var canvas = document.getElementById('game');
var lvl = document.getElementById('Level');
var size = document.getElementById('Size');
var mine = new Image();
mine.src = "../resources/mine.png";

var context = canvas.getContext('2d');
//Стандартное поле - 9 на 9, стандартное количество мин - 10 (простой уровень сложности)
var actualWidth = 9;
var actualHeight = 9;

var grid = Math.floor(canvas.width/actualWidth);
var field = canvas.getBoundingClientRect();

var game = {
	goes: 0,
	cellsNumber: actualWidth,
	cells: [],
	openedCells: [],
	bombsNumber: 10,
	flagsNumber: 0,
	bombs: []
};


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
// Перерисовывание поля, когда открывается клетка
function redraw(){
	for (i = 0; i < actualWidth; i++){
		for (j = 0; j < actualHeight; j++){
			if (game.openedCells[i][j]==1){
				context.clearRect(i*grid, j*grid, grid, grid);
				if (game.cells[i][j]!=0){
					var s = "" + game.cells[i][j];
					context.fillStyle = "red";
					context.font=grid+"px Georgia";
					context.fillText(s,(i+0.25)*grid,(j+0.75)*grid);
				}
			}
			else if (game.openedCells[i][j]==2){
				context.clearRect(i*grid, j*grid, grid, grid);
				context.fillStyle = "purple";
				context.fillRect(i*grid + 1, j*grid + 1, grid - 1, grid - 1);
			}
			else if (game.openedCells[i][j]==0){
				context.clearRect(i*grid, j*grid, grid, grid);
				context.fillStyle = "gray";
				context.fillRect(i*grid + 1, j*grid + 1, grid - 1, grid - 1);
			}
		}
	}
}
//Проигравший должен видеть где были бомбы
function death(){
	for (i = 0; i < actualWidth; i++){
		for (j = 0; j < actualHeight; j++){
			if (game.cells[i][j]===9){
				context.clearRect(i*grid, j*grid, grid, grid);
				context.drawImage(mine, i*grid, j*grid,grid,grid);
				//context.fillStyle = "red";
				//context.fillRect(i*grid + 1, j*grid + 1, grid - 1, grid - 1);
			}
		}
	}
}
//Открывает клетку, а если 0, открывает окружающие клетки
function openCell(a,b){
	game.goes++;
	game.openedCells[a][b] = 1;
	if (game.cells[a][b] === 0){
		if ((a>0) && (b>0) && (game.openedCells[a-1][b-1]===0)){
			openCell(a-1,b-1);
		}
		if ((a>0) && (game.openedCells[a-1][b]===0)){
			openCell(a-1,b);
		}
		if ((a>0) && (b<actualWidth-1) && (game.openedCells[a-1][b+1]===0)){
			openCell(a-1,b+1);
		}
		if ((b>0) && (game.openedCells[a][b-1]===0)){
			openCell(a,b-1);
		}
		if ((b<actualWidth-1) && (game.openedCells[a][b+1]===0)){
			openCell(a,b+1);
		}
		if ((a<actualWidth-1) && (b>0) && (game.openedCells[a+1][b-1]===0)){
			openCell(a+1,b-1);
		}
		if ((a<actualWidth-1) && (game.openedCells[a+1][b]===0)){
			openCell(a+1,b);
		}
		if ((a<actualWidth-1) && (b<actualWidth-1) && (game.openedCells[a+1][b+1]===0)){
			openCell(a+1,b+1);
		}
	}
}

