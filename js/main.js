// search section variables
let search = document.querySelector(".search")
let searchInput = document.querySelector("input")
let searchButton = document.querySelector(".search-buttom")
let apiKey = `128c4205e4aefe3a18111d9c90f02dfe` // API key for OpenWeatherMap API
let searchMessage = document.querySelector(".search_message")
let weatherSection = document.querySelector(".weather")
let notFoundMessage = document.querySelector(".not-found_message")

// Weather section variables
let city = document.querySelector(".city") // City name element
let day = document.querySelector(".day") // Day of the week element
let month = document.querySelector(".month") // Month and date element
let weatherImage = document.querySelector(".status img") // Weather image element (icon)
let temperature_degree = document.querySelector(".temperature_degree") // Temperature element
let weatherName = document.querySelector(".weather_name") // Weather condition name
let humidity = document.querySelector(".humidity .value") // Humidity value element
let windSpeed = document.querySelector(".wind_speed .value") // Wind speed value element

// Forecast section variables
let forecastDate = document.querySelectorAll(".forecast li .date") // Date elements for each forecast item
let forecastImage = document.querySelectorAll(".forecast li img") // Weather icons for each forecast item
let forecastTemp = document.querySelectorAll(".forecast li .temperature") // Temperature for each forecast item


// Trigger search when Enter key is pressed
searchInput.addEventListener("keydown",(e)=>{
  if(e.key=="Enter" && searchInput.value.trim()!==""){ // Check if the input is not empty
    updateData(searchInput.value.trim()) // Call the function to fetch weather data
    searchInput.value = "" // Clear the input field
    searchInput.blur() // Remove focus from the input field
  }
})

// Trigger search when the search button is clicked
searchButton.addEventListener("click",()=>{
  if(searchInput.value.trim()!==""){ // Check if the input is not empty
    updateData(searchInput.value.trim()) // Call the function to fetch weather data
    searchInput.value = "" // Clear the input field
    searchInput.blur() // Remove focus from the input field
  }
})

// Helper function to show the appropriate section (message, weather, or not-found)
function displayMessage(message){
  [searchMessage,weatherSection,notFoundMessage].forEach(s=>s.style.display = "none") 
  message.style.display = "flex" // Display the requested section
}

// Function to fetch weather data based on the location and data type (current weather or forecast)
async function getData(location, type) {
  try {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/${type}?q=${location}&appid=${apiKey}&units=metric`);
    // check the response if not success 
    if (!response.ok) {  
      throw new Error("Error Fetching Data");
    }
    // the response success and store
    return await response.json();
    // if error happens
  } catch (error) {
    console.log(error);
    displayMessage(notFoundMessage);
  }
}

// Main function to update the UI with the fetched weather data
async function updateData(location){
  let weatherData = await getData(location,`weather`) // Fetch current weather data
  if(!weatherData || weatherData.cod != 200){ // If there's an error (e.g., city not found)
    displayMessage(notFoundMessage) // Show 'not found' message
    return
  }

  // Update weather details
  city.innerHTML = weatherData.name // Set city name
  let date = new Date() // Get current date
  day.innerHTML = date.toLocaleDateString("default", { weekday: 'long' }) // Set day of the week
  month.innerHTML = `, ${date.getDate()} ${date.toLocaleDateString("default", { month: 'short' })}` // Set date and month
  weatherImage.src = `images/weather/${weatherData.weather[0].main}.png` // Set weather icon based on condition
  temperature_degree.innerHTML = `${Math.round(weatherData.main.temp)} °C` // Set temperature
  weatherName.innerHTML = weatherData.weather[0].main // Set weather condition (e.g., "Clear")
  humidity.innerHTML = `${weatherData.main.humidity}%` // Set humidity percentage
  windSpeed.innerHTML = `${weatherData.wind.speed}M/s` // Set wind speed
  displayMessage(weatherSection) // Show the weather section

  // Fetch forecast data
  let forecastData = await getData(location,`forecast`)
  let forecastList = []

  // Filter forecasts to show only data at 12:00:00 each day
  forecastData.list.forEach(forecast=>{
    (forecast.dt_txt.includes('12:00:00'))?forecastList.push(forecast):"" // Add each day forecasts to the list
  })

  // Update forecast section
  forecastList.forEach((list,index)=>{
    if(index!=0){ // Skip the first item (current day)
      date = new Date(list.dt_txt.slice(0,10)).toLocaleDateString("default", {day:"numeric", month: 'short' })
      forecastDate[index-1].innerHTML = date.split(" ").reverse().join(" ") // Format and display the date
      forecastImage[index-1].src = `images/weather/${list.weather[0].main}.png` // Set forecast icon
      forecastTemp[index-1].innerHTML = `${Math.round(list.main.temp)} °C` // Set forecast temperature
    }
  })
}

// to know your location
navigator.geolocation.getCurrentPosition(
  async (pos) => {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    let data = await response.json();
    console.log(data);
    document.getElementById("city").innerText = data.name;
    document.getElementById("temp").innerText = data.main.temp + "°C";
    document.getElementById("weather").innerText = data.weather[0].description;
  },
  (error) => {
    console.log(error);
  }
);

// dark and light mode
let toggleBtn = document.querySelector(".theme-toggle");
let icon = toggleBtn.querySelector("i");

// get mode from local storage
window.addEventListener("load", () => {
  let savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    icon.classList.add("fa-moon");
  }
});

// if in local storage no mode
if (!localStorage.getItem("theme")) {
  let prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  if (prefersLight) {
    document.body.classList.add("light-mode");
    icon.classList.replace("fa-moon", "fa-sun");
  }
}

// change mode onclick
toggleBtn.addEventListener("click", () => {
  setTimeout(() => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      icon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    }
  }, 200);
});