console.log('Lets write JS')
let currentSong = new Audio();
let songs;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);

    // Ensure two digits for minutes and seconds
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const roundedSecond = Math.floor(seconds % 60);
    const formattedSeconds = roundedSecond < 10 ? '0' + roundedSecond : roundedSecond;

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {

    let a = await fetch('http://192.168.0.106:5501/songs/')
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split('/songs'))
        }
    }
    return songs
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    const path = Array.isArray(track) ? track[1].replace('/', '') : `${track}`;
    currentSong.src = "/songs/" + path;
    if (!pause) {
        currentSong.play();
        play.src = "play.svg"
    } else {
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(path)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {


    // Get the list of all the songs;
    songs = await getSongs();
    playMusic(songs[0], true)

    // show all the song in the playlist
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        const name = decodeURI(song[1]).replace('/', '');
        songUL.innerHTML = songUL.innerHTML + `<li title="${name}">
        
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div> ${name}</div>
            <div>Anushree</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="pause.svg" alt="">   
        </div>
        ${name} </li>`;
    }

    // attach an event listener to each song
    Array.from(document.querySelector('.songsList').getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    // Attach an eventlisterner to play next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "play.svg";
        } else {
            currentSong.pause()
            play.src = "pause.svg";
        }
    })

    // // listen for time update event
    // currentSong.addEventListener("timeupdate", () => {
    //     console.log(currentSong.currentTime, currentSong.duration)
    //     document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    //     document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    // })

    // // add an event listener to seekbar
    // document.querySelector(".seekbar").addEventListener("click", e=>{
    //     document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
    // })


    
    // listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const seekPercentage = (offsetX / rect.width);
        document.querySelector(".circle").style.left = seekPercentage * 100 + "%";
        currentSong.currentTime = seekPercentage * currentSong.duration;
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    // add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    // add an event listener to previous clicked
    previous.addEventListener("click", ()=>{
        let index = songs.findIndex((songPath) => {
            return songPath[1] === `/${currentSong.src.split("/").slice(-1)}`
        });
        playMusic(songs[index - 1] ? songs[index - 1]: songs[songs.length - 1]);
    })
    // add an event listener to next clicked
    
    next.addEventListener("click", ()=>{
        let index = songs.findIndex((songPath) => {
            return songPath[1] === `/${currentSong.src.split("/").slice(-1)}`
        });
        playMusic(songs[index + 1] ? songs[index + 1]: songs[0]);
    })
}

main()







