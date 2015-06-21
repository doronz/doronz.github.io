var PLAY_ALARM = "play alarm";
var STOP_ALARM = "stop alarm";
var ALARM_PLAYING = "alarm playing";
var ALARM_NOT_PLAYING = "alarm not playing";

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function get12Hour(i) {
    if (i == 0 || i == 12){
        return 12;
    }
    else {
        return i % 12;   
    }
}
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    h = get12Hour(h);
    m = checkTime(m);
    document.getElementById('time').innerHTML = h + ":" + m;
    t = setTimeout(function () {
        startTime()
    }, 1000);
    console.log("time: " + h + ":" + m);
    //if (s % 5 == 0) { // load new wallpaper 5 seconds
    if (m == 0 && s == 0) { // load new wallpaper every hour
        if (loaded) {
          loadWallpaper();
        }
    }
}

function getLocation(){
  showProgress();
  navigator.geolocation.getCurrentPosition(function(position) {
    loadWeather(position.coords.latitude, position.coords.longitude);
    });
}

function loadWeather(lat, long) {
  var apiKey = 'b075f45fbfc81a2a9cdfd9741db90c90';
  var url = 'https://api.forecast.io/forecast/';
  var lati = lat;
  var longi = long;
  var data;
  var weatherDetail = $('weather-detail');
  weatherDetail.hide();
  console.log(url + apiKey + "/" + lati + "," + longi);
  $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
      //console.log(JSON.stringify(data, null, '  '));
      hideProgress();
      $('#temp-min').html(Math.round(data.daily.data[0].temperatureMin) + "\u00B0"); 
      $('#temp-max').html(Math.round(data.daily.data[0].temperatureMax) + "\u00B0");
      $('#summary').html(data.hourly.summary);
      $('#weather').fadeIn(2500);
      loadWeatherIcons(data.daily.data[0].icon);
      /* getting location name */
      var geoAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lati + ',' + longi +'&key=AIzaSyCp8gYYsbSTYhKB8G2oGU2xbID_PxdNSOw';
      $.getJSON(geoAPI, function(data) {
        console.log(geoAPI);
        //console.log(JSON.stringify(data.results[0].address_components));
        //$('location').html(data.results.address_components[4].long_name);
        var city, state;
        for (var i = 0; i < data.results[0].address_components.length; i++){
          if (data.results[0].address_components[i].types[0].indexOf("locality") !=-1){
            city = data.results[0].address_components[i].long_name;
          }
          if (data.results[0].address_components[i].types[0].indexOf("administrative_area_level") !=-1){
            state = data.results[0].address_components[i].long_name;
          }
        }
        $('#location').html(city + ', ' + state);
              weatherDetail.show();
      });

    });
}

var wallpapers = [];
var _getRedditData = function(callback) {
  var random = Math.floor(Math.random() * 15);
  var api = "https://www.reddit.com/r/EarthPorn+pics+wallpaper+wallpapers+spaceporn/search.json?q=1920%201080&sort=top&restrict_sr=on&t=week&chosen=" + random;
  
  // this starts running
  $.getJSON(api, function(data) {
         $.each(data.data.children, function(i, item) {
             wallpapers.push(item.data.url);
         });
         callback(wallpapers);
    });   
};

var loaded = false;
var getLinks = function() {
    _getRedditData(function(wallpapers) {
      loaded = true;
      console.log("Loading wallpaper.");  
      loadWallpaper();
      console.log(wallpapers.length);
    });
};

var chosen;
function loadWallpaper() {
  var wallpaperContainer = document.getElementById('wallpaper');
  var wallpaper = new Image();
  var random;
  do {
    random = Math.floor(Math.random() * wallpapers.length);
  } while (chosen == random || !isImage(wallpapers[random]));
  chosen = random;
  wallpaper.setAttribute('src', wallpapers[chosen]);
  showLoading();
  wallpaper.style.visibility = 'hidden';
  wallpaperContainer.appendChild(wallpaper);
  wallpaper.onload = function () {
    console.info("Image loaded !");
    hideLoading();
    wallpaper.style.visibility = 'visible';
    Materialize.fadeInImage('#wallpaper');
  }
  wallpaper.onerror = wallpaper.onabort = function () {
    console.info("Error loading image!");
    loadWallpaper();
    return;
  }
  console.log("set to " + wallpapers[chosen]);
}

function isImage(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function showLoading() {
  $('#loader').load('loader.html'); 
}

function hideLoading() {
   $('#loader').hide();
}

function showProgress() {
  $('#weather-progress').removeClass('hidden').show();
}

function hideProgress() {
  $('#weather-progress').hide();
}

$(document).ready(function() {
  getLocation();
});


function setFooter() {
  var timeHeight = document.getElementById('time').getAttribute('height');
  document.getElementById('footer').setAttribute('height', timeHeight);
}

function loadChromecast() {
  window.onload = function() {
    cast.receiver.logger.setLevelValue(0);
    window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  
  
    // create a CastMessageBus to handle messages for a custom namespace
    window.messageBus =
      window.castReceiverManager.getCastMessageBus(
      'urn:x-cast:com.doronzehavi.casttest');


    window.messageBus.onMessage = function(event) {
      
    }

    // initialize the CastReceiverManager
    var appConfig = new cast.receiver.CastReceiverManager.Config();
    appConfig.maxInactivity = 6000;
    window.castReceiverManager.start(appConfig);
    console.log('Receiver Manager started');
  };


}

function handleMessage(msg) {
  console.log('Message [' + event.senderId + ']: ' + event.data);
  if (event.data.indexOf(":") !=-1) { // If received long/lat, load weather
    var message = event.data.split(':');
    var lati = parseFloat(message[0]);
    var long = parseFloat(message[1]);
    console.log("Lat/Long: " + lati + " - " + long);
    loadWeather(lati, long);
  }
  else if (event.data.indexOf(PLAY_ALARM) !=-1){
    playAlarm(true);
  }
  else if (event.data.indexOf(STOP_ALARM) != -1) {
    playAlarm(false);
  }
}

function playAlarm(play) {
    if (play){
        audio.play();
        window.messageBus.send(event.senderId, ALARM_PLAYING);
        isPlaying = true;
      }
      else {
        audio.pause();
        audio = new Audio('good_morning.mp3');
        audio.bind("ended", function(){
          window.messageBus.send(event.senderId, ALARM_NOT_PLAYING);
        });
      }
  
}

function audioEndedListener(){
  audio.bind("ended", function(){
    window.messageBus.send(event.senderId, ALARM_NOT_PLAYING);
  });
}

/** Weather icons **/
function loadWeatherIcons(icon){
  var skycons = new Skycons({"color": "#151515"});
  skycons.add("weather-icon", icon);
  skycons.play();
}

/** Alarm Sounds **/
var audio = new Audio('good_morning.mp3');
var isPlaying = false;



/* On Startup */
showLoading();
loadChromecast();
getLinks();
startTime();
setFooter();