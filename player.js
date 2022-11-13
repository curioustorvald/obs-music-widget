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

let RANDOMISED = true;
let AUDIO = undefined;
let songlist = [];// list of object: {f:"file.mp3",t:"Title",a:"Artist"}
let songindex = 0;
let rndbuf = [-1,-1];

function fmod(num, dem) {
    if (dem == 0) throw Error("Denominator is zero")
    let n = num % dem
    while (n < 0) {
        n += dem
    }
    return n
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateNextRandomSong() {
    let rnum = getRandomInt(songlist.length)
    while (rndbuf.includes(rnum)) {
        rnum = getRandomInt(songlist.length)
    }
    songindex = rnum
    rndbuf.unshift(rnum)
    rndbuf.pop()
}

function nextsong() {
    let songinfo = songlist[songindex]

    AUDIO = new Audio("audio/"+songinfo.f)
    AUDIO.onended = function() {
        stop()
        nextsong()
        AUDIO.play()
    }



    if (!RANDOMISED) {
        let prevsongindex = fmod(songindex - 1, songlist.length)
        document.getElementById("pmark"+prevsongindex).innerText = ''+(prevsongindex + 1)
        document.getElementById("pmark"+songindex).innerText = '▶'
        console.log(`Next song: #${1 + songindex} ${songinfo.t} - ${songinfo.a}`)
        updateText(songinfo.t, songinfo.a)
        songindex = fmod(songindex + 1, songlist.length)
    }
    else {
        let prevsongindex = rndbuf[1]
        let currentindex = rndbuf[0]

        if (prevsongindex >= 0) {
            document.getElementById("pmark"+prevsongindex).innerText = ''+(prevsongindex + 1)
        }
        document.getElementById("pmark"+songindex).innerText = '▶'
        console.log(`Next song: #${1 + songindex} ${songinfo.t} - ${songinfo.a}`, rndbuf)
        updateText(songinfo.t, songinfo.a)

        generateNextRandomSong()
    }
}

function init() {

    RANDOMISED = qd.r != undefined && qd.r[0]

    loadJSON(qd.p[0], (e) => {

        // check if the JSON contains "meta" info
        let listJson = JSON.parse(e)
        if (listJson[0] != undefined && listJson[0].meta) {
            // parse meta
            let meta = listJson[0]
            RANDOMISED = (meta.random == true)

            songlist = listJson.slice(1)
        }
        else {
            songlist = listJson
        }

        console.log("Playlist:"+((RANDOMISED) ? " (randomised)" : ""))
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


        if (RANDOMISED) {
            generateNextRandomSong()
            document.getElementById("plistheader").innerText = 'Playlist (randomised)'
        }

        nextsong()
        AUDIO.play()
    })
}
