document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById("startButton");

    let bird, gravity, velocity, obstacles, gameActive, score, highScore;
    const GAP_SIZE = 140; 
    const OBSTACLE_WIDTH = 50;
    const OBSTACLE_SPACING = 200;

    const birdImg = new Image();
    birdImg.src = "flappybara/capybara-wings.png"; // Set path to your capybara image

    canvas.width = 400;
    canvas.height = 500;

    function initializeGame() {
        bird = { x: 80, y: 250, width: 40, height: 30 }; // Adjust size based on image
        gravity = 0.5;
        velocity = 0;
        obstacles = [];
        gameActive = true;
        score = 0;
        highScore = localStorage.getItem("highScore") || 0;

        for (let i = 1; i <= 3; i++) {
            addObstacle(canvas.width + i * OBSTACLE_SPACING);
        }

        startButton.style.display = "none";
        canvas.style.display = "block";
        loop();
    }

    function addObstacle(startX) {
        let passageY = Math.random() * (canvas.height - GAP_SIZE - 50) + 25;
        obstacles.push({ x: startX, y: passageY, width: OBSTACLE_WIDTH });
    }

    function updateGame() {
        if (!gameActive) return;

        velocity += gravity;
        bird.y += velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            endGame();
        }

        obstacles.forEach(obstacle => obstacle.x -= 2);

        if (obstacles.length > 0 && obstacles[0].x + OBSTACLE_WIDTH < 0) {
            obstacles.shift();
            score++;
            addObstacle(obstacles[obstacles.length - 1].x + OBSTACLE_SPACING);
        }

        obstacles.forEach(obstacle => {
            if (
                bird.x < obstacle.x + OBSTACLE_WIDTH &&
                bird.x + bird.width > obstacle.x &&
                (bird.y < obstacle.y || bird.y + bird.height > obstacle.y + GAP_SIZE)
            ) {
                endGame();
            }
        });
    }

    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the capybara image instead of a square
        ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        ctx.fillStyle = "green";
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.y);
            ctx.fillRect(obstacle.x, obstacle.y + GAP_SIZE, obstacle.width, canvas.height - (obstacle.y + GAP_SIZE));
        });

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 10, 20);
    }

    function loop() {
        updateGame();
        drawGame();
        if (gameActive) requestAnimationFrame(loop);
    }

    function endGame() {
        gameActive = false;
        
        const gameOverDialog = document.createElement("div");
        gameOverDialog.style.position = "fixed";
        gameOverDialog.style.top = "50%";
        gameOverDialog.style.left = "50%";
        gameOverDialog.style.transform = "translate(-50%, -50%)";
        gameOverDialog.style.background = "white";
        gameOverDialog.style.padding = "20px";
        gameOverDialog.style.borderRadius = "10px";
        gameOverDialog.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.3)";
        gameOverDialog.style.textAlign = "center";
        gameOverDialog.innerHTML = `
            <h2>Game Over!</h2>
            <p>Score: ${score}</p>
            <p>High Score: ${Math.max(score, highScore)}</p>
            <button id="restartButton">Replay</button>
        `;
        document.body.appendChild(gameOverDialog);

        document.getElementById("restartButton").addEventListener("click", () => {
            gameOverDialog.remove();
            initializeGame();
        });

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }

        canvas.style.display = "none";
        startButton.style.display = "block";
    }

    function jump() {
        if (!gameActive) return;
        velocity = -7;
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            jump();
            e.preventDefault();
        }
    });

    document.addEventListener("click", jump);
    startButton.addEventListener("click", initializeGame);
});
