document.addEventListener("DOMContentLoaded", () => {
    // select the button element
    const button = document.querySelector("input[type='submit']");

    // initializing cache array
    const cache = []

    // event listener to clear the input field on focus
    const inputField = document.getElementById("city")
    inputField.addEventListener("focus", () => {
        inputField.value = ""
    })

    // add event listener for clicking the button
    button.addEventListener("click", async (e) => {
        // disable the button for the duration of the event handler's execution, to prevent duplicate form submissions / duplicate renderings
        button.disabled = true;

        // whatever this is
        e.preventDefault();

        // get the parent div element (#container)
        const container = document.getElementById("container")

        // empty the container element at each click event, so as not to append the same DOM elements multiple times, on consecutive clicks (remove <h2> and <img> element from container)
        removeFosterChildren(container);
        
        // get the name of the city from the text input
        const city = document.getElementById("city").value.toLowerCase();

        // check if city is in cache; if not, make the API calls and store the name of the city and the corresponding data inside the cache array for faster future access
        if(!isInCache(city, cache)){

            // call api for city coordinates
            console.log("api call")    
            let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=564bc16d09194b34bb33ade87379339d`);
            let data = await response.json();
            console.log("openCage API: ")
            console.log(data)
            
            // error handling for missing or invalid city name
            if(data.results[0] === undefined){
                const errorMessage = document.createElement("p")
                errorMessage.textContent = "*(Invalid or missing city name)"
                errorMessage.setAttribute("style", "color:red")
                container.append(errorMessage)
                button.disabled = false;
                return;
            }

            // get city coordinates 
            const lat = data.results[0].geometry.lat;
            const lon = data.results[0].geometry.lng;

            // get city timeZone to use for getting the local time and date later on
            console.log("timezone: ")
            const timeZoneName = data.results[0].annotations.timezone.name;
            console.log(timeZoneName);

            // call api for weather details based on city coordinates
            console.log("weather API: ")
            response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b39e780fca49ecc87aab1fe4792361fc`)
            data = await response.json();
            console.log(data)
            
            // add all the info that we need from the previous API calls to our local cache
            // with our city's name as a key 
            cache[city] = data;
            cache[city].timeZone = timeZoneName;
            // console.log(cache)
        }

        // create a row div to hold the weekday+img pair(s) of elements
        const rowDiv = document.createElement("div")
        rowDiv.setAttribute("class", "row-div")

        // get the number of positions to subtract from the WeatherAPI's list of 40 forecasts, according to the number of days selected by the user
        // /!\ this constant holds one of the following values: 40, 32, 24, 16, 8 or 0 /!\
        const positionsToSubtract = document.getElementById("positionsToSubtract").value;
        // console.log(positionsToSubtract)

        // Bonus - display the current date and time for the target city
        appendCurrentDateAndTime(cache, city, container);

        // create and populate DOM elements for display, using the data from the cache and the input from the user 
        createAndPopulateDomElements(rowDiv, positionsToSubtract, cache, city);

        // re-enable the button at the end of the event
        button.disabled = false;
    })   
})

