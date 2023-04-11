// menu variables
const menu = document.getElementById("menu-container");
const bonusDino = document.getElementById("bonusDino");
const bonusDinoName = document.getElementById("bonusDinoname");
const dinoNames = document.getElementById("dino-name");
const yellowDino = document.getElementById("yellowDino");
const purpleDino = document.getElementById("purpleDino");
const greenDino = document.getElementById("greenDino");
const blueDino = document.getElementById("blueDino");
const start = document.getElementById("start");
const continueBtn = document.getElementById("continue-btn");
const death = document.getElementById("death-container");
const bonusReward = document.getElementById("highScore-container");
const dinos = document.querySelectorAll('.dino-container > div');
const scoreDisplay = document.getElementById("your-score");
const highScoreDisplay = document.getElementById("high-score");
const dirContainer = document.getElementById("dir-container");

// audio variables
const audioPlayer = document.querySelector(".audio-player");
const songElement = document.querySelector('.name');
const musicPlayerSymbol = document.getElementById("musicplayer-symbol");
const audio = new Audio();

// songs
const songNodes = [
    {
        id: 1,
        SongArtist: "Summer Chill Reggaeton by Alex-Productions",
        url: "audio/alex-productions-summer-chill-reggaeton-island.mp3",
    },
    {
        id: 2,
        SongArtist: "El Guiso by Dubaquinho",
        url: "audio/dubaquinho-el-guiso.mp3",
    },
    {
        id: 3,
        SongArtist: "Tropical Sensation (Instrumental) by Mike Leite",
        url: "audio/mike-leite-tropical-sensation-instrumental.mp3",
    },
    {
        id: 4,
        SongArtist: "Easy by Ron Gelinas Chillout Lounge",
        url: "audio/ron-gelinas-chillout-lounge-easy.mp3",
    },
    {
        id: 5,
        SongArtist: "Boat by Vlad Gluschenko",
        url: "audio/vlad-gluschenko-boat.mp3",
    },
]

// Randomly play and update song
function playRandomSong() {
    const randomIndex = Math.floor(Math.random() * songNodes.length); // Generate random index
    const randomSong = songNodes[randomIndex]; // Get random song from array
    audio.src = randomSong.url; // Set audio source to the URL of the random song
    songElement.textContent = randomSong.SongArtist;
    audio.play(); // Play audio
}

playRandomSong();


// audio player functionality
console.dir(audio);

audio.addEventListener(
  "loadeddata",
  () => {
    audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
      audio.duration
    );
    audio.volume = .75;
  },
  false
);

//click on timeline to skip around
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener("click", e => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
}, false);

//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}, false)

//check audio percentage and update time accordingly
setInterval(() => {
  const progressBar = audioPlayer.querySelector(".progress");
  progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
  audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
}, 500);


//toggle between playing and pausing on button click
const playBtn = audioPlayer.querySelector(".controls .toggle-play");
playBtn.addEventListener(
  "click",
  () => {
    if (audio.paused) {
      playBtn.classList.remove("play");
      playBtn.classList.add("pause");
      audio.play();
    } else {
      playBtn.classList.remove("pause");
      playBtn.classList.add("play");
      audio.pause();
    }
  },
  false
);

audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = audioPlayer.querySelector(".volume-container .volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
  }
});

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

// Add event listener for click event
musicPlayerSymbol.addEventListener("click", () => {
    // Target the "musicplayer" element
    const musicPlayer = document.getElementById("musicplayer");
  
    // Toggle the visibility of the "musicplayer" element
    musicPlayer.style.display = musicPlayer.style.display === "none" ? "block" : "none";
  });


//canvas variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// game variables
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let earnedBonus = parseInt(localStorage.getItem("earnedBonus")) || undefined;
let startingScore = 0;
let continueAnimating = false;
let score = '';
let elapsedTime = 0;
let lastRockUpdate = Date.now();
const rockImages = ["img/meteor1.png", "img/meteor2.png", "img/meteor3.png", "img/meteor4.png", "img/meteor5.png", "img/meteor6.png", "img/meteor7.png", "img/meteor8.png"];
let dino = '';

// block variables
let dinoFacingLeft = false;
let blockWidth = '';
let blockHeight = '';
let blockSpeed = 10;
let block = {};

// randomize variables
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// rock variables
let rockWidth = '';
let rockHeight = '';
let totalRocks = 10;
let fallingRocks = 0;
let rocks = [];

