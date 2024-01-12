const APIKey = "b5711c612035188f45544a9bce61dd4d";

function searchCity() {
  //listening the click event and run the callback fuction
  $("#search-button").on("click", function (e) {
    e.preventDefault();
    //save my search input value to a variable
    const cityInput = $(".weather-search").val();
  
    
    // getting the api openweathermap and its receives the search input and my API key
    const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&cnt=5&appid=${APIKey}&units=metric`;

    //runs the fetch with the API Url and receive the info
    fetch(queryUrl)
      //wait the response and configurate the data
      .then(function (response) {
        return response.json();
      })
      //wait for the data
      .then(function (data) {
        //when restart the page clean the section
        $("#today").empty();
        $("#forecast").empty()

        const weatherToday = $("#today");
        weatherToday.css("border", "gray 2px solid");
       
        const weatherImg = $("<img>").attr(
          "src",
          `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
        );
        const cityChosen = $("<h1>").text(
          `${data.name} ${dayjs().format("(DD/MM/YYYY)")}`
        );
        const dataTemp = $("<p>").text(`Temp: ${data.main.temp}°C`);
        const dataWind = $("<p>").text(`Wind: ${data.wind.speed}KPH`);
        const dataHum = $("<p>").text(`Humidity: ${data.main.humidity}%`);

        weatherToday.append(cityChosen, dataTemp, dataWind, dataHum);
        cityChosen.append(weatherImg);

        const history = $(".list-group");
        const userInputSave = $("<p>").text(
          JSON.stringify(cityInput).replace(/"/g, "")
        );
        userInputSave.css("background", "lightgray");
        history.append(userInputSave);

        // Build forecast URL only if current weather is found
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${APIKey}&units=metric`;

        // Fetch 5-day forecast
        fetch(apiUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (forecastData) {
            // Loop through the first 5 forecast entries
            for (let i = 0; i < 5; i++) {
              const forecastEntry = forecastData.list[i];
               // Access individual forecast data for each entry
              const firstDay = $('<div>')
              firstDay.css({
                'border': 'gray 2px solid',
                'display': 'flex',
                'width': '130px',
                'margin': '10px',
                'height': '200px',
                'align-content': 'center'
              })
            //   const tempDiv = $('<div>')
            //  tempDiv.css('background', 'pink')
            //   const windDiv = $('<div>')
            //   const humiDiv = $('<div>')

              const date = (forecastEntry.dt_txt);
              const temperature = forecastEntry.main.temp;
              const wind = forecastEntry.wind.speed;
              const humidity = forecastEntry.main.humidity;
              
              const forecastList = $("#forecast");
  
              const dayText = $('<p>').html(date + '<br>' + wind + '<br>' + temperature + '<br>' + humidity);
             
              firstDay.append(dayText)
              forecastList.append(firstDay)
  
              
            }
          });
      });
  })}


searchCity();
