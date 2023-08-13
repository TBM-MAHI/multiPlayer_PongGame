//socket
/*  by default socket io connects to the same server/hostname
    as the front and backend are on the same host/server/port
    the connection will be on the same port
 */
//const socket = io('http://localhost:3500');
const socket = io('/pong');
// Canvas Related 
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const gameOverEl = document.createElement('div');
//Player
let isReferee = false;
let paddleIndex = 0;
let playerNO = null;
let playerStatus = [ 0, 0 ];

let width = 500;
let height = 700;

// Paddle
let paddleHeight = 10;
let paddleWidth = 50;
let paddleDiff = 25;
//paddeleX[0]= player at bottom
//paddeleX[1]= player at top
let paddleX = [ 225, 225 ];
let trajectoryX = [ 0, 0 ];
let playerMoved = false;

// Ball
let ballX = 250;
let ballY = 350;
let ballRadius = 5;
let ballDirection = 1;

// Speed
let speedY = 2;
let speedX = 0;

// Score for Both Players
let score = [ 0, 0 ];
let winningScore = 5;
let isGameOver = true;
let isNewGame = true;

// Create Canvas Element
function createCanvas() {
  canvas.id = 'canvas';
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  renderCanvas();
}

// Wait for Opponents
function renderIntro() {
  // Canvas Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
   // Intro Text
  context.fillStyle = 'white';
  context.font = "32px Courier New";
  context.fillText("Waiting for opponent...", 20, (canvas.height / 2) - 30);
}

// Render Everything on Canvas
function renderCanvas() {
  // Canvas Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  // Paddle Color
  context.fillStyle = 'white';

  // Bottom Paddle
  context.fillRect(paddleX[ 0 ], height - 20, paddleWidth, paddleHeight);

  // Top Paddle
  context.fillRect(paddleX[ 1 ], 10, paddleWidth, paddleHeight);

  // Dashed Center Line
  context.beginPath();
  context.setLineDash([ 4 ]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = 'grey';
  context.stroke();

  // Ball
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();

  // Score
  context.font = "20px Courier New";
  context.fillText(score[ 1 ], 10, (canvas.height / 2) - 30);//top player
  context.fillText(score[ 0 ], 10, (canvas.height / 2) + 50); // bottom player
  context.font = "15px serif";
  if (playerNO % 2 !== 0) {
    // console.log("playerLabel", playerNO);
    context.fillText("(You)", 37, (canvas.height / 2) - 30); //top
    context.fillText("(Opponent)", 37, (canvas.height / 2) + 50);//bottom
  }
  else {
    //console.log("playerLabel", playerNO);
    context.fillText("(You)", 37, (canvas.height / 2) + 50);//bottom
    context.fillText("(Opponent)", 37, (canvas.height / 2) - 30);//top
  }
}

// Reset Ball to Center
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = 1.5;
  socket.emit('BallMove', {
    ballX,
    ballY,
    score
  })
}

// Adjust Ball Movement
function ballMove() {
  // Vertical Speed
  ballY += speedY * ballDirection;
  // Horizontal Speed
  if (playerMoved) {
    ballX += speedX;
  }
  socket.emit('BallMove', {
    ballX,
    ballY,
    score
  })
}

// Determine What Ball Bounces Off, Score Points, Reset Ball
function ballBoundaries() {
  // Bounce off Left Wall
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
  // Bounce off Right Wall
  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }
  // Bounce off Bottom player paddle 
  if (ballY > height - paddleDiff) {
    if (ballX >= paddleX[ 0 ] && ballX <= paddleX[ 0 ] + paddleWidth) {
      // Add Speed on Hit
      if (playerMoved) {
        speedY += 1;
        // Max Speed
        if (speedY > 5) {
          speedY = 5;
         }
      }
      ballDirection = -ballDirection;
      trajectoryX[ 0 ] = ballX - (paddleX[ 0 ] + paddleDiff);
      speedX = trajectoryX[ 0 ] * 0.3;
    } else {
      // Reset Ball, add to Computer Score
      ballReset();
      score[ 1 ]++;
    }
  }
  // Bounce off Top player paddle 
  if (ballY < paddleDiff) {
    if (ballX >= paddleX[ 1 ] && ballX <= paddleX[ 1 ] + paddleWidth) {
      // Add Speed on Hit
      if (playerMoved) {
        speedY += 1;
        // Max Speed
        if (speedY > 5) {
          speedY = 5;
        }
      }
      ballDirection = -ballDirection;
      trajectoryX[ 1 ] = ballX - (paddleX[ 1 ] + paddleDiff);
      speedX = trajectoryX[ 1 ] * 0.3;
    } else {
      ballReset();
      score[ 0 ]++;
    }
  }
}

