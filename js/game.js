const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

let box = 32;

let score = 0;

let food = {
  x: Math.floor(Math.random() * 15 + 2) * box -4,
  y: Math.floor(Math.random() * 15 + 3) * box -5,
};

let goes = 0;
let maxSpeed = 6;
let speed = maxSpeed;

let snake = [];
snake[0] = {
  x: 9 * box - 4,
  y: 10 * box - 5
};


document.addEventListener("keydown", direction);

let dir = "";

function direction(event) {
  if (goes == -1){
    restart();
  } else {
  if (goes == 0){
    snake[1] = {
      x: 9 * box - 4,
      y: 10 * box - 5
    };
    goes = 1;
  }
  if((event.keyCode == 37 ||  event.keyCode == 65) && dir != "right")
    dir = "left";
  else if((event.keyCode == 38 ||  event.keyCode == 87) && dir != "down")
    dir = "up";
  else if((event.keyCode == 39 ||  event.keyCode == 68) && dir != "left")
    dir = "right";
  else if((event.keyCode == 40 ||  event.keyCode == 83) && dir != "up")
    dir = "down";
  }
}

function eatTail(){
  for( let i = 1; i < snake.length; i++){
    if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
	goes = -1;
	alert("you died");
      return;
    }
  }
}
function restart (){
  goes = 0;
  dir = "";
  score = 0;
  speed = maxSpeed;

  // max speed be written later;

  snake = [];
  snake[0] = {
    x: 9 * box - 4,
    y: 10 * box - 5
  };
  food = {
    x: Math.floor(Math.random() * 15 + 2) * box -4,
    y: Math.floor(Math.random() * 15 + 3) * box -5,
  };
  requestAnimationFrame(start);
}


function start(){
  ctx.drawImage(ground, 0, 0);
  ctx.fillStyle = "red";
  ctx.fillRect(snake[0].x, snake[0].y, box, box);
  while ((food.x == (9 * box - 4))&&(food.y == (10 * box - 5))){
    food = {
      x: Math.floor(Math.random() * 15 + 2) * box -4,
      y: Math.floor(Math.random() * 15 + 3) * box -5,
    };
  }
  ctx.drawImage(foodImg, food.x, food.y);
  requestAnimationFrame(loop);
}

function loop (){
  if (speed < maxSpeed){
    speed++;
    requestAnimationFrame(loop);
  }else{
  speed = 0;

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;
    let newHead = {
      x: snakeX,
      y: snakeY
    };
    if (goes == 2){
      eatTail(newHead, snake);
    }
    if ((dir!="")&&(goes!=-1)) goes = 2;
    snake.unshift(newHead);
  if((goes == 2)&&(snakeX < box -4 || snakeX > box * 17 -4 || snakeY < box * 2 -5 || snakeY > box * 18 -5)){
    goes = -1;
    alert("you died");
    return;
  }

  if(snakeX == food.x && snakeY == food.y) {
    score ++;
    let x1=0;
    let y1=0;
    while (x1==0){
	x1 = Math.floor(Math.random() * 15 + 2) * box -4;
  	y1 = Math.floor(Math.random() * 15 + 3) * box -5;
	for (let i = 0; i < snake.length; i++){
	  if ((x1==snake[i].x)&&(y1==snake[i].y)) x1=0;
	}
    }
    food = {
  	x: x1,
  	y: y1,
    };
  } else {
    snake.pop();
  }

  if (goes != -1){
//Перерисовка поля
  ctx.clearRect(box,box*3,box*17,box*17);
  ctx.drawImage(ground, 0, 0);
  ctx.drawImage(foodImg, food.x, food.y);
  if (goes != 0){
    for (let i = 1; i < snake.length; i++) {
      ctx.fillStyle = "orange";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }
  ctx.fillStyle = "red";
  ctx.fillRect(snake[0].x, snake[0].y, box, box);
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.5, box * 1.7)

    requestAnimationFrame(loop);
  }
  }
}


requestAnimationFrame(start);
