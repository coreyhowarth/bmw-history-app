// Confirm JavaScript loaded successfully
console.log("BMW Archive Loaded");

// Fetch AWS API URL
const API_URL = "https://lzw16bqvh5.execute-api.us-west-1.amazonaws.com/default/bmw-models-api";

// Find the HTML container where cards will be inserted
const grid = document.getElementById("js-car-grid");

// Clear any existing content
grid.innerHTML = "";

// Takes a BMW object and returns a complete card
function createCarCard(car) {
    return `
    <article class="car-card">

      <div class="card-title">
        <h2>${car.year}</h2>
        <h3>${car.model}</h3>
      </div>

      <div class="card-content">

        <img
          src="${car.image}"
          alt="${car.model} Side Profile"
          class="car-image"
        />

        <div class="stats">

          <div class="stat-row">
            <i class="bi bi-gear"></i>
            <div>
              <span>Engine</span>
              <p>${car.engine}</p>
            </div>
          </div>

          <div class="stat-row">
            <i class="bi bi-lightning-charge-fill"></i>
            <div>
              <span>Power</span>
              <p>${car.power}</p>
            </div>
          </div>

          <div class="stat-row">
            <i class="bi bi-speedometer"></i>
            <div>
              <span>Top Speed</span>
              <p>${car.topSpeed}</p>
            </div>
          </div>

          <div class="stat-row">
            <i class="bi bi-calendar3"></i>
            <div>
              <span>Years</span>
              <p>${car.years}</p>
            </div>
          </div>

        </div>

      </div>

      <p class="car-description">${car.description}</p>

    </article>
  `;
}

async function loadCars() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const cars = await response.json();

    grid.innerHTML = "";

    cars.forEach(car => {
      grid.innerHTML += createCarCard(car);
    });

  } catch (error) {
    console.error("Failed to load cars:", error);
    grid.innerHTML = "<p>Failed to load BMW data.</p>";
  }
}

loadCars();