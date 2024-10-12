// Переменные для отслеживания состояния игры
let currentPlayer = 1; // 1 - крестики (синий), 2 - нолики (красный)
let mainGrid = [];
const gridSize = 3;
const smallGridSize = 3;
let nextMoveIn = null; // Индекс ячейки большой сетки, куда следующий игрок должен ходить
let gameWon = false; // Флаг, указывающий, что игра завершена

// Функция для генерации сетки
function generateGrid() {
    const mainGridElement = document.getElementById('main-grid');
    mainGridElement.innerHTML = ''; // Очистка предыдущей сетки
    mainGrid = []; // Очистка логики основной сетки
    gameWon = false; // Сбрасываем флаг победы

    // Создание основной сетки
    for (let i = 0; i < gridSize * gridSize; i++) {
        const mainCell = document.createElement('div');
        mainCell.classList.add('cell');
        mainCell.dataset.index = i;

        // Генерация маленькой сетки в каждой ячейке
        const smallGrid = [];
        for (let j = 0; j < smallGridSize * smallGridSize; j++) {
            const smallCell = document.createElement('div');
            smallCell.classList.add('small-cell');
            smallCell.dataset.mainCellIndex = i;
            smallCell.dataset.smallCellIndex = j;

            smallCell.addEventListener('click', handleCellClick);
            mainCell.appendChild(smallCell);
            smallGrid.push(null); // Инициализация состояния маленькой сетки
        }

        mainGridElement.appendChild(mainCell);
        mainGrid.push({ grid: smallGrid, winner: null }); // Добавление информации о сетке и победителе
    }

    highlightNextMove();
}

// Обработка кликов по ячейке
function handleCellClick(event) {
    if (gameWon) return; // Если игра уже завершена, ходы запрещены

    const smallCell = event.target;
    const mainCellIndex = smallCell.dataset.mainCellIndex;
    const smallCellIndex = smallCell.dataset.smallCellIndex;

    // Если ячейка уже занята или ход не туда, куда нужно, выходим
    if (mainGrid[mainCellIndex].grid[smallCellIndex] !== null || 
        (nextMoveIn !== null && nextMoveIn != mainCellIndex && mainGrid[nextMoveIn].winner === null)) {
        return;
    }

    // Отметка хода текущего игрока
    if (currentPlayer === 1) {
        smallCell.textContent = 'X';
        smallCell.style.color = 'blue';
        mainGrid[mainCellIndex].grid[smallCellIndex] = 'X';
    } else {
        smallCell.textContent = 'O';
        smallCell.style.color = 'red';
        mainGrid[mainCellIndex].grid[smallCellIndex] = 'O';
    }

    // Проверка победы в маленькой сетке
    if (checkSmallGridWin(mainCellIndex)) {
        markGridAsWon(mainCellIndex, currentPlayer === 1 ? 'X' : 'O');
        
        // Проверка победы в большой сетке
        if (checkBigGridWin()) {
            endGame(currentPlayer === 1 ? 'X' : 'O');
            return;
        }
    } else if (checkSmallGridTie(mainCellIndex)) {
        markGridAsTied(mainCellIndex);
    }

    // Смена игрока
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerTurn();

    // Обновляем, куда нужно ходить следующему игроку
    nextMoveIn = smallCellIndex;
    // Если следующая сетка уже выиграна или ничья, разрешаем ходить куда угодно
    if (mainGrid[nextMoveIn].winner !== null) {
        nextMoveIn = null;
    }

    highlightNextMove(); // Подсветка возможного хода

    // Проверка ничьей в большой сетке
    if (checkBigGridTie()) {
        endGame('Tie');
    }
}

// Проверка ничьей в маленькой сетке
function checkSmallGridTie(mainCellIndex) {
    const smallGrid = mainGrid[mainCellIndex].grid;
    return smallGrid.every(cell => cell !== null) && mainGrid[mainCellIndex].winner === null;
}

// Проверка ничьей в большой сетке
function checkBigGridTie() {
    return mainGrid.every(cell => cell.winner !== null);
}

// Отметка маленькой сетки как ничейной
function markGridAsTied(mainCellIndex) {
    const mainCellElement = document.getElementById('main-grid').children[mainCellIndex];
    mainCellElement.innerHTML = '<span class="winner">-</span>';
    mainGrid[mainCellIndex].winner = '-';
}

