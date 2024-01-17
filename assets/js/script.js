///////////////

const key = "611631ac74efe5427566ac7f7af97eae";

function fetchWeather(search) {
    let geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${key}`;

    fetch(geoUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`;

            const h3El = $('#card-title').text(`${data[0].name} (${dayjs().format('MMMM D, YYYY')})`);

            fetch(forecastUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const currentWeather = data.list
                    displayCurrentWeather(data.list[0]);

                    const fiveDayForecast = currentWeather.filter(function (data) {
                        return data.dt_txt.includes('12:00:00')
                    }
                    )
                    console.log(`five day forecast: ${fiveDayForecast}`)

                    const iconCode = currentWeather[0].weather[0].icon;
                    const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

                    $('#forecast').empty();

                    for (let i = 0; i < fiveDayForecast.length; i++) {
                        const day = fiveDayForecast[i];

                        const cardCol = $('<div>').attr('class', 'col-md')
                        const forecastCard = $('<div>').attr('class', 'card')
                        const forecastBody = $('<div>').attr('class', 'card-body')
                        const forecastCardTitle = $('<h5>').attr('class', 'card-title').text(dayjs(day.dt_txt).format('MM-DD-YYYY'))
                        const forecastTemp = $('<p>').text(`Temp: ${day.main.temp} C`)
                        const forecastWind = $('<p>').text(`Wind: ${day.wind.speed} kph`)
                        const forecastHumidity = $('<p>').text(`Humidity: ${day.main.humidity} %`)
                        const forecastIcon = $('<img>').attr('src', iconUrl)

                        $('#forecast').append(cardCol)
                        cardCol.append(forecastCard)
                        forecastCard.append(forecastBody)
                        forecastBody.append(forecastCardTitle, forecastIcon, forecastTemp, forecastWind, forecastHumidity)

                    }
                });
        });
}


function displayCurrentWeather(currentWeather) {
    $('#icon').empty()
    const iconCode = currentWeather.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    console.log(currentWeather.weather[0].icon)
    const icon = $('<img>').attr('src', iconUrl)
    const temp = $('#temp').text(`Temperature: ${currentWeather.main.temp} C`);
    const wind = $('#wind').text(`Wind: ${currentWeather.wind.speed} kph`);
    const humidity = $('#humidity').text(`Humidity: ${currentWeather.main.humidity} %`);
    $('#icon').append(icon)

}

$('#search-button').on('click', function (e) {
    e.preventDefault();

    const search = $('#search-input').val().trim();

    $('#today').attr('class', 'mt-3');

    fetchWeather(search);
});