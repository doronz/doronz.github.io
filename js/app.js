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
    console.log("checking time");
    if (s % 5 == 0) {
        loadNewWallpaper();
        loadTemp();
    }
}
startTime();

function loadTemp() {
    var apiKey = 'b075f45fbfc81a2a9cdfd9741db90c90';
    var url = 'https://api.forecast.io/forecast/';
    var lati = 37.6625;
    var longi = -121.8747;
    var data;
    
    $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
        $('#weather').html(Math.round(data.currently.temperature)) + "\u00B0";
    });
    }

var wallpapers = ["http://i.imgur.com/DuMqW96.jpg", "http://i.imgur.com/V0n6d41.jpg",
                 "http://i.imgur.com/PMgfJSm.jpg", "http://i.imgur.com/54deiOy.jpg", 
                 "http://i.imgur.com/Wj6acBM.jpg", "http://i.imgur.com/vR8w3xT.jpg", "http://i.imgur.com/fLR1tGM.jpg", 
                 "http://i.imgur.com/Lvh407h.jpg", "http://i.imgur.com/RY55VZr.jpg"];


function firstLoadWallpaper() {
  var wallpaper = document.getElementById('wallpaper');
  var newWallpaper = new Image();
  newWallpaper.setAttribute('src', wallpapers[0]);
  wallpaper.appendChild(newWallpaper);
  }

var chosen;

function loadNewWallpaper() {
  var wallpaper = document.getElementById('wallpaper');
  var newWallpaper = new Image();
  var random;
  do {
    random = Math.floor(Math.random() * wallpapers.length);
    console.log(chosen + " - " + random);
  } while (chosen == random);
  chosen = random;
  newWallpaper.setAttribute('src', wallpapers[chosen]);
  wallpaper.appendChild(newWallpaper);
  Materialize.fadeInImage('#wallpaper');
  wallpaper.removeChild(wallpaper.childNodes[0]);
}

function showLoading() {
  $('#loader').load('loader.html'); 
}

function hideLoading() {
   $('#loader').hide();
}

$(document).ready(function() {
  hideLoading();
});

/* On Startup */
showLoading();
firstLoadWallpaper();
loadNewWallpaper();
loadTemp();
