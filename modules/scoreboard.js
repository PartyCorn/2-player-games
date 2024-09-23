// Добавление побед на страницу
function createScoreboard() {
    const scoreboardHTML = `
        <div id="scoreboard">
            <div class="score" id="player1-score">
                <span id="player1-wins">0</span>
                <span class="player-label">Игрок 1</span>
            </div>
            <div class="score" id="player2-score">
                <span id="player2-wins">0</span>
                <span class="player-label">Игрок 2</span>
            </div>
            <button id="reset-scoreboard">Сбросить счет</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', scoreboardHTML);
}

// Инициализация побед
function initializeScoreboard() {
    let player1Wins = localStorage.getItem('player1Wins') || 0;
    let player2Wins = localStorage.getItem('player2Wins') || 0;

    // Обновляем HTML с количеством побед
    document.getElementById('player1-wins').textContent = player1Wins;
    document.getElementById('player2-wins').textContent = player2Wins;
}

// Обновление счетчика побед игрока
function updateScore(winner) {
    if (winner === 1) {
        let player1Wins = parseInt(localStorage.getItem('player1Wins') || 0);
        player1Wins++;
        localStorage.setItem('player1Wins', player1Wins);
        document.getElementById('player1-wins').textContent = player1Wins;
    } else if (winner === 2) {
        let player2Wins = parseInt(localStorage.getItem('player2Wins') || 0);
        player2Wins++;
        localStorage.setItem('player2Wins', player2Wins);
        document.getElementById('player2-wins').textContent = player2Wins;
    }
}

// Сброс счетчика побед
function resetScoreboard() {
    localStorage.setItem('player1Wins', 0);
    localStorage.setItem('player2Wins', 0);
    document.getElementById('player1-wins').textContent = 0;
    document.getElementById('player2-wins').textContent = 0;
}


// Вызов инициализации при загрузке страницы
window.onload = function() {
    createScoreboard();
    initializeScoreboard();
    // Обработчик для кнопки сброса
    document.getElementById('reset-scoreboard').addEventListener('click', resetScoreboard);
};
