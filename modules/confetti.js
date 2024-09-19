let isRunning = false;

function launchConfetti(duration = null, releaseSpeed = 50) {
    const colors = [
        '#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545',
        '#fd7e14', '#ffc107', '#198754', '#20c997', '#0dcaf0', '#fff'
    ];

    const confettiElements = [];
    isRunning = true;

    // Функция для генерации одного элемента конфетти
    function createConfetti() {
        if (!isRunning) return;

        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Определяем стартовую сторону (лево или право)
        const side = Math.random() < 0.5 ? 'left' : 'right';
        confetti.style[side] = '0';

        // Устанавливаем случайную высоту (близко к центру экрана)
        const randomHeight = `${Math.random() * 80 + 10}vh`;
        confetti.style.top = randomHeight;

        // Устанавливаем случайные размеры
        const size = Math.random() * 10 + 5; // Размер от 5 до 15px
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size * 2}px`;

        // Задаем случайный цвет
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Случайное вращение конфетти
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        // Добавляем элемент в тело страницы
        document.body.appendChild(confetti);
        confettiElements.push(confetti);

        // Анимация "вылета" конфетти с боков
        const flyX = side === 'left' ? Math.random() * 50 + 50 : -(Math.random() * 50 + 50); // Вылет вправо или влево
        const flyY = -(Math.random() * 100 + 50); // Высота выброса (вверх)
        const duration = Math.random() * 2 + 2; // Время анимации (от 2 до 4 секунд)
        
        confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${flyX}vw, ${flyY}vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'ease-out',
            iterations: 1,
            fill: 'forwards'
        });

        // Удаляем конфетти после завершения анимации
        setTimeout(() => {
            confetti.remove();
            const index = confettiElements.indexOf(confetti);
            if (index > -1) {
                confettiElements.splice(index, 1); // Убираем элемент из массива
            }
        }, duration * 1000);
    }

    // Функция для постоянного выпуска конфетти
    function startConfetti() {
        if (!isRunning) return;
        createConfetti();
        setTimeout(startConfetti, releaseSpeed); // Интервал между выпусками конфетти
    }

    // Запуск конфетти
    startConfetti();

    // Остановка конфетти через заданное время
    if (duration !== null) {
        setTimeout(() => {
            isRunning = false; // Останавливаем выпуск через определенное время
        }, duration);
    }
}

// Функция для преждевременной остановки выпуска
function stopConfetti() {
    isRunning = false;
};
