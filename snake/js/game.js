const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";

var head = new Image();
head.src = "img/head.png";
//head.style.transform = 'rotate(180deg)';
const tail = new Image();
tail.src = "img/tail.png";

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
  y: 10 * box - 5,
  condition: 3
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
  if((event.keyCode == 37 ||  event.keyCode == 65) && dir != "right"){
    dir = "left";
    snake[0].condition = 3;

  } else{ if((event.keyCode == 38 ||  event.keyCode == 87) && dir != "down"){
    dir = "up";
    snake[0].condition = 0;
    
  } else{ if((event.keyCode == 39 ||  event.keyCode == 68) && dir != "left"){
    dir = "right";
    snake[0].condition = 1;
    
  } else{ if((event.keyCode == 40 ||  event.keyCode == 83) && dir != "up"){
    dir = "down";
    snake[0].condition = 2;
    
  }}}}}
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
  if (goes!=0){
  goes = 0;
  dir = "";
  score = 0;

  // max speed be written later;

  snake = [];
  snake[0] = {
    x: 9 * box - 4,
    y: 10 * box - 5,
    condition: 3
  };
  food = {
    x: Math.floor(Math.random() * 15 + 2) * box -4,
    y: Math.floor(Math.random() * 15 + 3) * box -5,
  };
  speed = maxSpeed;
  requestAnimationFrame(start);
  }
}


function start(){
  ctx.drawImage(ground, 0, 0);
  ctx.drawImage(head, 9 * box - 4, 10 * box - 5, box, box);
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
  let cond = 0;
    if (dir == "left") {snakeX -= box; cond = 3;}
    if (dir == "right") {snakeX += box; cond = 1;}
    if (dir == "up") {snakeY -= box; cond = 0;}
    if (dir == "down") {snakeY += box; cond = 2;}

    let newHead = {
      x: snakeX,
      y: snakeY,
	condition: cond
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
  //ctx.drawImage(head, snake[0].x, snake[0].y,box,box);
  ctx.drawImage(foodImg, food.x, food.y);  
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.5, box * 1.7)

  if (goes != 0){
    for (let i = 1; i < snake.length -1; i++) {
      ctx.fillStyle = "darkorange";
	if (snake[i].condition == snake[i+1].condition){
		if (snake[i].condition % 2 == 0){
			ctx.fillRect(snake[i].x+box*0.25, snake[i].y, box*0.5, box);
		} else{
			ctx.fillRect(snake[i].x, snake[i].y+box*0.25, box, box*0.5);
		}
	} else{
      	ctx.fillRect(snake[i].x+box*0.25, snake[i].y+box*0.25, box*0.5, box*0.5);
		if (snake[i].condition == 0){
			ctx.fillRect(snake[i].x+box*0.25, snake[i].y, box*0.5, box*0.5);
		} else{ if (snake[i].condition == 1){
			ctx.fillRect(snake[i].x+box*0.5, snake[i].y+box*0.25, box*0.5, box*0.5);
		} else{ if (snake[i].condition == 2){
			ctx.fillRect(snake[i].x+box*0.25, snake[i].y+box*0.5, box*0.5, box*0.5);
		} else{ if (snake[i].condition == 3){
			ctx.fillRect(snake[i].x, snake[i].y+box*0.25, box*0.5, box*0.5);
		}}}}
		if (snake[i+1].condition == 2){
			ctx.fillRect(snake[i].x+box*0.25, snake[i].y, box*0.5, box*0.5);
		} else{ if (snake[i+1].condition == 3){
			ctx.fillRect(snake[i].x+box*0.5, snake[i].y+box*0.25, box*0.5, box*0.5);
		} else{ if (snake[i+1].condition == 0){
			ctx.fillRect(snake[i].x+box*0.25, snake[i].y+box*0.5, box*0.5, box*0.5);
		} else{ if (snake[i+1].condition == 1){
			ctx.fillRect(snake[i].x, snake[i].y+box*0.25, box*0.5, box*0.5);
		}}}}
	}
    }

    if (snake[snake.length -1].condition == 0){
	ctx.save();
	ctx.rotate(Math.PI/2);
	ctx.drawImage(tail, snake[snake.length -1].y, -snake[snake.length -1].x-box, box, box);
	ctx.restore();

    } else{ if(snake[snake.length -1].condition == 1){
	ctx.save();
	ctx.rotate(Math.PI);
	ctx.drawImage(tail, -snake[snake.length -1].x-box, -snake[snake.length -1].y-box, box, box);
	ctx.restore();

    } else{ if(snake[snake.length -1].condition == 2){
	ctx.save();
	ctx.rotate(-Math.PI/2);
	ctx.drawImage(tail, -snake[snake.length -1].y-box, snake[snake.length -1].x, box, box);
	ctx.restore();

    } else{ if(snake[snake.length -1].condition == 3){
	ctx.drawImage(tail, snake[snake.length -1].x, snake[snake.length -1].y, box, box);
    }}}}


    if (dir == "up"){
	ctx.save();
	ctx.rotate(Math.PI/2);
	ctx.drawImage(head, snake[0].y, -snake[0].x-box,box,box);
	ctx.restore();

    } else{ if(dir == "right"){
	ctx.save();
	ctx.rotate(Math.PI);
	ctx.drawImage(head, -snake[0].x-box, -snake[0].y-box,box,box);
	ctx.restore();

    } else{ if(dir == "down"){
	ctx.save();
	ctx.rotate(-Math.PI/2);
	ctx.drawImage(head, -snake[0].y-box, snake[0].x,box,box);
	ctx.restore();

    } else{ if(dir == "left"){
	ctx.drawImage(head, snake[0].x, snake[0].y,box,box);
    }}}}

  } else{
    ctx.drawImage(head, snake[0].x, snake[0].y,box,box);
  }
    requestAnimationFrame(loop);
  }
  }
}


requestAnimationFrame(start);