// Called Every Frame
function animate() {
  //console.log(playerNO, "isGameOver",isGameOver);
  if (!isGameOver)
    window.requestAnimationFrame(animate);
  /*  console.log("ball X", ballX);
   console.log("ball Y", ballY); */
  //MOVE THE BALL If THE REFEREE / 2nd PLAYER IS PRESENT
  if (isReferee) {
    ballMove();
    ballBoundaries();
  }
  renderCanvas();
  checkGameOver();
}


function showGameOverEl(winner) {
  console.log("Winner", winner);
  console.log("Status from gameOver-", playerStatus);
  console.log("score from gameOver-", score);
  let playerNoType = (playerNO % 2 === 0) ? "even" : "odd";
  // Hide Canvas
  canvas.hidden = true;
  // Container
  gameOverEl.textContent = '';
  gameOverEl.classList.add('game-over-container');
  // Title
  const title = document.createElement('h1');
  //check if THIS client/player WON
  if (playerNoType === winner)
    title.textContent = `You Won!😎`;
  else
    title.textContent = `You Lost 😔`;
  // Button
  const playAgainBtn = document.createElement('button');
  playAgainBtn.setAttribute('onclick', 'setPlayerStatus()');
  playAgainBtn.textContent = 'Play Again';
  // Append
  gameOverEl.append(title);
  gameOverEl.append(playAgainBtn);
  //append game over Div to the body
  document.body.append(gameOverEl);
}

// Check If One Player Has Winning Score, If They Do, End Game
function checkGameOver() {
  // console.log(score);
  if (score[ 0 ] === winningScore || score[ 1 ] === winningScore) {
    isGameOver = true;
    // Set Winner
    let winner = score[ 0 ] === winningScore ? "even" : "odd";
    //deactivate players
    playerStatus.fill(0);
   showGameOverEl(winner);
  }
}

function setPlayerStatus() {
  if (isGameOver && !isNewGame) {
    document.body.removeChild(gameOverEl);
    canvas.hidden = false;
  }
  console.log("play again clicked by player", playerNO);
  (playerNO % 2 === 0) ? playerStatus[ 0 ] = 1 : playerStatus[ 1 ] = 1;

  socket.emit("playerStatus", { playerStatus }, (response) => {
    if (response.status === 'ok') {
      if (playerStatus.every((val) => val === 1))
        socket.emit("startGame", { clientID: socket.id });
      else {
        console.log("rendering intro");
        renderIntro();
      }
    }
  });
  console.log(playerStatus);
}

function startGame() {
  /* SET Player & opponent indices
   1 - Client 1 / player 1/  TOP player,
   0 - Client 2 / player 2  referee/ Bottom Player, 
   */
    //reset Scores
  score = [ 0, 0 ];
  paddleIndex = isReferee ? 0 : 1;
  isGameOver = false;
  isNewGame = false;
  //set the playerStatus Data to 1-active in gameStart
  playerStatus.fill(1);
  animate();

  canvas.addEventListener('mousemove', (e) => {
    playerMoved = true;
    paddleX[ paddleIndex ] = e.offsetX;
    if (paddleX[ paddleIndex ] < 0) {
      paddleX[ paddleIndex ] = 0;
    }
    if (paddleX[ paddleIndex ] > (width - paddleWidth)) {
      paddleX[ paddleIndex ] = width - paddleWidth;
    }
    socket.emit("PaddleMove", {
      paddleIndex,
      paddlePositionX: paddleX[ paddleIndex ]
    })
    // Hide Cursor
    canvas.style.cursor = 'none';
    //  console.log(paddleX);
  });
  console.log("player", playerNO, "activity from gameStart-", playerStatus);
}

// Load Game, Reset Everything
function loadGame() {
  createCanvas();
  renderIntro();
  socket.emit('ready');
}

// On Load
loadGame();

socket.on('connect', () => {
  console.log('Connected.');
})

socket.on('PlayerReady', (playerData) => {
  console.log(`player ${playerData.readyPlayersCount} ready. ID= ${playerData._id}`);
  playerNO = playerData.readyPlayersCount;
})

socket.on('StartGame', (refereeId) => {
  isReferee = socket.id === refereeId;
  console.log('This player isReferee', isReferee, "Referee ID", refereeId);
  startGame();
})

socket.on("paddleMoveDataClient", (paddlePositionData) => {
  let opponentPaddle_Index = paddlePositionData.paddleIndex;
  paddleX[ opponentPaddle_Index ] = paddlePositionData.paddlePositionX;
});
socket.on("playerStatusDataClient", (playerStatusData, callback) => {
  playerStatus = playerStatusData.playerStatus;
  callback({ response: "ok" });
});

socket.on("BallMoveClient", (ballData) => {
  // console.log("ball move listening");
  ballX = ballData.ballX;
  ballY = ballData.ballY;
  score = ballData.score;
});

socket.on('disconnect', (reason) => {
  console.log(reason);
})