// pixel_count is the pixels on horizontal or vertical axis of the game board (SQUARE).
const pixel_count = 40;
const SQUARE_OF_pixel_count = Math.pow(pixel_count, 2);

let totalFoodAte = 0;
let totalDistanceTravelled = 0;

/// THE GAME BOARD:
const gameBoard = document.getElementById("gameBoard");

const createGameBoardPixels = () => {
  // Populate the [#gameBoard] div with small div's representing game pixels
  for (let i = 1; i <= SQUARE_OF_pixel_count; ++i) {
    gameBoard.innerHTML = `${gameBoard.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`;
  }
};

// This variable always holds the updated array of game pixels created by createGameBoardPixels() :
const gameBoardPixels = document.getElementsByClassName("gameBoardPixel");

/// THE FOOD:
let currentFoodPostion = 0;
const createFood = () => {
  // Remove previous food;
  gameBoardPixels[currentFoodPostion].classList.remove("food");

  // Create new food
  currentFoodPostion = Math.random();
  currentFoodPostion = Math.floor(
    currentFoodPostion * SQUARE_OF_pixel_count
  );
  gameBoardPixels[currentFoodPostion].classList.add("food");
};

/// THE SNAKE:

// Direction codes (Keyboard key codes for arrow keys):
const go_left = 37;
const go_up = 38;
const go_right = 39;
const go_down = 40;

// Set snake direction initially to right
let snakeCurrentDirection = go_right;

const changeDirection = (newDirectionCode) => {
  // Change the direction of the snake
  if (newDirectionCode == snakeCurrentDirection) return;

  if (newDirectionCode == go_left && snakeCurrentDirection != go_right) {
    snakeCurrentDirection = newDirectionCode;
  } else if (newDirectionCode == go_up && snakeCurrentDirection != go_down) {
    snakeCurrentDirection = newDirectionCode;
  } else if (
    newDirectionCode == go_right &&
    snakeCurrentDirection != go_left
  ) {
    snakeCurrentDirection = newDirectionCode;
  } else if (newDirectionCode == go_down && snakeCurrentDirection != go_up) {
    snakeCurrentDirection = newDirectionCode;
  }
};

// Let the starting position of the snake be at the middle of game board
let snakeHeadPosition = SQUARE_OF_pixel_count / 2;

// Initial snake length
let snakeLength = 1000;

// Move snake continously by calling this function repeatedly :
const moveSnake = () => {
  switch (snakeCurrentDirection) {
    case go_left:
      --snakeHeadPosition;
      const isSnakeHeadAtLastGameBoardPixelTowardsLeft =
        snakeHeadPosition % pixel_count == pixel_count - 1 ||
        snakeHeadPosition < 0;
      if (isSnakeHeadAtLastGameBoardPixelTowardsLeft) {
        snakeHeadPosition = snakeHeadPosition + pixel_count;
      }
      break;
    case go_up:
      snakeHeadPosition = snakeHeadPosition - pixel_count;
      const isSnakeHeadAtLastGameBoardPixelTowardsUp =
        snakeHeadPosition < 0;
      if (isSnakeHeadAtLastGameBoardPixelTowardsUp) {
        snakeHeadPosition =
          snakeHeadPosition + SQUARE_OF_pixel_count;
      }
      break;
    case go_right:
      ++snakeHeadPosition;
      const isSnakeHeadAtLastGameBoardPixelTowardsRight =
        snakeHeadPosition % pixel_count == 0;
      if (isSnakeHeadAtLastGameBoardPixelTowardsRight) {
        snakeHeadPosition = snakeHeadPosition - pixel_count;
      }
      break;
    case go_down:
      snakeHeadPosition = snakeHeadPosition + pixel_count;
      const isSnakeHeadAtLastGameBoardPixelTowardsDown =
        snakeHeadPosition > SQUARE_OF_pixel_count - 1;
      if (isSnakeHeadAtLastGameBoardPixelTowardsDown) {
        snakeHeadPosition =
          snakeHeadPosition - SQUARE_OF_pixel_count;
      }
      break;
    default:
      break;
  }

  let nextSnakeHeadPixel = gameBoardPixels[snakeHeadPosition];

  // Kill snake if it bites itself:
  if (nextSnakeHeadPixel.classList.contains("snakeBodyPixel")) {
    // Stop moving the snake
    clearInterval(moveSnakeInterval);
    if (
      !alert(
        `You have ate ${totalFoodAte} food by travelling ${totalDistanceTravelled} blocks.`
      )
    )
      window.location.reload();
  }

  nextSnakeHeadPixel.classList.add("snakeBodyPixel");

  setTimeout(() => {
    nextSnakeHeadPixel.classList.remove("snakeBodyPixel");
  }, snakeLength);

  // Update total distance travelled
  totalDistanceTravelled++;
  // Update in UI:
  document.getElementById("blocksTravelled").innerHTML = totalDistanceTravelled;

  if (snakeHeadPosition == currentFoodPostion) {
    // Update total food ate
    totalFoodAte++;
    // Update in UI:
    document.getElementById("pointsEarned").innerHTML = totalFoodAte;

    // Increase Snake length:
    snakeLength = snakeLength + 100;
    createFood();
  }
};

/// CALL THE FOLLOWING FUNCTIONS TO RUN THE GAME:

// Create game board pixels:
createGameBoardPixels();

// Create initial food:
createFood();

// Move snake:
var moveSnakeInterval = setInterval(moveSnake, 80);

// Call change direction function on keyboard key-down event:
addEventListener("keydown", (e) => changeDirection(e.keyCode));

// ON SCREEN CONTROLLERS:
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");

leftButton.onclick = () => changeDirection(go_left);
rightButton.onclick = () => changeDirection(go_right);
upButton.onclick = () => changeDirection(go_up);
downButton.onclick = () => changeDirection(go_down);
