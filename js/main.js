// search section variables
let search = document.querySelector(".search")
let search_input = document.querySelector("input")
let search_button = document.querySelector(".search-buttom")
let api_key = `128c4205e4aefe3a18111d9c90f02dfe` // API key for OpenWeatherMap API
let search_message = document.querySelector(".search_message")
let weather_section = document.querySelector(".weather")
let not_found_message = document.querySelector(".not-found_message")
// Weather section variables
let city = document.querySelector(".city") // City name element
let day = document.querySelector(".day") // Day of the week element
let month = document.querySelector(".month") // Month and date element
let weather_img = document.querySelector(".status img") // Weather image element (icon)
let temperature_degree = document.querySelector(".temperature_degree") // Temperature element
let weather_name = document.querySelector(".weather_name") // Weather condition name
let humidity = document.querySelector(".humidity .value") // Humidity value element
let wind_speed = document.querySelector(".wind_speed .value") // Wind speed value element
// Forecast section variables
let forecast_box = document.querySelectorAll(".forecast li") // List of forecast elements
let forecast_date = document.querySelectorAll(".forecast li .date") // Date elements for each forecast item
let forecast_img = document.querySelectorAll(".forecast li img") // Weather icons for each forecast item
let forecast_temp = document.querySelectorAll(".forecast li .temperature") // Temperature for each forecast item
// Trigger search when Enter key is pressed
search_input.addEventListener("keydown",(e)=>{
  if(e.key=="Enter" && search_input.value.trim()!==""){ // Check if the input is not empty
    update_data(search_input.value.trim()) // Call the function to fetch weather data
    search_input.value = "" // Clear the input field
    search_input.blur() // Remove focus from the input field
  }
})
// Trigger search when the search button is clicked
search_button.addEventListener("click",()=>{
  if(search_input.value.trim()!==""){ // Check if the input is not empty
    update_data(search_input.value.trim()) // Call the function to fetch weather data
    search_input.value = "" // Clear the input field
    search_input.blur() // Remove focus from the input field
  }
})
// Helper function to show the appropriate section (message, weather, or not-found)
function display_message(message){
  [search_message,weather_section,not_found_message].forEach(s=>s.style.display = "none") 
  message.style.display = "flex" // Display the requested section
}
// Function to fetch weather data based on the location and data type (current weather or forecast)
async function get_data(location, type) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/${type}?q=${location}&appid=${api_key}&units=metric`
    );
    // check the response if not success
    if (!response.ok) {  
      throw new Error("Error fetching data");
    }
    // the response success and store
    return await response.json();
    // if error happens
  } catch (error) {
    console.log(error);
    display_message(not_found_message);
  }
}
// Main function to update the UI with the fetched weather data
async function update_data(location){
  let weather_data = await get_data(location,`weather`) // Fetch current weather data
  if(weather_data.cod!=200){ // If there's an error (e.g., city not found)
    display_message(not_found_message) // Show 'not found' message
    return
  }
  // Update weather details
  city.innerHTML = weather_data.name // Set city name
  let date = new Date() // Get current date
  day.innerHTML = date.toLocaleDateString("default", { weekday: 'long' }) // Set day of the week
  month.innerHTML = `, ${date.getDate()} ${date.toLocaleDateString("default", { month: 'short' })}` // Set date and month
  weather_img.src = `assets/weather/${weather_data.weather[0].main}.png` // Set weather icon based on condition
  temperature_degree.innerHTML = `${Math.round(weather_data.main.temp)} °C` // Set temperature
  weather_name.innerHTML = weather_data.weather[0].main // Set weather condition (e.g., "Clear")
  humidity.innerHTML = `${weather_data.main.humidity}%` // Set humidity percentage
  wind_speed.innerHTML = `${weather_data.wind.speed}M/s` // Set wind speed
  display_message(weather_section) // Show the weather section
  // Fetch forecast data
  let forecast_data = await get_data(location,`forecast`)
  let forecast_list = []
  // Filter forecasts to show only data at 12:00:00 each day
  forecast_data.list.forEach(forecast=>{
    (forecast.dt_txt.includes('12:00:00'))?forecast_list.push(forecast):"" // Add each day forecasts to the list
  })
  // Update forecast section
  forecast_list.forEach((list,index)=>{
    if(index!=0){ // Skip the first item (current day)
      date = new Date(list.dt_txt.slice(0,10)).toLocaleDateString("default", {day:"numeric", month: 'short' })
      forecast_date[index-1].innerHTML = date.split(" ").reverse().join(" ") // Format and display the date
      forecast_img[index-1].src = `assets/weather/${list.weather[0].main}.png` // Set forecast icon
      forecast_temp[index-1].innerHTML = `${Math.round(list.main.temp)} °C` // Set forecast temperature
    }
  })
}

// to know your location
navigator.geolocation.getCurrentPosition(
  async (pos) => {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
    );
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

// تحميل الحالة
window.addEventListener("load", () => {
  let savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    icon.classList.add("fa-moon");
  }
});

// لو مفيش ثيم محفوظ
if (!localStorage.getItem("theme")) {
  let prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  if (prefersLight) {
    document.body.classList.add("light-mode");
    icon.classList.replace("fa-moon", "fa-sun");
  }
}

// dark and light mode
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