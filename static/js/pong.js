const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7,
  color: "WHITE",
};
let paddle1 = {
  x: 0, // left side of canvas
  y: (canvas.height - 100) / 2, // -100 the height of paddle
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
};

let paddle2 = {
  x: canvas.width - 10, // - width of paddle
  y: (canvas.height - 100) / 2, // -100 the height of paddle
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
};

function drawRect(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

function drawText(text, x, y, color) {
  context.fillStyle = color;
  context.font = "75px fantasy";
  context.fillText(text, x, y);
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "BLACK");
  drawRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height, paddle1.color);
  drawRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height, paddle2.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
  drawText(paddle1.score, canvas.width / 4, canvas.height / 5, "WHITE");
  drawText(paddle2.score, (3 * canvas.width) / 4, canvas.height / 5, "WHITE");
}

function game() {
  update();
  render();
}

// control the paddle
document.addEventListener("keydown", controlPaddle);

function controlPaddle(event) {
  const keyPressed = event.keyCode;
  const paddleSpeed = 20;
  // W key
  if (keyPressed == 87 && paddle1.y > 0) {
    paddle1.y -= paddleSpeed;
  }
  // S Key
  else if (keyPressed == 83 && paddle1.y < canvas.height - paddle1.height) {
    paddle1.y += paddleSpeed;
  }
  // Up arrow
  else if (keyPressed == 38 && paddle2.y > 0) {
    paddle2.y -= paddleSpeed;
  }
  // Down arrow
  else if (keyPressed == 40 && paddle2.y < canvas.height - paddle2.height) {
    paddle2.y += paddleSpeed;
  }
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  // simple collision detection
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }
  let player = ball.x < canvas.width / 2 ? paddle1 : paddle2;
  if (collisionDetect(player, ball)) {
    // handle collision here
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    // increase ball speed
    ball.speed += 0.1;
  }
  // update the score
  if (ball.x - ball.radius < 0) {
    paddle2.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    paddle1.score++;
    resetBall();
  }
}

function collisionDetect(paddle, ball) {
  paddle.top = paddle.y;
  paddle.bottom = paddle.y + paddle.height;
  paddle.left = paddle.x;
  paddle.right = paddle.x + paddle.width;

  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  return (
    ball.right > paddle.left &&
    ball.top < paddle.bottom &&
    ball.left < paddle.right &&
    ball.bottom > paddle.top
  );
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;
  ball.velocityX = -ball.velocityX;
}
setInterval(game, 1000 / 50);
