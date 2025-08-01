// card.js - EANO Card Game Logic

// DOM references const startButton = document.getElementById("start-game"); const playerHand = document.getElementById("player-hand"); const aiHand = document.getElementById("ai-hand"); const drawPile = document.getElementById("draw-pile"); const playPile = document.getElementById("play-pile"); const aiSpeech = document.getElementById("ai-speech"); const userSpeech = document.getElementById("user-speech"); const aiAvatar = document.getElementById("ai-avatar"); const userAvatar = document.getElementById("user-avatar");

// Game state let deck = []; let playerCards = []; let aiCards = []; let currentCard = null; let gameStarted = false;

// Card structure (basic 20 cards for testing) const baseCards = ["Circle", "Square", "Star", "Triangle"]; const eanoCards = []; baseCards.forEach(shape => { for (let i = 1; i <= 5; i++) { eanoCards.push({ type: shape, value: i }); } });

function shuffleDeck() { deck = [...eanoCards]; for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } }

function drawCard() { return deck.pop(); }

function renderHand(hand, container, isPlayer) { container.innerHTML = ""; hand.forEach((card, index) => { const cardEl = document.createElement("div"); cardEl.className = "card"; cardEl.innerText = ${card.type} ${card.value}; if (isPlayer) { cardEl.addEventListener("click", () => playCard(index)); } container.appendChild(cardEl); }); }

function updatePlayPile(card) { playPile.innerText = ${card.type} ${card.value}; currentCard = card; }

function playCard(index) { const card = playerCards[index]; if (card.type === currentCard.type || card.value === currentCard.value) { playerCards.splice(index, 1); updatePlayPile(card); renderHand(playerCards, playerHand, true); showUserReaction("Nice move! 😎"); setTimeout(aiTurn, 1500); } else { showUserReaction("Invalid card ❌"); } }

function aiTurn() { let played = false; for (let i = 0; i < aiCards.length; i++) { const card = aiCards[i]; if (card.type === currentCard.type || card.value === currentCard.value) { aiCards.splice(i, 1); updatePlayPile(card); renderHand(aiCards, aiHand, false); showAIReaction(["Hmm 🤔", "EANO Power! 💥", "Cornered you! 🧠"][Math.floor(Math.random() * 3)]); played = true; break; } }

if (!played && deck.length > 0) { aiCards.push(drawCard()); renderHand(aiCards, aiHand, false); showAIReaction("Drawing... 🃏"); } }

function showAIReaction(text) { aiSpeech.innerText = text; aiAvatar.classList.add("talk"); setTimeout(() => aiAvatar.classList.remove("talk"), 1000); }

function showUserReaction(text) { userSpeech.innerText = text; userAvatar.classList.add("talk"); setTimeout(() => userAvatar.classList.remove("talk"), 1000); }

function startGame() { gameStarted = true; shuffleDeck(); playerCards = [drawCard(), drawCard(), drawCard(), drawCard(), drawCard()]; aiCards = [drawCard(), drawCard(), drawCard(), drawCard(), drawCard()]; updatePlayPile(drawCard()); renderHand(playerCards, playerHand, true); renderHand(aiCards, aiHand, false); showAIReaction("EANO 20 begins!"); showUserReaction("Ready to roll 🎮"); }

startButton.addEventListener("click", startGame);

