function loadJSON(jsonPath, callback) {
    let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonPath, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
}

function updateText(title, artist) {
    document.getElementById("songtitle").innerText = title
    document.getElementById("songartist").innerText = artist
}

let AUDIO = undefined;
let songlist = [];// list of object: {f:"file.mp3",t:"Title",a:"Artist"}
let songindex = 0;

function nextsong() {
    let songinfo = songlist[songindex]

    AUDIO = new Audio("audio/"+songinfo.f)
    AUDIO.onended = function() {
        stop()
        nextsong()
        AUDIO.play()
    }

    updateText(songinfo.t, songinfo.a)
    songindex = (songindex + 1) % songlist.length
}

function init() {
    loadJSON(qd.p[0], (e) => {
        songlist = JSON.parse(e)


        console.log(songlist)

        nextsong()
        AUDIO.play()
    })
}
