console.log("Let’s Write Some JS");
let currentsong = new Audio();
let songs = [];
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let response = await fetch(`/${folder}/info.json`);
    let data = await response.json();

    console.log("Fetched songs data:", data);
    console.log("Songs array:", data.songs);

    songs = data.songs.map(song => typeof song === "string" ? song : song.name);
    console.log("Songs list after processing:", songs);


    let songUL = document.querySelector(".song-list ul");
    songUL.innerHTML = "";
    
    songs.forEach(song => {
        console.log("Song item:", song);
        songUL.innerHTML += `
            <li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${typeof song === "string" ? song : song.name}</div>
                    <div>Edii Vedaa</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="Plays.svg" alt="">
                </div>
            </li>`;
    });

    document.querySelectorAll(".song-list li").forEach(e => {
        e.addEventListener("click", () => {
            let track = e.querySelector(".info div").textContent.trim();
            console.log("Playing track:", track);
            playMusic(track);
        });
    });
}

const playMusic = (track, pause = false) => {
    let songPath = `/${currFolder}/${encodeURIComponent(track)}.mp3`;
    console.log("Trying to play:", songPath);

    currentsong.src = songPath;
    currentsong.load();
    if (!pause) {
        currentsong.play().catch(e => console.error("Playback error:", e));
        document.getElementById("play").src = "pause.svg";
    }
    document.querySelector(".song-info").textContent = decodeURI(track);
    document.querySelector(".song-time").textContent = "00:00 / 00:00";
};

async function displayAlbums() {
    try {
        let response = await fetch("/songs/albums.json");
        if (!response.ok) throw new Error("Failed to fetch albums");
        let albums = await response.json();
        let cardContainer = document.querySelector(".card-container");
        
        cardContainer.innerHTML = "";
        albums.forEach(album => {
            cardContainer.innerHTML += `
                <div data-folder="${album.folder}" class="card">
                    <div class="button">
                        <svg viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="22" fill="#1fdf64" />
                            <polygon points="20,15 20,35 35,25" fill="black" />
                        </svg>
                    </div>
                    <img src="/songs/${album.folder}/cover.jpg" alt="">
                    <h2>${album.title}</h2>
                    <p>${album.description}</p>
                </div>`;
        });
        
        document.querySelectorAll(".card").forEach(e => {
            e.addEventListener("click", async (item) => {
                await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            });
        });
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}

displayAlbums();

async function main() {
    await getSongs("songs/ncs");
    playMusic(songs[0], true)

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "Play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".song-time").innerHTML =
            `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".colse").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%"
    })

    let currentSongIndex = 0; // Track current song index

    previous.addEventListener("click", () => {
        console.log("Previous button clicked");
        console.log("Current index before:", currentSongIndex);
    
        if (currentSongIndex > 0) {
            currentSongIndex--;
        } else {
            currentSongIndex = songs.length - 1;
        }
    
        console.log("Current index after:", currentSongIndex);
        playMusic(songs[currentSongIndex]);
    });
    
    next.addEventListener("click", () => {
        console.log("Next button clicked");
        console.log("Current index before:", currentSongIndex);
    
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
        } else {
            currentSongIndex = 0;
        }
    
        console.log("Current index after:", currentSongIndex);
        playMusic(songs[currentSongIndex]);
    });
    

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100
    })

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
}

main();