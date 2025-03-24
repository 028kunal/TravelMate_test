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
      { name: "IndiGo", image: "indigo.jpg", basePrice: 400 },
      { name: "Air India", image: "airindia.jpg", basePrice: 450 },
      { name: "Vistara", image: "vistara.jpg", basePrice: 500 },
      { name: "SpiceJet", image: "spicejet.jpg", basePrice: 380 },
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
  
