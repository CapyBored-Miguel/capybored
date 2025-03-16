const gameBoard = document.getElementById("gameBoard");
const resetButton = document.getElementById("reset");
const timerDisplay = document.getElementById("timer");
const bestTimeDisplay = document.getElementById("best-time");

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer;
let secondsElapsed = 0;
let bestTime = localStorage.getItem("memoryBestTime") || null;

if (bestTime) {
    bestTimeDisplay.textContent = bestTime;
}

// Generate card values (2 of each)
const emojis = ["🐱", "🐶", "🐰", "🐵", "🐼", "🦊", "🐸", "🐯"];
const cardValues = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

function startTimer() {
    clearInterval(timer);
    secondsElapsed = 0;
    timer = setInterval(() => {
        secondsElapsed++;
        timerDisplay.textContent = secondsElapsed;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function checkMatch() {
    if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
        flippedCards.forEach(card => card.classList.add("hidden"));
        flippedCards = [];
        matchedPairs++;

        if (matchedPairs === emojis.length) {
            stopTimer();
            alert(`You win! Time: ${secondsElapsed} seconds`);

            if (!bestTime || secondsElapsed < bestTime) {
                bestTime = secondsElapsed;
                localStorage.setItem("memoryBestTime", bestTime);
                bestTimeDisplay.textContent = bestTime;
            }
        }
    } else {
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove("flip"));
            flippedCards = [];
        }, 1000);
    }
}

function flipCard(event) {
    const card = event.target;
    if (!card.classList.contains("flip") && flippedCards.length < 2) {
        card.classList.add("flip");
        flippedCards.push(card);
    }

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function resetGame() {
    stopTimer();
    gameBoard.innerHTML = "";
    matchedPairs = 0;
    flippedCards = [];
    
    cardValues.sort(() => Math.random() - 0.5);
    generateBoard();
    startTimer();
}

function generateBoard() {
    cardValues.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.classList.add("card", "hidden");
        card.dataset.emoji = emoji;
        card.textContent = emoji;
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}

resetButton.addEventListener("click", resetGame);

generateBoard();
startTimer();
