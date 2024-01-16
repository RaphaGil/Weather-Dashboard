const APIKey = "b5711c612035188f45544a9bce61dd4d";

function searchCity() {
  $("#search-button").on("click", function (e) {
    e.preventDefault();
    // Save the search input value to a variable
    const cityInput = $(".weather-search").val();
    const searchHistory = []

    const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&cnt=5&appid=${APIKey}&units=metric`;

    fetch(queryUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        $("#today").empty();
        $("#forecast").empty();
        $(".weather-search").val('');

        const weatherToday = $("#today");
        weatherToday.css({"border": "gray 2px solid",
        "background-color": "darkblue"});
        const weatherImg = $("<img>").attr(
          "src",
          `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
        );
        const cityChosen = $("<h1>").text(
          `${data.name} ${dayjs().format("(DD/MM/YYYY)")}`
        );
        const dataTemp = `Temp: ${data.main.temp}°C`;
        const dataWind = `Wind: ${data.wind.speed}KPH`;
        const dataHum = `Humidity: ${data.main.humidity}%`;

        const dataParagraf = $("<p>").text(dataTemp)
        const windParagraf = $("<p>").text(dataWind)
        const humiParagraf = $("<p>").text(dataHum)

        weatherToday.append(cityChosen, dataParagraf, windParagraf,  humiParagraf);
        cityChosen.append(weatherImg);
     
        const history = $(".list-group");
        const saveBtn = $("<button>")
        const userInputSave = saveBtn.text(
          JSON.stringify(cityInput).replace(/"/g, "")
        );
        saveBtn.attr('value', userInputSave)

        userInputSave.css({
          "margin-bottom": "10px",
          'background': "lightgray",

        });
        history.append(userInputSave);

        searchHistory.push(
        weatherImg.prop('outerHTML'), 
        cityChosen.text(), 
        dataTemp, 
        dataWind, dataHum);

        saveBtn.on("click", function () {
          console.log(saveBtn.text())
          var saveBtnText = saveBtn.text()
          localStorage.removeItem('searchHistory');
          localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
          // localStorage.removeItem('dayTextArray')
          historySearch(saveBtnText)

          $("#weatherToday").empty();
          reprintWeather();
        });
      })
      //Alert if there is no input or has a typo
      .catch(function (error) {
        const history = $(".list-group")
        const errorDisplay=$('<div>')
        const errorMessage=$('<p>')
        errorMessage.css('color', 'red')
        errorDisplay.append(errorMessage)
        history.append(errorDisplay)
        if (!cityInput || (error.response && error.response.status === 404)) {
          errorMessage.text('Please enter a city before searching or check for typos.');
        } else {
          // Handle other errors if needed
          errorMessage.text('Please enter a city before searching or check for typos.')
        }
        setTimeout(function () {
          errorDisplay.remove();
        }, 3000);
      });
    
        // Build forecast URL only if current weather is found
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${APIKey}&units=metric`;
       
        // Fetch 5-day forecast
        fetch(apiUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (forecastData) {
            const dayTextArray = [];
            // For a 5-day forecast, you might consider selecting one entry per day (e.g., every 8 entries)
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

                const forecastList = $("#forecast");
                const dayText = $('<p>').html(date + '<br>' + temperature + weatherIcon[0].outerHTML + '<b>' + '<b>' + '<br>' + wind + '<br>' + humidity);

                const dayTextHtmlString = dayText.prop('outerHTML');
                dayTextArray.push(dayTextHtmlString);

                const firstDay = $('<div>')
                firstDay.css({
                  'border': 'gray 2px solid',
                  'display': 'flex',
                  'width': '210px',
                  'margin': '8px',
                  'height': '190px',
                  'align-content': 'center',
                  'background-color': 'lightblue',
                  'color': 'white',
                  'padding': '10px',
                  'background-color': 'darkblue',
                })
                firstDay.append(dayText);
                forecastList.append(firstDay);

                localStorage.setItem('dayTextArray', JSON.stringify(dayTextArray));
            }}
            )
          })}

searchCity();


function historySearch(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;
        fetch(apiUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (forecastData) {
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

                const forecastList = $("#forecast");
                const dayText = $('<p>').html(date + '<br>' + weatherIcon[0].outerHTML + '<b>' + '<b>' + temperature + '<br>' + wind + '<br>' + humidity);

                const dayTextHtmlString = dayText.prop('outerHTML');
                dayTextArray.push(dayTextHtmlString);

                const firstDay = $('<div>')
                firstDay.css({
                  'border': 'gray 2px solid',
                  'display': 'flex',
                  'width': '190px',
                  'margin': '8px',
                  'height': '190px',
                  'align-content': 'center',
                  'background-color': 'darkblue',
                  'color': 'white',
                  'padding': '10px'
                })
                firstDay.append(dayText);
                forecastList.append(firstDay);

                localStorage.setItem('dayTextArray', JSON.stringify(dayTextArray));
            }}
            )
          }

const searchHistory = []

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

    cityNameBtn.append(storedData[0])
    weatherToday.append(cityNameBtn, storedData[2], '<br>','<br>', storedData[3], '<br>', '<br>', storedData[4], '<br>');
  }
