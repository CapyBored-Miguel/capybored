const board = document.getElementById("board");
const resetButton = document.getElementById("reset");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0 };

function createBoard() {
    board.innerHTML = "";
    gameBoard.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.textContent = cell;
        cellDiv.addEventListener("click", handleMove);
        board.appendChild(cellDiv);
    });
}

function handleMove(event) {
    const index = event.target.dataset.index;
    if (!gameBoard[index]) {
        gameBoard[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        if (checkWinner()) {
            alert(`Player ${currentPlayer} wins!`);
            scores[currentPlayer]++;
            updateScoreboard();
            resetBoard();
        } else if (gameBoard.every(cell => cell !== "")) {
            alert("It's a draw!");
            resetBoard();
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function updateScoreboard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function resetBoard() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    createBoard();
}

resetButton.addEventListener("click", resetBoard);

createBoard();
