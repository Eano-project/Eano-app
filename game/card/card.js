// card.js

const startGameBtn = document.getElementById("startGameBtn"); const startScreen = document.getElementById("start-screen"); const gameWrapper = document.getElementById("game-wrapper"); const loadingScreen = document.getElementById("loading-screen"); const playerCardsDiv = document.getElementById("playerCards"); const aiCardsDiv = document.getElementById("aiCards"); const drawPile = document.getElementById("draw-pile"); const discardPile = document.getElementById("discard-pile"); const gameLog = document.getElementById("game-log");

let deck = []; let playerHand = []; let aiHand = []; let discardTop = null; let turn = "player"; // or "ai"

const cardTypes = ["Core", "Block", "Triangle", "Star", "Cross"]; const specialCards = { 1: "Trust Pause", 2: "Network Drain", 8: "Suspension", 14: "General Market", 20: "WHOT" };

function buildDeck() { const newDeck = []; cardTypes.forEach((type) => { for (let i = 1; i <= 14; i++) { newDeck.push({ number: i, type }); } }); newDeck.push({ number: 20, type: "WHOT" }); return shuffle(newDeck); }

function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

function dealHands() { for (let i = 0; i < 5; i++) { playerHand.push(deck.pop()); aiHand.push(deck.pop()); } discardTop = deck.pop(); updateUI(); }

function updateUI() { // Update discard pile discardPile.innerText = ${discardTop.number}\n${discardTop.type};

// Player hand playerCardsDiv.innerHTML = ""; playerHand.forEach((card, index) => { const cardDiv = document.createElement("div"); cardDiv.className = "card"; cardDiv.innerText = ${card.number}\n${card.type}; cardDiv.onclick = () => playCard(index); playerCardsDiv.appendChild(cardDiv); });

// AI hand count only (hidden) aiCardsDiv.innerText = Cards: ${aiHand.length};

drawPile.onclick = () => { if (turn === "player") { drawCard(playerHand); gameLog.innerText = "You drew a card."; turn = "ai"; setTimeout(aiPlay, 1500); } }; }

function playCard(index) { if (turn !== "player") return; const card = playerHand[index]; if (card.number === discardTop.number || card.type === discardTop.type || card.type === "WHOT") { discardTop = card; playerHand.splice(index, 1); gameLog.innerText = You played ${card.number} (${card.type}); turn = "ai"; updateUI(); setTimeout(aiPlay, 1500); } else { gameLog.innerText = "Invalid move. Try another card or draw."; } }

function drawCard(hand) { if (deck.length === 0) deck = shuffle(buildDeck()); const card = deck.pop(); hand.push(card); updateUI(); }

function aiPlay() { let playableIndex = aiHand.findIndex( (card) => card.number === discardTop.number || card.type === discardTop.type || card.type === "WHOT" );

if (playableIndex !== -1) { discardTop = aiHand[playableIndex]; aiHand.splice(playableIndex, 1); gameLog.innerText = EANO AI played ${discardTop.number} (${discardTop.type}); } else { drawCard(aiHand); gameLog.innerText = "EANO AI drew a card."; } turn = "player"; updateUI(); }

function startGame() { loadingScreen.style.display = "block"; startScreen.style.display = "none"; setTimeout(() => { loadingScreen.style.display = "none"; gameWrapper.style.display = "block"; deck = buildDeck(); playerHand = []; aiHand = []; dealHands(); }, 1500); }

startGameBtn.addEventListener("click", startGame);

