// Confirm JavaScript loaded successfully
console.log("BMW Archive Loaded");

// BMW data (one object = one car)
const cars = [
  {
    year: "1929",
    model: "BMW 3/15 PS",
    image: "images/bmw_1930s/bmw_3_15_ps_side_pro_gen.png",
    description: "BMW's first automobile. The beginning of the BMW legacy.",
    engine: "4-Cyl 747cc",
    power: "15 HP",
    topSpeed: "53 mph",
    years: "1929-1932"
  },

  {
    year: "1936",
    model: "BMW 328",
    image: "images/bmw_1930s/bmw_328_side_pro_gen.png",
    description: "A legendary sports car that dominated its class and helped establish BMW's reputation in motorsport.",
    engine: "2.0L I6",
    power: "80 HP",
    topSpeed: "93 mph",
    years: "1936-1940"
  }
];

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
          <p>Engine: ${car.engine}</p>
          <p>Power: ${car.power}</p>
          <p>Top Speed: ${car.topSpeed}</p>
          <p>Years: ${car.years}</p>
        </div>

      </div>

      <p class="car-description">${car.description}</p>

    </article>
  `;
}

// Loop through every BMW and add its card to the page
cars.forEach(car => {
  grid.innerHTML += createCarCard(car);
});
