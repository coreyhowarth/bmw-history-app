// ==============================
// ADMIN PAGE CONFIG
// ==============================

// API Gateway endpoint for adding cars to DynamoDB
const API_URL = "https://33sn264097.execute-api.us-west-1.amazonaws.com/cars";

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


// ==============================
// FORM SUBMIT: POST TO AWS
// ==============================

carForm.addEventListener("submit", async function (event) {
  // Stop browser from refreshing the page
  event.preventDefault();

  // Build car object from form inputs
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
    // Send car object to API Gateway
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(car)
    });

    // Convert API response from JSON string into JS object
    const result = await response.json();

    // If API returned an error, stop and show it
    if (!response.ok) {
      throw new Error(result.message || "Failed to save car");
    }

    // Add car to temporary page list only after AWS save succeeds
    cars.push(car);

    // Refresh visible admin list
    renderCars();

    // Clear form
    carForm.reset();

    // Hide preview after saving
    preview.style.display = "none";
    preview.src = "";

    alert("Car saved to DynamoDB");

  } catch (error) {
    // Show error in browser console
    console.error("Save failed:", error);

    // Show simple user-facing alert
    alert("Failed to save car. Check console.");
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
      method: "DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Delete failed");
    }

    cars = cars.filter(car => car.id !== id);
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
        <button class="edit-btn" onclick="alert('Update API not built yet')">
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