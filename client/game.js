const words = [
    "COMPUTER",
    "ELEPHANT",
    "PROGRAMMING",
    "JAVASCRIPT",
    "TREASURE",
    "MOUNTAIN",
    "KEYBOARD",
    "ADVENTURE"
];

let word;
let revealed;
let lives;
let gameOver;
let selectedPosition = null;

const wordDisplay = document.getElementById("word");
const livesDisplay = document.getElementById("lives");
const wrongDisplay = document.getElementById("wrong");
const message = document.getElementById("message");
const newGameButton = document.getElementById("newGame");
const gallows = document.querySelector(".gallows");

function getClueCount(length) {
    if (length > 10) return 3;
    if (length > 7) return 2;
    if (length > 3) return 1;
    return 0;
}

function startGame() {
    word = words[Math.floor(Math.random() * words.length)];

    revealed = Array(word.length).fill(false);
    lives = 6;
    gameOver = false;
    selectedPosition = null;

    message.textContent = "";

    createStartingClues();
    updateDisplay();
}

function createStartingClues() {
    const clueCount = getClueCount(word.length);
    const positions = [];

    while (positions.length < clueCount) {
        const index = Math.floor(Math.random() * word.length);

        if (!positions.includes(index)) {
            positions.push(index);
            revealed[index] = true;
        }
    }
}

function updateDisplay() {
    wordDisplay.innerHTML = "";

    for (let i = 0; i < word.length; i++) {
        const input = document.createElement("input");

        input.type = "text";
        input.maxLength = 1;
        input.className = "letter-input";
        input.dataset.position = i;

        if (revealed[i]) {
            input.value = word[i];
            input.disabled = true;
            input.classList.add("revealed");
        } else {
            input.value = "";
            input.disabled = gameOver;
        }

        input.addEventListener("focus", () => {
            selectedPosition = i;
        });

        input.addEventListener("input", (event) => {
            handleInput(event, i);
        });

        wordDisplay.appendChild(input);
    }

    const wrongGuesses = 6 - lives;

    wrongDisplay.textContent = wrongGuesses;
    livesDisplay.textContent = lives;

    updateHangman(wrongGuesses);
}

function handleInput(event, position) {
    if (gameOver || revealed[position]) {
        return;
    }

    const input = event.target;
    const letter = input.value.toUpperCase();

    if (!/^[A-Z]$/.test(letter)) {
        input.value = "";
        return;
    }

    input.value = "";

    if (letter === word[position]) {
        revealed[position] = true;
        message.textContent = "✅ Correct!";
    } else {
        lives--;
        message.textContent = `❌ ${letter} is wrong here!`;
    }

    updateDisplay();
    checkGameState();

    if (!gameOver) {
        moveToNextEmpty(position);
    }
}

function moveToNextEmpty(position) {
    for (let i = position + 1; i < word.length; i++) {
        if (!revealed[i]) {
            document
                .querySelector(`[data-position="${i}"]`)
                .focus();

            selectedPosition = i;
            return;
        }
    }

    for (let i = 0; i < position; i++) {
        if (!revealed[i]) {
            document
                .querySelector(`[data-position="${i}"]`)
                .focus();

            selectedPosition = i;
            return;
        }
    }
}

function updateHangman(wrongGuesses) {
    gallows.className = "gallows";

    if (wrongGuesses >= 1) {
        gallows.classList.add("show-head");
    }

    if (wrongGuesses >= 2) {
        gallows.classList.add("show-body");
    }

    if (wrongGuesses >= 3) {
        gallows.classList.add("show-left-arm");
    }

    if (wrongGuesses >= 4) {
        gallows.classList.add("show-right-arm");
    }

    if (wrongGuesses >= 5) {
        gallows.classList.add("show-left-leg");
    }

    if (wrongGuesses >= 6) {
        gallows.classList.add("show-right-leg");
    }
}

function checkGameState() {
    if (revealed.every(value => value === true)) {
        gameOver = true;
        message.textContent = "🎉 YOU WON!";
        return;
    }

    if (lives <= 0) {
        gameOver = true;
        message.textContent = `💀 GAME OVER! The word was ${word}`;
        revealWord();
    }
}

function revealWord() {
    for (let i = 0; i < word.length; i++) {
        revealed[i] = true;
    }

    updateDisplay();
}

newGameButton.addEventListener("click", startGame);

startGame();