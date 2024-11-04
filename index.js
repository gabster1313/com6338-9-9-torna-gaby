const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';
const weatherAppDiv = document.getElementById('weather-app');
const form = document.querySelector('form');
const input = document.getElementById('weather-search');
const weatherDisplay = document.getElementById('weather');

form.onsubmit = async (e) => {
    e.preventDefault();

    const userQuery = input.value.trim();
    console.log(`User input: ${userQuery}`);
    
    const queryString = `?units=imperial&appid=731656e2316f6224d48e82770fabc3c5&q=${userQuery}`;
    const fetchURL = `${weatherURL}${queryString}`;
    
    try {
        const response = await fetch(fetchURL);
        console.log(`Response Status: ${response.status}`);
        
        if (response.status === 404) { 
            showLocationNotFound();
            input.value = '';
            return;
        }
        
        const data = await response.json();
        console.log(data);
        updateDisplay(data);
        input.value = '';
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
};

const showLocationNotFound = () => {
    const h2 = document.createElement('h2');
    h2.textContent = 'Location not found';
    weatherDisplay.innerHTML = '';
    weatherDisplay.appendChild(h2);
};

const updateDisplay = (data) => {
    const {
        name: city,
        sys: { country },
        coord: { lat, lon },
        weather,
        main: { temp: currentTemp, feels_like: feelsLike },
        dt
    } = data;

    const mapLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const weatherDescription = weather[0].description;
    const date = new Date(dt * 1000);
    const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    console.log(`City: ${city}`);
    console.log(`Country: ${country}`);
    console.log(`Map link: ${mapLink}`);
    console.log(`Icon link: ${weatherIcon}`);
    console.log(`Description: ${weatherDescription}`);
    console.log(`Temp: ${currentTemp}`);
    console.log(`Feels like temp: ${feelsLike}`);
    console.log(`Last updated: ${timeString}`);

    weatherDisplay.innerHTML = `
        <h2>${city}, ${country}</h2>
        <a href="${mapLink}" target="_blank">Click to view map</a>
        <img src="${weatherIcon}" alt="Weather icon">
        <p style="text-transform: capitalize;">${weatherDescription}</p><br>
        <p>Current: ${currentTemp}°F</p>
        <p>Feels like: ${feelsLike}°F</p><br>
        <p>Last updated: ${timeString}</p>
    `;
};
