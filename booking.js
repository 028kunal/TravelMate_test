const categories = {
    hill: ["Manali", "Shimla", "Ooty"],
    pilgrimage: ["Varanasi", "Rishikesh", "Kedarnath"],
    beach: ["Goa", "Kovalam", "Andaman"],
    historical: ["Hampi", "Khajuraho", "Jaipur"],
    camping: ["Rishikesh", "Spiti Valley", "Pawna Lake"],
    trekking: ["Roopkund", "Kedarkantha", "Hampta Pass"],
    snow: ["Gulmarg", "Auli", "Manali"],
    forest: ["Sundarbans", "Jim Corbett", "Bandipur"],
  };
  
  const internationalLocations = ["Andaman"]; // Add more if needed
  
  const airlines = {
    domestic: [
      { name: "IndiGo", image: "indigo.avif", basePrice: 400 },
      { name: "Air India", image: "air_india.jpeg", basePrice: 450 },
      { name: "Vistara", image: "vistara.webp", basePrice: 500 },
      { name: "SpiceJet", image: "spice_jet.jpeg", basePrice: 380 },
    ],
    international: [
      { name: "Qatar Airways", image: "qatar.jpg", basePrice: 800 },
      { name: "Singapore Airlines", image: "singapore.jpg", basePrice: 850 },
      { name: "Turkish Airlines", image: "turkish.jpg", basePrice: 780 },
      { name: "Emirates", image: "emirates.jpg", basePrice: 900 },
    ],
  };
  
  const categorySelect = document.getElementById("category-select");
  const locationSelect = document.getElementById("location-select");
  const budgetSlider = document.getElementById("budget");
  const budgetValue = document.getElementById("budget-value");
  const airlineGallery = document.getElementById("airline-gallery");
  const departureDate = document.getElementById("departure-date");
  const bookBtn = document.getElementById("book-btn");
  const viewBookingsBtn = document.getElementById("view-bookings");
  const confirmationModal = document.getElementById("confirmation-modal");
  const confirmationMessage = document.getElementById("confirmation-message");
  const closeModal = document.getElementById("close-modal");
  
  let selectedAirline = null;
  let selectedBasePrice = 0;
  let selectedTotalPrice = 0;
  
  function updateLocationOptions() {
    const selectedCategory = categorySelect.value;
    locationSelect.innerHTML = '<option value="">-- Select a Location --</option>';
  
    if (selectedCategory && categories[selectedCategory]) {
      categories[selectedCategory].forEach((loc) => {
        const option = document.createElement("option");
        option.value = loc;
        option.textContent = loc;
        locationSelect.appendChild(option);
      });
    }
  }
  
  function updateBudgetValue() {
    budgetValue.textContent = `$${budgetSlider.value}`;
  }
  
  function getFareBasedOnDate(basePrice) {
    const dateValue = departureDate.value;
    if (!dateValue) return basePrice;
  
    const selected = new Date(dateValue);
    const today = new Date();
    const diffDays = Math.ceil((selected - today) / (1000 * 60 * 60 * 24));
  
    if (diffDays <= 3) return basePrice + 300;
    if (diffDays <= 7) return basePrice + 200;
    if (diffDays <= 14) return basePrice + 100;
    return basePrice;
  }
  
  function renderAirlineCards(location) {
    airlineGallery.innerHTML = "";
    if (!location) return;
  
    const isInternational = internationalLocations.includes(location);
    const airlineSet = isInternational ? airlines.international : airlines.domestic;
  
    airlineSet.forEach((airline) => {
      const card = document.createElement("div");
      card.className = "airline-card";
  
      const img = document.createElement("img");
      img.src = airline.image;
      img.alt = airline.name;
  
      const info = document.createElement("div");
      info.className = "airline-info";
  
      const name = document.createElement("h3");
      name.textContent = airline.name;
  
      const base = document.createElement("p");
      base.textContent = `Base Price: $${airline.basePrice}`;
  
      const total = document.createElement("p");
      const calculatedFare = getFareBasedOnDate(airline.basePrice);
      total.textContent = `Total Price: $${calculatedFare}`;
      total.classList.add("total-price");
  
      info.appendChild(name);
      info.appendChild(base);
      info.appendChild(total);
      card.appendChild(img);
      card.appendChild(info);
      airlineGallery.appendChild(card);
  
      card.addEventListener("click", () => {
        document.querySelectorAll(".airline-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedAirline = airline.name;
        selectedBasePrice = airline.basePrice;
        selectedTotalPrice = getFareBasedOnDate(selectedBasePrice);
      });
    });
  }
  
  function updateTotalPricesOnDateChange() {
    const totalPrices = document.querySelectorAll(".airline-card .total-price");
    const isInternational = internationalLocations.includes(locationSelect.value);
    const airlineSet = isInternational ? airlines.international : airlines.domestic;
  
    totalPrices.forEach((p, i) => {
      const updatedFare = getFareBasedOnDate(airlineSet[i].basePrice);
      p.textContent = `Total Price: $${updatedFare}`;
    });
  
    if (selectedAirline) {
      const selected = airlineSet.find((a) => a.name === selectedAirline);
      selectedTotalPrice = getFareBasedOnDate(selected.basePrice);
    }
  }
  
  function saveBooking() {
    if (!categorySelect.value || !locationSelect.value || !departureDate.value || !selectedAirline) {
      alert("Please select all options before booking.");
      return;
    }
  
    const booking = {
      category: categorySelect.value,
      location: locationSelect.value,
      airline: selectedAirline,
      date: departureDate.value,
      price: selectedTotalPrice,
    };
  
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));
  
    confirmationMessage.innerHTML = `Booking Confirmed!<br>${booking.location} via ${booking.airline}<br>on ${booking.date}<br>Total: $${booking.price}`;
    confirmationModal.style.display = "flex";
  }
  
  categorySelect.addEventListener("change", () => {
    updateLocationOptions();
    airlineGallery.innerHTML = "";
  });
  
  locationSelect.addEventListener("change", () => {
    renderAirlineCards(locationSelect.value);
  });
  
  departureDate.addEventListener("input", () => {
    updateTotalPricesOnDateChange();
  });
  
  budgetSlider.addEventListener("input", updateBudgetValue);
  
  bookBtn.addEventListener("click", saveBooking);
  
  viewBookingsBtn.addEventListener("click", () => {
    window.location.href = "mybookings.html";
  });
  
  closeModal.addEventListener("click", () => {
    confirmationModal.style.display = "none";
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    departureDate.setAttribute("min", today);
    updateBudgetValue();
  });
 


