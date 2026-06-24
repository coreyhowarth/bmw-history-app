// ==============================
// ADMIN PAGE CONFIG
// ==============================

// API Gateway endpoint for adding cars to DynamoDB
const API_URL = "https://33sn264097.execute-api.us-west-1.amazonaws.com/cars";

const COGNITO_DOMAIN = "https://us-west-1oawhavgma.auth.us-west-1.amazoncognito.com";
const CLIENT_ID = "66b0d5tir0sa06l31bt0nm1aoa";
const REDIRECT_URI = "https://d84l1y8p4kdic.cloudfront.net/admin.html";

// Grab the HTML form
const carForm = document.getElementById("carForm");

// Grab the area where newly submitted cars appear temporarily
const carList = document.getElementById("carList");

// Grab image input field
const imageInput = document.getElementById("image");

// Grab image preview element
const preview = document.getElementById("previewImage");

// Temporary frontend-only list
// This only shows cars added during this browser session
let cars = [];
let editMode = false;

function getToken() {
  return localStorage.getItem("id_token");
}

function login() {
  const loginUrl =
    `${COGNITO_DOMAIN}/login?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=token&` +
    `scope=email+openid+phone&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  window.location.href = loginUrl;
}

function logout() {
  localStorage.removeItem("id_token");

  const logoutUrl =
    `${COGNITO_DOMAIN}/logout?` + `client_id=${CLIENT_ID}&` + `logout_uri=${encodeURIComponent(REDIRECT_URI)}`;

  window.location.href = logoutUrl;
}

function handleLoginRedirect() {
  const hash = window.location.hash;

  if (!hash) {
    return;
  }

  const params = new URLSearchParams(hash.substring(1));
  const idToken = params.get("id_token");

  if (idToken) {
    localStorage.setItem("id_token", idToken);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

handleLoginRedirect();

// ==============================
// FORM SUBMIT: POST TO AWS
// ==============================

carForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const wasEditing = editMode;

  const car = {
    id: document.getElementById("id").value,
    year: document.getElementById("year").value,
    years: document.getElementById("years").value,
    model: document.getElementById("model").value,
    engine: document.getElementById("engine").value,
    power: document.getElementById("power").value,
    topSpeed: document.getElementById("topSpeed").value,
    image: document.getElementById("image").value,
    description: document.getElementById("description").value
  };

  try {
    let response;

    if (wasEditing) {
      response = await fetch(`${API_URL}/${car.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(car)
      });
    } else {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(car)
      });
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Save failed");
    }

    carForm.reset();

    document.getElementById("id").disabled = false;
    document.querySelector("button[type='submit']").textContent = "Save Car";

    editMode = false;

    preview.style.display = "none";
    preview.src = "";

    await loadCars();

    alert(wasEditing ? "Car updated successfully" : "Car saved successfully");
  } catch (error) {
    console.error("Save failed:", error);
    alert("Save failed. Check console.");
  }
});

// ==============================
// IMAGE PREVIEW
// ==============================

imageInput.addEventListener("input", function () {
  // If field is empty, hide preview
  if (!imageInput.value) {
    preview.style.display = "none";
    preview.src = "";
    return;
  }

  // Set preview image source to typed path/URL
  preview.src = imageInput.value;

  // Show preview image
  preview.style.display = "block";
});

/*
Load cars from AWS when page opens
*/
async function loadCars() {
  try {
    // Send GET request to API Gateway
    const response = await fetch(API_URL);

    // Convert JSON response into JavaScript array
    const data = await response.json();

    // Store DynamoDB cars inside frontend array
    cars = data;

    // Display cars on page
    renderCars();
  } catch (error) {
    console.error("Failed loading cars:", error);
  }
}
loadCars();

async function deleteCar(id) {
  const confirmDelete = confirm(`Delete ${id}?`);

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Delete failed");
    }

    cars = cars.filter((car) => car.id !== id);
    renderCars();

    alert("Car deleted from DynamoDB");
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Delete failed. Check console.");
  }
}

function renderCars() {
  carList.innerHTML = "";

  cars.forEach((car) => {
    const div = document.createElement("div");
    div.classList.add("admin-car");

    div.innerHTML = `
      <div>
        <strong>${car.year} ${car.model}</strong>

        <div class="car-details">
          <p><strong>ID:</strong> ${car.id}</p>
          <p><strong>Years:</strong> ${car.years || "N/A"}</p>
          <p><strong>Engine:</strong> ${car.engine}</p>
          <p><strong>Power:</strong> ${car.power}</p>
          <p><strong>Top Speed:</strong> ${car.topSpeed}</p>
          <p><strong>Image:</strong> ${car.image || "N/A"}</p>
          <p><strong>Description:</strong></p>
          <p class="description-preview">
            ${car.description || "No description"}
          </p>
        </div>
      </div>

      <div class="admin-actions">
       <button class="edit-btn" onclick="editCar('${car.id}')">
          Edit
        </button>

        <button class="delete-btn" onclick="deleteCar('${car.id}')">
            Delete
          </button>
      </div>
    `;

    carList.appendChild(div);
  });
}

function editCar(id) {
  const car = cars.find((car) => car.id === id);

  if (!car) {
    alert("Car not found");
    return;
  }

  // Enter edit mode
  editMode = true;

  // Fill form with existing car data
  document.getElementById("id").value = car.id;
  document.getElementById("year").value = car.year;
  document.getElementById("years").value = car.years || "";
  document.getElementById("model").value = car.model;
  document.getElementById("engine").value = car.engine;
  document.getElementById("power").value = car.power;
  document.getElementById("topSpeed").value = car.topSpeed;
  document.getElementById("image").value = car.image || "";
  document.getElementById("description").value = car.description || "";

  // Lock ID so primary key cannot change
  document.getElementById("id").disabled = true;

  // Change button text
  document.querySelector("button[type='submit']").textContent = "Update Car";

  // Scroll back to form
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
