// menu variables
const menu = document.getElementById("menu-container");
const bonusDino = document.getElementById("bonusDino");
const yellowDino = document.getElementById("yellowDino");
const purpleDino = document.getElementById("purpleDino");
const greenDino = document.getElementById("greenDino");
const blueDino = document.getElementById("blueDino");
const start = document.getElementById("start");
const continueBtn = document.getElementById("continue-btn");
const death = document.getElementById("death-container");

//canvas variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// game variables
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
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

// function to save the high score to local storage
function saveHighScore() {
    localStorage.setItem("highScore", highScore.toString());
}

// restart game
function restartGame() {
   location.reload(); 
}

// death screen
function youDied() {
    death.style.visibility = "visible";
    continueAnimating = false;
    continueBtn.addEventListener('click', restartGame);
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
        menu.style.visibility = "hidden";
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
  });

function highScoreReward() {
    if (highScore > 200) {
        bonusDino.hidden = false;
    } else {
        bonusDino.hidden = true;
    }
}

highScoreReward();
start.addEventListener('click', startGame);