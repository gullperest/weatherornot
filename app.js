let valueSearch = document.getElementById("valueSearch");
let city = document.getElementById("city");
let temperature = document.getElementById("temperature");
let description = document.querySelector(".description");
let clouds = document.getElementById("clouds");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");
let form = document.querySelector("form");
let main = document.querySelector("main");
//forecast div
let forecastDiv = document.getElementById("forecast")
//authorise the user
const clientId = "PLV5BQ5AJQEU4CKF2J";
const clientSecret = "7VU77IK4ZNSM3KYARGO2NXFFWL5SA33K4DPYXM4NWS6T5PMAVR";
const redirectUri = 'https://gullperest.github.io/weatherornot/';

//events div
let eventsDiv = document.getElementById("events")
//eventsDiv.appendChild(eventsDiv);


form.addEventListener("submit", (event) => {
  event.preventDefault();
  //   alert(valueSearch.value);
  if (valueSearch.value !== "") {
    searchWeather();
  }
});

let id = "80b9264aafc0f673093c580da5334399";
let url =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + id;
  //fetch forecast api
let urlForecast = "";
let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" + id;
// fetch event api
let eventbriteApiKey = "LOI25EIEQ5DSGPYSBJLQ";
let eventbriteUrl = "https://www.eventbriteapi.com/v3/users/me/?token=" + eventbriteApiKey;

function authoriseUser() {
  const authURL = `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = authURL; // Redirect the user to Eventbrite for authorization
}

async function searchWeather() {
  let response = await fetch(url + "&q=" + valueSearch.value);
  let data = await response.json();
  console.log(data);
  if (data.cod === 200) {
    city.querySelector("figcaption").innerText = data.name;
    city.querySelector("img").src =
      "https://flagsapi.com/" + data.sys.country + "/shiny/32.png";
    temperature.querySelector("img").src =
      "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
    temperature.querySelector("figcaption span").innerText = data.main.temp;
    description.innerText = data.weather[0].description;
    clouds.innerText = data.clouds.all;
    humidity.innerText = data.main.humidity;
    pressure.innerText = data.main.pressure;
    valueSearch.value = "";
    // searchforecast
    showForecast(data.name)
    //search event based on the temp
    fetchEvents(data.main.temp,data.name);
  } else {
    main.classList.add("error");
    setTimeout(() => {
      main.classList.remove("error");
    }, 1000);
  }
}
// forecast function
async function showForecast(cityName){
  try {
    let forecastResponse = await fetch(forecastUrl + "&q=" + cityName);
    let forecastData = await forecastResponse.json();
    console.log("Forecast data", forecastData);

    if (forecastData.cod === "200") {
      displayForecast(forecastData);
    } else {
      console.error("Failed to fetch forecast data");
    }
  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}
function displayForecast(forecastData) {
  forecastDiv.innerHTML = "<h2>5-Day Forecast</h2>";
  // Filter out only the forecast items for the next 5 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fiveDaysLater = new Date(today);
  fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

  const filteredForecast = forecastData.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date >= tomorrow && date <= fiveDaysLater;
  });

  // Group forecast items by date
  const groupedByDate = {};
  filteredForecast.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(item);
  });

  // Calculate average temperature for each date
  const averageTemperatures = Object.keys(groupedByDate).map(date => {
    const items = groupedByDate[date];
    const totalTemp = items.reduce((acc, curr) => acc + curr.main.temp, 0);
    const avgTemp = totalTemp / items.length;
    return {
      date,
      avgTemp: avgTemp.toFixed(1), // Round to 1 decimal place
      icon: items[0].weather[0].icon, // Use the first item's icon
      description: items[0].weather[0].description // Use the first item's description
    };
  });

  // Generate HTML for forecast items
  const forecastItems = averageTemperatures.map(item => {
    return `
      <div class="forecast-item">
        <p>${item.date}</p>
        <img src="https://openweathermap.org/img/wn/${item.icon}.png" alt="${item.description}">
        <p>Average Temperature: ${item.avgTemp} °C</p>
        <p>Condition: ${item.description}</p>
      </div>
    `;
  }).join('');

  forecastDiv.innerHTML += `<div class="forecast-items">${forecastItems}</div>`;
}
// Fetch events based on temperature
sync function fetchEvents(temperature, cityName) {
  try {
    let eventType = temperature >= 25 ? "outdoor" : "indoor";
    let accessToken = " LOI25EIEQ5DSGPYSBJLQ"

    let eventsResponse = await fetch(eventbriteUrl + "&q=" + eventType + "&location.address=" + cityName);
    let eventsData = await eventsResponse.json();
    console.log("Events data", eventsData);

    if (eventsData.events && eventsData.events.length > 0) {
      displayEvents(eventsData.events);
    } else {
      eventsDiv.innerHTML = "<p>No events found.</p>";
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}
function displayEvents(events) {
  eventsDiv.innerHTML = "<h2>Recommended Events</h2>";

  const eventItems = events.map(event => {
    return `
      <div class="event-item">
        <p><strong>${event.name.text}</strong></p>
        <p>${event.start.local}</p>
        <a href="${event.url}" target="_blank">View Event</a>
      </div>
    `;
  }).join('');

  eventsDiv.innerHTML += `<div class="event-items">${eventItems}</div>`;
}

function initialApp() {
  valueSearch.value = "Berlin";
  searchWeather();
}
initialApp();

/* Store the element in el */
let el = document.getElementById("tilt");

/* Get the height and width of the element */
const height = el.clientHeight;
const width = el.clientWidth;

/*
 * Add a listener for mousemove event
 * Which will trigger function 'handleMove'
 * On mousemove
 */
el.addEventListener("mousemove", handleMove);

/* Define function a */
function handleMove(e) {
  /*
   * Get position of mouse cursor
   * With respect to the element
   * On mouseover
   */
  /* Store the x position */
  const xVal = e.layerX;
  // console.log(xVal);
  /* Store the y position */
  const yVal = e.layerY;

  /*
   * Calculate rotation valuee along the Y-axis
   * Here the multiplier 20 is to
   * Control the rotation
   * You can change the value and see the results
   */
  const yRotation = 15 * ((xVal - width / 2) / width);

  /* Calculate the rotation along the X-axis */
  const xRotation = -15 * ((yVal - height / 2) / height);

  /* Generate cssTiltProperty for CSS transform property */
  const cssTiltProperty =
    "perspective(500px) scale(1.1) rotateX(" +
    xRotation +
    "deg) rotateY(" +
    yRotation +
    "deg)";

  /* Apply the calculated transformation */
  el.style.transform = cssTiltProperty;
}

/* Add listener for mouseout event, remove the rotation */
el.addEventListener("mouseout", function () {
  el.style.transform = "perspective(500px) scale(1) rotateX(0) rotateY(0)";
});

// /* Add listener for mousedown event, to simulate click */
// el.addEventListener("mousedown", function () {
//   el.style.transform = "perspective(500px) scale(0.9) rotateX(0) rotateY(0)";
// });

// /* Add listener for mouseup, simulate release of mouse click */
// el.addEventListener("mouseup", function () {
//   el.style.transform = "perspective(500px) scale(1.1) rotateX(0) rotateY(0)";
// });
