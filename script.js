const apiKey = '7ef83d28280d127f242c2a20cdb05f1a';

function kelvinToFahrenheit(kelvin) {
  return (kelvin - 273.15) * 9/5 + 32;
}

function getWeather() {
  const city = document.getElementById('cityInput').value.trim();

  if (city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const temperatureFahrenheit = kelvinToFahrenheit(data.main.temp);

        const weatherInfo = `
          <h2>Weather in ${data.name}, ${data.sys.country}</h2>
          <p>Temperature: ${temperatureFahrenheit.toFixed(2)} °F</p>
          <p>Weather Description: ${data.weather[0].description}</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
        document.getElementById('weatherInfo').innerHTML = weatherInfo;
      })
      .catch(error => {
        console.error('There was a problem fetching the weather data:', error);
        document.getElementById('weatherInfo').innerHTML = '<p>Failed to fetch weather data</p>';
      });
  } else {
    alert('Please enter a city name');
  }
}

document.getElementById('getWeatherBtn').addEventListener('click', getWeather);

document.getElementById('cityInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    getWeather();
  }
});
