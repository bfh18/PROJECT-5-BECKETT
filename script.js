// Game state
let gameRunning = false;
let dropMaker, timerInterval;
let timeLeft, score, milestoneIndex;

// Difficulty settings
const difficulties = {
  easy:   { time: 40, target: 15, spawnRate: 900, badChance: 0.15 },
  normal: { time: 30, target: 20, spawnRate: 700, badChance: 0.25 },
  hard:   { time: 20, target: 25, spawnRate: 500, badChance: 0.35 },
};

// Milestones
const milestoneScores = [5, 10, 20];
const milestoneMessages = [
  "Great start!",
  "Halfway there!",
  "Almost legendary!"
];

// Win/Lose messages
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

// Sound effects
const sfx = {
  collect: new Audio('audio/collect.mp3'),
  miss:    new Audio('audio/miss.mp3'),
  button:  new Audio('audio/button.mp3'),
  win:     new Audio('audio/win.mp3'),
};

// DOM refs
const scoreDisplay = document.getElementById("score");
const timeDisplay  = document.getElementById("time");
const messageContainer = document.getElementById("message-container");
const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');

document.getElementById("start-btn").addEventListener("click", () => {
  sfx.button.play();
  startGame();
});
document.getElementById("reset-btn").addEventListener("click", () => {
  sfx.button.play();
  resetGame();
});

function getDifficulty() {
  return [...difficultyInputs].find(i => i.checked).value;
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  messageContainer.textContent = "";

  // Initialize based on difficulty
  const diff = difficulties[getDifficulty()];
  timeLeft = diff.time;
  score   = 0;
  milestoneIndex = 0;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  dropMaker = setInterval(createDrop, diff.spawnRate);
  timerInterval = setInterval(updateTimer, 1000);
}

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;
  document.getElementById("game-container").innerHTML = "";
  messageContainer.textContent = "";
  scoreDisplay.textContent = "0";
  timeDisplay.textContent = difficulties[getDifficulty()].time;
}

function updateTimer() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function createDrop() {
  const drop = document.createElement("div");
  drop.className = "water-drop";

  const diff = difficulties[getDifficulty()];
  const isBad = Math.random() < diff.badChance;
  if (isBad) drop.classList.add("bad-drop");

  const size = 60 * (Math.random() * 0.6 + 0.6);
  drop.style.width = drop.style.height = `${size}px`;
  drop.style.left = Math.random() * (document.getElementById("game-container").offsetWidth - size) + "px";
  drop.style.animationDuration = diff.time + "s";

  drop.addEventListener("click", () => {
    if (!gameRunning) return;
    if (isBad) {
      score = Math.max(0, score - 1);
      sfx.miss.play();
    } else {
      score++;
      sfx.collect.play();
    }
    scoreDisplay.textContent = score;
    drop.remove();
    checkMilestone();
  });

  drop.addEventListener("animationend", () => drop.remove());
  document.getElementById("game-container").appendChild(drop);
}

function checkMilestone() {
  if (milestoneIndex < milestoneScores.length && score >= milestoneScores[milestoneIndex]) {
    messageContainer.textContent = milestoneMessages[milestoneIndex];
    milestoneIndex++;
  }
}

function endGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;

  const diff = difficulties[getDifficulty()];
  const message = score >= diff.target
    ? winningMessages[Math.floor(Math.random() * winningMessages.length)]
    : losingMessages[Math.floor(Math.random() * losingMessages.length)];

  messageContainer.textContent = message;
  sfx.win.play();
  if (score >= diff.target) triggerConfetti();
}

// Confetti celebration
function triggerConfetti() {
  for (let i = 0; i < 60; i++) {
    const conf = document.createElement("div");
    conf.style.cssText = `
      width: 10px; height: 10px;
      position: absolute;
      left: ${Math.random() * window.innerWidth}px;
      top: -10px;
      background-color: ${['#FFC907','#2E9DF7','#8BD1CB'][Math.floor(Math.random()*3)]};
      opacity: .8;
      animation: fall ${Math.random()*2+2}s linear forwards;
      z-index: 999;
    `;
    document.body.appendChild(conf);
    conf.addEventListener("animationend", () => conf.remove());
  }
}

const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes fall {
    to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(styleTag);