// Возвращение всех параметров в изначальное положение после окончания игры
function restart() {
	lvl = document.getElementById('Level');
	size = document.getElementById('Size');
	if (size.value!=""){
		if ((size.value>60)||(size.value<3)){
			alert("Введите количество клеток от трех до шестидесяти. \nХотя при шестидесяти клетках на 540 пикселей вы сломаете себе глаза.");
			actualWidth=9;
			actualHeight=9;
			grid=Math.floor(canvas.width/actualWidth);
			game.cellsNumber = actualWidth;
		}else{
			grid=Math.floor(canvas.width/size.value);
			actualWidth=Math.floor(canvas.width/grid);
			actualHeight=Math.floor(canvas.width/grid);
			game.cellsNumber = actualWidth;
		}
	}
	if (lvl.value!=""){
		if ((lvl.value<1)||(lvl.value>9)){
			alert("Введите уровень сложности от одного до девяти. \nУровень сложности - это десятая часть от процентного соотношения заминированных клеток к полю.");
			game.bombsNumber=Math.floor(actualWidth*actualHeight/10);
		}else{
			game.bombsNumber=Math.floor(actualWidth*actualHeight*lvl.value/10);
			if (game.bombsNumber===0){
				game.bombsNumber = 1;
			}
		}
	}

	game.goes = 0;
	game.cells = new Array(actualWidth);
	game.openedCells = new Array(actualWidth);
	game.bombs = new Array(game.bombsNumber);
	for (i = 0; i < actualWidth; i++){
		game.cells[i] = new Array(actualHeight);
		game.openedCells[i] = new Array(actualHeight);
	}
	for (i = 0; i < game.bombsNumber; i++){
		game.bombs[i] = getRandomInt(0, actualWidth*actualHeight);
		for (j = 0; j < i; j++){
			if (game.bombs[i]===game.bombs[j]){
				i--;
				break;
			}
		}
		var a = Math.floor(game.bombs[i]/actualHeight);
		var b = game.bombs[i]-(a*actualHeight);
		game.cells[a][b] = 9;
	}
	for (i = 0; i < actualWidth; i++){
		for (j = 0; j < actualHeight; j++){
			game.openedCells[i][j] = 0;
			if (game.cells[i][j]!=9){
				var count = 0;
				if ((i>0)&&(j>0)&&(game.cells[i-1][j-1]===9)){
					count++;
				}
				if ((i>0)&&(game.cells[i-1][j]===9)){
					count++;
				}
				if ((i>0)&&(j<actualWidth-1)&&(game.cells[i-1][j+1]===9)){
					count++;
				}
				if ((j>0)&&(game.cells[i][j-1]===9)){
					count++;
				}
				if ((j<actualWidth-1)&&(game.cells[i][j+1]===9)){
					count++;
				}
				if ((i<actualWidth-1)&&(j>0)&&(game.cells[i+1][j-1]===9)){
					count++;
				}
				if ((i<actualWidth-1)&&(game.cells[i+1][j]===9)){
					count++;
				}
				if ((i<actualWidth-1)&&(j<actualWidth-1)&&(game.cells[i+1][j+1]===9)){
					count++;
				}
				game.cells[i][j] = count;
			}
		}
	}
}
//Прорисовка поля в начале игры
function drawRestart() {
	restart();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "gray";
	for (i = 0; i < actualWidth; i++){
		for (j = 0; j < actualHeight; j++){
			context.fillRect(i*grid + 1, j*grid + 1, grid - 1, grid - 1);
		}
	}
}
function showMines(){
	alert(game.bombsNumber-game.flagsNumber);
}

