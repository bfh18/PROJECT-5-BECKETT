let gameRunning = false;
let dropMaker;
let timerInterval;
let timeLeft = 30;
let score = 0;

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const messageContainer = document.getElementById("message-container");

const winningMessages = [
  "You're a Water Hero!",
  "Clean Water Champion!",
  "You made waves!"
];

const losingMessages = [
  "Almost there! Try again.",
  "Don't give up!",
  "Better luck next time!"
];

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);

function startGame() {
  if (gameRunning) return;
  gameRunning = true;

  messageContainer.textContent = "";
  timeLeft = 30;
  score = 0;
  scoreDisplay.textContent = "0";
  timeDisplay.textContent = "30";

  dropMaker = setInterval(createDrop, 700);
  timerInterval = setInterval(updateTimer, 1000);
}

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = "0";
  timeDisplay.textContent = "30";
  messageContainer.textContent = "";
  document.getElementById("game-container").innerHTML = "";
}

function updateTimer() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function createDrop() {
  const drop = document.createElement("div");
  drop.className = "water-drop";

  const isBad = Math.random() < 0.25; // 25% chance bad drop
  if (isBad) drop.classList.add("bad-drop");

  const size = 60 * (Math.random() * 0.6 + 0.6);
  drop.style.width = drop.style.height = `${size}px`;

  const gameWidth = document.getElementById("game-container").offsetWidth;
  drop.style.left = Math.random() * (gameWidth - size) + "px";
  drop.style.animationDuration = "4s";

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    if (drop.classList.contains("bad-drop")) {
      score = Math.max(0, score - 1);
    } else {
      score++;
    }
    scoreDisplay.textContent = score;
    drop.remove();
  });

  drop.addEventListener("animationend", () => {
    drop.remove();
  });

  document.getElementById("game-container").appendChild(drop);
}

function endGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;

  const message = score >= 20
    ? winningMessages[Math.floor(Math.random() * winningMessages.length)]
    : losingMessages[Math.floor(Math.random() * losingMessages.length)];

  messageContainer.textContent = message;

  if (score >= 20) {
    triggerConfetti();
  }
}

// Simple win celebration
function triggerConfetti() {
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement("div");
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.position = "absolute";
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.top = "-10px";
    confetti.style.backgroundColor = ["#FFC907", "#2E9DF7", "#8BD1CB"][Math.floor(Math.random() * 3)];
    confetti.style.opacity = "0.8";
    confetti.style.zIndex = "999";
    confetti.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
    document.body.appendChild(confetti);

    confetti.addEventListener("animationend", () => confetti.remove());
  }
}

// Confetti animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}`;
document.head.appendChild(style);