// Окончание игры
function endGame(winner) {
    const playerTurnElement = document.getElementById('player-turn');
    if (winner === 'Tie') {
        playerTurnElement.textContent = `Ничья!`;
    } else {
        playerTurnElement.textContent = `Игрок ${winner === 'X' ? 1 : 2} (${winner}) победил!`;
        updateScore(winner === 'X' ? 1 : 2);
    }
    gameWon = true;
    launchConfetti();
}

// Функция перезапуска игры
function restartGame() {
    currentPlayer = 1;
    nextMoveIn = null;
    updatePlayerTurn();
    generateGrid();
    stopConfetti();
    const winLine = document.querySelector('.win-line');
    if (winLine) winLine.remove();
}

// Функция для проверки победы в маленькой сетке
function checkSmallGridWin(mainCellIndex) {
    const smallGrid = mainGrid[mainCellIndex].grid;
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтальные линии
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикальные линии
        [0, 4, 8], [2, 4, 6]             // Диагонали
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (smallGrid[a] && smallGrid[a] === smallGrid[b] && smallGrid[a] === smallGrid[c]) {
            return true;
        }
    }
    return false;
}

// Функция для проверки победы в большой сетке
function checkBigGridWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтальные линии
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикальные линии
        [0, 4, 8], [2, 4, 6]             // Диагонали
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (mainGrid[a].winner && mainGrid[a].winner === mainGrid[b].winner && mainGrid[a].winner === mainGrid[c].winner) {
            markBigWin(combination); // Зачеркиваем победную линию
            return true;
        }
    }
    return false;
}

// Подсветка активной ячейки большой сетки
function highlightNextMove() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('active');
    });

    if (nextMoveIn !== null && mainGrid[nextMoveIn].winner === null) {
        cells[nextMoveIn].classList.add('active');
    } else if (nextMoveIn === null) {
        cells.forEach(cell => {
            if (mainGrid[cell.dataset.index].winner === null) {
                cell.classList.add('active');
            }
        });
    }
}

// Зачеркивание победной линии
function markBigWin(combination) {
    const mainGridElement = document.getElementById('main-grid');
    const line = document.createElement('div');
    line.classList.add('win-line');

    // Получаем координаты первой и последней ячейки в комбинации
    const startCell = mainGridElement.children[combination[0]];
    const endCell = mainGridElement.children[combination[2]];

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    // Вычисляем длину и угол линии
    const deltaX = endRect.left - startRect.left;
    const deltaY = endRect.top - startRect.top;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Устанавливаем размеры и поворот линии
    line.style.width = `${distance}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${startRect.left + startRect.width / 2}px`;
    line.style.top = `${startRect.top + startRect.height / 2}px`;

    document.body.appendChild(line);
}

// Отметка маленькой сетки как выигранной
function markGridAsWon(mainCellIndex, winner) {
    const mainCellElement = document.getElementById('main-grid').children[mainCellIndex];
    mainCellElement.innerHTML = `<span class="winner">${winner}</span>`;
    mainGrid[mainCellIndex].winner = winner;

    // Стилизация ячейки с победителем
    const winnerElement = mainCellElement.querySelector('.winner');
    winnerElement.style.color = winner === 'X' ? 'blue' : 'red';
}

// Обновление надписи о текущем игроке
function updatePlayerTurn() {
    const playerTurnElement = document.getElementById('player-turn');
    playerTurnElement.textContent = `Ход игрока: ${currentPlayer} (${currentPlayer === 1 ? 'Крестики' : 'Нолики'})`;

    // Изменяем размеры подсветки в зависимости от игрока
    const spot1 = document.getElementById('spot1');
    const spot2 = document.getElementById('spot2');

    if (currentPlayer === 1) {
        spot1.style.width = '15vw'; // Увеличиваем свечение для игрока 1 (синий)
        spot2.style.width = '10vw'; // Уменьшаем свечение для игрока 2 (красный)
    } else {
        spot1.style.width = '10vw'; // Уменьшаем свечение для игрока 1 (синий)
        spot2.style.width = '15vw'; // Увеличиваем свечение для игрока 2 (красный)
    }
}

// Добавление обработчика события на кнопку перезапуска
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Инициализация игры
generateGrid();
updatePlayerTurn();
