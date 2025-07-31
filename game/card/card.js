const startBtn = document.getElementById("startGameBtn");
const startScreen = document.getElementById("start-screen");
const gameWrapper = document.getElementById("game-wrapper");
const drawPile = document.getElementById("draw-pile");
const discardPile = document.getElementById("discard-pile");
const playerHand = document.getElementById("player-hand");
const cpuHand = document.getElementById("cpu-hand");
const log = document.getElementById("log");

let deck = [];
let player = [];
let cpu = [];
let discard = [];
let currentPlayer = "player";

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let d = [];
  for (let s of suits) {
    for (let v of values) {
      d.push({ suit: s, value: v });
    }
  }
  return shuffle(d);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderHand(handEl, cards, isCpu = false) {
  handEl.innerHTML = "";
  cards.forEach((card, i) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    if (isCpu) {
      cardDiv.innerHTML = `<img src="game/assets/eano-card-img.png" alt="Card Back" width="60">`;
    } else {
      cardDiv.textContent = `${card.value}${card.suit}`;
      cardDiv.onclick = () => {
        if (currentPlayer === "player" && canPlay(card)) {
          discard.push(player.splice(i, 1)[0]);
          updateGame();
          checkWin();
          currentPlayer = "cpu";
          log.textContent = "CPU's turn...";
          setTimeout(cpuTurn, 800);
        }
      };
    }
    handEl.appendChild(cardDiv);
  });
}

function canPlay(card) {
  if (discard.length === 0) return true;
  let top = discard[discard.length - 1];
  return card.suit === top.suit || card.value === top.value;
}

function updateGame() {
  renderHand(playerHand, player, false);
  renderHand(cpuHand, cpu, true);
  if (discard.length > 0) {
    let top = discard[discard.length - 1];
    discardPile.textContent = `${top.value}${top.suit}`;
  } else {
    discardPile.textContent = "🃏";
  }
}

function drawCard(hand) {
  if (deck.length > 0) {
    hand.push(deck.pop());
    return true;
  } else {
    log.textContent = "Deck is empty!";
    return false;
  }
}

function cpuTurn() {
  for (let i = 0; i < cpu.length; i++) {
    if (canPlay(cpu[i])) {
      discard.push(cpu.splice(i, 1)[0]);
      log.textContent = "CPU played a card.";
      updateGame();
      checkWin();
      currentPlayer = "player";
      log.textContent = "Your turn. Draw or play a card.";
      return;
    }
  }
  if (drawCard(cpu)) {
    log.textContent = "CPU drew a card.";
  }
  updateGame();
  currentPlayer = "player";
  log.textContent = "Your turn. Draw or play a card.";
}

function checkWin() {
  if (player.length === 0) {
    log.textContent = "🎉 You win!";
    drawPile.onclick = null;
  } else if (cpu.length === 0) {
    log.textContent = "💻 CPU wins!";
    drawPile.onclick = null;
  }
}

drawPile.onclick = () => {
  if (currentPlayer !== "player") return;
  if (drawCard(player)) {
    log.textContent = "You drew a card.";
    updateGame();
    currentPlayer = "cpu";
    log.textContent = "CPU's turn...";
    setTimeout(cpuTurn, 800);
  }
};

startBtn.onclick = () => {
  deck = createDeck();
  player = deck.splice(0, 5);
  cpu = deck.splice(0, 5);
  discard = [];
  currentPlayer = "player";
  startScreen.style.display = "none";
  gameWrapper.style.display = "block";
  log.textContent = "Your turn. Draw or play a card.";
  updateGame();
};
