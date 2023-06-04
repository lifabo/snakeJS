// const global variables
const width = 17;
const height = 15;

// initialize variables and start application
init();
main();

/**
 * Initializes all (global) variables that are necessary for the game. Also the game field is built by @function buildGameField
 * and the content is being displayed to the user by @function Print.
 */
function init() {
  // global
  snakeCoordinates = [106, 105, 104];
  foodPosition = 122;
  foodEaten = false;
  score = 0;
  direction = "right";
  bufferedDirection = "";
  changingDirection = false;
  updateInterval = 200;

  setGameStatus("running");
  buildGameField();
  Print();
}

function markBorderBlocks() {
  // mark border blocks
  // left
  for (let i = 0; i < (width * height) - 1; i += width) {
    gameField.childNodes[i].className = "fieldBlock borderBlock";
  }

  // right
  for (let i = width - 1; i <= (width * height) - 1; i += width) {
    gameField.childNodes[i].className = "fieldBlock borderBlock";
  }

  // bottom
  for (let i = (width * height) - width; i < width * height; i++) {
    gameField.childNodes[i].className = "fieldBlock borderBlock";
  }

  // top
  for (let i = 1; i < width; i++) {
    gameField.childNodes[i].className = "fieldBlock borderBlock";
  }
}

/**
 * Creates the game field grid layout and marks border and playfield blocks.
 */
function buildGameField() {
  var gameField = document.getElementById("gameField");
  gameField.innerHTML = "";
  gameField.style.display = "inline-grid";

  // set grid width by adding "auto" width-times to grid templace columns value
  var widthInText = "";
  for (let i = 0; i < width; i++) {
    widthInText += "auto ";
  }
  gameField.style.gridTemplateColumns = widthInText;

  // create blocks (border and playfield)
  for (let i = 0; i < (width * height); i++) {
    newElement = document.createElement("div");
    newElement.className = "fieldBlock";
    //newElement.innerText = i;

    gameField.appendChild(newElement);
  }

  markBorderBlocks();
}

function Print() {
  var gameField = document.getElementById("gameField");

  // display all blocks that are part of the snake with the according css class
  for (let i = 0; i < snakeCoordinates.length; i++) {
    gameField.childNodes[snakeCoordinates[i]].className = "fieldBlock snakeBody";
  }

  // display food
  gameField.childNodes[foodPosition].innerHTML = "<img src='pics/food.png' class='food'>";

  // display snake head as image and rotate image depending on current direction
  gameField.childNodes[snakeCoordinates[0]].className = "fieldBlock";
  switch (direction) {
    case "right":
      gameField.childNodes[snakeCoordinates[0]].innerHTML = "<img src='pics/snakehead_cut.png' class='snakeHead rotate180'>";
      break;

    case "left":
      gameField.childNodes[snakeCoordinates[0]].innerHTML = "<img src='pics/snakehead_cut.png' class='snakeHead'>";
      break;

    case "bottom":
      gameField.childNodes[snakeCoordinates[0]].innerHTML = "<img src='pics/snakehead_cut.png' class='snakeHead rotate270'>";
      break;

    case "top":
      gameField.childNodes[snakeCoordinates[0]].innerHTML = "<img src='pics/snakehead_cut.png' class='snakeHead rotate90'>";
      break;

  }

  // overwrite border blocks in case it is game over and snake head is on the border, so that it is not markes as a fieldBlock
  markBorderBlocks();

  // display score
  var scoreElement = document.getElementById("score");
  scoreElement.innerHTML = score;

  // display highscore
  var highscoreElement = document.getElementById("highscore");
  var currentHighscore = getCookie("highscore");
  console.log(currentHighscore);

  if (currentHighscore == "")
    highscoreElement.innerHTML = 0;
  else {
    highscoreElement.innerHTML = currentHighscore;
  }


  /*if (foodEaten == true) {
    // right lane
    if (foodPosition > width && foodPosition < width * 2 - 1) {

    }
  }*/
}

/**
 * Checks wether the next snake head position causes a collision with either a border block, its own snake body
 * or food.
 * @param int nextHeadPosition 
 */
function detectCollision(nextHeadPosition) {
  // borders (left, right, bottom, top)
  if (nextHeadPosition % width == 0 || nextHeadPosition % width == width - 1 || nextHeadPosition >= (height - 1) * width || (nextHeadPosition >= 0 && nextHeadPosition < width)) {
    console.log("collision with border");
    setGameStatus("gameOver");
  }

  // own body
  for (let i = 1; i < snakeCoordinates.length; i++) {
    if (snakeCoordinates[i] == nextHeadPosition) {
      console.log("collision with body");
      setGameStatus("gameOver");
    }
  }

  // food
  if (nextHeadPosition == foodPosition) {
    console.log("eat food");
    gameField.childNodes[foodPosition].className = "fieldBlock";
    foodEaten = true;
    score++;
  }
}

/**
 * Generates next food position by using @function Math.random. If no collision with snake body is detected
 * next food position is then stored in global variable @global foodPosition.
 */
