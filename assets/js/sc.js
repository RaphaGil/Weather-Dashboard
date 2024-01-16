const APIKey = "b5711c612035188f45544a9bce61dd4d";
const searchHistory = [];

function searchCurrentWeather(cityInput) {
  const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&cnt=5&appid=${APIKey}&units=metric`;
  return fetch(queryUrl)
    .then(function (response) {
      return response.json();
    });
}

function displayCurrentWeather(data) {
  $("#today").empty();
  $(".weather-search").val('');
  const weatherToday = $("#today");
  weatherToday.css({
    "border": "gray 2px solid",
    'background': 'white',
    'color': 'darkgray'
  });

  const weatherImg = $("<img>").attr(
    "src",
    `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
  );
  const city = data.name
  const cityChosen = $("<h1>").text(
    `${city} ${dayjs().format("(DD/MM/YYYY)")}`
  );
  const dataTemp = `Temp: ${data.main.temp}°C`;
  const dataWind = `Wind: ${data.wind.speed}KPH`;
  const dataHum = `Humidity: ${data.main.humidity}%`;

  const dataParagraf = $("<p>").text(dataTemp);
  const windParagraf = $("<p>").text(dataWind);
  const humiParagraf = $("<p>").text(dataHum);

  weatherToday.append(cityChosen, dataParagraf, windParagraf, humiParagraf);
  cityChosen.append(weatherImg);

searchHistory.push(
  weatherImg.prop('outerHTML'), 
  cityChosen.text(), 
  dataTemp, 
  dataWind, 
  dataHum);

  weatherToday.css({
    'padding':'10px'
  })
}

function appendSaveButton(cityName) {
  const history = $(".list-group");
  const saveBtn = $("<button>");
  const userInputSave = cityName; // Assuming you want to set the button text to the city name
  saveBtn.text(userInputSave);
  saveBtn.attr('value', userInputSave);

  saveBtn.css({
    'margin-bottom': '10px',
    "background": "lightgray",
    "height": '30px'
  });

  history.append(saveBtn);

  var saveBtnText = saveBtn.text();

  saveBtn.on("click", function () {
    reprintWeather(saveBtnText);
    historySearch(saveBtnText);
  });
}

function search5DayForecast(cityInput) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${APIKey}&units=metric`;

  return fetch(apiUrl)
    .then(function (response) {
      return response.json();
    });
}

function display5DayForecast(forecastData) {
  const forecastList = $("#forecast");
  forecastList.empty();
  const dayTextArray = [];

  for (let i = 2; i < forecastData.list.length; i += 8) {
    const forecastEntry = forecastData.list[i];
    const dateCreated = forecastEntry.dt_txt;
    const newDate = dateCreated.split(' ');
    const date = dayjs(newDate[0]).format("DD/MM/YYYY")
    const weatherIcon = $("<img>").attr(
      "src",
      `http://openweathermap.org/img/w/${forecastEntry.weather[0].icon}.png`
    );
    const temperature = `Temp: ${forecastEntry.main.temp}°C`;
    const wind = `Wind: ${forecastEntry.wind.speed}KPH`;
    const humidity = `Humidity: ${Math.floor(forecastEntry.main.humidity)}%`;

    const dayText = $('<p>').html('<b>' + date + '<br>' + temperature + weatherIcon[0].outerHTML + '<br>' + wind + '<br>' + humidity);

    const dayTextHtmlString = dayText.prop('outerHTML');
    dayTextArray.push(dayTextHtmlString);

    const firstDay = $('<div>')
    firstDay.css({
      'display': 'flex',
      'width': '190px',
      'margin': '18px',
      'height': '190px',
      'align-content': 'center',
      'background': 'white',
      'color': 'darkgray',
      'padding': '10px',
      'border-radius': '5px',
    })
    firstDay.append(dayText);
    forecastList.append(firstDay);

  }
}

function historySearch(saveBtnText) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${saveBtnText}&appid=${APIKey}&units=metric`;
  // Call search5DayForecast with the city name, not the full API URL
  search5DayForecast(saveBtnText)
    .then(forecastData => display5DayForecast(forecastData))
    .catch(error => console.error("Error fetching forecast data:", error));
}

function reprintWeather(cityName) {
  const queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=metric`;
  searchCurrentWeather(cityName)
  .then(data => displayCurrentWeather(data))
  .catch(error => console.error("Error fetching forecast data:", error));
}

// Listening to the click event and running the callback function
$("#search-button").on("click", function (e) {
  e.preventDefault();
  const cityInput = $(".weather-search").val();

  searchCurrentWeather(cityInput)
    .then(function (data) {
      if (data.cod && data.cod !== 200) {
        alert(`Error: ${data.message}`);
      } else {
        // Display current weather and proceed
        displayCurrentWeather(data);
        appendSaveButton(cityInput);
        return search5DayForecast(cityInput);
      }
    })
    .then(function (forecastData) {
      display5DayForecast(forecastData);
    })
    .catch(error => console.error("Error fetching data:", error));
});