//Обработка щелчков мыши
document.addEventListener('mousedown', function (e) {
	field = canvas.getBoundingClientRect();
	if (game.goes===-1){
		requestAnimationFrame(drawRestart());
	}
	else if ((e.clientX<=field.right) && (e.clientX>=field.left) && (e.clientY<=field.bottom) && (e.clientY>=field.top)){
		grid = Math.floor(canvas.width/actualWidth);
		var actualX = Math.floor((e.clientX-field.left)/grid);
		var actualY = Math.floor((e.clientY-field.top)/grid);
		if (e.which==1){
			if ((game.cells[actualX][actualY]===9) && (game.goes!=0) && (game.openedCells[actualX][actualY]===0)){
				alert("You died");
				game.goes = -1;
				requestAnimationFrame(death());
			}
			else if (game.cells[actualX][actualY]===9){
				while (game.goes===0){
					if (game.cells[actualX][actualY]===9){
						restart();
					}
					else{
						openCell(actualX,actualY);
					}
				}
				requestAnimationFrame(redraw());
			}
			else if (game.openedCells[actualX][actualY]===0){
				openCell(actualX,actualY);
				if (game.goes===((game.cellsNumber*game.cellsNumber)-game.bombsNumber)){
					alert("You win!");
				}
				requestAnimationFrame(redraw());
			}
		}
		// Поставить флажок и убрать флажок.
		else if (e.which==2){
			if (game.openedCells[actualX][actualY]===0){
				game.openedCells[actualX][actualY]=2;
				game.flagsNumber++;
				requestAnimationFrame(redraw());
			}
			else if (game.openedCells[actualX][actualY]===2){
				game.openedCells[actualX][actualY]=0;
				game.flagsNumber--;
				requestAnimationFrame(redraw());
			}
			//Вы когда-то видели такую штуку, где если нажать на цифорку, а все ее флажки проставлены, оно само откроет все остальные клетки?
			else if (game.openedCells[actualX][actualY]===1){
				var i = actualX;
				var j = actualY;
				var count = 0;
				if ((i>0)&&(j>0)&&(game.openedCells[i-1][j-1]===2)){
					count++;
				}
				if ((i>0)&&(game.openedCells[i-1][j]===2)){
					count++;
				}
				if ((i>0)&&(j<actualWidth-1)&&(game.openedCells[i-1][j+1]===2)){
					count++;
				}
				if ((j>0)&&(game.openedCells[i][j-1]===2)){
					count++;
				}
				if ((j<actualWidth-1)&&(game.openedCells[i][j+1]===2)){
					count++;
				}
				if ((i<actualWidth-1)&&(j>0)&&(game.openedCells[i+1][j-1]===2)){
					count++;
				}
				if ((i<actualWidth-1)&&(game.openedCells[i+1][j]===2)){
					count++;
				}
				if ((i<actualWidth-1)&&(j<actualWidth-1)&&(game.openedCells[i+1][j+1]===2)){
					count++;
				}

				if  (count===game.cells[actualX][actualY]){
					if ((i>0)&&(j>0)&&(game.openedCells[i-1][j-1]===0)){
						if (game.cells[i-1][j-1]===9){
							alert("You died");
							game.goes = -1;
							requestAnimationFrame(death());
						} else{
							openCell(i-1,j-1);
						}
					}
					if ((i>0)&&(game.openedCells[i-1][j]===0)){
						if (game.cells[i-1][j]===9){
							alert("You died");
							game.goes = -1;
							requestAnimationFrame(death());
						} else{
							openCell(i-1,j);
						}
					}
					if ((i>0)&&(j<actualWidth-1)&&(game.openedCells[i-1][j+1]===0)){
						if (game.cells[i-1][j+1]===9){
							alert("You died");
							game.goes = -1;
							requestAnimationFrame(death());
						} else{
							openCell(i-1,j+1);
						}
					}
					if ((j>0)&&(game.openedCells[i][j-1]===0)){
						if (game.cells[i][j-1]===9){
							alert("You died");
							game.goes = -1;
							requestAnimationFrame(death());
						} else{
							openCell(i,j-1);
						}					}
					if ((j<actualWidth-1)&&(game.openedCells[i][j+1]===0)){
						if (game.cells[i][j+1]===9){
							alert("You died");
							game.goes = -1;
							requestAnimationFrame(death());
						} else{
							openCell(i,j+1);
						}
					}
					if ((i<actualWidth-1)&&(j>0)&&(game.openedCells[i+1][j-1]===0)){
						if (game.cells[i+1][j-1]===9){
							alert("You died");
							game.goes = -1;
							requestAnimationFrame(death());
						} else{
							openCell(i+1,j-1);
						}
					}
					if ((i<actualWidth-1)&&(game.openedCells[i+1][j]===0)){
						if (game.cells[i+1][j]===9){
							alert("You died");
							game.goes = -1;
							requestAnimationFrame(death());
						} else{
							openCell(i+1,j);
						}
					}
					if ((i<actualWidth-1)&&(j<actualWidth-1)&&(game.openedCells[i+1][j+1]===0)){
						if (game.cells[i+1][j+1]===9){
							alert("You died");
							game.goes = -1;
							requestAnimationFrame(death());
						} else{
							openCell(i+1,j+1);
						}
					}
				}
				if (game.goes===((game.cellsNumber*game.cellsNumber)-game.bombsNumber)){
					alert("You win!");
				}
				requestAnimationFrame(redraw());
			}
		}
	}
});

requestAnimationFrame(drawRestart());

