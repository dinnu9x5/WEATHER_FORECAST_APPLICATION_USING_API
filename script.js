const searchBtn = document.querySelector(".btn");
const city = document.querySelector(".input-box");
const API_KEY = "8e5a8b5ebc819e97f548f1fb9f43ff86";
const weatherCardDiv = document.querySelector(".cards");
const presentDayCard = document.querySelector(".present-day");

function createWeatherCard(name,weatherItem,i)
{
  if(i===0)
  {
      return '<div class="present-day-info"><h2>'+name+" "+ weatherItem.dt_txt.split(" ")[0]+'</h2><p>Temp: '+(weatherItem.main.temp-273.15).toFixed(2)+' &deg;C</p><p>Speed: '+weatherItem.wind.speed+' M/S</p><p>Humidity: '+weatherItem.main.humidity+'%</p></div><div class="icon"><img src="https://openweathermap.org/img/wn/'+weatherItem.weather[0].icon+'@4x.png" ><h4>'+weatherItem.weather[0].description+'</h4></div>';
  }
  else
  {
      return '<div class="day-card"><img src="https://openweathermap.org/img/wn/'+weatherItem.weather[0].icon+'@2x.png" class="weather-status"><h4>'+weatherItem.dt_txt.split(" ")[0]+'</h4><p>Temp: '+(weatherItem.main.temp-273.15).toFixed(2)+' &deg;C</p><p>Wind: '+weatherItem.wind.speed+' M/S</p><p>Humidity: '+weatherItem.main.humidity+' %</p></div>';
  }
  
}

function getWeatherDetails(name,lat,lon)
{
  const URL = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+API_KEY;
  fetch(URL).then(res => res.json()).then(data => {
    
    const uniqueDays = [];
    const fiveDayForecast = data.list.filter(forecast => {
      
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if(!uniqueDays.includes(forecastDate))
      {
        return uniqueDays.push(forecastDate);
      }

      
    });
    city.value = "";
    presentDayCard.innerHTML = "";
    weatherCardDiv.innerHTML = "";

    console.log(fiveDayForecast);
    fiveDayForecast.forEach((weatherItem,i)=>{
      if(i===0)
      {
          presentDayCard.insertAdjacentHTML("beforeend",createWeatherCard(name,weatherItem,i))
      }
      else{
        weatherCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(name,weatherItem,i));
      }
      
      

    })
    
  }).catch(() => {
    alert("An error occured while searching for weather")
  })
}
function getCoordinates()
{
    const cityName = city.value.trim();
    if(!cityName)
    {
      return;
    }
    const GEO_CODING_API_URL = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid="+API_KEY;

    fetch(GEO_CODING_API_URL).then(res => res.json()).then(data => {
      if(!data.length)
      {
        return alert("No coordinates found for city "+cityName);
      }
      const {name,lat,lon} = data[0];
      getWeatherDetails(name,lat,lon);

    }).catch(() => {
      alert("An error occured while searching for weather")
    })
}

searchBtn.addEventListener("click",getCoordinates);