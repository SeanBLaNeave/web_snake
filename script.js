import {snake_head_right, snake_head_left, snake_head_up, snake_head_down, 
    snake_down_right, snake_down_left, snake_up_right, snake_up_left, 
    snake_straight, snake_up_down, apple, ground1, ground2, 
    snake_tail_right, snake_tail_left, snake_tail_up, snake_tail_down} from './img/img.js';

const board = document.getElementById("board");
const ctx = board.getContext("2d");
const tileSize = 32;
var xSize = parseInt(document.getElementById("xsize").value, 10);
var ySize = parseInt(document.getElementById("ysize").value, 10);
board.width = tileSize * xSize;
board.height = tileSize * ySize;

var snake, direct, newDirect, food, now, then, elapsed;
let requestId;
var fpsInterval = 1000 / parseInt(document.getElementById("speed").value, 10);

document.getElementById("start").addEventListener('click', () => {
    snake = [{x: 2, y: 0, img: snake_head_right}, {x: 1, y: 0, img: snake_straight}, {x: 0, y: 0, img: snake_tail_right}];
    direct = 'right';
    newDirect = 'right';
    food = null;
    document.getElementById("score").textContent = 0;
    then = Date.now();
    requestId = requestAnimationFrame(animateGame);
});

function animateGame(){
    now = Date.now(); 
    elapsed = now - then;
    if(elapsed > fpsInterval){
        drawBackGround();
        draw();
        addFood();
        move();
        addToSnake();
        then = now - (elapsed % fpsInterval);
    }
    requestId = window.requestAnimationFrame(animateGame);
    youWin();
    collision();
}

window.addEventListener('keydown', (event) => {
    console.log(event.code)
    switch(event.code){
        case 'ArrowDown' :
        case 'KeyS' :
            direct != 'up' ? newDirect = 'down' : newDirect = direct;
            break;
        case 'ArrowUp' :
        case 'KeyW' :
            direct != 'down' ? newDirect = 'up' : newDirect = direct;
            break;
        case 'ArrowRight' :
        case 'KeyD' :
            direct != 'left' ? newDirect = 'right' : newDirect = direct;    
            break;
        case 'ArrowLeft' :
        case 'KeyA' :
            direct != 'right' ? newDirect = 'left' : newDirect = direct;
            break;
        default:
            console.error('Invalid input', event.code);
    }
});

function addFood(){
    if(food === null){
        food = {x: Math.floor(Math.random() * xSize), y: Math.floor(Math.random() * ySize), img: apple};
        while(snake.find(element => element.x === food.x) && snake.find(element => element.y === food.y)){
            food = {x: Math.floor(Math.random() * xSize), y: Math.floor(Math.random() * ySize), img: apple};
        }
    }
    ctx.drawImage(food.img, food.x * tileSize, food.y * tileSize, tileSize, tileSize)
}

function move(){
    if(snake[snake.length - 2].img != snake_straight && snake[snake.length - 2].img.img != snake_up_down){
        snake[snake.length - 1]['img'] = tailImg(snake[snake.length - 1], snake[snake.length - 2]);
    }
    snake[snake.length - 1].x = snake[snake.length - 2].x;
    snake[snake.length - 1].y = snake[snake.length - 2].y;
    for(let i = snake.length - 2; i > 0; i--){
        snake[i] = {...snake[i - 1]};
    }
    switch(newDirect){
        case 'right':
            snake[0]["x"] += 1;
            snake[0]["img"] = snake_head_right;
            break;
        case 'left':
            snake[0]["x"] -= 1;
            snake[0]["img"] = snake_head_left;
            break;
        case 'up':
            snake[0]["y"] -= 1;
            snake[0]["img"] = snake_head_up;
            break;
        case 'down':
            snake[0]["y"] += 1;
            snake[0]["img"] = snake_head_down;
            break;
        default:
            console.error('Invalid input', direct);
    }
    var dictMoves = {rightright: snake_straight, upup: snake_up_down, downdown: snake_up_down,
                    leftleft: snake_straight, upright: snake_down_left, downright: snake_up_left,
                    upleft: snake_down_right, downleft: snake_up_right, rightdown: snake_down_right,
                    leftdown: snake_down_left, leftup: snake_up_left, rightup: snake_up_right};
    snake[1]["img"] = dictMoves[newDirect + direct];
    direct = newDirect;
}

