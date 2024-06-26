// l7lnMA4sPyZXAkzgQqjbeBHIB7D6cnl5
// 7ef83d28280d127f242c2a20cdb05f1a
const weatherApiKey = '7ef83d28280d127f242c2a20cdb05f1a';
const ticketmasterApiKey = 'l7lnMA4sPyZXAkzgQqjbeBHIB7D6cnl5'; 

let cities = JSON.parse(localStorage.getItem('cities')) || [];


function kelvinToFahrenheit(kelvin) {
  return (kelvin - 273.15) * 9 / 5 + 32;
}

function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const temperatureFahrenheit = kelvinToFahrenheit(data.main.temp);
      const weatherDescription = data.weather[0].description.toLowerCase();

      const weatherInfo = `
        <div class="box">
          <h2 class="title is-4">Weather in ${data.name}, ${data.sys.country}</h2>
          <p><strong>Temperature:</strong> ${temperatureFahrenheit.toFixed(2)} °F</p>
          <p><strong>Weather Description:</strong> ${data.weather[0].description}</p>
          <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
          <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        </div>
      `;
      document.getElementById('results').innerHTML = weatherInfo;

      let suggestion = '';
                if (weatherDescription.includes('rain')) {
                    suggestion = "Make sure to bring an umbrella!";
                } else if (weatherDescription.includes('clear')) {
                    suggestion = "Stay hydrated!";
                } else if (weatherDescription.includes('cloud')) {
                    suggestion = "You might want to bring some layers!";
                } else {
                    suggestion = "Consider preparing appropriately for the weather.";
                }

                document.getElementById('weatherSuggestion').innerHTML = `<p><strong>Suggestion:</strong> ${suggestion}</p>`;

      getEvents(city);
    })
    .catch(error => {
      console.error('There was a problem fetching the weather data:', error);
      document.getElementById('results').innerHTML = '<p class="has-text-danger">Failed to fetch weather data</p>';
    });
}

function getEvents(city) {
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmasterApiKey}&city=${city}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data._embedded && data._embedded.events.length > 0) {
        const events = data._embedded.events;
        let eventsInfo = `<div class="box"><h2 class="title is-4">Events in ${city}</h2></div>`;

        events.forEach(event => {
          eventsInfo += `
            <div class="box">
              <h3 class="title is-5">${event.name}</h3>
              <p><strong>Date:</strong> ${new Date(event.dates.start.dateTime).toLocaleString()}</p>
              <p><strong>Venue:</strong> ${event._embedded.venues[0].name}</p>
              <p><a class="button is-link" href="${event.url}" target="_blank">More Info</a></p>
            </div>
          `;
        });

        document.getElementById('results').innerHTML += eventsInfo;
      } else {
        document.getElementById('results').innerHTML += '<p class="has-text-warning">No events found</p>';
      }
    })
    .catch(error => {
      console.error('There was a problem fetching the event data:', error);
      document.getElementById('results').innerHTML += '<p class="has-text-danger">Failed to fetch event data</p>';
    });
}

document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const city = document.getElementById('city').value.trim();
  if (city) {
    getWeather(city);
cities.push(city)
localStorage.setItem('cities',JSON.stringify(cities)) 

  } else {
    alert('Please enter a city name');
  }
});

const citiesInput = document.querySelector('#city');
const citiesList = document.querySelector('#cities-List');


function renderCities() {
  
  citiesList.innerHTML = '';


  for (let i = 0; i < cities.length; i++) {
     cities = cities[i];

    const li = document.createElement('li');
    li.textContent = cities;
    li.setAttribute('data-index', i);

    

    li.appendChild(button);
    citiesList.appendChild(li);
  }
}


function init() {

  const storedCities = JSON.parse(localStorage.getItem('cities'));

  if (storedCities !== null) {
    cities = storedCities;
  }
  renderCities();
}

function storeCities() {
  
  localStorage.setItem('cities', JSON.stringify(cities));
}
const citiesForm = document.getElementById('searchForm')
citiesForm.addEventListener('submit', function (event) {
  event.preventDefault();



  

  citiesInput.value = '';

 
  storeCities();
  renderCities();
});


citiesList.addEventListener('click', function (event) {
  const element = event.target;

  if (element.matches('button') === true) {
   
    const index = element.parentElement.getAttribute('data-index');
    cities.splice(index, 1)

   
    storeCities();
    renderCities();
  }
});


init();

