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
  const weatherImg = $("<img>").attr(
      "src",
      `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
  ).css({
      'width': '80px',
      'height': 'auto',
  });

  const city = data.name;
  const cityChosen = $("<h1>").text(city).css({
      'font-weight': 'bold',
      // 'color': 'blue',
      'font-size': '20px',
   
  });

  const day = `${dayjs().format("dddd, DD MMM")}`;

  const dataTemp = `${data.main.temp}°C`;
  const dataWeather = `${data.weather[0].main}`;
  const dataMin = `L: ${data.main.temp_min}°C`;
  const dataMax = `H: ${data.main.temp_max}°C`;
  const dataFeels = `Feels like: ${data.main.feels_like}°C`;
  const dataWind = `${data.wind.speed}KPH`;
  const dataHum = `${data.main.humidity}%`;

  const dataParagraph = $("<h2>").text(dataTemp);
  const weatherParagraph = $("<p>").text(dataWeather);
  const minParagraph = $("<p>").text(dataMin);
  const maxParagraph = $("<p>").text(dataMax);
  const feelsParagraph = $("<p>").text(dataFeels);
  const windParagraph = $("<p>").text(dataWind);
  const humiParagraph = $("<p>").text(dataHum);

  const leftDiv = $("<div>").append(day, cityChosen,dataParagraph,feelsParagraph,);
  const rightDiv = $("<div>").append( weatherImg,weatherParagraph, minParagraph, maxParagraph, windParagraph, humiParagraph);

  weatherToday.append(leftDiv, rightDiv);

  const searchHistory = [];
  searchHistory.push(
      cityChosen.text(),
      dataTemp,
      weatherImg.prop('outerHTML'),
      dataMax,
      dataMin,
      dataFeels,
      dataWind,
      dataHum
  );
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  weatherToday.css({
      'display': 'flex',
      'flex-wrap': 'wrap',
      'justify-content':'center',
      'align-items': 'center',
      'font-size': '14px',
      'border-line': '2px',
      'border-radius': '15px',
      'background-color': 'rgba(144, 238, 144, 0.6)',
      'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.5)',
  });
      
  weatherParagraph.css({
    'font-size': '18px'
  })
  dataParagraph.css({
    'font-size': '50px'
  });
  leftDiv.css({
    'margin-right': '60px'
    })
  rightDiv.css({
    // 'margin': '30px'
    })
}

//Create and save a button for the user history 
function appendSaveButton(cityInput) {
  const btnCreated = JSON.parse(localStorage.getItem('saveBtn')) || []; 
  const history = $(".list-group");
  const saveBtn = $("<button>");
  const userInputSave = cityInput; 

  //New variable to compare lower and uppercase
  const userInputLower = userInputSave.toLowerCase();
  if (!btnCreated.some(btn => btn.toLowerCase() === userInputLower)) {
    saveBtn.text(userInputSave);
    saveBtn.attr('value', userInputSave);

    btnCreated.push(userInputSave);
    localStorage.setItem('saveBtn', JSON.stringify(btnCreated));
    saveBtn.css({
      'border-radius': '10px',
      'background-color': 'rgba(144, 238, 144, 0.6)',
      'width': '100%',
      'margin-bottom': '15px',
      'border':'none',
      'color': 'white',
      'padding':'10px',
      'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.5)' 
    });

    history.append(saveBtn);

    saveBtn.on("click", function (e) {
      e.preventDefault();
      const cityInput = $(this).val();
      searchCurrentWeather(cityInput)
        .then(function (data) {
          if (data.cod && data.cod !== 200) {
            alert(`The city has a typo`);
            $(".weather-search").val('');
            return Promise.reject('Invalid City');
          } else {
            displayCurrentWeather(data);
            appendSaveButton(cityInput);
            return cityInput;
          }
        })
        .then(function (cityInput) {
          return search5DayForecast(cityInput);
        })
        .then(function (forecastData) {
          if (forecastData) {
  
            display5DayForecast(forecastData);
          }
        })
    })}}
    
//Delete the saveBtn from localstorage when the page is loaded 
window.addEventListener('beforeunload', function () {
  localStorage.removeItem('saveBtn');
})

function display5DayForecast(forecastData) {
  const forecastList = $("#forecast");
  forecastList.css({
    'display': 'flex',
    'flex-wrap':'wrap',
    'justify-content':'center',    
  })
  forecastList.empty();
  const dayTextArray = [];
//i += 8 because I want to show the weather every 8h as I am using 16 days forecast
  for (let i = 2; i < forecastData.list.length; i +=8) {
    const forecastEntry = forecastData.list[i];
    const dateCreated = forecastEntry.dt_txt;
    const newDate = dateCreated.split(' ');
    const date = dayjs(newDate[0]).format("ddd")
    const weatherIcon = $("<img>").attr(
      "src",
      `http://openweathermap.org/img/w/${forecastEntry.weather[0].icon}.png`
    );
    weatherIcon.css({
      'width': '100px',
      'height': '100px'
    })
    
    const weather = `${forecastEntry.weather[0].main}`;
    const feelsLike = `Feels like: ${forecastEntry.main.feels_like}°C`;
    const temperature = `${forecastEntry.main.temp}°C`;
    
    const dayText = $('<p>').html(weatherIcon[0].outerHTML+  '<b>' + date + '<br>' + weather+ '<br>' + temperature + '<br>' + feelsLike  );
  
    const dayTextHtmlString = dayText.prop('outerHTML');
    dayTextArray.push(dayTextHtmlString);
    
    const firstDay = $('<div>')
    firstDay.css({
      'margin': '5px',
      'height': 'auto',
      'border-radius': '15px',
      'padding': '10px',
      'width': 'auto',
      'border': '5px solid rgba(144, 238, 144, 0.6)',
      'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)'
    })
  
    firstDay.append(dayText);
    forecastList.append(firstDay);
    localStorage.setItem('dayTextArray', JSON.stringify(dayTextArray));
  }
}


//Function to display conform the btn text
function search5DayForecast(cityInput) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${APIKey}&units=metric`;
  return fetch(apiUrl)
    .then(response => response.json());
}

function historySearch(saveBtnText) {
  search5DayForecast(saveBtnText)
    .then(forecastData => {
      if (forecastData) {
        display5DayForecast(forecastData);
      }
    })
    .catch(error => console.error('Error fetching 5-day forecast:', error));
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
    .then(function (data) {
      console.log(data)
      if (data.cod && data.cod !== 200) {
        alert(`Input not found`);
        alert(`The city has a typo`);
        $(".weather-search").val('');
      } else {
        displayCurrentWeather(data);
        appendSaveButton(cityInput);
        return search5DayForecast(cityInput);
      }
    })
    .then(function (forecastData) {
      display5DayForecast(forecastData);
      if (forecastData) {
        display5DayForecast(forecastData);
      }
    })
})

