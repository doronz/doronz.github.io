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
    if (s % 10 == 0) { // load new wallpaper 10 seconds
    //if (m == 0 && s == 0) { // load new wallpaper every hour
        loadWallpaper();
        loadTemp();
    }
}


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

/*var wallpapers = ["http://i.imgur.com/DuMqW96.jpg", "http://i.imgur.com/V0n6d41.jpg",
                 "http://i.imgur.com/PMgfJSm.jpg", "http://i.imgur.com/54deiOy.jpg", 
                 "http://i.imgur.com/Wj6acBM.jpg", "http://i.imgur.com/vR8w3xT.jpg", "http://i.imgur.com/fLR1tGM.jpg", 
                 "http://i.imgur.com/Lvh407h.jpg", "http://i.imgur.com/RY55VZr.jpg"];*/

var wallpapers = [];
function prepareWallpaperLinks() {
  var random = Math.random() * 50;
  $.getJSON("https://www.reddit.com/r/EarthPorn+pics+wallpaper+wallpapers+spaceporn/search.json?q=1920+1080&sort=top&restrict_sr=on&t=month&count=" + random, function(data) {
      $.each(data.data.children, function(i, item ){
          wallpapers.push(item.data.url);
      });
      if (wallpapers.length > 10) {
        loadWallpaper(); 
      }
  });
  console.log(wallpapers.length);
}

var chosen;
function loadWallpaper() {
  var wallpaperContainer = document.getElementById('wallpaper');
  var wallpaper = new Image();
  var random;
  do {
    random = Math.floor(Math.random() * wallpapers.length);
  } while (chosen == random);
  chosen = random;
  wallpaper.setAttribute('src', wallpapers[chosen]);
  wallpaperContainer.appendChild(wallpaper);
  wallpaper.style.visibility = 'hidden';
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

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

function showLoading() {
  $('#loader').load('loader.html'); 
}

function hideLoading() {
   $('#loader').hide();
}

$(document).ready(function() {
  //hideLoading();
});

/* On Startup */
showLoading();
prepareWallpaperLinks();
loadTemp();
startTime();