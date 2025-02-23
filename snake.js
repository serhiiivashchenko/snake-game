// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get the score element
const scoreElement = document.getElementById('score');

// Set the size of each grid cell
const gridSize = 20;

// Initialize the snake with a starting position
let snake = [{ x: 200, y: 200 }];

// Initialize the direction of the snake (initially not moving)
let direction = { x: 0, y: 0 };

// Initialize the food position and score
let food = { x: 0, y: 0 };
let score = 0;

// Initialize the obstacles array
let obstacles = [];

// Function to generate a random position for the food or obstacles
function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

// Function to generate a random position for the food
function getRandomFoodPosition() {
    let position;
    do {
        position = getRandomPosition();
    } while (isPositionOccupied(position));
    return position;
}

// Function to check if a position is occupied by the snake or obstacles
function isPositionOccupied(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y) ||
           obstacles.some(obstacle => obstacle.x === position.x && obstacle.y === position.y);
}

// Function to generate random positions for the obstacles
function generateObstacles(count) {
    for (let i = 0; i < count; i++) {
        let position;
        do {
            position = getRandomPosition();
        } while (isPositionOccupied(position));
        obstacles.push(position);
    }
}

// Function to draw the snake on the canvas
function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Function to draw the food on the canvas
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Function to draw the obstacles on the canvas
function drawObstacles() {
    ctx.fillStyle = 'gray';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, gridSize, gridSize);
    });
}

// Function to move the snake
function moveSnake() {
    // Create a new head based on the current direction
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap the snake's position around the canvas edges
    if (head.x < 0) {
        head.x = canvas.width - gridSize;
    } else if (head.x >= canvas.width) {
        head.x = 0;
    }
    if (head.y < 0) {
        head.y = canvas.height - gridSize;
    } else if (head.y >= canvas.height) {
        head.y = 0;
    }

    snake.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFoodPosition(); // Generate new food position
        scoreElement.textContent = `Score: ${score}`; // Update the score display
    } else {
        snake.pop(); // Remove the last segment of the snake
    }
}

// Function to check for collisions
function checkCollision() {
    const head = snake[0];
    // Check if the snake has collided with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    // Check if the snake has collided with an obstacle
    for (let i = 0; i < obstacles.length; i++) {
        if (head.x === obstacles[i].x && head.y === obstacles[i].y) {
            return true;
        }
    }
    return false;
}

// Main game loop
function gameLoop() {
    if (checkCollision()) {
        alert(`Game Over! Your score: ${score}`);
        document.location.reload(); // Reload the page to restart the game
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawSnake(); // Draw the snake
    drawFood(); // Draw the food
    drawObstacles(); // Draw the obstacles
    moveSnake(); // Move the snake
}

// Function to change the direction of the snake based on key presses
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    // Prevent the snake from reversing
    if (keyPressed === LEFT && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (keyPressed === UP && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (keyPressed === RIGHT && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    } else if (keyPressed === DOWN && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    }
}

// Add an event listener for key presses to change the snake's direction
document.addEventListener('keydown', changeDirection);

// Generate the initial food position
food = getRandomFoodPosition();

// Generate obstacles
generateObstacles(5); // Change the number to increase or decrease the number of obstacles

// Start the game loop with an interval of 100 milliseconds
setInterval(gameLoop, 100);