const request = require('request').defaults({
    timeout: 10000,
});
const cheerio = require('cheerio');
const parseUrl = require("parse-url")
const parseString = require('xml2js').parseString
var fs = require('fs')
var config = fs.readFileSync('./config/config.json');
config = JSON.parse(config)

// FUNCTIONS //

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    url: "http://api.wunderground.com/api/" + config['wunderground']['api_key'] + "/conditions/q/" + config['wunderground']['state_country'] + "/" + config['wunderground']['city'] + ".json",
    method: "get"
  }, function(err, res, body) {
    if(err) {
      console.log("Error parsing weather")
    }
    var parsedbody = JSON.parse(body)
    parsedbody = parsedbody['current_observation']
    document.getElementById("weather").innerHTML = parsedbody['temp_c']+"°";
    document.getElementById("forecast").innerHTML = parsedbody['weather'];
    var ret = String(parsedbody['weather']);
    renderImage(ret);
  })
}

function renderImage(status) {


  var fore = status;
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


}

function show_image(src, width, height, alt) {
      var img = document.createElement("img");
        img.src = src;
        img.width = width;
        img.height = height;
        img.alt = alt;
        document.getElementById("img").appendChild(img);
}

function newsAPI(){
  for(i = 0; i<config['newsapi']['sources'].length;i++) {
    document.getElementById('news_icon').src="img/news/" + config['newsapi']['sources'][i] + ".png";
    request({
      url: 'https://newsapi.org/v1/articles?source=' + config['newsapi']['sources'][i] + '&sortBy=top&apiKey=' + config['newsapi']['api_key'],
      method: 'get'
    }, function (err, res, body){
      var parsedbody = JSON.parse(body)
      parsedbody = parsedbody['articles'];
      document.getElementById('news_1').innerHTML = parsedbody[0]['title'];
      document.getElementById('news_2').innerHTML = parsedbody[1]['title'];
      document.getElementById('news_3').innerHTML = parsedbody[2]['title'];
      document.getElementById('news_4').innerHTML = parsedbody[3]['title'];
      document.getElementById('news_5').innerHTML = parsedbody[4]['title'];

    })
      sleep(10000);
  }
}

function todoistAPI(){
  request({
    url: "https://todoist.com/API/v7/sync?token=" + config['todoist']['api_key'] + "&sync_token=*&resource_types=[%22items%22]",
    method: "get"
  }, function(err, res, body){
    if(err) {
      console.log("Error parsing todoist API")
    }
    var parsedbody = JSON.parse(body)
    var output = '<br />'
    for(i = 0; i < parsedbody['items'].length; i++) {
      var splitted = parsedbody['items'][i]['due_date_utc'].split(" ")
      console.log(splitted)
      output += parsedbody['items'][i]['content'] + ' | ' + splitted[2] + ' ' + splitted[1] + '<br />'
    }

      document.getElementById('todo_1').innerHTML = output

  })
}

function currencyExchange(){
  request({
    url: 'https://api.coinmarketcap.com/v1/ticker/?convert=CAD&limit=2',
    method: 'get'
  }, function(err, res, body){
    var parsedbody = JSON.parse(body)
    var bitcoin = parseFloat(parsedbody[0]['price_cad'])
    var bitcoin_24h = parseFloat(parsedbody[0]['percent_change_24h'])
    var eth = parseFloat(parsedbody[1]['price_cad'])
    var eth_24h = parseFloat(parsedbody[1]['percent_change_24h'])
    bitcoin = bitcoin.toFixed(2)
    bitcoin_24h = bitcoin_24h.toFixed(2)
    eth = eth.toFixed(2)
    eth_24h = eth_24h.toFixed(2)
    console.log(bitcoin + ' ' +eth)
    if(bitcoin_24h>0){
      document.getElementById('crypto_btc').innerHTML = 'BTC = $' + bitcoin + ' CAD '
      document.getElementById('crypto_1_btc').innerHTML = '▲ ' + bitcoin_24h + '%'
      document.getElementById('crypto_1_btc').className = 'crypto_up'
    } else {
      document.getElementById('crypto_btc').innerHTML = 'BTC = $' + bitcoin + ' CAD '
      document.getElementById('crypto_1_btc').innerHTML = '▼ ' + bitcoin_24h + '%'
      document.getElementById('crypto_1_btc').className = 'crypto_down'
    }
    if(eth_24h>0){
      document.getElementById('crypto_eth').innerHTML = 'ETH = $' + eth + ' CAD '
      document.getElementById('crypto_1_eth').innerHTML = '▲ ' + eth_24h + '%'
      document.getElementById('crypto_1_eth').className = 'crypto_up'
    } else {
      document.getElementById('crypto_eth').innerHTML = 'ETH = $' + eth + ' CAD '
      document.getElementById('crypto_1_eth').innerHTML = '▼ ' + eth_24h + '%'
      document.getElementById('crypto_1_eth').className = 'crypto_down'
    }

  })
  request({
    url: 'http://api.fixer.io/latest?base=CAD&symbols=THB,USD',
    method: 'get'
  }, function(err, res, body){
    var parsedbody = JSON.parse(body)
    parsedbody = parsedbody['rates']
    console.log(parsedbody)
    var result = Object.keys(parsedbody)
    console.log(result[0])
    console.log(parsedbody[result[0]])



  })
}

function render() {
  setInterval(renderTime, 1000)
  setTimeout(renderWeather, 30000)
  setInterval(newsAPI , 5000)
  setInterval(todoistAPI, 1400)
  setInterval(currencyExchange, 1500)
}
newsAPI()
