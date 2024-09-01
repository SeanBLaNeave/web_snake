const board = document.getElementById("board");
const ctx = board.getContext("2d");
const height = 576;
const width = 576;
board.width = width;
board.height = height;
const tileSize = 32;

const snake_head_right = new Image();
snake_head_right.src = "/img/snake-head-right.png";
const snake_head_left = new Image();
snake_head_left.src = "/img/snake-head-left.png";
const snake_head_up = new Image();
snake_head_up.src = "/img/snake-head-up.png";
const snake_head_down = new Image();
snake_head_down.src = "/img/snake-head-down.png";
const snake_down_right = new Image();
snake_down_right.src = "/img/snake-down-right.png";
const snake_down_left = new Image();
snake_down_left.src = "/img/snake-down-left.png";
const snake_up_right = new Image();
snake_up_right.src = "/img/snake-up-right.png";
const snake_up_left = new Image();
snake_up_left.src = "/img/snake-up-left.png";
const snake_straight = new Image();
snake_straight.src = "/img/snake-straight.png";
const snake_up_down = new Image();
snake_up_down.src = "/img/snake-up-down.png";
const apple = new Image();
apple.src = "/img/apple.png";
const ground1 = new Image()
ground1.src = "/img/ground1.png"
const ground2 = new Image()
ground2.src = "/img/ground2.png"
const snake_tail_right = new Image();
snake_tail_right.src = "/img/snake-tail-right.png";
const snake_tail_left = new Image();
snake_tail_left.src = "/img/snake-tail-left.png";
const snake_tail_up = new Image();
snake_tail_up.src = "/img/snake-tail-up.png";
const snake_tail_down = new Image();
snake_tail_down.src = "/img/snake-tail-bottom.png";


const snake = [{x: 2, y: 0, img: snake_head_right}, {x: 1, y: 0, img: snake_straight}, {x: 0, y: 0, img: snake_tail_right}];
var direct = 'right';
var newDirect = 'right';
var count = 0;
var food = null;
let requestId;
var fpsInterval, now, then, elapsed; 

function startGame(){
    fpsInterval = 1000 / 10; 
    then = Date.now();
    requestId = requestAnimationFrame(animateGame);
}

function animateGame(){
    now = Date.now(); 
    elapsed = now - then;
    if(elapsed > fpsInterval){
        drawBackGround();
        draw();
        addFood()
        move();
        addToSnake();
        then = now - (elapsed % fpsInterval);
    }
    requestId = window.requestAnimationFrame(animateGame);
    collision();
}

window.addEventListener('keydown', (event) => {
    switch(event.code){
        case 'KeyS' :
            direct != 'up' ? newDirect = 'down' : newDirect = direct;
            break;
        case 'KeyW' :
            direct != 'down' ? newDirect = 'up' : newDirect = direct;
            break;
        case 'KeyD' :
            direct != 'left' ? newDirect = 'right' : newDirect = direct;    
            break;
        case 'KeyA' :
            direct != 'right' ? newDirect = 'left' : newDirect = direct;
            break;
        default:
            console.error('Invalid input', event.code);
    }
});

function addFood(){
    if(food === null){
        food = {x: Math.floor(Math.random() * 18), y: Math.floor(Math.random() * 18), img: apple};
        while(snake.find(element => element.x === food.x) && snake.find(element => element.y === food.y)){
            food = {x: Math.floor(Math.random() * 18), y: Math.floor(Math.random() * 18), img: apple};
        }
    }
    ctx.drawImage(food.img, food.x * tileSize, food.y * tileSize, tileSize, tileSize)
}

function move(){
    var temp = {...snake[1]};
    snake[1] = {...snake[0]};
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
    for(let i = 2; i < snake.length; i++){
        var newTemp = {...snake[i]};
        if(i === (snake.length - 1)){
            snake[i]['x'] = temp.x;
            snake[i]['y'] = temp.y;
            if(temp.img != snake_straight || temp.img != snake_up_down){
                snake[i]['img'] = tailImg(snake[i], temp);
            }
        }else{
            snake[i] = temp;
        }
        temp = newTemp;
    }
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
        food = null
    }
}

function drawBackGround(){
    var groundType = true;
    for(let i = 0; i < 18; i++){
        for(let j = 0; j < 18; j++){
            if(groundType){
                ctx.drawImage(ground2, i * tileSize, j * tileSize, tileSize, tileSize);
                groundType = false;
            }else{
                ctx.drawImage(ground1, i * tileSize, j * tileSize, tileSize, tileSize);
                groundType = true;
            }
        }
        groundType = (groundType === true)? false: true;
    }
}

function collision() {
    var head = snake[0];
    if (head.x < 0 || head.x > 17 || head.y < 0 || head.y > 17 || snake.slice(1, snake.length - 1).find(element => element.x === head.x && element.y === head.y)) {
        console.log('Collision detected');
        window.cancelAnimationFrame(requestId);
        ctx.font = "80px Arial";
        ctx.textAlign = "center"
        ctx.fillText("Game Over", (18 * tileSize) / 2, (18 * tileSize) / 2);
        return;
    }
}