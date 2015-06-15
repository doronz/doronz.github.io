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
    if (m == 0 && s == 0) {
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

var wallpaper = ["http://i.imgur.com/DuMqW96.jpg", "http://i.imgur.com/V0n6d41.jpg", "http://i.imgur.com/6dfIT0V.jpg",
                 "http://i.imgur.com/PMgfJSm.jpg", "http://i.imgur.com/X7O4wF8.jpg", "http://i.imgur.com/54deiOy.jpg", 
                 "http://i.imgur.com/Wj6acBM.jpg", "http://i.imgur.com/vR8w3xT.jpg", "http://i.imgur.com/fLR1tGM.jpg", 
                 "http://i.imgur.com/Lvh407h.jpg", "http://i.imgur.com/RY55VZr.jpg", "http://i.imgur.com/6dfIT0V.jpg"];

function loadNewWallpaper() {
    console.log("Loading wallpaper");
    var random = Math.floor(Math.random() * wallpaper.length);
    var chosen = wallpaper[random];
    console.log("Set to: " + chosen);
    $('body').fadeTo('slow', 1, function() {
        $(this).css('background-image', 'url(' + chosen + ')');
    }).delay(1000).fadeTo('slow', 1);
}

/* On Startup */
loadNewWallpaper();
loadTemp();