// INTERACTIVE MAP 



document.addEventListener("DOMContentLoaded", function () {
  // Initialize the map
  var map = L.map('map').setView([20.5937, 78.9629], 5);

  // Base layers (Normal + Satellite)
  var normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  });

  var satelliteLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors, Tiles courtesy of HOT'
  });

  // Add the normal map as default
  normalLayer.addTo(map);

  // Predefined coordinates for locations
  const locationCoordinates = {
      "Manali": [32.2396, 77.1887],
      "Shimla": [31.1048, 77.1734],
      "Ooty": [11.4064, 76.6932],
      "Varanasi": [25.3176, 82.9739],
      "Rishikesh": [30.0869, 78.2676],
      "Kedarnath": [30.7346, 79.0669],
      "Goa": [15.2993, 74.1240],
      "Kovalam": [8.4000, 76.9784],
      "Andaman": [11.7401, 92.6586],
      "Hampi": [15.3350, 76.4600],
      "Khajuraho": [24.8318, 79.9199],
      "Jaipur": [26.9124, 75.7873],
      "Spiti Valley": [32.2465, 78.0170],
      "Pawna Lake": [18.6500, 73.4723],
      "Roopkund": [30.2565, 79.7304],
      "Kedarkantha": [31.0244, 78.1958],
      "Hampta Pass": [32.2737, 77.3516],
      "Gulmarg": [34.0484, 74.3805],
      "Auli": [30.5285, 79.5656],
      "Sundarbans": [22.0176, 88.8263],
      "Jim Corbett": [29.5300, 78.7740],
      "Bandipur": [11.6542, 76.6476]
  };

  // Markers
  var markers = {};

  // Function to update map when location is selected
  function updateMap(location) {
      if (location && locationCoordinates[location]) {
          const coords = locationCoordinates[location];

          // Zoom in more when selecting a location
          map.setView(coords, 14);

          // Remove old marker if exists
          if (markers[location]) {
              map.removeLayer(markers[location]);
          }

          // Add new marker
          const marker = L.marker(coords).addTo(map)
              .bindPopup(`<b>${location}</b><br>Coordinates: ${coords[0]}, ${coords[1]}`)
              .openPopup();
          
          markers[location] = marker;
      }
  }

  // Event listener for location selection
  document.getElementById("location-select").addEventListener("change", function () {
      updateMap(this.value);
  });

  // Add markers for all locations at the start
  for (let place in locationCoordinates) {
      let coords = locationCoordinates[place];
      let marker = L.marker(coords).addTo(map)
          .bindPopup(`<b>${place}</b><br>Coordinates: ${coords[0]}, ${coords[1]}`);
      markers[place] = marker;
  }

  // POI Markers for hospitals, restaurants, metro stations, medical shops
  var hospitals = L.layerGroup([
      L.marker([28.6139, 77.2090]).bindPopup("<b>Hospital</b><br>Delhi"),
      L.marker([19.0760, 72.8777]).bindPopup("<b>Hospital</b><br>Mumbai"),
      L.marker([12.9716, 77.5946]).bindPopup("<b>Hospital</b><br>Bangalore")
  ]);

  var restaurants = L.layerGroup([
      L.marker([28.7041, 77.1025]).bindPopup("<b>Restaurant</b><br>Delhi"),
      L.marker([19.0760, 72.8777]).bindPopup("<b>Restaurant</b><br>Mumbai"),
      L.marker([12.9716, 77.5946]).bindPopup("<b>Restaurant</b><br>Bangalore")
  ]);

  var metroStations = L.layerGroup([
      L.marker([28.6353, 77.2250]).bindPopup("<b>Metro Station</b><br>Connaught Place, Delhi"),
      L.marker([19.0760, 72.8777]).bindPopup("<b>Metro Station</b><br>Andheri, Mumbai"),
      L.marker([12.9716, 77.5946]).bindPopup("<b>Metro Station</b><br>MG Road, Bangalore")
  ]);

  var medicalShops = L.layerGroup([
      L.marker([28.7041, 77.1025]).bindPopup("<b>Medical Shop</b><br>Delhi"),
      L.marker([19.0760, 72.8777]).bindPopup("<b>Medical Shop</b><br>Mumbai"),
      L.marker([12.9716, 77.5946]).bindPopup("<b>Medical Shop</b><br>Bangalore")
  ]);

  // Add layers control to toggle between views
  L.control.layers(
      {
          "Normal Map": normalLayer,
          "Satellite Map": satelliteLayer
      },
      {
          "Hospitals": hospitals,
          "Restaurants": restaurants,
          "Metro Stations": metroStations,
          "Medical Shops": medicalShops
      }
  ).addTo(map);
});