function spawnFood() {
  var generatePosLoop = true;
  var nextPos = 0;

  while (generatePosLoop) {
    var collision = false;
    var dimensions = width * height;
    nextPos = Math.floor(Math.random() * dimensions);

    // food collides with snake body
    for (let i = 0; i < snakeCoordinates.length; i++) {
      if (snakeCoordinates[i] == nextPos) {
        collision = true;
      }
    }

    // food collides with borders
    if (nextPos % width == 0 || nextPos % width == width - 1 || nextPos >= (height - 1) * width || (nextPos >= 0 && nextPos < width)) {
      collision = true;
    }

    if (collision == false) {
      generatePosLoop = false;
    }
  }

  foodPosition = nextPos;
}

function move(pDirection) {
  gameField.childNodes[snakeCoordinates[snakeCoordinates.length - 1]].className = "fieldBlock";

  if (!foodEaten) {
    // move snake body
    for (let i = snakeCoordinates.length - 1; i > 0; i--) {
      snakeCoordinates[i] = snakeCoordinates[i - 1];
    }
  }
  else {
    // food eaten
    snakeCoordinates.splice(1, 0, foodPosition);
    gameField.childNodes[foodPosition].innerHTML = "";
    foodEaten = false;
    spawnFood();
  }

  gameField.childNodes[snakeCoordinates[0]].innerHTML = "";

  switch (pDirection) {
    case "right":
      detectCollision(snakeCoordinates[0] + 1);
      snakeCoordinates[0] += 1;
      break;

    case "left":
      detectCollision(snakeCoordinates[0] - 1);
      snakeCoordinates[0] -= 1;
      break;

    case "bottom":
      detectCollision(snakeCoordinates[0] + width);
      snakeCoordinates[0] += width;
      break;

    case "top":
      detectCollision(snakeCoordinates[0] - width);
      snakeCoordinates[0] -= width;
      break;
  }
}

function pauseButtonOnClick() {
  if (gameStatus == "running") {
    setGameStatus("paused");
  }
  else if (gameStatus == "gameOver") {
    restartGame();
  }
  else {
    setGameStatus("running");
  }
}

function setGameStatus(newStatus) {
  gameStatus = newStatus;

  // update pauseButton class
  var pauseButton = document.getElementById("pauseButton");

  if (gameStatus == "paused" || gameStatus == "gameOver")
    pauseButton.className = "pauseButton";
  else
    pauseButton.className = "pauseButton pauseButtonPaused";
}

function restartGame() {
  init();
  buildGameField();
  score = 0;
  setGameStatus("running");
}

function setSnakeSpeed() {
  clearInterval(mainInterval);
  var slider = document.getElementById("speedSlider");
  updateInterval = 600 - 4.5 * slider.value;
  mainInterval = window.setInterval(main, updateInterval);
}

function main() {
  // check if game over

  if (gameStatus == "running") {
    move(direction);
    Print();
    changingDirection = false;

    setSnakeSpeed();

    if (bufferedDirection != "") {
      direction = bufferedDirection;
      bufferedDirection = "";
    }
  }
  else if (gameStatus == "paused") {
    Print();
  }
  else if (gameStatus == "gameOver") {
    console.log("gameover");
    saveHighscoreAsCookie();
    Print();
  }
}

function saveHighscoreAsCookie() {
  let highscore = getCookie("highscore");

  // no highscore has been yet saved OR current score is greater than current highscore
  if (highscore == "" || score > highscore) {
    document.cookie = "highscore=" + score;
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var mainInterval = window.setInterval(main, updateInterval);

// keyboard input
document.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // event was already processed
  }

  // es soll immer nur die nächste direction gepuffert werden, nicht mehrere directions, wenn also schon eine gespeichert ist, soll er die nicht
  // überschreiben
  if (bufferedDirection != "") return;

  //if (gameStatus == "running") {
  switch (event.key) {
    case "ArrowLeft":
    case "a":
      if (direction == "top" || direction == "bottom") {
        if (changingDirection)
          bufferedDirection = "left";
        else {
          direction = "left";
        }
      }
      break;
    case "ArrowRight":
    case "d":
      if (direction == "top" || direction == "bottom") {
        if (changingDirection)
          bufferedDirection = "right";
        else {
          direction = "right";
        }
      }
      break;
    case "ArrowDown":
    case "s":
      if (direction == "left" || direction == "right") {
        if (changingDirection)
          bufferedDirection = "bottom";
        else {
          direction = "bottom";
        }
      }
      break;
    case "ArrowUp":
    case "w":
      if (direction == "left" || direction == "right") {
        if (changingDirection)
          bufferedDirection = "top";
        else {
          direction = "top";
        }
      }
      break;
    case "p":
      if (gameStatus == "gameOver")
        restartGame();
      else
        pauseButtonOnClick();
      break;

    default:
      return;
    //}

    //changingDirection = true;
  }
  if (gameStatus == "gameOver") {
    init();
  }

  event.preventDefault();
}, true);
