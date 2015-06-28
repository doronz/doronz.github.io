var NAMESPACE = 'urn:x-cast:com.doronzehavi.casttest';

var PLAY_ALARM = "play alarm";
var STOP_ALARM = "stop alarm";
var ALARM_PLAYING = "alarm playing";
var ALARM_NOT_PLAYING = "alarm not playing";

var messageBus;
var sender;

/********************
  Load Chromecast
*********************/
function onChannelOpened(event) {
   console.log("onChannelOpened. Total number of channels: " + window.castReceiverManager.getSenders().length);
}

function onChannelClosed(event) {
   console.log("onChannelClosed. Total number of channels: " + window.castReceiverManager.getSenders().length);
    if (window.castReceiverManager.getSenders().length == 0) window.close();
}

function onError(){
   console.log("onError");
}

function onMessage(event){
    var message = event.data;
    var senderId = event.senderId;
   console.log("message from: " + senderId + " message: " + message);
}

function onLoad(){
  console.log("document loaded");
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  window.castReceiverManager.onSenderConnected = onChannelOpened;
  window.castReceiverManager.onSenderDisconnected = onChannelClosed;
  window.customMessageBus = window.castReceiverManager.getCastMessageBus(NAMESPACE);
  window.customMessageBus.onMessage = onMessage;
  window.castReceiverManager.start();
  console.log("cast started");
}

function broadcast(message){
  try {
    window.customMessageBus.broadcast(message);
    }
  catch (err){
    console.error("Unable to send broadcast:" + err);
    }
}

window.addEventListener("load", onLoad);

/********************
  Other stuff
*********************/

var currentTime = {
  "hour" : "00",
  "minute" : "00",
  "second" : 00
}

function getLeadingZero(i) {
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
    currentTime.hour   = get12Hour(today.getHours());
    currentTime.minute = getLeadingZero(today.getMinutes());
    currentTime.second = today.getSeconds();
    document.getElementById('time').innerHTML = currentTime.hour + ":" + currentTime.minute;
    setTimeout(function () {
        startTime()
    }, 1000);
    console.log("time: " + currentTime.hour + ":" + currentTime.minute);
    //if (currentTime.second % 15 == 0) { // load new wallpaper 15 seconds
    if (currentTime.minute % 10 == 0 && currentTime.second == 0) { // load new wallpaper every 5 minutes
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
  var wallpaper = new Image();
  var random;
  do {
    random = Math.floor(Math.random() * wallpapers.length);
  } while (chosen == random || !isImage(wallpapers[random]));
  chosen = random;
  wallpaper.setAttribute('src', wallpapers[chosen]);
  showLoading();
  wallpaper.onload = function () {
    var sourceURL = "url(" + wallpaper.src + ")";
    $("#content").css("background-image", sourceURL);
    sendMessage(wallpaper.src);
    hideLoading();
  } 
  wallpaper.onerror = wallpaper.onabort = function () {
    console.info("Error loading image!");
    loadWallpaper();
    return;
  }
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
  $("#loading-subtext").html("Waiting for location...");
  $('#loader-container').removeClass('hidden').show();
  $('#weather-progress').removeClass('hidden').show();
  
}

function hideProgress() {
  $('#loader-container').hide();
  $('#weather-progress').hide();
}

$(document).ready(function() {
  getLocation();
});


function setFooter() {
  var timeHeight = document.getElementById('time').getAttribute('height');
  document.getElementById('footer').setAttribute('height', timeHeight);
}



function handleMessage(msg) {
  console.log('Message [' + msg.senderId + ']: ' + event.data);
  if (msg.data.indexOf(":") !=-1) { // If received long/lat, load weather
    var message = msg.data.split(':');
    var lati = parseFloat(message[0]);
    var long = parseFloat(message[1]);
    console.log("Lat/Long: " + lati + " - " + long);
    loadWeather(lati, long);
  }
  else if (event.data.indexOf(PLAY_ALARM) !=-1){
    playAlarm(PLAY_ALARM);
  }
  else if (event.data.indexOf(STOP_ALARM) != -1) {
    playAlarm(STOP_ALARM);
  }
}

var attempts = 0;
function sendMessage(msg) {
    broadcast(msg);
    console.log("Sending message: " + msg);
    attempts = 0;
}

function playAlarm(play) {
  if (play == PLAY_ALARM){
    audio.play();
    //audioEndedListener(audio);
    showAlarm();
    console.log("sending message: " + ALARM_PLAYING);
    sendMessage(ALARM_PLAYING);
    isPlaying = true;
  }
  else if (play == STOP_ALARM) {
    audio.pause();
    hideAlarm();
    audio = new Audio('good_morning.mp3');
    console.log("sending message: " + ALARM_NOT_PLAYING);
    sendMessage(ALARM_NOT_PLAYING);
  }
}

function showAlarm() {
  console.log("Showing alarm");
  var container = document.getElementById('alarm-view-container');
  var alarmView = document.createElement('H1');
  alarmView.id = 'alarm-view';
  alarmView.innerHTML = currentTime.hour + ':' + currentTime.minute;
  setTimeout(function () {
    alarmView.innerHTML = currentTime.hour + ':' + currentTime.minute;
  }, 1000);
  container.appendChild(alarmView);
  $('#time').hide();
}

function hideAlarm() {
  console.log("Hiding alarm");
  var alarmView = document.getElementById('alarm-view');
  var container = document.getElementById('alarm-view-container');
  container.removeChild(alarmView);
  $('#time').show();
}


/** Weather icons **/
function loadWeatherIcons(icon){
  var skycons = new Skycons({"color": "#151515"});
  skycons.add("weather-icon", icon);
  skycons.play();
}

/** Alarm Sounds **/
var audio = new Audio('good_morning.mp3');
//audioEndedListener(audio);
var isPlaying = false;

/* On Startup */
showLoading();
getLinks();
startTime();
setFooter();