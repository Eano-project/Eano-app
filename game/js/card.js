// EANO 20 Card Game Logic - card.js

const deck = [ ...Array(4).fill(['1', '2', '3', '4', '5', '6', '7', '8', '10', '14', '20']).flatMap( (val) => [ { type: 'E', value: val }, { type: 'A', value: val }, { type: 'N', value: val }, { type: 'O', value: val }, ] ) ].flat();

let playerHand = []; let aiHand = []; let pile = []; let currentPlayer = 'player';

const table = document.querySelector('.table'); const pileEl = document.getElementById('pile'); const playerCardsEl = document.getElementById('player-cards'); const aiCardsEl = document.getElementById('ai-cards'); const playerSpeech = document.getElementById('player-speech'); const aiSpeech = document.getElementById('ai-speech'); const drawBtn = document.getElementById('draw-btn');

function shuffleDeck(deck) { for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } return deck; }

function drawCard(hand, count = 1) { for (let i = 0; i < count; i++) { if (deck.length > 0) hand.push(deck.pop()); } }

function renderHands() { playerCardsEl.innerHTML = ''; aiCardsEl.innerHTML = '';

playerHand.forEach((card, index) => { const div = document.createElement('div'); div.className = 'card'; div.innerText = ${card.type} ${card.value}; div.onclick = () => playCard('player', index); playerCardsEl.appendChild(div); });

aiHand.forEach(() => { const div = document.createElement('div'); div.className = 'card back'; aiCardsEl.appendChild(div); });

renderPile(); }

function renderPile() { pileEl.innerHTML = ''; const top = pile[pile.length - 1]; if (top) { const div = document.createElement('div'); div.className = 'card top'; div.innerText = ${top.type} ${top.value}; pileEl.appendChild(div); } }

function speak(who, text) { const el = who === 'player' ? playerSpeech : aiSpeech; const avatar = document.getElementById(${who}-avatar); el.innerText = text; el.classList.add('talk'); avatar.classList.add('talk'); setTimeout(() => { el.classList.remove('talk'); avatar.classList.remove('talk'); }, 1500); }

function canPlay(card) { const top = pile[pile.length - 1]; return !top || card.type === top.type || card.value === top.value; }

function playCard(who, index) { const hand = who === 'player' ? playerHand : aiHand; const card = hand[index];

if (!canPlay(card)) { speak(who, "Can't play that"); return; }

pile.push(...hand.splice(index, 1)); renderHands(); checkWinner(); if (who === 'player') setTimeout(aiTurn, 1000); }

function aiTurn() { let playable = aiHand.findIndex(canPlay); if (playable >= 0) { playCard('ai', playable); speak('ai', pickAiPhrase()); } else { drawCard(aiHand); speak('ai', 'Oh no! Drawing again...'); } renderHands(); currentPlayer = 'player'; }

function pickAiPhrase() { const phrases = [ 'Nice move!', 'Oh no way!', 'You got me!', 'I corner you!', 'Try harder!' ]; return phrases[Math.floor(Math.random() * phrases.length)]; }

function checkWinner() { if (playerHand.length === 0) { speak('player', '🎉 You win EANO 20!'); drawBtn.disabled = true; } else if (aiHand.length === 0) { speak('ai', '😎 Eano AI wins!'); drawBtn.disabled = true; } }

drawBtn.onclick = () => { if (currentPlayer !== 'player') return; drawCard(playerHand); renderHands(); speak('player', 'One more for luck!'); currentPlayer = 'ai'; setTimeout(aiTurn, 1000); };

function initGame() { shuffleDeck(deck); drawCard(playerHand, 5); drawCard(aiHand, 5); pile.push(deck.pop()); renderHands(); }

initGame();