function addRock() {
    for (let i = fallingRocks; i < totalRocks; i++) {
        // Randomize rock size
        let rockWidth = randomNumber(15, 55);
        let rockHeight = rockWidth * 2;

        // Create rock
        let rock = {
            width: rockWidth,
            height: rockHeight,
            speed: ''
        }
        fallingRocks +=1;
        resetRock(rock);
        rocks.push(rock);
    }
}

// move the rock to a random position near the top-of-canvas
// assign the rock a random speed
function resetRock(rock) {
    rock.x = Math.random() * (canvas.width - rockWidth);
    rock.y = 15 + Math.random() * 30;
    rock.speed = 0.5 + Math.random();
    rock.image = rockImages[randomNumber(0, rockImages.length - 1)];
}


//left and right keypush event handlers
document.onkeydown = function (event) {
    if (event.keyCode == 39) {
        block.x += block.blockSpeed;
        dinoFacingLeft = false;
        if (block.x >= (canvas.width - blockWidth)) {
            block.x = canvas.width - blockWidth;
        }
    } else if (event.keyCode == 37) {
        block.x -= block.blockSpeed;
        dinoFacingLeft = true;
        if (block.x <= 0) {
            block.x = 0;
        }
    }
}

function toggleButton() {
    start.disabled = false;
}

// function to save the high score to local storage
function saveHighScore() {
    localStorage.setItem("highScore", highScore.toString());
}

// restart game
function restartGame() {
   location.reload(); 
}

function bonusShown() {
    earnedBonus = true;
    localStorage.setItem("earnedBonus", highScore.toString());
    document.removeEventListener('click', bonusShown);
    youDied();
}

// death screen
function youDied() {
    if ((earnedBonus === undefined) && (highScore >= 200)) {
        continueAnimating = false;
        bonusReward.style.visibility = "visible";
        document.addEventListener('click', bonusShown);
    } else {
        bonusReward.style.visibility = "hidden";
        death.style.visibility = "visible";
        continueAnimating = false;
        scoreDisplay.innerText = `Meteors Dodged: ${score}`;
        highScoreDisplay.innerText = `High Score: ${highScore}`;
        continueBtn.addEventListener('click', restartGame);
    }
}

// animate game and elements
function animate() {
    // request another animation frame
    const now = Date.now();
    elapsedTime += now - lastRockUpdate;
    lastRockUpdate = now;

    if (continueAnimating) {
        requestAnimationFrame(animate);
    }
    
    // for each rock
    // (1) check for collisions
    // (2) advance the rock
    // (3) if the rock falls below the canvas, reset that rock

    for (let i = 0; i < rocks.length; i++) {

        let rock = rocks[i];

        // test for rock-block collision and end game
        if (isColliding(rock, block)) {
            youDied();
        }

        // advance the rocks
        rock.y += rock.speed;

        // if the rock is below the canvas,
        if (rock.y > (canvas.height-5)) {
            score += 1;
            if (score > highScore) {
                highScore = score;
                saveHighScore();
                highScoreReward();
            }
            resetRock(rock);
        }

        // increase difficulty every 15 seconds
        if (elapsedTime >= 15000) {
            totalRocks += 1;
            rock.speed += 0.2;
            elapsedTime = 0;
            addRock();
        }   

    }

    // redraw everything
    drawAll();
}

// collision detection
function isColliding(a, b) {
    return !(
    b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
}

// generate game
function drawAll() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // load the image
    ctx.fillStyle = "#A56000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let backgroundImage = new Image();
    backgroundImage.src = "img/background.png";

    // draw the background image
    ctx.drawImage(backgroundImage, -5, -5, (canvas.width + 10), (canvas.height + 10));

    // draw the player
    ctx.fillStyle = "#B278E5";
    let playerImage = new Image();

    // flip the dino if the player changes directions
    if (dinoFacingLeft === true) {
        if (dino === "bonusDinosaur") {
            playerImage.src = "img/bonusDino.png";
        } else if (dino === "yellowDinosaur") {
            playerImage.src = "img/yellowDino.png";
        } else if (dino === "purpleDinosaur") {
            playerImage.src = "img/purpleDino.png";
        } else if (dino === "greenDinosaur") {
            playerImage.src = "img/greenDino.png";
        } else if (dino === "blueDinosaur") {
            playerImage.src = "img/blueDino.png";
        }
    } else {
        if (dino === "bonusDinosaur") {
            playerImage.src = "img/bonusDinoRight.png";
        } else if (dino === "yellowDinosaur") {
            playerImage.src = "img/yellowDinoRight.png";
        } else if (dino === "purpleDinosaur") {
            playerImage.src = "img/purpleDinoRight.png";
        } else if (dino === "greenDinosaur") {
            playerImage.src = "img/greenDinoRight.png";
        } else if (dino === "blueDinosaur") {
            playerImage.src = "img/blueDinoRight.png";
        }
    }
    ctx.drawImage(playerImage, block.x, block.y, block.width, block.height);

    // draw all rocks
    for (let i = 0; i < rocks.length; i++) {
        let rock = rocks[i];
        let rockImage = new Image();
        rockImage.src = rock.image;
        ctx.drawImage(rockImage, rock.x, rock.y, rock.width, rock.height);
    }

    // draw the score
    ctx.font = "30px Architects Daughter";
    ctx.fillStyle = "#321300";
    ctx.fillText(score, (canvas.width - (canvas.width/2)), 31);
}

