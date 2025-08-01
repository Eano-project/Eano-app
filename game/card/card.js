// === EANO Cards Gameplay Script ===

const startBtn = document.getElementById("startGameBtn"); const startScreen = document.getElementById("start-screen"); const gameWrapper = document.getElementById("game-wrapper"); const drawPile = document.getElementById("draw-pile"); const discardPile = document.getElementById("discard-pile"); const playerHand = document.getElementById("player-hand"); const cpuHand = document.getElementById("cpu-hand"); const log = document.getElementById("log"); const audioDraw = new Audio("game/assets/snd-draw.mp3"); const audioPlay = new Audio("game/assets/snd-play.mp3"); const audioWin = new Audio("game/assets/snd-win.mp3"); const audioLose = new Audio("game/assets/snd-lose.mp3");

let deck = []; let player = []; let cpu = []; let discard = []; let currentPlayer = "player";

const cardTypes = ["Trust", "Marketplace", "Block", "Square"]; const suits = ["♠", "♥", "♦", "♣"]; const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck() { let d = []; for (let s of suits) { for (let v of values) { const type = cardTypes[Math.floor(Math.random() * cardTypes.length)]; d.push({ suit: s, value: v, type }); } } return shuffle(d); }

function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

function cardPower(value) { const powers = { A: 14, J: 11, Q: 12, K: 13 }; return powers[value] || parseInt(value); }

function renderHand(handEl, cards, hide = false) { handEl.innerHTML = ""; cards.forEach((card, index) => { const cardDiv = document.createElement("div"); cardDiv.className = "card"; if (hide) { cardDiv.innerHTML = <img src="game/assets/eano-card-back.png" alt="Hidden Card" width="60" />; } else { cardDiv.innerHTML = <img src="game/assets/eano-card-img.png" alt="${card.value}${card.suit}" width="60" />; cardDiv.title = ${card.value}${card.suit} - ${card.type}; cardDiv.onclick = () => { if (currentPlayer === "player" && canPlay(card)) { audioPlay.play(); discard.push(player.splice(index, 1)[0]); updateGame(); checkWin(); currentPlayer = "cpu"; log.textContent = "CPU's turn..."; setTimeout(cpuTurn, 1000); } }; } handEl.appendChild(cardDiv); }); }

function canPlay(card) { if (discard.length === 0) return true; const top = discard[discard.length - 1]; return card.suit === top.suit || card.value === top.value || card.type === top.type; }

function cpuTurn() { for (let i = 0; i < cpu.length; i++) { if (canPlay(cpu[i])) { audioPlay.play(); discard.push(cpu.splice(i, 1)[0]); log.textContent = "CPU played a card."; updateGame(); checkWin(); currentPlayer = "player"; log.textContent = "Your turn. Draw or play a card."; return; } } if (deck.length > 0) { audioDraw.play(); cpu.push(deck.pop()); log.textContent = "CPU drew a card."; } updateGame(); currentPlayer = "player"; log.textContent = "Your turn. Draw or play a card."; }

function updateGame() { renderHand(playerHand, player); renderHand(cpuHand, cpu, true); if (discard.length > 0) { const top = discard[discard.length - 1]; discardPile.innerHTML = ${top.value}${top.suit}<br><small>${top.type}</small>; } else { discardPile.innerHTML = "🃏"; } }

drawPile.onclick = () => { if (currentPlayer !== "player") return; if (deck.length === 0) { log.textContent = "Deck is empty!"; return; } audioDraw.play(); player.push(deck.pop()); log.textContent = "You drew a card."; updateGame(); };

function checkWin() { if (player.length === 0 || cpu.length === 0 || (deck.length === 0 && player.length === cpu.length)) { let playerScore = player.reduce((acc, c) => acc + cardPower(c.value), 0); let cpuScore = cpu.reduce((acc, c) => acc + cardPower(c.value), 0);

let msg = "";
if (playerScore > cpuScore) {
  msg = `🎉 You win! Score: ${playerScore} vs ${cpuScore}`;
  audioWin.play();
} else if (cpuScore > playerScore) {
  msg = `😢 CPU wins! Score: ${cpuScore} vs ${playerScore}`;
  audioLose.play();
} else {
  msg = `🤝 It's a tie! Score: ${playerScore} vs ${cpuScore}`;
}

log.innerHTML = msg;
currentPlayer = "none";

} }

startBtn.onclick = () => { deck = createDeck(); player = deck.splice(0, 5); cpu = deck.splice(0, 5); discard = []; currentPlayer = "player"; startScreen.style.display = "none"; gameWrapper.style.display = "block"; log.textContent = "Your turn. Draw or play a card."; updateGame(); };

