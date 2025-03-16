const gameBoard = document.getElementById("gameBoard");
const shuffleButton = document.getElementById("shuffle");
const timerDisplay = document.getElementById("timer");
const bestTimeDisplay = document.getElementById("bestTime");
const imageSelect = document.getElementById("imageSelect");
const startGameButton = document.getElementById("startGame");

let tiles = [];
let emptyIndex = 15; // Adjusted for 4x4 grid (last tile)
let timer;
let time = 0;
let bestTime = localStorage.getItem("bestTime") || "--";
bestTimeDisplay.textContent = bestTime;

let selectedImage = "image1"; // Default image set

startGameButton.addEventListener("click", () => {
    selectedImage = imageSelect.value;
    createBoard();
    resetTimer();
});

function createBoard() {
    gameBoard.innerHTML = "";
    tiles = [];

    for (let i = 0; i < 15; i++) { // 15 tiles + 1 empty
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.style.backgroundImage = `url('tiles/${selectedImage}_tile_${i + 1}.png')`;
        tile.dataset.index = i;

        // Add number in bottom-right corner
        const numberLabel = document.createElement("span");
        numberLabel.textContent = i + 1;
        numberLabel.classList.add("tile-number");
        tile.appendChild(numberLabel);

        tile.addEventListener("click", moveTile);
        tiles.push(tile);
        gameBoard.appendChild(tile);
    }

    // Create empty tile
    const emptyTile = document.createElement("div");
    emptyTile.classList.add("tile", "empty");
    tiles.push(emptyTile);
    gameBoard.appendChild(emptyTile);
}

function moveTile(event) {
    const index = tiles.indexOf(event.target);
    if (isMovable(index)) {
        swapTiles(index);
        checkWin();
    }
}

function isMovable(index) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
           (Math.abs(col - emptyCol) === 1 && row === emptyRow);
}

function swapTiles(index) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    emptyIndex = index;
    updateBoard();
}

function updateBoard() {
    gameBoard.innerHTML = "";
    tiles.forEach(tile => gameBoard.appendChild(tile));
}

function shuffleTiles() {
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    emptyIndex = tiles.indexOf(tiles.find(tile => tile.classList.contains("empty")));
    updateBoard();
    resetTimer();
}

function checkWin() {
    for (let i = 0; i < 15; i++) {
        if (tiles[i].dataset.index != i) return;
    }
    clearInterval(timer);
    setTimeout(() => alert("You solved the puzzle in " + time + " seconds!"), 100);
    
    if (bestTime === "--" || time < parseInt(bestTime)) {
        localStorage.setItem("bestTime", time);
        bestTimeDisplay.textContent = time;
    }
}

function resetTimer() {
    clearInterval(timer);
    time = 0;
    timerDisplay.textContent = time;
    timer = setInterval(() => {
        time++;
        timerDisplay.textContent = time;
    }, 1000);
}

shuffleButton.addEventListener("click", shuffleTiles);
