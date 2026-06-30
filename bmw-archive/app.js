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

// Search-wrapper
const searchInput = document.getElementById("car-search");

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

        <div class="car-image-wrap">
          <img class="car-image" src="${car.image}" alt="${car.model}" />
        </div>

        <div class="stats stats-horizontal">
          <div class="stat-row">
            <i class="bi bi-gear"></i>
            <div><span>Engine</span><p>${car.engine || "N/A"}</p></div>
          </div>

          <div class="stat-row">
            <i class="bi bi-lightning-charge-fill"></i>
            <div><span>Power</span><p>${car.power || "N/A"}</p></div>
          </div>

          <div class="stat-row">
            <i class="bi bi-wrench-adjustable"></i>
            <div><span>Torque</span><p>${car.torque || "N/A"}</p></div>
          </div>

          <div class="stat-row">
            <i class="bi bi-speedometer"></i>
            <div><span>Top Speed</span><p>${car.topSpeed || "N/A"}</p></div>
          </div>

          <div class="stat-row">
            <i class="bi bi-car-front-fill"></i>
            <div><span>Body</span><p>${car.bodyStyle || "N/A"}</p></div>
          </div>

          <div class="stat-row">
            <i class="bi bi-disc"></i>
            <div><span>Drive</span><p>${car.drive || "N/A"}</p></div>
          </div>

          <div class="stat-row">
            <i class="bi bi-arrow-repeat"></i>
            <div><span>Transmission</span><p>${car.transmission || "N/A"}</p></div>
          </div>

          <div class="stat-row">
            <i class="bi bi-fuel-pump-fill"></i>
            <div><span>Fuel</span><p>${car.fuelType || "N/A"}</p></div>
          </div>

          <div class="stat-row">
            <i class="bi bi-calendar3"></i>
            <div><span>Years</span><p>${car.years || "N/A"}</p></div>
          </div>
        </div>
        </div>

      </div>

      <p class="car-description">${car.description}</p>

    </article>

  `;
}

const resultsCount = document.getElementById("results-count");

function renderCars(carsToRender) {
  grid.innerHTML = "";

  resultsCount.textContent = `${carsToRender.length} BMW Models Found`;

  carsToRender.forEach((car) => {
    grid.innerHTML += createCarCard(car);
  });
}

// Search Wrapper EventListener
searchInput.addEventListener("input", applyFilters);

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

// Track currently selected decade
// Default = show all cars
let activeDecade = "all";

// Listen for user clicking decade buttons
decadeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Save currently selected decade
    // Example: 1970s, 1980s, all
    activeDecade = button.dataset.decade;
    // Remove active highlight from all buttons
    decadeButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    // Highlight selected button
    button.classList.add("active");
    // Run combined filtering logic
    // Search + decade filters work together
    applyFilters();
  });
});

// Shared filtering function
// Handles BOTH search bar and decade buttons
function applyFilters() {
  // Read current search text
  const searchTerm = searchInput.value.toLowerCase();
  // Start with all cars
  let filteredCars = allCars;
  // Apply decade filter first
  if (activeDecade !== "all") {
    // Convert decade into number
    // Example: 1970s → 1970
    const decadeStart = Number(activeDecade.slice(0, 4));
    // Keep only cars matching decade
    filteredCars = filteredCars.filter((car) => {
      const year = Number(car.year);
      return year >= decadeStart && year <= decadeStart + 9;
    });
  }
  // Apply search filter second
  if (searchTerm !== "") {
  filteredCars = filteredCars.filter((car) => {
    const searchableText = `
      ${car.year || ""}
      ${car.years || ""}
      ${car.model || ""}
      ${car.engine || ""}
      ${car.power || ""}
      ${car.torque || ""}
      ${car.topSpeed || ""}
      ${car.bodyStyle || ""}
      ${car.drive || ""}
      ${car.transmission || ""}
      ${car.fuelType || ""}
      ${car.description || ""}
      ${car.category || ""}
      ${(car.tags || []).join(" ")}
    `.toLowerCase();

    return searchableText.includes(searchTerm);
  });
}
  // Render final filtered cars
  renderCars(filteredCars);
}

// Start application
// Load all BMW cars when page opens
loadCars();
