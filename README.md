# WeatherForecast
Small weather forecasting program using APIs


A small weather forecast page, entirely in JavaScript, using APIs to fetch the weather forecast for a specific city.

The front-end will have a simple HTML page with a form. The form will let a visitor search for a specific city. Then, using JavaScript, the app will get the forecast for that city and modify the HTML page to display it.

It'll use two APIs:

- the OpenCage Geocoder API to get the GPS coordinates from the city name

- the OpenWeather API to get the weather forecast for the next 7 days for given GPS coordinates (One Call API)


When it comes to displaying the information on the HTML page, it will be grouped into the 5 following weathers:
- Clear
- Snow
- Clouds (if there are more than 50% of clouds)
- Cloudy (between 0 and 50% of clouds)
- Rain (in all other cases, so including Thunderstorm, Mist, etc)
