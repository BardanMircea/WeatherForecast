# WeatherForecast
Small weather forecasting program using APIs


A small weather forecast page, entirely in JavaScript, using APIs to fetch the weather forecast for a specific city.

The front-end will have a simple HTML page with a form. The form will let a visitor search for a specific city. Then, using JavaScript, the app will get the forecast for that city and modify the HTML page to display it.

I'll use two APIs:

- the OpenCage Geocoder API to get the GPS coordinates from the city name

- the OpenWeather API to get the weather forecast for the next 7 days for given GPS coordinates (you will use their One Call API)

If you wish to, you may use jQuery (to manipulate the DOM) and Bootstrap (to style your page more easily).

Step 1
Start by putting the foundations in place.

From the provided city name, you will get the current weather forecast and display it, along with the day's name.

Step1 Weather
Demo step 1
To be able to do so, you will need to figure out how to use the APIs. Look at the demo & documentation on the API websites, and test them. Request different URLs and pay attention to what kind of data the API sends back. Then, you can figure out how to extract the necessary information from the API's answer.

Only start coding when you have a good understanding of how the APIs work!
 
To send a request to an API and handle its response without reloading the page, you can use jQuery's get method.

When it comes to displaying the information on the HTML page, you will group it into the 5 following weathers:
- Clear
- Snow
- Clouds (if there are more than 50% of clouds)
- Cloudy (between 0 and 50% of clouds)
- Rain (in all other cases, so including Thunderstorm, Mist, etc)

Here's a set of weather icons to get you started:

weather icons
