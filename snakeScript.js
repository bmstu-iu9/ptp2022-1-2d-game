// Поле, на котором всё будет происходить, — тоже как бы переменная
var canvas = document.getElementById('game');
// Классическая змейка — двухмерная, сделаем такую же
var context = canvas.getContext('2d');
// Размер одной клеточки на поле — 16 пикселей
var grid = 16;
// Служебная переменная, которая отвечает за скорость змейки
var count = 0;
// Результаты
var score = 0;
var highScore = 0;
// А вот и сама змейка
var snake = {
	// Началась ли игра (пока не началась)
	goes: 0,
	// Начальные координаты
	x: 192,
	y: 192,
	// Скорость змейки — в каждом новом кадре змейка смещается по оси Х или У. На старте будет двигаться горизонтально, поэтому скорость по игреку равна нулю.
	dx: 0,
	dy: 0,
	// Тащим за собой хвост, который пока пустой
	cells: [],
	// Стартовая длина змейки — 4 клеточки
	maxCells: 4
};
// А это — еда. Представим, что это красные яблоки.
var apple = {
	// Ставим яблочко в случайное место
	x: getRandomInt(0, 25) * grid,
	y: getRandomInt(0, 25) * grid
};
var bomb = {
	// Ставим бомбу в случайное место
	x: getRandomInt(0, 25) * grid,
	y: getRandomInt(0, 25) * grid
};
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
// Возвращение всех параметров в изначальное положение после окончания игры
function restart() {
	snake.goes = 0;
	snake.x = 192;
	snake.y = 192;
	snake.cells = [];
	snake.maxCells = 4;
	snake.dx = 0;
	snake.dy = 0;
	apple.x = getRandomInt(0, 25) * grid;
	apple.y = getRandomInt(0, 25) * grid;
	bomb.x = getRandomInt(0, 25) * grid;
      bomb.y = getRandomInt(0, 25) * grid;
	if (score>highScore){
		alert ("Новый рекорд! \n\nВаш результат "+score*100+" очков!");
		highScore = score;
	}
	else{
		alert ("Ваш результат "+score*100+" очков!");
	}
	score = 0;
}
function loop() {
	// Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 10. Для этого она пропускает пять кадров из шести, то есть срабатывает каждый шестой кадр игры. Было 60 кадров в секунду, станет 10.
	requestAnimationFrame(loop);
	// Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет.
	if (++count < 6) {
		return;
	}
	// Обнуляем переменную скорости
	count = 0;
	// Очищаем игровое поле
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Двигаем змейку с нужной скоростью
	snake.x += snake.dx;
	snake.y += snake.dy;
	// Если змейка достигла края поля по горизонтали — убиваем ее
	if (snake.x < 0) {
		restart();
	} else if (snake.x >= canvas.width) {
		restart();
	}
	// Делаем то же самое для движения по вертикали
	if (snake.y < 0) {
		restart();
	} else if (snake.y >= canvas.height) {
		restart();
	}
	// Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку.
	snake.cells.unshift({ x: snake.x, y: snake.y });
	// Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно особождает клетки после себя
	if (snake.cells.length > snake.maxCells) {
		snake.cells.pop();
	}
	// Рисуем еду — красное яблоко
	context.fillStyle = 'red';
	context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
	context.fillStyle = 'black';
	context.fillRect(bomb.x, bomb.y, grid - 1, grid - 1);
	// Одно движение змейки — один новый нарисованный квадратик 
	context.fillStyle = 'green';
	// Обрабатываем столкновение змейки с обЪектами
	if (snake.cells[0].x===bomb.x && snake.cells[0].y===bomb.y){
		restart();
	}
	// Если змейка добралась до яблока...
	if (snake.cells[0].x===apple.x && snake.cells[0].y===apple.y){
		// увеличиваем длину змейки
      	snake.maxCells++;
		score++;
      	// Рисуем новое яблочко
      	// Помним, что размер холста у нас 400x400, при этом он разбит на ячейки — 25 в каждую сторону
      	apple.x = getRandomInt(0, 25) * grid;
      	apple.y = getRandomInt(0, 25) * grid;
		bomb.x = getRandomInt(0, 25) * grid;
      	bomb.y = getRandomInt(0, 25) * grid;
	}

	// Обрабатываем каждый элемент змейки
	snake.cells.forEach(function (cell, index) {
		// Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, чтобы вокруг них образовалась чёрная граница
		context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
		// Проверяем, не столкнулась ли змея сама с собой
		// Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две клетки с одинаковыми координатами 
		for (var i = index + 1; i < snake.cells.length; i++) {
		// Если такие клетки есть — начинаем игру заново
			if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y && snake.goes>3) {
				restart();
			}
		}
	});
}
// Я как обычно не могу выбрать адекватный подход к ее движению
if (snake.goes===5){
	snake.geoes--;
}
// Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
document.addEventListener('keydown', function (e) {
	// Дополнительно проверяем такой момент: если змейка движется, например, влево, то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону, что и раньше. Это сделано для того, чтобы не разворачивать весь массив со змейкой на лету и не усложнять код игры.
	// Стрелка влево
	if ((snake.dx === 0) && (e.which === 37 || e.which === 65)) {
		snake.dx = -grid;
		snake.dy = 0;
		snake.goes++;
	}
	// Стрелка вправо
	else if ((snake.dx === 0) && (e.which === 39 || e.which === 68)){
		snake.dx = grid;
		snake.dy = 0;
		snake.goes++;
	}
	// Стрелка вверх
	else if ((snake.dy === 0) && (e.which === 38 || e.which === 87)){
		snake.dy = -grid;
		snake.dx = 0;
		snake.goes++;
	}
	// Стрелка вниз
	else if ((snake.dy === 0) && (e.which === 40 || e.which === 83)) {
		snake.dy = grid;
		snake.dx = 0;
		snake.goes++;
	}
});
requestAnimationFrame(loop);
