const request = require('request').defaults({
    timeout: 10000,
});
const cheerio = require('cheerio');
const parseUrl = require("parse-url")
const parseString = require('xml2js').parseString
var fs = require('fs')
var config = fs.readFileSync('config/config.json');
config = JSON.parse(config)
var $ = require('jquery')
var opn = require('opn')
// FUNCTIONS //

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

function newspap(i) {

    request({
        url: 'https://newsapi.org/v1/articles?source=' + config['newsapi']['sources'][i] + '&sortBy=top&apiKey=' + config['newsapi']['api_key'],
        method: 'get'
        }, function (err, res, body){
            var parsedbody = JSON.parse(body)
            parsedbody = parsedbody['articles'];
            $('#news_1').fadeOut('fast', function(){
              $('#news_1').html(parsedbody[0]['title'])
              setTimeout(function() { $('#news_1').fadeIn('fast');}, 200);
            })
            $('#news_2').fadeOut('fast', function(){
              $('#news_2').html(parsedbody[1]['title'])
              setTimeout(function() { $('#news_2').fadeIn('fast');}, 200);
            })
            $('#news_3').fadeOut('fast', function(){
              $('#news_3').html(parsedbody[2]['title'])
              setTimeout(function() { $('#news_3').fadeIn('fast');}, 200);
            })
            $('#news_4').fadeOut('fast', function(){
              $('#news_4').html(parsedbody[3]['title'])
              setTimeout(function() { $('#news_4').fadeIn('fast');}, 200);
            })
            $('#news_5').fadeOut('fast', function(){
              $('#news_5').html(parsedbody[4]['title'])
              setTimeout(function() { $('#news_5').fadeIn('fast');}, 200);
            })
            $('#news_icon').fadeOut('fast', function(){
              $('#news_icon').attr('src', "img/news/" + config['newsapi']['sources'][i] + ".png")
              setTimeout(function() { $('#news_icon').fadeIn('fast');}, 200);
            })
        });

}

function newsAPI() {
    for(var i = 0; i<config['newsapi']['sources'].length; i++) {
        setTimeout(newspap, config['newsapi']['interval'] * 60 * 1000 * i, i);
        if(i+1 == config['newsapi']['sources'].length) {
          setTimeout(newsAPI, 20000 * i);
        }
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

function spotifyAPI(token){
  if(token!=null){
    var access_token = token
  } else {
    var access_token = 'Bearer ' + config['spotify']['access_token']
  }
  request.get({
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: {
      Authorization: access_token
    }
  }, function(err, res, body){
    if(res.statusCode != 200){
      // If our access code is expired, obtain a new one via refresh code.
      var formData = {
        grant_type: 'refresh_token',
        refresh_token: config['spotify']['refresh_token']
      }

      // Renew the token
      request.post({
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          Authorization: 'Basic ' + window.btoa(config['spotify']['client_id']+':'+config['spotify']['client_secret'])
        },
        form: formData
      }, function(err, res, body){
        var parsedbody = JSON.parse(body)
        var access_token = 'Bearer ' + parsedbody['access_token']
        spotifyAPI(access_token) // New token.
      });
    } else {
      var parsedbody = JSON.parse(body)
      var isPlaying = parsedbody['is_playing']
      var name = parsedbody['item']['name']
      var artist = parsedbody['item']['artists'][0]['name']

      if(isPlaying){
        if(document.getElementById('spotify').innerHTML != 'Currently Playing: ' + name + ' - ' + artist){
          $('#spotify').fadeOut('fast', function(){
            $('#spotify').html('Currently Playing: ' + name + ' - ' + artist)
            setTimeout(function() { $('#spotify').fadeIn('fast');}, 200);
          })
        }
      } else {
        $('#spotify').fadeOut('fast', function(){
          $('#spotify').html('')
          setTimeout(function() { $('#spotify').fadeIn('fast');}, 200);
        })
      }
    }
    setTimeout(spotifyAPI, 3000, null) // Currently forces it to find a new token if expired previously
  })
}


function render() {
  var i = 0;
  while(i == 0) {
    newsAPI(); // Calls itself
    currencyExchange();
    spotifyAPI(null);
    i = 1;
  }
  setInterval(renderTime, 1000)
  setTimeout(renderWeather, 30000)
  //setInterval(newsAPI, 5000*(config['newsapi']['sources'].length + 1))
  setInterval(todoistAPI, 1400)
  setInterval(currencyExchange, 1500)
}
spotifyAPI(null)
