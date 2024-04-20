// Initializing multiple constants by selecting elements from DOM using their IDs or classes
// for manipulation within the application
const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    weatherDescription = document.getElementById("description"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv_index"),
    uvText = document.querySelector(".uv_text"),
    windSpeed = document.querySelector(".wind_speed"),
    sunRise = document.querySelector('.sunrise'),
    sunSet = document.querySelector(".sunset"),
    humidity = document.querySelector(".humidity"),
    humidityStatus = document.querySelector(".humidity_status"),
    visibility = document.querySelector(".visibility"),
    visibilityStatus = document.querySelector(".visibility_status"),
    airQuality = document.querySelector(".air_quality"),
    airQualityStatus = document.querySelector(".air_quality_status"),
    weatherCards = document.querySelector('#weather_cards'),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelector(".temp_unit"),
    searchCity = document.querySelector('#search'),
    search = document.getElementById("query");

// Defining variables for storing some details 
let currentCity = "";
let currentTempUnit = "c";
let hourlyorWeek = "Week";


// function returns the current time and day in a customized format.
function getCurrentDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;

    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}


// Updating the time every second
date.innerText = getCurrentDateTime();

setInterval(() => {
    date.innerText = getDateTime();
}, 1000);


// function to get your current location using your IP Addrerss
function getPublicIp() {
    fetch("https://api.ipgeolocation.io/ipgeo?apiKey=aa7f7bc869324131a27082dcd5adaa7b", {
        method: "GET",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        currentCity = data.city;
        getWeatherDetails(currentCity, currentTempUnit, hourlyorWeek);
    })
    .catch((error) => {
        console.error("Error fetching IP data:", error);
        currentCity = "Vellore";
        getWeatherDetails(currentCity, currentTempUnit, hourlyorWeek);
    });
}

getPublicIp();

// function to get weather data and update using DOM
function getWeatherDetails(city, unit, hourlyorWeek) {
    console.log(city);
    const apiKey = "PLQQWVHXE4LCEJTUEGXCSC4WD";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=${apiKey}&contentType=json`, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;
            if (unit == 'f') temp.innerText = today.temp;
            else temp.innerHTML = fahrenheitToCelcius(today.temp);

            currentLocation.innerText = data.resolvedAddress;
            weatherDescription.innerText = data.description;
            condition.innerText = today.conditions;
            rain.innerText = "Percent - " + today.precipprob + "%";
            windSpeed.innerText = today.windspeed;
            uvIndex.innerText = today.uvindex;
            visibility.innerText = today.visibility;
            humidity.innerText = today.humidity + '%';
            airQuality.innerText = today.winddir;
            sunRise.innerText = convertTimeInto12HrFormat(today.sunrise);
            sunSet.innerText = convertTimeInto12HrFormat(today.sunset);
            measureUvIndex(today.uvIndex);
            updateHumidityStatus(today.humidity);
            updateAirQualityStatus(today.winddir);
            updateVisibilityStatus(today.visibility);
            mainIcon.src = updateIcon(today.icon);
            
            updateBackgroundImage(today.icon);
            if (hourlyorWeek === "hourly") {
                updateWeatherForecast(data.days[0].hours, unit, "day");
            } else {
                updateWeatherForecast(data.days, unit, "week");
            }

        })

        .catch((err) => {
            document.querySelector(".popup").classList.remove('close');
        });

}

// convert celcius to fahrenheit
function fahrenheitToCelcius(temp) {
    return ((temp - 32) * (5 / 9)).toFixed(1);
}

// function to close the popup when city is not found
function closePopup() {
    document.getElementById('popup').classList.add('close');
}


// function to get uv index status
function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) uvText.innerText = "Low";
    else if (uvIndex <= 5) uvText.innerText = "Moderate";
    else if (uvIndex <= 7) uvText.innerText = "High";
    else if (uvIndex <= 10) uvText.innerText = "Very High";
    else uvText.innerText = "Extreme";
}

//function to get humidity status
function updateHumidityStatus(humidity) {
    if (humidity < 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity >= 30 && humidity < 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}

//function to get visibility status
function updateVisibilityStatus(visibility) {
    if (visibility < 0.3) {
        visibilityStatus.innerText = "Dense Fog";
    } else if (visibility >= 0.3 && visibility < 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility >= 0.16 && visibility < 0.35) {
        visibilityStatus.innerText = "Light Fog";
    } else if (visibility >= 0.35 && visibility < 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility >= 1.13 && visibility < 2.16) {
        visibilityStatus.innerText = "Light Mist";
    } else if (visibility >= 2.16 && visibility < 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility >= 5.4 && visibility < 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

//function to get air quality status
function updateAirQualityStatus(airQuality) {
    if (airQuality < 50) {
        airQualityStatus.innerText = "Good";
    } else if (airQuality >= 50 && airQuality < 100) {
        airQualityStatus.innerText = "Moderate";
    } else if (airQuality >= 100 && airQuality < 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
    } else if (airQuality >= 150 && airQuality < 200) {
        airQualityStatus.innerText = "Unhealthy";
    } else if (airQuality >= 200 && airQuality < 250) {
        airQualityStatus.innerText = "Very Unhealthy";
    } else {
        airQualityStatus.innerText = "Hazardous";
    }
}

// function to convert time into 12 Hours format
function convertTimeInto12HrFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    hour = hour < 10 ? "0" + hour : hour;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

// function to return image address for icon updation as per different weather conditions
function updateIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "assets/images/icons/cloud.png";
    } else if (condition === "Partly-cloudy-night") {
        return "assets/images/icons/cloud-night.png";
    } else if (condition === "snow") {
        return "assets/images/icons/snow.png";
    } else if (condition === "rain") {
        return "assets/images/icons/rain.png";
    } else if (condition === "clear-day") {
        return "assets/images/icons/clear.png";
    } else if (condition === "clear-night") {
        return "assets/images/icons/moon.png";
    } else if (condition === "mist") {
        return "assets/images/icons/mist.png";
    } else if (condition === "wind") {
        return "assets/images/icons/wind.png";
    } else {
        // return `https://source.unsplash.com/featured/?${condition}-cartoon`;
        return "assets/images/icons/clouds.png";
    }
}

