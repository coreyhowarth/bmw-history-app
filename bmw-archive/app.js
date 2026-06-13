// Confirm JavaScript file loaded successfully
// If this prints in browser console, app.js is connected properly

console.log("BMW Archive Loaded");

// API endpoint from AWS API Gateway
// Frontend sends request here to get BMW data from backend

const API_URL = "https://lzw16bqvh5.execute-api.us-west-1.amazonaws.com/default/bmw-models-api";

// Find HTML container where BMW cards will be inserted

const grid = document.getElementById("js-car-grid");

// Find all decade buttons in navigation bar
// JavaScript listens for user clicks here

const decadeButtons = document.querySelectorAll(".decade-nav button");

decadeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    decadeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// Store ALL BMW cars in memory
// Needed so we can filter cars later

let allCars = [];

// Clear old content

grid.innerHTML = "";

// Function that builds ONE BMW card
// Takes a single BMW object and returns HTML template

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

// Function that renders BMW cards on webpage
// Can display ALL cars or FILTERED cars

function renderCars(carsToRender) {

  // Remove old cards first

  grid.innerHTML = "";

  // Loop through every car object

  carsToRender.forEach(car => {
    grid.innerHTML += createCarCard(car);
  });
}

// Main function that loads BMW data from AWS backend

async function loadCars() {

  try {

    // Send request to API Gateway

    const response = await fetch(API_URL);

    // Check API success

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Convert JSON response into JavaScript array

    const cars = await response.json();

    // Save all cars into memory
    // Needed for decade filtering later

    allCars = cars;


    // Render all cars on first page load

    renderCars(allCars);

  } catch (error) {

    console.error("Failed to load cars:", error);

    grid.innerHTML = "<p>Failed to load BMW data.</p>";
  }
}

// Listen for button clicks
// Runs when user clicks decade buttons

decadeButtons.forEach(button => {

  button.addEventListener("click", () => {

    // Read decade from HTML button

    const selectedDecade = button.dataset.decade;

    // If All Models clicked
    // Show every BMW again

    if (selectedDecade === "all") {
      renderCars(allCars);
      return;
    }

    // Convert decade into number
    // Example: "1970s" becomes 1970

    const decadeStart = Number(selectedDecade.slice(0, 4));

    // Filter cars by matching decade

    const filteredCars = allCars.filter(car => {

      const year = Number(car.year);

      return year >= decadeStart && year <= decadeStart + 9;

    });

    // Show filtered cars only

    renderCars(filteredCars);

  });

});

// Start application
// Load all BMW cars when page opens

loadCars();