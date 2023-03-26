//canvas variables
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// game variables
let startingScore = 0;
let continueAnimating = false;
let score;
let elapsedTime = 0;
let lastRockUpdate = Date.now();

// block variables
let blockWidth = 30;
let blockHeight = 15;
let blockSpeed = 10;
let block = {
    x: 0,
    y: canvas.height - blockHeight,
    width: blockWidth,
    height: blockHeight,
    blockSpeed: blockSpeed
}

// rock variables
let rockWidth = 15;
let rockHeight = 15;
let totalRocks = 10;
let fallingRocks = 0
let rocks = [];

function addRock() {
    for (let i = fallingRocks; i < totalRocks; i++) {
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
    rock.speed = 0.2 + Math.random() * 0.5;
}


//left and right keypush event handlers
document.onkeydown = function (event) {
    if (event.keyCode == 39) {
        block.x += block.blockSpeed;
        if (block.x >= canvas.width - block.width) {
            continueAnimating = false;
            alert("Completed with a score of " + score);
        }
    } else if (event.keyCode == 37) {
        block.x -= block.blockSpeed;
        if (block.x <= 0) {
            block.x = 0;
        }
    }
}


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

        // test for rock-block collision
        if (isColliding(rock, block)) {
            alert("YOU DIED");
            startGame();
        }

        // advance the rocks
        rock.y += rock.speed;

        // if the rock is below the canvas,
        if (rock.y > canvas.height) {
            score += 1;
            resetRock(rock);
        }

        // increase difficulty every 15 seconds
        if (elapsedTime >= 15000) {
            totalRocks += 1;
            rock.speed += 0.1;
            elapsedTime = 0;
            addRock();
        }   

    }

    // redraw everything
    drawAll();

}

function isColliding(a, b) {
    return !(
    b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
}

function drawAll() {

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the background
    // (optionally drawImage an image)
    ctx.fillStyle = "#ADB5C7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw the block
    ctx.fillStyle = "#B278E5";
    ctx.fillRect(block.x, block.y, block.width, block.height);
    ctx.strokeStyle = "#76677E";
    ctx.strokeRect(block.x, block.y, block.width, block.height);

    // draw all rocks
    for (let i = 0; i < rocks.length; i++) {
        let rock = rocks[i];
        // optionally, drawImage(rocksImg,rock.x,rock.y)
        ctx.fillStyle = "#320000";
        ctx.fillRect(rock.x, rock.y, rock.width, rock.height);
    }

    // draw the score
    ctx.font = "14px Times New Roman";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 15);
}

// button to start the game
function startGame() {
    score = startingScore
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

let start = document.getElementById("start");
start.addEventListener('click', startGame);