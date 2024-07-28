var board = document.getElementById("board");
var ctx = board.getContext("2d");
ctx.fillStyle = "red";
addRect();

window.addEventListener('keydown', keyClick);

function keyClick(event){
    var key = event;
    console.log(key);
}

function addRect(){
    ctx.fillStyle = "red";
    var x = 0;
    var y = 0;
    for(let i = 0; i < 10; i++){
        ctx.fillRect(y, x, 20, 20)
        y += 20;
    }
}