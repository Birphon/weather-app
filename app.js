const apiKey = "1e43c5a5a2be7f03b0d88bf044b1cc1b";
const lang = "en";
const unit = "metric";

const weatherData = (() => {
	let observers = [];

	function subscribe(observer) {
		observers.push(observer);
	}

	function unsubscribe(observer) {
		observers = observers.filter((obs) => obs !== observer);
	}

	function notifyObservers(data) {
		observers.forEach((observer) => observer(data));
	}

	function getWeatherData(location) {
		// Geocoding API call to get latitude and longitude
		fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.length > 0) {
					const { lat, lon } = data[0];
					// 5-Day Weather Forecast API call
					fetch(
						`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}&lang=${lang}`
					)
						.then((response) => response.json())
						.then((data) => notifyObservers(data))
						.catch((error) => console.error(error));
				} else {
					console.error("Location not found");
				}
			})
			.catch((error) => console.error(error));
	}

	return {
		subscribe,
		unsubscribe,
		getWeatherData,
	};
})();

const weatherUI = (() => {
	const weatherInfo = document.getElementById("weather-info");

	function displayWeatherData(data) {
		if (data.city && data.list) {
			const { name, country } = data.city;
			const forecast = data.list.map((item) => {
				const { dt_txt, weather, main, wind } = item;
				const { description } = weather[0];
				const { temp } = main;
				const { speed } = wind;

				return `
                    <div class="forecast-item">
                        <h3>${dt_txt}</h3>
                        <p>Temperature: ${temp} °C (${(
					(temp * 9) / 5 +
					32
				).toFixed(2)} °F)</p>
                        <p>Description: ${description}</p>
                        <p>Wind Speed: ${speed} m/s</p>
                    </div>
                `;
			});

			weatherInfo.innerHTML = `
                <h2>${name}, ${country}</h2>
                <div class="forecast">
                    ${forecast.join("")}
                </div>
            `;
		} else {
			weatherInfo.innerHTML = "Error: Could not retrieve weather data.";
		}
	}

	weatherData.subscribe(displayWeatherData);

	return {
		unsubscribe: () => weatherData.unsubscribe(displayWeatherData),
	};
})();

const form = document.getElementById("weather-form");
form.addEventListener("submit", (event) => {
	event.preventDefault();
	const location = document.getElementById("location").value;
	weatherData.getWeatherData(location);
});

// Dark Mode Toggle
const darkModeToggle = document.querySelector(".dark-mode-toggle");
const body = document.querySelector("body");

darkModeToggle.addEventListener("click", () => {
	body.classList.toggle("dark-mode");
});
