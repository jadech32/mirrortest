const request = require('request').defaults({
    timeout: 10000,
});
const cheerio = require('cheerio');
const parseUrl = require("parse-url")
const parseString = require('xml2js').parseString
//var config = require('./js/config.js')

function renderTime() {
    var mydate = new Date();
    var year = mydate.getYear();
      if(year < 1000) {
        year += 1900;
      }
    var day = mydate.getDay();
    var month = mydate.getMonth();
    var daym = mydate.getDate();
    var dayarray = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    var montharray = new Array("January","February","March","April","May","June","July","August","September","October","November","December")
    // Date End

    // Time
    var currentTime = new Date();
    var h = currentTime.getHours();
    var m = currentTime.getMinutes();
    var s = currentTime.getSeconds();
    // 24 hour clock
    if (h == 24) {
      h = 0;
    } else if(h > 12) {
      h = h - 0;
    }

    if (h < 10) {
      h = "0" + h;
    }

    if (m < 10) {
      m = "0" + m;
    }

    if (s < 10) {
      s = "0" + s;
    }

    var myClock = document.getElementById("clockDisplay");
    myClock.textContent = h + ":" + m
    myClock.innerText = h + ":" + m

    var myDate = document.getElementById("dateDisplay");
    myDate.innerText = dayarray[day]

    var myMonth = document.getElementById("monthDisplay");
    myMonth.innerText = montharray[month] + " " + year;

}

function renderWeather() {
  request({
    url: "http://api.wunderground.com/api/7ef8fc32acd04dd5/conditions/q/Canada/Vancouver.json",
    method: "get"
  }, function(err, res, body) {
    if(err) {
      console.log("Error parsing weather")
    }
    var parsedbody = JSON.parse(body)
    parsedbody = parsedbody['current_observation']
    document.getElementById("weather").innerHTML = parsedbody['temp_c']+"°";
    document.getElementById("forecast").innerHTML = parsedbody['weather'];
  })
}

function renderImage() {
  request({
    url:"http://api.wunderground.com/api/7ef8fc32acd04dd5/conditions/q/Canada/Vancouver.json",
    method:"get"
  }, function(err, res, body) {
    var parsedbody = JSON.parse(body)
    parsedbody = parsedbody['current_observation'];
    var fore = parsedbody['weather'];
    console.log(fore)
    var currentTime = new Date();
    var h = currentTime.getHours();
    var thunder = "img/weather/thunder.png"; //
    var wind = "img/weather/wind.png";
    var clear_day = "img/weather/clear_day.png"; //
    var clear_night = "img/weather/clear_night.png"; //
    var fog = "img/weather/fog.png";
    var cloudy = "img/weather/cloudy.png"; //
    var part_cloudy_day = "img/weather/part_cloudy_day.png"; //
    var part_cloudy_night = "img/weather/part_cloudy_night.png"; //
    var rain = "img/weather/rain.png"; //
    var sleet = "img/weather/sleet.png"; //
    var snow = "img/weather/snow.png"; //

    if (fore.includes("Rain")) {
      show_image(rain,72,72,"Rain");
        } else if (fore.includes("Thunderstorm")) {
      show_image(thunder,72,72,"Thunderstorm");
        } else if ((fore.includes("Clear")) || (fore.includes("Sunny"))) {
          if ( h >= 18) {
            show_image(clear_night,72,72,"Clear Night");
          } else {
            show_image(clear_day,72,72,"Clear Day");
          }
        } else if((fore.includes("Partly Cloudy")) || (fore.includes("Scattered Clouds"))){
          if( h >= 18) {
            show_image(part_cloudy_night,72,72,"Partly Cloudy");
          } else {
            show_image(part_cloudy_day,72,72,"Partly Cloudy");
          }
        } else if(fore.includes("Cloudy") || fore.includes("Overcast")) {
            show_image(cloudy,72,72,"Cloudy");
          } else if((fore.includes("Snow")) || (fore.includes("Flurries"))) {
            show_image(snow,72,72,"Snow");
          } else if(fore.includes("Sleet")) {
            show_image(sleet,72,72,"Sleet");
          }
  })


}

function show_image(src, width, height, alt) {
      var img = document.createElement("img");
        img.src = src;
        img.width = width;
        img.height = height;
        img.alt = alt;
        document.getElementById("img").appendChild(img);
}



function render() {
  setInterval(renderTime, 1000)
  setInterval(renderWeather, 10000)
  setInterval(renderImage, 10000)
}
