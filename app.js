// const WeatherApp = (function () {
// 	// Private properties and methods
// 	const apiKey = "1e43c5a5a2be7f03b0d88bf044b1cc1b";
// 	const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
// 	const units = "metric"; // Can be changed to Fahrenheit using "imperial" instead
// 	const lang = "en";

// 	function getWeatherData(city) {
// 		const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=${units}&lang=${lang}`;
// 		return fetch(url)
// 			.then((response) => response.json())
// 			.catch((error) => console.error(error));
// 	}

// 	// Public methods
// 	return {
// 		init() {
// 			const cityInput = document.getElementById("city-input");
// 			const searchBtn = document.getElementById("search-btn");
// 			const weatherInfo = document.getElementById("weather-info");

// 			searchBtn.addEventListener("click", () => {
// 				const city = cityInput.value.trim();
// 				if (city) {
// 					getWeatherData(city)
// 						.then((data) => {
// 							if (data.cod === 200) {
// 								const { name, weather, main } = data;
// 								weatherInfo.innerHTML = `
//                     <h2>${name}</h2>
//                     <p>${weather[0].description}</p>
//                     <p>Temperature: ${main.temp}°C</p>
//                   `;
// 							} else {
// 								weatherInfo.innerHTML = `<p>City not found</p>`;
// 							}
// 						})
// 						.catch((error) => {
// 							console.error(error);
// 							weatherInfo.innerHTML = `<p>Error fetching weather data</p>`;
// 						});
// 				} else {
// 					weatherInfo.innerHTML = `<p>Please enter a city name</p>`;
// 				}
// 			});
// 		},
// 	};
// })();

// Weather Data Module (Subject)
const weatherData = (() => {
	let observers = [];
	let apiKey = "1e43c5a5a2be7f03b0d88bf044b1cc1b";
	let lang = "en";
	let unit = "";

	function subscribe(observer) {
		observers.push(observer);
	}

	function unsubscribe(observer) {
		observers = observers.filter((obs) => obs !== observer);
	}

	function notifyObservers(data) {
		observers.forEach((observer) => observer(data));
	}

	function getWeatherData(location, unit) {
		// API call to fetch weather data
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}&lang=${lang}`
		)
			.then((response) => response.json())
			.then((data) => notifyObservers(data))
			.catch((error) => console.error(error));
	}

	return {
		subscribe,
		unsubscribe,
		getWeatherData,
	};
})();

// Weather UI Module (Observer)
const weatherUI = (() => {
	const weatherInfo = document.getElementById("weather-info");

	function displayWeatherData(data) {
		if (
			data.name &&
			data.weather &&
			data.weather[0] &&
			data.main &&
			data.wind
		) {
			const { name, weather, main, wind } = data;
			const { country } = data.sys || {}; // Safely access country property
			const { description } = weather[0];
			const { temp } = main;
			const { speed } = wind;

			weatherInfo.innerHTML = `
            <h2>${name}${country ? `, ${country}` : ""}</h2>
            <p>Temperature: ${temp} °C (${((temp * 9) / 5 + 32).toFixed(
				2
			)} °F)</p>
            <p>Description: ${description}</p>
            <p>Wind Speed: ${speed} m/s</p>
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

// Event Listeners
const form = document.getElementById("weather-form");
form.addEventListener("submit", (event) => {
	event.preventDefault();
	const location = document.getElementById("location").value;
	// const unit = document.getElementById("unit").value;
	weatherData.getWeatherData(location, unit);
});
