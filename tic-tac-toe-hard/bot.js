// Функция для хода бота
function botMove() {
    if (gameWon) return; // Если игра закончена или не ход бота, выходим

    const mainCellIndex = nextMoveIn !== null ? nextMoveIn : getRandomAvailableMainCell();
    if (mainCellIndex === null) return; // Нет доступных ячеек для хода

    let move = findWinningMove(mainCellIndex) || findBlockingMove(mainCellIndex) || getRandomMove(mainCellIndex);

    if (move !== null) {
        // Исполняем ход бота
        const [smallCellIndex] = move;
        const smallCell = document.querySelector(`.cell[data-index='${mainCellIndex}'] .small-cell[data-small-cell-index='${smallCellIndex}']`);
        smallCell.click();
    }
}

// Функция для нахождения выигрывающего хода для бота в указанной большой ячейке
function findWinningMove(mainCellIndex) {
    return findBestMove(mainCellIndex, currentPlayer == 2 ? 'O' : 'X');
}

// Функция для нахождения блокирующего хода для бота в указанной большой ячейке
function findBlockingMove(mainCellIndex) {
    return findBestMove(mainCellIndex, currentPlayer == 2 ? 'X' : 'O');
}

// Функция для нахождения лучшего хода для указанного игрока в данной большой ячейке
function findBestMove(mainCellIndex, player) {
    const availableMoves = getAvailableMoves(mainCellIndex);
    for (let smallCellIndex of availableMoves) {
        mainGrid[mainCellIndex].grid[smallCellIndex] = player;
        if (checkSmallGridWin(mainCellIndex)) {
            mainGrid[mainCellIndex].grid[smallCellIndex] = null; // Отменить ход
            return [smallCellIndex];
        }
        mainGrid[mainCellIndex].grid[smallCellIndex] = null; // Отменить ход
    }
    return null;
}

// Функция для получения случайного доступного хода в указанной большой ячейке
function getRandomMove(mainCellIndex) {
    const availableMoves = getAvailableMoves(mainCellIndex);
    if (availableMoves.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return [availableMoves[randomIndex]];
}

// Функция для получения всех доступных ходов в указанной большой ячейке
function getAvailableMoves(mainCellIndex) {
    const availableMoves = [];
    if (mainCellIndex !== null) {
        mainGrid[mainCellIndex].grid.forEach((smallCell, smallCellIndex) => {
            if (smallCell === null) {
                availableMoves.push(smallCellIndex);
            }
        });
    }
    return availableMoves;
}

// Функция для получения случайного доступного индекса большой ячейки
function getRandomAvailableMainCell() {
    const availableCells = mainGrid
        .map((cell, index) => cell.winner === null ? index : null)
        .filter(index => index !== null);

    if (availableCells.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
}

// Добавление обработчика события на кнопку хода бота
document.getElementById('bot-btn').addEventListener('click', botMove);
