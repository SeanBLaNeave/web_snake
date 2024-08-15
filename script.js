const board = document.getElementById("board");
const ctx = board.getContext("2d");
const height = 576;
const width = 1024;
board.width = width;
board.height = height;
const size = 16

//game variable
var direct;
var snake;
var food;
var foodState;
var gameLooop;
var headX;
var headY;

function beginningGameState(){
    direct = 'right';
    snake = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}];
    headX = 2;
    headY = 0;
    foodState = false;
    gameLooop = setInterval(runGame, 100);
}

function runGame(){
    addFood();
    direction();
    addToSnake();
    collision();
    draw(); 
}

window.addEventListener('keydown', (event) => {
    switch(event.code){
        case 'KeyS':
            direct = 'down';
            break;
        case 'KeyW':
            direct = 'up';
            break;
        case 'KeyD':
            direct = 'right';
            break;
        case 'KeyA':
            direct = 'left';
            break;
        default:
    }
});

function addFood(){
    if(foodState === true){
        return;
    }
    food = {x: Math.floor(Math.random() * 64), y: Math.floor(Math.random() * 36)};
    while(snake.includes(food)){
        food = {x: Math.floor(Math.random() * 64), y: Math.floor(Math.random() * 36)};
    }
    foodState = true; 
}

function direction(){
    switch(direct){
        case 'right' :
            headX += 1;
            break;
        case 'left' :
            headX -= 1;
            break;
        case 'up' :
            headY -= 1;
            break;
        case 'down' :
            headY += 1;
            break;
        default:
            console.log("error");
    }
}

function draw(){
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "red";
    let x = headX;
    let y = headY;
    for(let i = snake.length - 1; i >= 0; i--){
        let tempX = snake[i]["x"]
        let tempY = snake[i]["y"]
        snake[i]["x"] = x;
        snake[i]["y"] = y;
        ctx.fillRect(snake[i]["x"] * size, snake[i]["y"] * size, size, size)
        x = tempX;
        y = tempY;
    }
    ctx.fillStyle = "green";
    ctx.fillRect(food.x * size, food.y * size, size, size);
}

function addToSnake(){
    if(snake[snake.length - 1]["x"] === food.x && snake[snake.length - 1]["y"] === food.y){
        snake.push({x: food.x, y: food.y});
        var score = document.getElementById('score');
        score.innerHTML = parseInt(score.textContent, 10) + 1;
        foodState = false;
        addFood();
    }
}

function collision(){
    (headX < 0 || headX > 64 || headY < 0 || headY > 36) ? clearInterval(gameLooop) :
    snake.slice(0, snake.length - 1).forEach((element) => {
        if(element.x === headX && element.y === headY){
            clearInterval(gameLooop);
            return;
        }
    });
}