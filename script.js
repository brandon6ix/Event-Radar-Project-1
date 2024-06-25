// l7lnMA4sPyZXAkzgQqjbeBHIB7D6cnl5
// 7ef83d28280d127f242c2a20cdb05f1a
const weatherApiKey = '7ef83d28280d127f242c2a20cdb05f1a';
const ticketmasterApiKey = 'l7lnMA4sPyZXAkzgQqjbeBHIB7D6cnl5'; 



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
                //  
                document.getElementById('weatherSuggestion').innerHTML = `<p> ${suggestion}</p>`;

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
  $( ".selector" ).dialog( "option", "modal", true );
  if (city) {
    getWeather(city);
  } else {
    alert('Please enter a city name');
  }
});

$( function() {
  $( "#dialog" ).dialog({
    autoOpen: false,
    show: {
      effect: "blind",
      duration: 1000
    },
    hide: {
      effect: "explode",
      duration: 1000
    }
  });

  $( "#opener" ).on( "click", function() {
    $( "#dialog" ).dialog( "open" );
  });
} );

