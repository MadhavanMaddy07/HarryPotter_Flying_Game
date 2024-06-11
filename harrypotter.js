        let board;
        let boardWidth = 480;
        let boardHeight = 580;
        let context;

        let harryPotterWidth = 68;
        let harryPotterHeight = 48;
        let harryPotterX = boardWidth / 8;
        let harryPotterY = boardHeight / 2;
        let potterImg;

        let harryPotter = {
            x: harryPotterX,
            y: harryPotterY,
            width: harryPotterWidth,
            height: harryPotterHeight
        };

        let dementorArray = [];
        let dementorWidth = 64; 
        let dementorHeight = 300;
        let dementorX = boardWidth;
        let dementorY = 0;

        let topdementorImg;
        let bottomdementorImg;

        let velocityX = -2; // dementor moving left speed
        let velocityY = 0; // Potter jump speed
        let gravity = 0.4;

        let gameOver = false;
        let score = 0;
        let gameStarted = false; // New variable to check if the game has started
        let dementorInterval; // Variable to store the interval ID

        window.onload = function () {
            board = document.getElementById("myCanvas1");
            board.height = boardHeight;
            board.width = boardWidth;
            context = board.getContext("2d");

            potterImg = new Image();
            potterImg.src = "HarryPotter.png";
            potterImg.onload = function () {
                context.drawImage(potterImg, harryPotter.x, harryPotter.y, harryPotter.width, harryPotter.height);
            };

            topdementorImg = new Image();
            topdementorImg.src = "./topdementor.png";

            bottomdementorImg = new Image();
            bottomdementorImg.src = "./dementor.png";

            document.getElementById("playButton").addEventListener("click", startGame);
            document.addEventListener("keydown", movePotter);
        };

        function startGame() {
            if (dementorInterval) {
                clearInterval(dementorInterval); // Clear any existing interval
            }
            gameStarted = true;
            gameOver = false;
            document.getElementById("playButton").style.display = "none";
            resetGame();
            requestAnimationFrame(update);
            dementorInterval = setInterval(placedementor, 1500); // every 1.5 seconds
        }

        function resetGame() {
            harryPotter.y = harryPotterY;
            dementorArray = [];
            score = 0;
            velocityY = 0; // Reset velocity
            gameOver = false;
            context.clearRect(0, 0, board.width, board.height); // Clear the canvas
            context.drawImage(potterImg, harryPotter.x, harryPotter.y, harryPotter.width, harryPotter.height); // Redraw Harry Potter at the starting position
        }

        function update() {
            if (!gameStarted) {
                return;
            }
            requestAnimationFrame(update);
            if (gameOver) {
                clearInterval(dementorInterval); // Clear the interval when the game is over
                return;
            }
            context.clearRect(0, 0, board.width, board.height);

            // Apply gravity to Potter
            velocityY += gravity;
            harryPotter.y = Math.max(harryPotter.y + velocityY, 0); // apply gravity to current Potter.y, limit the Potter.y to top of the canvas
            context.drawImage(potterImg, harryPotter.x, harryPotter.y, harryPotter.width, harryPotter.height);

            if (harryPotter.y > board.height) {
                gameOver = true;
            }

            // Dementors
            for (let i = 0; i < dementorArray.length; i++) {
                let dementor = dementorArray[i];
                dementor.x += velocityX;
                context.drawImage(dementor.img, dementor.x, dementor.y, dementor.width, dementor.height);

                if (!dementor.passed && harryPotter.x > dementor.x + dementor.width) {
                    score += 0.5; // 0.5 because there are 2 dementor! so 0.5*2 = 1, 1 for each set of dementor
                    dementor.passed = true;
                }

                if (detectCollision(harryPotter, dementor)) {
                    gameOver = true;
                }
            }

            // Clear dementors
            while (dementorArray.length > 0 && dementorArray[0].x < -dementorWidth) {
                dementorArray.shift(); // removes first element from the array
            }

            // Score
            context.fillStyle = "Red";
            context.font = "45px sans-serif";
            context.fillText(score, 5, 45);

            if (gameOver) {
                context.fillText("GAME OVER", 5, 90);
                gameStarted = false;
                document.getElementById("playButton").style.display = "block";
            }
        }

        function placedementor() {
            if (gameOver) {
                return;
            }

            let randomdementorY = dementorY - dementorHeight / 4 - Math.random() * (dementorHeight / 2);
            let openingSpace = board.height / 3;

            let topdementor = {
                img: topdementorImg,
                x: dementorX,
                y: randomdementorY, 
                width: dementorWidth,
                height: dementorHeight,
                passed: false
            };
            dementorArray.push(topdementor);

            let bottomdementor = {
                img: bottomdementorImg,
                x: dementorX,
                y: randomdementorY + openingSpace + dementorHeight,
                width: dementorWidth,
                height: dementorHeight,
                passed: false
            };
            dementorArray.push(bottomdementor);
        }

        function movePotter(e) {
            if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
                // Jump
                velocityY = -6;

                // Reset game
                if (gameOver) {
                    resetGame();
                    gameOver = false;
                    gameStarted = true;
                    document.getElementById("playButton").style.display = "none";
                }
            }
        }

        function detectCollision(a, b) {
            return (
                a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
                a.x + a.width > b.x && // a's top right corner passes b's top left corner
                a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
                a.y + a.height > b.y // a's bottom left corner passes b's top left corner
            );
        }
