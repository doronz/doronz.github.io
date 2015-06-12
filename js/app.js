$("#result").load("https://www.reddit.com/r/EarthPorn+wallpaper+MinimalWallpaper+spaceporn/search?q=1920+1080&sort=top&restrict_sr=on&t=week .thing.link", function(result) {
    var obj = $(this).find('#result'), html = obj.html(); $(this).append($('<div>').text(html)); });

