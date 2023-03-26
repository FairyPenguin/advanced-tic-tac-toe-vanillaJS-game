// selectors
const gameBoard = document.querySelector("#gameboard");
const info = document.getElementById("info");
const newGameBtn = document.getElementById("new-game-btn");
let turn;

//winning possiblites combos array
// we have 8 winning combos (Nested Arrays)

const winningCombos = [
  [0, 1, 2], //top row
  [3, 4, 5], //middle row
  [6, 7, 8], //bottom row
  [0, 3, 6], //right column
  [1, 4, 7], //center column
  [2, 5, 8], //left column
  [0, 4, 8], //right-to-left diagonal
  [2, 4, 6], //left-to-right diagonal
];

// Create the Game-Board function

function createGameboard() {
  const emptyTiles = " ".repeat(9).split("");
  const tileGrid = emptyTiles
    .map((t) => `<button class="tile"></button>`)
    .join("");
  gameBoard.innerHTML = tileGrid;
  turn = "X";
  document.documentElement.style.setProperty("--hue", 10);

  info.textContent = `${turn}'s turn`;

  gameBoard.addEventListener("click", gameBoardClick);

  const allTiles = gameBoard.querySelectorAll(".tile");
  allTiles.forEach((t) => {
    t.addEventListener("mouseenter", mouseHover);
    t.addEventListener("mouseleave", mouseLeave);
  });
  gameBoard.removeAttribute("inert");
}

createGameboard();

// update turn function
function updateTurn() {
  turn = turn === "X" ? "O" : "X";
  info.textContent = `${turn}'s turn`;
  document.documentElement.style.setProperty("--hue", turn === "X" ? 10 : 200);
}

//restart game function

function restartGame() {
  let seconds = 3;
  const timer = setInterval(() => {
    info.textContent = `Restarting in ${seconds}…`;
    seconds--;
    if (seconds < 0) {
      // stop the interval

      clearInterval(timer);
      // restart game

      createGameboard();
    }
  }, 1000);
}

//congrats winner function
function showCongrats() {
  info.textContent = `${turn} wins!`;
  gameBoard.removeEventListener("click", gameBoardClick);
  gameBoard.setAttribute("inert", true);
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: ["🥳", "👏", "🎊", "🎉"],
  });

  setTimeout(restartGame, 1000);
}

// check the score function

// function checkScore() {
//   const allTiles = [...document.querySelectorAll(".tile")];
//   const tileValues = allTiles.map((t) => t.dataset.value);
//   const isWinner = winningCombos.some((combo) => {
//     const [a, b, c] = combo;
//     return (
//       tileValues[a] &&
//       tileValues[a] === tileValues[b] &&
//       tileValues[a] === tileValues[c]
//     );
//   });

//   if (isWinner) {
//     return showCongrats();
//   } else {
//     updateTurn();
//   }
// }

function checkScore() {
  const allTiles = [...document.querySelectorAll(".tile")];
  const tileValues = allTiles.map((t) => t.dataset.value);
  const isWinner = winningCombos.some((combo) => {
    const [a, b, c] = combo;
    return (
      tileValues[a] &&
      tileValues[a] === tileValues[b] &&
      tileValues[a] === tileValues[c]
    );
  });

  const isDraw = !isWinner && tileValues.every((val) => val !== undefined);

  if (isWinner) {
    return showCongrats();
  } else if (isDraw) {
    info.textContent = "It's a draw!";
    gameBoard.removeEventListener("click", gameBoardClick);
    gameBoard.setAttribute("inert", true);
    // setTimeout(restartGame, 1000);
    showNewGameBtn();
  } else {
    updateTurn();
  }
}

// gameBoardClick function

function gameBoardClick(e) {
  //check if the value exist
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    hideNewGameBtn();
    e.target.dataset.value = turn;
    e.target.style.setProperty("--hue", turn === "X" ? 10 : 200);
    checkScore();
  }
}

// mouse hover function

function mouseHover(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.hover = turn;
    e.target.style.setProperty("--hue", turn === "X" ? 10 : 200);
  }
}

// mouse leave function

function mouseLeave(e) {
  e.target.dataset.hover = "";
}

// new game function

function newGame() {
  newGameBtn.addEventListener("click", () => {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ["✖️", "🔴", "🎯", "🎮"],
    });
    jsConfetti.addConfetti({
      confettiRadius: 10,
    });
    createGameboard();
  });
  hideNewGameBtn();
}

newGame();

function showNewGameBtn() {
  const newGameBtn = document.getElementById("new-game-btn");
  newGameBtn.style.display = "initial";
}

function hideNewGameBtn() {
  const newGameBtn = document.getElementById("new-game-btn");
  newGameBtn.style.display = "none";
}
