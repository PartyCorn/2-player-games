const minDate = new Date(2020, 0, 1);
const maxDate = new Date(2020, 11, 31);
let lowerBound = new Date(minDate);
let upperBound = new Date(maxDate);
let attempts = 1;
let guessedDates = new Set();
let useRandomGuessing = false;
let currentGuess = getRandomDate(lowerBound, upperBound);

displayGuess(currentGuess);

function getRandomDate(min, max) {
    // Generate unique random date within bounds
    let randomDate;
    do {
        const randomTime = min.getTime() + Math.random() * (max.getTime() - min.getTime());
        randomDate = new Date(2020, new Date(randomTime).getMonth(), new Date(randomTime).getDate());
        if (guessedDates.size >= (upperBound - lowerBound) / (24 * 60 * 60 * 1000)) {
            endGame("No more unique dates to guess. Game over!");
            return null;
        }
    } while (guessedDates.has(randomDate.toDateString()));
    guessedDates.add(randomDate.toDateString());
    return randomDate;
}

function getMidpointDate(min, max) {
    const midpointTime = Math.floor((min.getTime() + max.getTime()) / 2);
    return new Date(2020, new Date(midpointTime).getMonth(), new Date(midpointTime).getDate());
}

function toggleGuessMode() {
    useRandomGuessing = document.getElementById("guessModeToggle").checked;
    resetGame();
}

function displayGuess(date) {
    document.getElementById("guess-display").textContent = formatDate(date);
}

function logHistory(text) {
    const logEntry = document.createElement("p");
    logEntry.textContent = text;
    document.getElementById("history-log").insertAdjacentElement("afterbegin", logEntry);
}

function formatDate(date) {
    return date ? date.toLocaleString('en', { month: 'long', day: 'numeric' }) : "N/A";
}

function guessEarlier() {
    attempts++;
    upperBound = new Date(currentGuess);
    currentGuess = useRandomGuessing ? getRandomDate(lowerBound, upperBound) : getMidpointDate(lowerBound, upperBound);
    logHistory(`Earlier than ${formatDate(upperBound)}`);
    updateGame();
}

function guessLater() {
    attempts++;
    lowerBound = new Date(currentGuess);
    currentGuess = useRandomGuessing ? getRandomDate(lowerBound, upperBound) : getMidpointDate(lowerBound, upperBound);
    logHistory(`Later than ${formatDate(lowerBound)}`);
    updateGame();
}

function correctGuess() {
    logHistory(`Correct! Date guessed in ${attempts} attempts.`);
    endGame(`Your birth date is ${formatDate(currentGuess)}!`);
}

function updateGame() {
    displayGuess(currentGuess);
    document.getElementById("attempts").textContent = attempts;
    console.log("Lower bound:", formatDate(lowerBound), "-", "Upper bound:", formatDate(upperBound));
    disableButtons();

    // If no dates are left, end the game
    if (lowerBound >= upperBound) {
        logHistory(`No more dates to guess. Date guessed in ${attempts} attempts.`);
        endGame(`Your birth date is ${formatDate(currentGuess)}!`);
    }
}

function disableButtons(instant = false) {
    document.getElementById("earlier-btn").disabled = instant // || currentGuess.getTime() - lowerBound.getTime() < 60 * 60 * 24 * 1000;
    document.getElementById("later-btn").disabled = instant // || upperBound.getTime() - currentGuess.getTime() < 60 * 60 * 24 * 1000;
    document.getElementById("correct-btn").disabled = instant;
}

function resetGame() {
    lowerBound = new Date(minDate);
    upperBound = new Date(maxDate);
    attempts = 1;
    guessedDates.clear();
    currentGuess = getRandomDate(lowerBound, upperBound);  // Random start for unpredictability
    document.getElementById("history-log").innerHTML = "";
    document.getElementById("attempts").textContent = attempts;
    document.getElementById("instruction").textContent = "Let's guess your birth date!";
    document.getElementById("current-guess").innerHTML = "<p id=\"current-guess\">Current Guess: <strong><span id=\"guess-display\"></span></strong></p>";
    document.getElementsByTagName("label").item(0).style.display = "block";
    document.getElementById("restart-btn").style.display = "none";
    displayGuess(currentGuess);
    disableButtons();
    stopConfetti();
}

function endGame(message) {
    document.getElementById("instruction").textContent = message;
    document.getElementById("current-guess").textContent = "Game Over!";
    document.getElementsByTagName("label").item(0).style.display = "none";
    document.getElementById("restart-btn").style.display = "inline-block";
    disableButtons(true);
    launchConfetti();
}