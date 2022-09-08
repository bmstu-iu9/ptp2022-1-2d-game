const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
var figureSequence = [];

// с помощью двумерного массива следим за тем, что находится в каждой клетке игрового поля
// размер поля — 10 на 20 (канвас 320 на 640), и несколько строк ещё находится за видимой областью
var playfield = [];

// заполняем сразу массив пустыми ячейками
for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

const figures = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'O': [
        [1, 1],
        [1, 1],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ]
};


const colors = {
    'I': 'black',
    'O': 'saddlebrown',
    'T': 'peru',
    'S': 'sienna',
    'Z': 'chocolate',
    'J': 'grey',
    'L': 'brown'
};

let count = 0;
// текущая фигура
let figure = getNextFigure();
let rAF = null;
let gameOver = false;
let score = 0;

//showGameOver();
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        figureSequence.push(name);
    }
}

function getNextFigure() {
    if (figureSequence.length === 0) {
        generateSequence();
    }

    const name = figureSequence.pop();
    const matrix = figures[name];

    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
    const row = name === 'I' ? -1 : -2;

    return {
        name: name,
        matrix: matrix,  // матрица с фигурой
        row: row,        // текущая строка (фигуры стартуют за видимой областью холста)
        col: col         // текущий столбец
    };
}

function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    return result;
}

function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                playfield[cellRow + row][cellCol + col])
            ) {
                return false;
            }
        }
    }
    return true;
}

function placeFigure() {
    for (let row = 0; row < figure.matrix.length; row++) {
        for (let col = 0; col < figure.matrix[row].length; col++) {
            if (figure.matrix[row][col]) {

                if (figure.row + row < 0) {
                    return showGameOver();
                }
                playfield[figure.row + row][figure.col + col] = figure.name;
            }
        }
    }

    let c = 0;

    for (let row = playfield.length - 1; row >= 0;) {
        if (playfield[row].every(cell => !!cell)) {

            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r - 1][c];
                }
            }
            c++;
        }
        else {
            row--;
        }
    }
    if (c === 4) score += 1500;
    else if (c === 3) score += 700
    else if (c === 2) score += 300
    else if (c === 1) score += 100
    figure = getNextFigure();
}

function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '55px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 + 5);
}

document.addEventListener('keydown', function (e) {
    if (gameOver) return;

    if (e.which === 37 || e.which === 39) {
        const col = e.which === 37 ? figure.col - 1 : figure.col + 1;
        if (isValidMove(figure.matrix, figure.row, col)) {
            figure.col = col;
        }
    }

    // стрелка вверх — поворот
    if (e.which === 38) {
        const matrix = rotate(figure.matrix);
        if (isValidMove(matrix, figure.row, figure.col)) {
            figure.matrix = matrix;
        }
    }

    // стрелка вниз — ускорить падение
    if (e.which === 40) {
        const row = figure.row + 1;
        if (!isValidMove(figure.matrix, row, figure.col)) {
            figure.row = row - 1;
            placeFigure();
            return;
        }
        figure.row = row;
    }
});

// главный цикл игры
function loop() {
    // начинаем анимацию
    rAF = requestAnimationFrame(loop);
    // очищаем холст
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];
                context.fillRect(col * grid, row * grid, grid, grid);
            }
        }
    }

    let boost = score/500;


    if (figure) {

        // фигура сдвигается вниз каждые 25 кадров
        if (++count > 35 - boost*5) {
            figure.row++;
            count = 0;

            if (!isValidMove(figure.matrix, figure.row, figure.col)) {
                figure.row--;
                placeFigure();
            }
        }

        context.fillStyle = colors[figure.name];

        for (let row = 0; row < figure.matrix.length; row++) {
            for (let col = 0; col < figure.matrix[row].length; col++) {
                if (figure.matrix[row][col]) {
                    context.fillRect((figure.col + col) * grid, (figure.row + row) * grid, grid, grid);
                }
            }
        }
    }

    let text = "Score: "+ score;
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, 640, canvas.width, 32);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '32px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height-14);
}

rAF = requestAnimationFrame(loop);
