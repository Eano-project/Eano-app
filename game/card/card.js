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

function renderCard(card, container, isHidden = false) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  if (isHidden) {
    cardDiv.innerHTML = `<img src="game/assets/eano-card-back.png" alt="Hidden Card" width="60">`;
  } else {
    cardDiv.innerHTML = `<img src="game/assets/eano-card-img.png" alt="${card}" width="60">`;
  }

  container.appendChild(cardDiv);
}

function renderHand(handEl, cards, hide = false) {
  handEl.innerHTML = "";
  cards.forEach((card, index) => {
    let div = document.createElement("div");
    div.className = "card";
    div.textContent = hide ? "🂠" : card.value + card.suit;
    if (!hide) {
      div.onclick = () => {
        if (currentPlayer === "player" && canPlay(card)) {
          discard.push(player.splice(index, 1)[0]);
          updateGame();
          currentPlayer = "cpu";
          log.textContent = "CPU's turn...";
          setTimeout(cpuTurn, 1000);
        }
      };
    }
    handEl.appendChild(div);
  });
}

function canPlay(card) {
  if (discard.length === 0) return true;
  let top = discard[discard.length - 1];
  return card.suit === top.suit || card.value === top.value;
}

function cpuTurn() {
  for (let i = 0; i < cpu.length; i++) {
    if (canPlay(cpu[i])) {
      discard.push(cpu.splice(i, 1)[0]);
      log.textContent = "CPU played a card.";
      updateGame();
      currentPlayer = "player";
      log.textContent = "Your turn. Draw or play a card.";
      return;
    }
  }
  if (deck.length > 0) {
    cpu.push(deck.pop());
    log.textContent = "CPU drew a card.";
  }
  updateGame();
  currentPlayer = "player";
  log.textContent = "Your turn. Draw or play a card.";
}

function updateGame() {
  renderHand(playerHand, player);
  renderHand(cpuHand, cpu, true);
  discardPile.textContent = discard.length > 0 ? discard[discard.length - 1].value + discard[discard.length - 1].suit : "🃏";
}

drawPile.onclick = () => {
  if (currentPlayer !== "player") return;
  if (deck.length === 0) {
    log.textContent = "Deck is empty!";
    return;
  }
  player.push(deck.pop());
  log.textContent = "You drew a card.";
  updateGame();
};

startBtn.onclick = () => {
  deck = createDeck();
  player = deck.splice(0, 5);
  cpu = deck.splice(0, 5);
  discard = [];
  currentPlayer = "player";
  startScreen.style.display = "none";
  gameWrapper.style.display = "block";
  updateGame();
};
