const gameGrid = document.getElementById("gameGrid");
const diceBtn = document.getElementById("diceBtn");
const restartBtn = document.getElementById("restartBtn");
const diceFace = document.getElementById("diceFace");
const turnBanner = document.getElementById("turnBanner");
const p1Square = document.getElementById("p1Square");
const p2Square = document.getElementById("p2Square");
const playerOneBox = document.getElementById("playerOneBox");
const playerTwoBox = document.getElementById("playerTwoBox");

const ladderMap = { 6: 24, 15: 44, 28: 52, 41: 65, 53: 72, 64: 85, 73: 94 };
const snakeMap = { 26: 7, 39: 11, 48: 19, 59: 32, 68: 46, 79: 56, 88: 49, 98: 38 };
const dieSymbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

let playerPositions = [1, 1];
let activeIdx = 0;
let isFinished = false;

function initBoard() {
  gameGrid.innerHTML = "";
  for (let row = 9; row >= 0; row--) {
    const goRight = row % 2 === 0;
    for (let col = 0; col < 10; col++) {
      const num = goRight ? row * 10 + col + 1 : row * 10 + (10 - col);
      const tile = document.createElement("div");
      tile.className = `tile ${num % 2 === 0 ? "tile-even" : "tile-odd"}`;

      if (ladderMap[num]) tile.classList.add("has-ladder");
      if (snakeMap[num]) tile.classList.add("has-snake");

      const numLabel = document.createElement("span");
      numLabel.textContent = num;

      const jumpTag = document.createElement("span");
      jumpTag.className = "jump-tag";
      if (ladderMap[num]) jumpTag.textContent = `↑${ladderMap[num]}`;
      if (snakeMap[num]) jumpTag.textContent = `↓${snakeMap[num]}`;

      const pawnSlot = document.createElement("div");
      pawnSlot.className = "pawn-slot";
      pawnSlot.id = `slot-${num}`;

      tile.append(numLabel, jumpTag, pawnSlot);
      gameGrid.appendChild(tile);
    }
  }
  updatePawns();
}

function updatePawns() {
  document.querySelectorAll(".pawn-slot").forEach((slot) => (slot.innerHTML = ""));
  playerPositions.forEach((pos, i) => {
    const slot = document.getElementById(`slot-${pos}`);
    if (slot) {
      const pawn = document.createElement("span");
      pawn.className = `pawn pawn-${i + 1}`;
      slot.appendChild(pawn);
    }
  });
  p1Square.textContent = `Position: ${playerPositions[0]}`;
  p2Square.textContent = `Position: ${playerPositions[1]}`;
  playerOneBox.classList.toggle("active-turn", activeIdx === 0 && !isFinished);
  playerTwoBox.classList.toggle("active-turn", activeIdx === 1 && !isFinished);
}

diceBtn.addEventListener("click", () => {
  if (isFinished) return;

  const rolled = Math.floor(Math.random() * 6) + 1;
  diceFace.textContent = dieSymbols[rolled - 1];

  const name = `Player ${activeIdx + 1}`;
  let target = playerPositions[activeIdx] + rolled;
  let log = `${name} rolled a ${rolled}.`;

  if (target > 100) {
    log += " Needs exact number to finish!";
  } else {
    if (ladderMap[target]) {
      log += ` Ladder boost ${target} → ${ladderMap[target]}!`;
      target = ladderMap[target];
    } else if (snakeMap[target]) {
      log += ` Snake slide ${target} → ${snakeMap[target]}!`;
      target = snakeMap[target];
    }
    playerPositions[activeIdx] = target;
  }

  if (playerPositions[activeIdx] === 100) {
    turnBanner.textContent = `${name} wins the match!`;
    isFinished = true;
    diceBtn.disabled = true;
  } else {
    activeIdx = activeIdx === 0 ? 1 : 0;
    turnBanner.textContent = `${log} Next: Player ${activeIdx + 1}.`;
  }

  updatePawns();
});

restartBtn.addEventListener("click", () => {
  playerPositions = [1, 1];
  activeIdx = 0;
  isFinished = false;
  diceBtn.disabled = false;
  diceFace.textContent = "🎲";
  turnBanner.textContent = "Player 1 starts! Click Roll Dice.";
  updatePawns();
});

initBoard();
