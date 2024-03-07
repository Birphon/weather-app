const weatherData = (() => {
	let observers = [];
	let apiKey = "1e43c5a5a2be7f03b0d88bf044b1cc1b";
	let lang = "en";

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
	console.log(location);
	weatherData.getWeatherData(location);
});