// function to return day name of the argumented date
function getDayName(date) {
    let day = new Date(date);
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day.getDay()];
}

// function to display time in customized format
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}

// function to update the Weather Forecast based on specified unit and type
function updateWeatherForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = (type === "day") ? 24 : 7;

    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");

        // Set the hour if hourly forecast, or day name if weekly forecast
        let dayName = (type === "week") ? getDayName(data[day].datetime) : getHour(data[day].datetime);

        let dayTemp = data[day].temp;
        if (unit === 'c') {
            dayTemp = fahrenheitToCelcius(data[day].temp);
        }

        let iconCondition = data[day].icon;
        let iconSrc = updateIcon(iconCondition);

        let tempUnit = (unit === 'f') ? '°F' : '°C';

        // Create HTML structure for forecast card
        card.innerHTML = `
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
            <img src="${iconSrc}" alt="">
        </div>
        <div class="day-temp flex">
            <h2 class="temp">${dayTemp}</h2>
            <span class="temp_unit">${tempUnit}</span>
        </div>
        `;

        weatherCards.appendChild(card);
        day++;
    }
}

// function to change the background based on the current city weather conditions
function updateBackgroundImage(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "assets/background/cityscape.jpg";
    } else if (condition === "Partly-cloudy-night") {
        bg = "assets/background/cloudy-sky.jpg";
    } else if (condition === "rain") {
        bg = "assets/background/rainy-day.avif";
    } else if (condition === "clear-day") {
        bg = "assets/background/clear-day.avif";
    } else if (condition === "clear-night") {
        bg = "assets/background/clear-night.jpg";
    } else {
        bg = ` https://source.unsplash.com/featured/?${condition}`;
    }

    body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bg})`;
}


fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});

celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});

// function to change the unit 
function changeUnit(unit) {
    if (currentTempUnit !== unit) {
        currentTempUnit = unit;

        // Change unit on document
        tempUnit.innerText = `°${unit.toUpperCase()}`;

        if (unit === "c") {
            celciusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        } else {
            celciusBtn.classList.remove("active");
            fahrenheitBtn.classList.add("active");
        }

        // Call getWeatherDetails after changing the unit
        getWeatherDetails(currentCity, currentTempUnit, hourlyorWeek);
    }
}

hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});

weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
});

// function to change the forecasting content based on hourly or weekly value
function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;

        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }

        // Update weather on time change
        getWeatherDetails(currentCity, currentTempUnit, hourlyorWeek);
    }
}

// Event Handler for searching city name from search box content
searchCity.addEventListener("submit", function (e) {
    e.preventDefault();
    let location = search.value;

    if (location) {
        currentCity = location;
        search.value = "";
        getWeatherDetails(currentCity, currentTempUnit, hourlyorWeek);
    }
});

cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam", "Indore", "Thane", "Bhopal", "Patna", "Vadodara", "Ghaziabad",
    "Ludhiana", "Coimbatore", "Agra", "Madurai", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar",
    "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Howrah", "Ranchi", "Gwalior", "Jabalpur", "Vijayawada",
    "Jodhpur", "Raipur", "Kota", "Guwahati", "Chandigarh", "Thiruvananthapuram", "Solapur", "Tiruchirappalli", "Bareilly", "Moradabad",
    "Mysore", "Udaipur", "Kochi", "Kollam", "Thrissur", "Malappuram", "Kannur", "Kottayam", "Kasaragod", "Palakkad",
    "Alappuzha", "Pathanamthitta", "Kozhikode", "Idukki", "Wayanad", "Ernakulam", "Thalassery", "Ponnani", "Kodungallur",
    "Chavakkad", "Chalakudy", "Kunnamkulam", "Perumbavoor", "Payyannur", "Manjeri", "Neyyattinkara", "Taliparamba", "Nedumangad",
    "Thiruvalla", "Mavelikkara", "Thrippunithura", "Thodupuzha", "Koothattukulam", "Angamaly", "North Paravur", "Aluva", "Cherthala", "Vaikom",
    "Kattappana", "Kayamkulam", "Punalur", "Kalamassery", "Varkala", "Adoor", "Karunagappally", "Muvattupuzha", "Attingal", "Changanassery",
    "Perinthalmanna", "Kanhangad", "Chittur-Thathamangalam", "Pappinisseri", "Sultan Bathery", "Cheruthazham", "Peringathur", "Tirur",
    "Kadayanallur", "Panagudi", "Udumalaipettai", "Shenkottai", "Surandai", "Palladam", "Vellakoil", "Periyakulam", "Perambalur",
    "Nilakkottai", "Natham", "Naduvattam", "Pallapatti", "Mayiladuthurai", "Sirkali", "Pollachi", "Vadakkuvalliyur", "Pernampattu",
    "Vedaranyam", "Tharangambadi", "Chidambaram", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur",
    "Krishnagiri", "Nagapattinam", "Namakkal", "Nilgiris", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni",
    "Thoothukudi", "Tirunelveli", "Tirupur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar",
    "Alipurduar", "Asansol", "Baharampur", "Balurghat", "Bankura", "Baranagar", "Barasat", "Bardhaman", "Basirhat", "Bhadreswar",
    "Chandannagar", "Chinsurah", "Cooch Behar", "Darjeeling", "Diamond Harbour", "Dum Dum", "Durgapur", "Haldia", "Islampur", "Jalpaiguri",
    "Jangipur", "Kharagpur", "Krishnanagar", "Malda", "Midnapore", "Murshidabad", "Navadwip", "Paschim Bardhaman", "Purulia", "Manali",
    "Ayodhya"];



var currentFocus;

// Event listener for handling input in the search box to search cities from the provided list
search.addEventListener("input", function () {
    removeSuggestions(); // Remove any existing suggestions
    var a, b, i;
    var val = this.value;

    if (!val) { // If the input value is empty, return
        return false;
    }

    currentFocus = -1; // Reset the focus index

    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");

    this.parentNode.appendChild(a);

    for (var i = 0; i < cities.length; i++) {
        // Check if items start with the same letters as in the input
        if (cities[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
            // If any suggestion matches, then create <li>
            b = document.createElement("li");

            // Add content in <li>
            // Use <strong> to make the matching letters bold
            b.innerHTML = "<strong>" + cities[i].substr(0, val.length) + "</strong>";
            // Add the remaining part of the suggestion
            b.innerHTML += cities[i].substr(val.length);

            // Add an input field to hold the suggestion value
            b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";

            // Add event listener on suggestion
            b.addEventListener("click", function (e) {
                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggestions();
            });

            a.appendChild(b);
        }
    }
});

// function to remove the suggestions list
function removeSuggestions() {
    var x = document.getElementById("suggestions");
    if (x) {
        x.parentNode.removeChild(x);
    }
}

// Event listener for handling keyboard inputs for navigating through suggestions
search.addEventListener("keydown", function (e) {
    var x = document.getElementById("suggestions").getElementsByTagName("li");

    // Navigate through suggestions using arrow keys
    if (e.key === "ArrowDown") {
        currentFocus++;
        addActive(x);
    } else if (e.key === "ArrowUp") {
        currentFocus--;
        addActive(x);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (x) {
            x[currentFocus].click();
            searchCity.submit();
        }
    }
});

// function to add 'active' class to the currently focused suggestion
function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("active");
}

// function to remove 'active' class from all suggestions
function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}