function updateInfoPanel(location) {
  const placeData = {
      "Manali": {
          description: "A beautiful hill station in Himachal Pradesh, known for adventure sports and Rohtang Pass.",
          image: "manali.jpg",
          travel: "Nearest Airport: Kullu-Manali Airport. Nearest Railway Station: Joginder Nagar.",
          weather: "10°C, Snowy"
      },
      "Goa": {
          description: "Famous for its beaches, nightlife, and Portuguese heritage.",
          image: "goa.jpg",
          travel: "Nearest Airport: Goa International Airport. Nearest Railway Station: Madgaon.",
          weather: "28°C, Sunny"
      }
  };

  if (location in placeData) {
      document.getElementById("place-name").innerText = location;
      document.getElementById("place-description").innerText = placeData[location].description;
      document.getElementById("place-image").src = placeData[location].image;
      document.getElementById("travel-info").innerText = placeData[location].travel;
      document.getElementById("weather-info").innerText = placeData[location].weather;
  }
}

// Call this function inside your location change event
document.getElementById("location-select").addEventListener("change", function () {
  updateInfoPanel(this.value);
});

// MAP RIGHT SIDE


// Fetch Wikipedia Image
function fetchWikiImage(location) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${location}&pithumbsize=500&origin=*`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const pages = data.query.pages;
      const firstPage = Object.values(pages)[0];
      if (firstPage.thumbnail) {
        document.getElementById("place-image").src = firstPage.thumbnail.source;
      } else {
        document.getElementById("place-image").src = "default.jpg"; // Fallback image
      }
    })
    .catch(error => console.error("Error fetching Wiki image:", error));
}

// Fetch Wikipedia Description
function fetchWikiDescription(location) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${location}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.extract) {
        document.getElementById("place-description").innerText = data.extract;
      } else {
        document.getElementById("place-description").innerText = "No description available.";
      }
    })
    .catch(error => console.error("Error fetching Wiki description:", error));
}

// Update Information Panel
function updateInfoPanel(location, lat, lon) {
  document.getElementById("place-name").innerText = location;
  fetchWikiImage(location);
  fetchWikiDescription(location);
}



// Assuming markers are stored in an array
let locations = [
  { name: "Ooty", lat: 11.4102, lon: 76.6950 },
  { name: "Goa", lat: 15.2993, lon: 74.1240 },
  { name: "Shimla", lat: 31.1048, lon: 77.1734 }
];

locations.forEach(place => {
  let marker = L.marker([place.lat, place.lon]).addTo(map);
  marker.on("click", function (e) {
    updateInfoPanel(place.name, place.lat, place.lon);
  });
});

