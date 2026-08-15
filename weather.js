var lastCountryData;


function connect() {
    var search = document.getElementById("countryInput").value;
    var statusArea = document.getElementById("statusArea");

    if (search == "") {
        statusArea.innerHTML= "Please type a country name first.";
    }
    else {
        var url = `https://api.restcountries.com/countries/v5/names.common/${search}`;

        // Learned from restcountries.com docs — API key required in every request now
        fetch(url, {
            headers: {
                "Authorization": "Bearer rc_live_4ba239aaeeb54b94a9aa684b033c9721"
            }
        })
        .then(res => res.json())
        .then(data => {
            // I learned this from the REST Countries API documentation.
            // I check the response before displaying the country data.
            if (data.errors|| !data.data || !data.data.objects || data.data.objects.length == 0) {
                statusArea.innerHTML = "Country not found. Please check the spelling.";
            }
            else {
                // I used data.data.objects because the country results are stored inside this nested array.
                display(data.data.objects);
            }
        });
    }


}

function display(data) {
    var oldContent = document.getElementById("displayArea");

    oldContent.textContent = "";
    lastCountryData = data;

    for (var i = 1; i <= data.length;  i++) {

        // I learned this from the internet.
        // I used i - 1 because JavaScript arrays start from index 0. 
        var country = data[i - 1];

        // I learned these fields from the REST Countries API documentation.
        // I used them to display the country's flag, name, capital, region and population.
        var flagUrl = country.flag.url_png;
        var name = country.names.common;
        var capital = country.capitals[0].name;
        var region = country.region;
        var population = country.population;

        var newDiv = document.createElement("div");

        newDiv.innerHTML = `<img src="${flagUrl}"> <br>
                             Country Name: <b>${name}</b> <br>
                             Capital: ${capital} <br>
                             Region: ${region} <br>
                             Population: ${population} <br>

                             <button onclick="showWeather(${i - 1})">More Details (Weather)</button>
                             <div id="weatherArea${i - 1}"></div>`;

        newDiv.classList.add("countryCard");
        oldContent.appendChild(newDiv);
    }
}


function showWeather(index) {
    var country = lastCountryData[index];

    // I learned this technique from the internet.
    // I used + index to give each country a separate weather area.
    var weatherArea = document.getElementById("weatherArea" + index);

    // I learned these coordinate fields from the REST Countries API documentation.
    // I used them because Open-Meteo needs latitude and longitude for weather data.
    var lat = country.coordinates.lat;
    var lon = country.coordinates.lng;

    var url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(url)
    .then(res => res.json())
    .then(data => displayWeather(data, index));

}

function displayWeather(data, index) {
    var weatherArea = document.getElementById("weatherArea" + index);
    var current = data.current_weather;

    var newDiv = document.createElement("div");

    newDiv.innerHTML = `Temperature: <b>${current.temperature} &deg;C</b> <br>
                         Wind Speed: ${current.windspeed} km/h <br>
                         Wind Direction: ${current.winddirection} degrees`;

    newDiv.classList.add("weatherBox");


    weatherArea.textContent ="";
    weatherArea.appendChild(newDiv);

}