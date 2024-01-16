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

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  weatherToday.css({
    'padding':'10px'
  })
}

function appendSaveButton(cityInput) {
  const btnCreated = JSON.parse(localStorage.getItem('saveBtn')) || []; 
  const history = $(".list-group");
  const saveBtn = $("<button>");
  const userInputSave = cityInput; 
  const userInputLower = userInputSave.toLowerCase();
  if (!btnCreated.some(btn => btn.toLowerCase() === userInputLower)) {
    saveBtn.text(userInputSave);
    saveBtn.attr('value', userInputSave);

    btnCreated.push(userInputSave);
    localStorage.setItem('saveBtn', JSON.stringify(btnCreated));

    saveBtn.css({
      'margin-bottom': '10px',
      'background': 'lightgray',
      'height': '30px'
    });

    history.append(saveBtn);
    saveBtn.on("click", function () {
      reprintWeather(userInputSave);
      historySearch(userInputSave);
    });
  } else {
    console.log('City button already exists.');
  }
}

window.addEventListener('beforeunload', function () {
  localStorage.removeItem('saveBtn');
});

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

    localStorage.setItem('dayTextArray', JSON.stringify(dayTextArray));
  }
}

function historySearch(saveBtnText) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${saveBtnText}&appid=${APIKey}&units=metric`;
  search5DayForecast(saveBtnText)
    .then(forecastData => display5DayForecast(forecastData))
}

function reprintWeather() {
  $("#today").empty();
  $("#forecast").empty();

  const weatherToday = $("#today");
  weatherToday.css({
    "border": "gray 2px solid",
    "padding": '10px'})

    const printSearchHistory = localStorage.getItem('searchHistory')
    const storedData = JSON.parse(printSearchHistory)
    const cityNameBtn = $('<h1>').text(storedData[1])


    weatherToday.append(cityNameBtn, storedData[2], '<br>','<br>', storedData[3], '<br>', '<br>', storedData[4], '<br>');
}

// Listening to the click event and running the callback function
$("#search-button").on("click", function (e) {
  e.preventDefault();

  const cityInput = $(".weather-search").val();
  if (!cityInput) {
    alert('Please enter a city name.');
    return; 
  }
  // Proceed with the API request
  searchCurrentWeather(cityInput)
    .then(function (data) {
      if (data.cod && data.cod !== 200) {
        alert(`The city has a typo`);
        $(".weather-search").val('');
      } else {
        displayCurrentWeather(data);
        appendSaveButton(cityInput);
        return search5DayForecast(cityInput);
      }
    })
    .then(function (forecastData) {
      if (forecastData) {
        display5DayForecast(forecastData);
      }
    })
});


