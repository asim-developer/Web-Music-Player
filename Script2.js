console.log(`Let Write Some JS`);
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]));
        }
    }
    let songUL = document.querySelector(".song-list ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>Edii Vedaa</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="Plays.svg" alt="">
            </div>
        </li>`;
    }
    document.querySelectorAll(".song-list li").forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info div").innerText.trim());
        });
    });
}

const playMusic = (track, pause = false) => {
    currentsong.src = `/${currFolder}/` + encodeURIComponent(track);
    if (!pause) {
        currentsong.play();
        document.getElementById("play").src = "pause.svg";
    }
    document.querySelector(".song-info").innerText = track;
    document.querySelector(".song-time").innerText = "00:00 / 00:00";
};

async function main() {
    await getSongs("songs/ncs");
    playMusic(songs[0], true);

    document.getElementById("play").addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            document.getElementById("play").src = "pause.svg";
        } else {
            currentsong.pause();
            document.getElementById("play").src = "Play.svg";
        }
    });
}

main();
