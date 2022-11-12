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

function fmod(num, dem) {
    let n = num % dem
    while (n < 0) {
        n += dem
    }
    return n
}

function nextsong() {
    let songinfo = songlist[songindex]

    AUDIO = new Audio("audio/"+songinfo.f)
    AUDIO.onended = function() {
        stop()
        nextsong()
        AUDIO.play()
    }

    let prevsongindex = fmod(songindex - 1, songlist.length)

    document.getElementById("pmark"+prevsongindex).innerText = ''+(prevsongindex + 1)
    document.getElementById("pmark"+songindex).innerText = '▶'
    updateText(songinfo.t, songinfo.a)

    songindex = (songindex + 1) % songlist.length
}

function init() {
    loadJSON(qd.p[0], (e) => {
        songlist = JSON.parse(e)

        console.log("Playlist:")
        songlist.forEach((v,i)=>{
            console.log(i+1, `${v.t} — ${v.a} (file:${v.f})`)
        })

        if (qd.c != undefined && qd.c[0] >= 1) {
            songindex = qd.c[0] - 1
            console.log("Playback will begin from the entry #"+(songindex+1))
        }

        // fill up the visible part of the playlist
        let out = '<table>'
        songlist.forEach((v,i)=>{
            out += `<tr><td class="pmark" id="pmark${i}">${i+1}</td><td class="title">${v.t}</td><td class="artist">${v.a}</td></tr>`
        })
        out += '</table>'
        document.getElementById("plist").innerHTML = out

        nextsong()
        AUDIO.play()
    })
}
