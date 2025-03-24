window.onload = function () {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const bookingsContainer = document.getElementById("bookings-list");
    const filterType = document.getElementById("filter-type");
    const filterText = document.getElementById("filter-text");
    const filterDate = document.getElementById("filter-date");
    const clearBtn = document.getElementById("clear-filters");
  
    function displayBookings(filteredBookings) {
      bookingsContainer.innerHTML = "";
  
      if (filteredBookings.length === 0) {
        bookingsContainer.innerHTML = "<p>No bookings found.</p>";
        return;
      }
  
      filteredBookings.forEach((booking, index) => {
        const card = document.createElement("div");
        card.className = "booking-card";
  
        const destination = booking.location || "Not available";
        const airline = booking.airline || "Not available";
        const departureDate = booking.date || "Not available";
        const fare = booking.price !== undefined ? `$${booking.price}` : "N/A";
  
        card.innerHTML = `
          <p><strong>Destination:</strong> ${destination}</p>
          <p><strong>Airline:</strong> ${airline}</p>
          <p><strong>Departure Date:</strong> ${departureDate}</p>
          <p><strong>Total Fare:</strong> ${fare}</p>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;
  
        bookingsContainer.appendChild(card);
      });
  
      addDeleteListeners();
    }
  
    function addDeleteListeners() {
      const deleteButtons = document.querySelectorAll(".delete-btn");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const index = parseInt(this.getAttribute("data-index"));
          const confirmDelete = confirm("Are you sure you want to delete this booking?");
          if (confirmDelete) {
            bookings.splice(index, 1);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            alert("Booking deleted successfully!");
            displayBookings(bookings);
          }
        });
      });
    }
  
    function applyFilter() {
      const type = filterType.value;
      let value = "";
  
      if (type === "destination") {
        value = filterText.value.toLowerCase();
        const filtered = bookings.filter((booking) =>
          (booking.location || "").toLowerCase().includes(value)
        );
        displayBookings(filtered);
      } else if (type === "departureDate") {
        value = filterDate.value;
        const filtered = bookings.filter(
          (booking) => booking.date === value
        );
        displayBookings(filtered);
      }
    }
  
    // Show relevant input based on selected filter
    filterType.addEventListener("change", () => {
      const type = filterType.value;
      if (type === "destination") {
        filterText.style.display = "inline-block";
        filterDate.style.display = "none";
      } else {
        filterText.style.display = "none";
        filterDate.style.display = "inline-block";
      }
    });
  
    // Listeners for filtering
    filterText.addEventListener("input", applyFilter);
    filterDate.addEventListener("input", applyFilter);
  
    clearBtn.addEventListener("click", () => {
      filterText.value = "";
      filterDate.value = "";
      displayBookings(bookings);
    });
  
    // Initial display
    displayBookings(bookings);
    filterType.dispatchEvent(new Event("change")); // set correct input box
  };
  