// function to handle the dynamic creation and display of custom DOM elements that hold the information requested by the user 
function createAndPopulateDomElements(rowDiv, positionsToSubtract, cache, city) {
    for (let i = 0; i <= cache[city].list.length - positionsToSubtract; i = i + 8) {
        // create a div to hold the weekday and its corresponding icon
        const colDiv = document.createElement("div");
        colDiv.setAttribute("class", "colDiv");

        // get today's weekday
        let day = getDayOfWeek(i);

        // get weather id and cloud percentage for the current day
        let cloudPercentage = cache[city].list[i].clouds.all;
        let weatherId = cache[city].list[i].weather[0].id;

        // choose what icon to display for the current day, based on weather conditions (weather id and cloud percentage)
        const svgFileName = getWeatherIconFilename(weatherId, cloudPercentage);

        createDomElements(day, svgFileName, colDiv, rowDiv);

        // handle the indexOutOfBounds, in case we've reached the 40th weather list element 
        //--(only if we need to display the weather forecast for 6 days)--
        if (i === cache[city].list.length - 8 && positionsToSubtract === "0") {
            i--;
        }

        // append the row div to the main section element (#container)
        container.append(rowDiv); 
        console.log(cache)
    }

    // function to check the local time against the local sunrise time for our city
    // returns true if it's night time over there
    function isNightTime() {

        const now = new Date();
        const sunriseTime = new Date(cache[city].city.sunrise*1000)
        const sunsetTime = new Date(cache[city].city.sunset*1000)
        // console.log("sunset time :" + new Date(cache[city].city.sunset*1000))
        // console.log("sunrise time :" + new Date(cache[city].city.sunrise*1000))
        if(now >= sunriseTime && now < sunsetTime) {
            return false;
        }    
        return true;
    }

    function getWeatherIconFilename(weatherId, cloudPercentage) {
        return weatherId === 800 ? "sun"
            : weatherId >= 600 && weatherId < 700 ? "snow"
                : (weatherId >= 200 && weatherId < 600) || (weatherId >= 700 && weatherId < 800) ? "rain"
                    : weatherId > 800 && cloudPercentage < 50 ? "cloudy" : "clouds";
    }

    function getDayOfWeek(i) {

        // get local city dateTime
        const localDateTime = new Date().toLocaleString("US", { timeZone: cache[city].timeZone, hour12: true });

        // get our local date
        const hereNow = new Date().getDate()                                     // getDate() returns the date part of the DateTime object

        // check if today's date is the same in both locations, locally and in the target city
        // if the target city already passed into the next day (a.k.a. if the time there is past midnight), set the first displayed day of the week to tomorrow
        let day = new Date(cache[city].list[i].dt_txt).getDay();
        if(localDateTime.substring(0, 2) > hereNow){                             // calling substring(0, 2) because we just need the date (the first 2 characters of the dateTime) 
            day = day === 6 ? 0 : ++day;
        }
        
        switch (day) {
            case 0:
                day = "Sunday";
                break;
            case 1:
                day = "Monday";
                break;
            case 2:
                day = "Tuesday";
                break;
            case 3:
                day = "Wednesday";
                break;
            case 4:
                day = "Thursday";
                break;
            case 5:
                day = "Friday";
                break;
            case 6:
                day = "Saturday";
                break;
        }
        return day;
    }

    // function to create DOM elements (h2 and img) to hold the day and weather icon, append both of them to a container element (colDiv), and append the latter to the rowDiv
    function createDomElements(day, svgFileName, colDiv, rowDiv) {
        
        const h2 = document.createElement("h2");
        h2.textContent = day;

        const img = document.createElement("img");
        img.setAttribute("src", `./weatherOptions/${svgFileName}.svg`);

        // check if it's nightime or daytime, and render the display accordingly 
        if(isNightTime()){
            h2.setAttribute("style", "color:white")
            img.setAttribute("style", "filter:invert()")
            document.querySelector("html").style.background="midnightblue";
            document.querySelector("h1").setAttribute("style", "color:white");
            document.querySelector("input[type='submit']").setAttribute("style", "color:white")
            document.querySelector("p").setAttribute("style", "color:white")
        } else {
            document.querySelector("html").style.background="skyblue";
            document.querySelector("h1").setAttribute("style", "color:black")
            document.querySelector("input[type='submit']").setAttribute("style", "color:black")
        }

        // append the h2 and img elements to the col div element
        colDiv.append(h2, img);

        // append the col div element to the row div element
        rowDiv.append(colDiv);

    }
}

// function to remove the appended custom elements 
function removeFosterChildren(container) {
    if (container.childElementCount > 1) {

        while (container.childElementCount > 1) {
            container.lastChild.remove();
        }
        console.log(container.childElementCount);
    }
}

// function to check if the city is already in the cache
function isInCache(city, cache) {
    for(const entry of Object.entries(cache)){
        for(const key of entry){ 
            if(key === city){
                return true;
            }
        }
    }
    return false;
}

// function to append the curent city's date and time to the final display
function appendCurrentDateAndTime(cache, city, container) {
    const localTimeElem = document.createElement("p");
    const localTime = new Date().toLocaleString("US", { timeZone: cache[city].timeZone, hour12: true });
    localTimeElem.textContent = `Local Time : \n ${localTime}`;
    localTimeElem.setAttribute("class", "date-and-time");
    container.append(localTimeElem);
}

