const APIKey = "b5711c612035188f45544a9bce61dd4d";
const searchHistory = [];

function searchCurrentWeather(cityInput) {
  const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&cnt=5&appid=${APIKey}&units=metric`;
  return fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayCurrentWeather(data)
})}

function displayCurrentWeather(data) {
  $("#today").empty();
  $(".weather-search").val('');

  const weatherToday = $("#today");
  weatherToday.css({

  });
  
  const weatherImg = $("<img>").attr(
    "src",
    `http://openweathrmap.org/img/w/${data.weather[0].icon}.png`
  );
  weatherImg.css({
    'width': '100px',
    'height': '100px'
  })
  const city = data.name;
  const date = dayjs().format("(dddd, DDDD MMMM)");
  const cityChosen = $("<h1>").text(`${city} ${date}`);

  const dataTemp = `${data.main.temp}°C`;
  const dataWind = `Wind: ${data.wind.speed}KPH`;
  const dataHum = `Humidity: ${data.main.humidity}%`;

  const dataParagraph = $("<p>").text(dataTemp);
  const windParagraph = $("<p>").text(dataWind);
  const humiParagraph = $("<p>").text(dataHum);

  weatherToday.append(cityChosen, dataParagraph, windParagraph, humiParagraph);
  cityChosen.append(weatherImg);

  weatherIcon.css({
    'width': '40px',
    'height': '40px'
  });
  weatherImg.css({
    'width': '40px',
    'height': '40px'
  });
  searchHistory.push({
    name: city,
    date: date,
    temp: dataTemp,
    weatherImg: weatherImg.prop('outerHTML'),
    wind: dataWind,
    humidity: dataHum
  });

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  weatherToday.css({
    'padding':'10px',

  })
}
// window.addEventListener('beforeunload', function () {
//   localStorage.removeItem('saveBtn');
// })
var btnCreated = []

function appendSaveButton(cityInput) {
  // btnCreated = JSON.parse(localStorage.getItem('saveBtn')) || [];
 btnCreated.push(cityInput)
  const saveBtn = $("<button/>");
  saveBtn.text(cityInput)

 for (let i = 0; i < btnCreated.length; i++) {
  saveBtn.css({
        'margin-bottom': '10px',
        'height': '30px',
        'background-color':'transparent',
        'border': 'none',
        'width': 'auto',
      
      });
 
      const history = $(".list-group")
      history.append(saveBtn);
      localStorage.setItem('btnCreated', JSON.stringify(btnCreated));
  btnCreatedHistory(saveBtn)
}}

function appendToSave(cityInput){
  localStorage.setItem('saveBtn', JSON.stringify(cityInput));
  appendSaveButton(cityInput)
}

function btnCreatedHistory(saveBtn) {
  saveBtn.on("click", function (e) {
    e.preventDefault();

    const saveBtnText = $(this).text();

    console.log(saveBtnText)
    searchCurrentWeather(saveBtnText)
    search5DayForecast(saveBtnText)

  })}

  
function search5DayForecast(cityInput) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${APIKey}&units=metric`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(function (forecastData) {
      display5DayForecast(forecastData)
})}


function display5DayForecast(forecastData) {
  const forecastList = $("#forecast");
  // console.log(forecastData.city.name)

  forecastList.empty();
  const dayTextArray = [];
//i += 8 because I want to show the weather every 8h as I am using 16 days forecast
  for (let i = 2; i < forecastData.list.length; i +=8) {
    const forecastEntry = forecastData.list[i];
    const dateCreated = forecastEntry.dt_txt;
    const newDate = dateCreated.split(' ');
    const date = dayjs(newDate[0]).format("dddd, DD MMMM")
    const weatherIcon = $("<img>").attr(
      "src",
      `http://openweathermap.org/img/w/${forecastEntry.weather[0].icon}.png`
    );
    weatherIcon.css({
      'width': '100px',
      'height': '100px'
    })
    const temperature = `${forecastEntry.main.temp}°C`;
    const wind = ` ${forecastEntry.wind.speed}KPH`;
    const humidity = `Humidity: ${Math.floor(forecastEntry.main.humidity)}%`;

    const dayText = $('<p>').html(weatherIcon[0].outerHTML + '<br>'+ date + '<br>' + temperature + '<br>' + wind + '<br>' + humidity);
 
    const dayTextHtmlString = forecastData.city.name + dayText.prop('outerHTML');
    dayTextArray.push(dayTextHtmlString);

    const firstDay = $('<div>')
    firstDay.css({
      'display': 'flex',
      'width': '190px',
      'margin': '18px',
      'height': '230px',
      'align-content': 'center',
      'background-color': 'rgba(18, 81, 130, 0.2)',
      'padding': '10px',
      'border-radius': '15px',
    })
    firstDay.append(dayText);
    forecastList.append(firstDay);
    localStorage.setItem('dayTextArray', JSON.stringify(dayTextArray));
  }
}


$("#search-button").on("click", function (e) {
  e.preventDefault();

  const cityInput = $(".weather-search").val();
  if (!cityInput) {
    alert('Please enter a city name.');
    return; 
  }
  // Proceed with the API request
    searchCurrentWeather(cityInput)
    appendToSave(cityInput)
    search5DayForecast(cityInput)
  
})

function showSearchHistory(){
  const btnCreatedParse = JSON.parse(localStorage.getItem('btnCreated'))
  
  if(btnCreatedParse !== null){
    for (let i = 0; i < btnCreatedParse.length; i++) {
      
      appendSaveButton(btnCreatedParse[i])
    }
  }
}

showSearchHistory()