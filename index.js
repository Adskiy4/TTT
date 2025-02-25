const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let playerSymbol = CROSS;
let gameOver = false;
let fieldSize = 3;
let gameField = createEmptyField(fieldSize);

startGame();
addResetListener();

function startGame() {
    renderGrid(fieldSize);
}

function createEmptyField(size) {
    return [[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY]
    ];
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = gameField[i][j];
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    if (gameOver || gameField[row][col] !== EMPTY) return;

    gameField[row][col] = playerSymbol;
    renderSymbolInCell(playerSymbol, row, col);

    if (checkWin(playerSymbol)) {
        gameOver = true;
        alert(`Победил ${playerSymbol}`);
        // highlightWinningCells(playerSymbol);
        return;
    }

    if (checkDraw()) {
        gameOver = true;
        alert('Победила дружба');
        return;
    }

    playerSymbol = playerSymbol === CROSS ? ZERO : CROSS;

    if (playerSymbol === ZERO) {
        makeAIMove();
    }
}

function checkWin(playerSymbol) {

    let winningCells = [];
    let diag = true;
    if (gameField.every((row, index) => row[index] === playerSymbol)){
        winningCells = gameField.map((_, i) => [i, j]);
        highlightWinningCells(playerSymbol,winningCells);
        return true;
    }

    for (let i = 0; i < fieldSize; i++) {
        if (gameField[i].every(cell => cell === playerSymbol)){
            for (let j = 0; j < fieldSize; j++){
            winningCells = gameField.map((_, i) => [j,i]);}

            highlightWinningCells(playerSymbol,winningCells);
            console.log(1231231);
            return true;
        }
    }

    for (let j = 0; j < fieldSize; j++) {
        if (gameField.every(row => row[j] === playerSymbol)){ 
            winningCells = gameField.map((_, i) => [i, j]);
            highlightWinningCells(playerSymbol,winningCells);
            return true;
        }
    }

    for (let j = 0; j < fieldSize; j++){
        if (gameField[j][j] != playerSymbol) diag = false;
        else
        {
            winningCells.push([j,j]);
        }
    }
    if (diag){
        highlightWinningCells(playerSymbol,winningCells);
        return true;
    }
    
    for (let j = fieldSize - 1; j >= 0; j--){
        if (gameField[j][j] != playerSymbol) diag = false;
        else
        {
            winningCells.push([j,j]);
        }
    }
    if (diag){ 
        highlightWinningCells(playerSymbol,winningCells)
        return true;
    }

    return false;
}

function checkDraw() {
    return gameField.every(row => row.every(cell => cell !== EMPTY));
}

function highlightWinningCells(player, winningCells) {
    winningCells.forEach(([i, j]) => {
        renderSymbolInCell(player, i, j, 'red');
    });
}

function makeAIMove() {
    let emptyCells = [];
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            if (gameField[i][j] === EMPTY) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyCells.length > 0) {
        for (let cell of emptyCells) {
            gameField[cell.row][cell.col] = ZERO;
            if (checkWin(ZERO)) {
                renderSymbolInCell(ZERO, cell.row, cell.col, 'red');
                gameOver = true;
                alert('Победил ИИ');
                // highlightWinningCells(ZERO);
                return;
            }
            gameField[cell.row][cell.col] = EMPTY; 
        }

    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameField[randomCell.row][randomCell.col] = ZERO;
        renderSymbolInCell(ZERO, randomCell.row, randomCell.col);

        if (checkWin(ZERO)) {
            gameOver = true;
            alert('Победил ИИ');
            // highlightWinningCells(ZERO);
            return;
        }

        if (checkDraw()) {
            gameOver = true;
            alert('Победила дружба');
            return;
        }

        playerSymbol = CROSS;
    }
}
}
function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    gameField = createEmptyField(fieldSize);
    gameOver = false;
    playerSymbol = CROSS;
    renderGrid(fieldSize);
}

function expandField() {
    fieldSize += 2;
    const newField = createEmptyField(fieldSize);

    for (let i = 0; i < fieldSize - 2; i++) {
        for (let j = 0; j < fieldSize - 2; j++) {
            newField[i + 1][j + 1] = gameField[i][j];
        }
    }

    gameField = newField;
    renderGrid(fieldSize);
}

function checkFieldExpansion() {
    const totalCells = fieldSize * fieldSize;
    let filledCells = 0;

    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            if (gameField[i][j] !== EMPTY) {
                filledCells++;
            }
        }
    }

    if (filledCells > totalCells / 2) {
        expandField();
    }
}

function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}