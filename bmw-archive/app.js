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
        description:
            "A legendary sports car that dominated its class and helped establish BMW's reputation in motorsport.",
        engine: "2.0L I6",
        power: "80 HP",
        topSpeed: "93 mph",
        years: "1936-1940"
    },

    {
        year: "1955",
        model: "BMW Isetta 300",
        image: "images/bmw_1950s/bmw_isetta_300_pro_gen.png",
        description: "The microcar that made mobility possible for millions. Small in size, big in impact.",
        engine: "298cc Isetta",
        power: "13 HP",
        topSpeed: "53 mph",
        years: "1955-1962"
    },
    
    {
        year: "1956",
        model: "BMW 507",
        image: "images/bmw_1950s/bmw_507_side_pro_gen.png",
        description:
            "A stunning roadster with timeless design and strong performance. One of BMW's most iconic classics.",
        engine: "3.2L V8",
        power: "150 HP",
        topSpeed: "120 mph",
        years: "1956-1959"
    },

    {
        year: "1968",
        model: "BMW 2002",
        image: "images/bmw_1960s/bmw_2002_side_pro_gen.png",
        description: "The car that saved BMW. A sporty, driver-focused sedan that became a legend.",
        engine: "2.0L I4",
        power: "100 HP",
        topSpeed: "112 mph",
        years: "1968-1976"
    },

    {
        year: "1975",
        model: "BMW 3 Series (E21)",
        image: "images/bmw_1970s/bmw_3_series_e21_side_pro_gen.png",
        description: "The first 3 Series. A compact sport sedan that became BMW's most important model line.",
        engine: "1.6L I4",
        power: "90 HP",
        topSpeed: "102 mph",
        years: "1975-1983"
    },

    {
        year: "1986",
        model: "BMW M3 (E30)",
        image: "images/bmw_1980s/bmw_m3_e30_side_pro_gen.png",
        description: "Born for motorsport. The E30 M3 is one of the most beloved performance cars ever built.",
        engine: "2.3L I4",
        power: "192 HP",
        topSpeed: "140 mph",
        years: "1986-1991"
    },

    {
        year: "1998",
        model: "BMW M5 (E39)",
        image: "images/bmw_1990s/bmw_m5_e39_side_pro_gen.png",
        description: "A perfect blend of luxury and performance. The E39 M5 set the benchmark.",
        engine: "4.9L V8",
        power: "394 HP",
        topSpeed: "155 mph",
        years: "1998-2003"
    },
    
    {
        year: "1999",
        model: "BMW X5 (E53)",
        image: "images/bmw_1990s/bmw_x5_e53_side_pro_gen.png",
        description: "BMW's first SUV. The E53 X5 helped define the modern luxury sport utility vehicle.",
        engine: "4.4L V8",
        power: "282 HP",
        topSpeed: "143 mph",
        years: "1999-2006"
    },

    {
        year: "2000",
        model: "BMW M3 (E46)",
        image: "images/bmw_2000s/bmw_m3_e46_side_pro_gen.png",
        description: "High-revving, naturally aspirated perfection. The E46 M3 is a modern classic.",
        engine: "3.2L I6",
        power: "333 HP",
        topSpeed: "155 mph",
        years: "2000-2006"
    },

    {
        year: "2014",
        model: "BMW i8",
        image: "images/bmw_2010s/bmw_i8_side_pro_gen.png",
        description: "A futuristic hybrid sports car that represents BMW's vision for tomorrow.",
        engine: "1.5L Turbo I3 + EV",
        power: "362 HP",
        topSpeed: "155 mph",
        years: "2014-2020"
    },
    
    {
        year: "2021",
        model: "BMW i4",
        image: "images/bmw_2020s/bmw_i4_side_pro_gen.png",
        description: "BMW's modern electric sport sedan. The i4 brings classic BMW performance into the EV era.",
        engine: "Dual Electric Motors",
        power: "536 HP",
        topSpeed: "140 mph",
        years: "2021-Present"
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

// Loop through every BMW and add its card to the page
cars.forEach((car) => {
    grid.innerHTML += createCarCard(car);
});
