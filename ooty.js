function updateBackground(weather) {
    let body = document.body;

    if (weather.includes("clear")) {
        body.style.background = "linear-gradient(to right, #ff9800, #ff5722)";
    } else if (weather.includes("cloud")) {
        body.style.background = "linear-gradient(to right, #757f9a, #d7dde8)";
    } else if (weather.includes("rain")) {
        body.style.background = "linear-gradient(to right, #3a7bd5, #3a6073)";
    } else if (weather.includes("snow")) {
        body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } else {
        body.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
    }
}

// function getWeather() {
//     let city = document.getElementById("cityInput").value.trim();
//     let apiKey = "da74582ba7196175d3532166e190ead0"; // Replace with actual key
//     let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//     fetch(apiUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("City not found");
//             }
//             return response.json();
//         })
//         .then(data => {
//             document.getElementById("cityName").textContent = data.name;
//             document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
//             document.getElementById("weatherDesc").textContent = `Weather: ${data.weather[0].description}`;
//             document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
//             document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

//             document.querySelector(".weather-info").style.display = "block";

//             // Update background dynamically
//             updateBackground(data.weather[0].description.toLowerCase());
//         })
//         .catch(error => {
//             alert("City not found. Please enter a valid city name.");
//             console.error("Error fetching weather data:", error);
//         });
// }

function getWeather() {
    let city = document.getElementById('cityInput').value;
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    // Mock weather data for demo (You should replace this with an actual API call)
    let temp = Math.floor(Math.random() * (35 - 10) + 10);
    let desc = ["Sunny", "Cloudy", "Rainy", "Stormy", "Snowy"][Math.floor(Math.random() * 5)];
    let humidity = Math.floor(Math.random() * (90 - 30) + 30);

    // Set values dynamically
    document.getElementById('cityName').innerText = city;
    document.getElementById('temperature').innerText = `Temperature: ${temp}°C`;
    document.getElementById('weatherDesc').innerText = `Weather: ${desc}`;
    document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;

    // Set a random weather icon
    let weatherIcons = {
        "Sunny": "https://cdn-icons-png.flaticon.com/128/1163/1163661.png",
        "Cloudy": "https://cdn-icons-png.flaticon.com/128/414/414927.png",
        "Rainy": "https://cdn-icons-png.flaticon.com/128/1163/1163625.png",
        "Stormy": "https://cdn-icons-png.flaticon.com/128/1779/1779940.png",
        "Snowy": "https://cdn-icons-png.flaticon.com/128/642/642102.png"
    };
    document.getElementById('weatherIcon').src = weatherIcons[desc];

    // Show weather info with animation
    let weatherInfo = document.querySelector('.weather-info');
    weatherInfo.classList.add('show');
}
