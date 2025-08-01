// EANO 20 Card Game - card.js (based on Ludo.ai, customized)

const deck = []; const suits = ['E', 'A', 'N', 'O']; const values = ['1','2','3','4','5','6','7','8','10','14','20'];

// Build deck with suit and value suits.forEach(suit => { values.forEach(val => { deck.push({ suit, value: val }); }); });

let playerHand = [], aiHand = [], pile = []; let currentPlayer = 'player';

const pileEl = document.getElementById('pile'); const playerCardsEl = document.getElementById('player-cards'); const aiCardsEl = document.getElementById('ai-cards'); const playerSpeech = document.getElementById('player-speech'); const aiSpeech = document.getElementById('ai-speech'); const drawBtn = document.getElementById('draw-btn'); const startBtn = document.getElementById('start-game');

function shuffle(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

function drawCard(hand, count = 1) { for (let i = 0; i < count; i++) { if (deck.length > 0) { hand.push(deck.pop()); } } }

function renderHands() { playerCardsEl.innerHTML = ''; aiCardsEl.innerHTML = '';

playerHand.forEach((card, index) => { const div = document.createElement('div'); div.className = 'card'; div.textContent = ${card.suit} ${card.value}; div.onclick = () => playCard(index); playerCardsEl.appendChild(div); });

aiHand.forEach(() => { const div = document.createElement('div'); div.className = 'card back'; aiCardsEl.appendChild(div); });

renderPile(); }

function renderPile() { pileEl.innerHTML = ''; const top = pile[pile.length - 1]; if (top) { const div = document.createElement('div'); div.className = 'card top'; div.textContent = ${top.suit} ${top.value}; pileEl.appendChild(div); } }

function speak(who, message) { const speech = who === 'player' ? playerSpeech : aiSpeech; const avatar = document.getElementById(${who}-avatar); speech.textContent = message; speech.classList.add('talk'); avatar.classList.add('talk'); setTimeout(() => { speech.classList.remove('talk'); avatar.classList.remove('talk'); }, 1500); }

function canPlay(card) { const top = pile[pile.length - 1]; return !top || card.suit === top.suit || card.value === top.value; }

function playCard(index) { if (currentPlayer !== 'player') return; const card = playerHand[index];

if (canPlay(card)) { pile.push(...playerHand.splice(index, 1)); renderHands(); speak('player', pickSpeech('player')); checkWinner(); currentPlayer = 'ai'; setTimeout(aiTurn, 1500); } else { speak('player', 'Invalid move!'); } }

function aiTurn() { const index = aiHand.findIndex(canPlay); if (index >= 0) { pile.push(...aiHand.splice(index, 1)); renderHands(); speak('ai', pickSpeech('ai')); checkWinner(); } else { drawCard(aiHand); speak('ai', 'Oh no! Drawing again.'); } currentPlayer = 'player'; }

function checkWinner() { if (playerHand.length === 0) { speak('player', '🎉 You win! EANO 20'); drawBtn.disabled = true; } else if (aiHand.length === 0) { speak('ai', '😎 AI wins! EANO 20'); drawBtn.disabled = true; } }

function pickSpeech(who) { const phrases = { player: ['I got you!', 'My turn!', 'Eano time!', 'Watch this!', 'Let’s go!'], ai: ['Cornered you!', 'Haha nice!', 'Gotcha!', 'Play fast!', 'Oh, you got me!'] }; const pool = phrases[who]; return pool[Math.floor(Math.random() * pool.length)]; }

function initGame() { deck.length = 0; suits.forEach(suit => { values.forEach(val => { deck.push({ suit, value: val }); }); }); shuffle(deck);

playerHand = []; aiHand = []; pile = []; drawCard(playerHand, 5); drawCard(aiHand, 5); pile.push(deck.pop());

drawBtn.disabled = false; renderHands(); currentPlayer = 'player'; }

drawBtn.onclick = () => { if (currentPlayer !== 'player') return; drawCard(playerHand); renderHands(); speak('player', 'Picked a card...'); currentPlayer = 'ai'; setTimeout(aiTurn, 1500); };

startBtn.onclick = initGame;

document.addEventListener('DOMContentLoaded', initGame);