var tailImg = (tail, snakePart) => {
    var img = tail.img;
    switch(snakePart.img){
        case snake_down_left :
            img = img === snake_tail_right ? snake_tail_up : snake_tail_left;
            return img;
        case snake_down_right :
            img = img === snake_tail_left ? snake_tail_up : snake_tail_right;
            return img;
        case snake_up_right :
            img = img === snake_tail_up ? snake_tail_right : snake_tail_down;
            return img;
        case snake_up_left :
            img = img === snake_tail_up ? snake_tail_left : snake_tail_down;
            return img;
        default:
            return img;
    }
}

function draw(){
    for(let i = 0; i < snake.length; i++){
        ctx.drawImage(snake[i]["img"], snake[i]["x"] * tileSize, snake[i]["y"] * tileSize, tileSize, tileSize);
    }
}

function addToSnake(){
    if(snake[0]["x"] === food.x && snake[0]["y"] === food.y){
        var temp = {...snake[snake.length - 1]}
        snake.push(temp);
        var score = document.getElementById('score')
        score.innerHTML = parseInt(score.textContent, 10) + 1;
        food = null;
    }
}

function drawBackGround(){
    console.log('hi')
    var groundType = true;
    for(let i = 0; i < xSize; i++){
        for(let j = 0; j < ySize; j++){
            groundType === true ? ctx.drawImage(ground2, i * tileSize, j * tileSize, tileSize, tileSize) : ctx.drawImage(ground1, i * tileSize, j * tileSize, tileSize, tileSize);
            groundType = groundType === true ? false : true;
        }
        groundType = (groundType === true)? false: true;
    }
}

function collision(){
    var head = snake[0];
    if(head.x < 0 || head.x > xSize - 1|| head.y < 0 || head.y > ySize - 1|| snake.slice(1, snake.length - 1).find(element => element.x === head.x && element.y === head.y)) {
        console.log('Collision detected');
        for(let i = 0; i < snake.length; i++){
            delete snake[i];
        };
        window.cancelAnimationFrame(requestId);
        ctx.font = (board.width / 7) + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", (xSize * tileSize) / 2, (ySize * tileSize) / 2);
        newRecord()
        return true;
    }
}

function youWin(){
    if(snake.length === ySize * xSize){
        console.log("You Win");
        for(let i = 0; i < snake.length; i++){
            delete snake[i];
        };
        window.cancelAnimationFrame(requestId);
        ctx.font = (board.width / 7) + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Winner!", (xSize * tileSize) / 2, (ySize * tileSize) / 2);
        newRecord()
        return;
    }
}

function newRecord(){
    var score = document.getElementById("score");
    var record = document.getElementById("record");
    if(parseInt(score.textContent, 10) > parseInt(record.textContent, 10)){
        record.textContent = score.textContent;
    }
}

document.getElementById("speed").addEventListener("mousemove", () => sliderInput("speed", 2, 14));

document.getElementById("xsize").addEventListener("mousemove", () => sliderInput("xsize", 8, 16));

document.getElementById("ysize").addEventListener("mousemove", () => sliderInput("ysize", 8, 16));

function sliderInput(id, min, max){
    var element = document.getElementById(id);
    var colorValue = ((parseInt(element.value, 10) - min) / (max - min)) * 100;
    element.style.background = `linear-gradient(90deg, rgb(255, 98, 98), white ${colorValue + 10}%)`;
}

document.getElementById('save').addEventListener('click', () => {
    xSize = parseInt(document.getElementById("xsize").value, 10); 
    xSize += xSize % 2 != 0 ? 1 : 0;
    ySize = parseInt(document.getElementById("ysize").value, 10);
    ySize += ySize % 2 != 0 ? 1 : 0;
    fpsInterval = 1000 / parseInt(document.getElementById("speed").value, 10);
    board.width = tileSize * xSize;
    board.height = tileSize * ySize;
    drawBackGround();
});