// button to start the game
function startGame() {
    if (dino === "bonusDinosaur" || dino === "yellowDinosaur"|| dino === "purpleDinosaur"|| dino === "greenDinosaur"|| dino === "blueDinosaur" ) {
        score = startingScore;
        block.x = 0;
        addRock();
        for (let i = 0; i < rocks.length; i++) {
            resetRock(rocks[i]);
        }
        if (!continueAnimating) {
            continueAnimating = true;
            animate();
        };
    }
}

// hide instructions
function hideDemo() {
    if (event.keyCode == 39 || event.keyCode == 37) {
        dirContainer.style.display = "none";
        document.removeEventListener("keydown", hideDemo);
        startGame();
    }
}

// display instructions
function demo() {
    toggleButton();
    menu.style.visibility = "hidden";
    bonusDinoName.style.visibility = "hidden";
    dirContainer.style.display = "inherit";
    document.addEventListener("keydown", hideDemo);
}

// reset selector
dinos.forEach(dino => {
    dino.addEventListener('click', () => {
        dinos.forEach(d => d.classList.remove('selected'));
    });
});

// add event listeners to dinosaur menu items
bonusDino.addEventListener("click", function() {
    dino = "bonusDinosaur";
    blockWidth = 75;
    blockHeight = 30;
    block = {
        x: 0,
        y: canvas.height - blockHeight,
        width: blockWidth,
        height: blockHeight,
        blockSpeed: blockSpeed
      }
    bonusDino.classList.add('selected');
    toggleButton();
  });
  
  yellowDino.addEventListener("click", function() {
    dino = "yellowDinosaur";
    blockWidth = 75;
    blockHeight = 45;
    block = {
        x: 0,
        y: canvas.height - blockHeight,
        width: blockWidth,
        height: blockHeight,
        blockSpeed: blockSpeed
      }
    yellowDino.classList.add('selected');
    toggleButton();
  });
  
  purpleDino.addEventListener("click", function() {
    dino = "purpleDinosaur";
    blockWidth = 60;
    blockHeight = 60;
    block = {
        x: 0,
        y: canvas.height - blockHeight,
        width: blockWidth,
        height: blockHeight,
        blockSpeed: blockSpeed
      }
    purpleDino.classList.add('selected');
    toggleButton();
  });
  
  greenDino.addEventListener("click", function() {
    dino = "greenDinosaur";
    blockWidth = 45;
    blockHeight = 75;
    block = {
        x: 0,
        y: canvas.height - blockHeight,
        width: blockWidth,
        height: blockHeight,
        blockSpeed: blockSpeed
      }
    greenDino.classList.add('selected');
    toggleButton();
  });
  
  blueDino.addEventListener("click", function() {
    dino = "blueDinosaur";
    blockWidth = 60;
    blockHeight = 75;
    block = {
        x: 0,
        y: canvas.height - blockHeight,
        width: blockWidth,
        height: blockHeight,
        blockSpeed: blockSpeed
      }
    blueDino.classList.add('selected');
    toggleButton();
  });

function highScoreReward() {
    if (highScore > 200) {
        bonusDino.style.display = "inherit";
        bonusDinoName.style.visibility = "visible";
        dinoNames.style.width = "950px";
    } else {
        bonusDino.style.display = "none";
        bonusDinoName.style.visibility = "hidden";
        dinoNames.style.width = "775px";
    }
}


highScoreReward();
start.addEventListener('click', demo);