// EANO 20 - card.js // Custom playable card game logic with AI and emoji suits

const suits = ['👥', '🏅', '🎙', '🛍', '🔗']; // Community, TrustScore, Studio, Marketplace, Mainnet const shapeMap = { '👥': 'Community', '🏅': 'TrustScore', '🎙': 'Studio', '🛍': 'Marketplace', '🔗': 'Mainnet' };

const specialNumbers = { 1: 'Hold On', 2: 'Pick Two', 3: 'Skip', 8: 'Suspension', 14: 'Marketplace', 20: 'EANO 20' };

let playerHand = [], aiHand = [], deck = [], pile = [], playerTurn = true;

const drawPileEl = document.getElementById('draw-pile'); const playPileEl = document.getElementById('play-pile'); const playerHandEl = document.getElementById('player-hand'); const aiHandEl = document.getElementById('ai-hand'); const playerSpeech = document.getElementById('player-speech'); const aiSpeech = document.getElementById('ai-speech');

const emotions = { happy: ['Nice move!', 'You’re on fire!', 'Well played!'], sad: ['Ouch!', 'Invalid move!', 'Not my day...'], angry: ['No way!', 'You got me!', 'That’s unfair!'], laugh: ['Haha!', 'Gotcha!', 'Funny!'], surprised: ['What?!', 'Oh no!', 'Didn’t see that!'], neutral: ['Hmm...', 'Play fast!'] };

function createDeck() { const cards = []; for (const suit of suits) { const numbers = [2, 4, 5, 7, 12, 14, 20, 3, 1, 8, 10, 11]; for (let num of numbers) { cards.push({ suit, number: num, effect: specialNumbers[num] || null }); } } return shuffle(cards); }

function shuffle(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

function renderHand(hand, element, isAi = false) { element.innerHTML = ''; hand.forEach((card, index) => { const cardDiv = document.createElement('div'); cardDiv.className = card ${isAi ? 'ai-card' : 'player-card'}; cardDiv.innerHTML = isAi ? '' : <div class="emoji">${card.suit}</div><div class="number">${card.number}</div>; if (!isAi) { cardDiv.addEventListener('click', () => playCard(index)); } element.appendChild(cardDiv); }); }

function renderPile() { playPileEl.innerHTML = ''; const top = pile[pile.length - 1]; if (!top) return; const cardDiv = document.createElement('div'); cardDiv.className = 'card played-card'; cardDiv.innerHTML = <div class="emoji">${top.suit}</div><div class="number">${top.number}</div>; playPileEl.appendChild(cardDiv); drawPileEl.innerHTML = '<div class="card back-card"></div>'; }

function startGame() { deck = createDeck(); playerHand = deck.splice(0, 7); aiHand = deck.splice(0, 7); pile = [deck.pop()]; playerTurn = true; updateGame(); speak(playerSpeech, 'Let’s start!', 'happy'); }

function updateGame() { renderHand(playerHand, playerHandEl); renderHand(aiHand, aiHandEl, true); renderPile(); }

function playCard(index) { if (!playerTurn) return speak(playerSpeech, 'Not your turn!', 'sad'); const selected = playerHand[index]; const top = pile[pile.length - 1]; if (selected.suit === top.suit || selected.number === top.number) { pile.push(playerHand.splice(index, 1)[0]); applyEffect(selected); updateGame(); if (playerHand.length === 0) { speak(playerSpeech, 'EANO Game Up! You Win!', 'happy'); return; } playerTurn = false; setTimeout(aiTurn, 1500); } else { speak(playerSpeech, 'You can’t play that!', 'angry'); } }

function drawCard() { if (playerTurn && deck.length > 0) { playerHand.push(deck.pop()); updateGame(); playerTurn = false; setTimeout(aiTurn, 1500); } }

drawPileEl.addEventListener('click', drawCard);

function aiTurn() { const top = pile[pile.length - 1]; let played = false; for (let i = 0; i < aiHand.length; i++) { const card = aiHand[i]; if (card.suit === top.suit || card.number === top.number) { pile.push(aiHand.splice(i, 1)[0]); applyEffect(card); played = true; break; } } if (!played && deck.length > 0) aiHand.push(deck.pop()); updateGame(); if (aiHand.length === 0) { speak(aiSpeech, 'I win! Game up!', 'laugh'); return; } playerTurn = true; speak(aiSpeech, 'Your move.', 'neutral'); }

function speak(bubble, text, mood) { bubble.textContent = text; bubble.className = speech-bubble ${mood}; bubble.style.display = 'block'; setTimeout(() => { bubble.style.display = 'none'; }, 2000); }

function applyEffect(card) { if (!card.effect) return; switch (card.effect) { case 'Pick Two': for (let i = 0; i < 2 && deck.length > 0; i++) aiHand.push(deck.pop()); break; case 'Suspension': playerTurn = true; break; case 'Marketplace': pile[pile.length - 1].suit = suits[Math.floor(Math.random() * suits.length)]; break; case 'Hold On': playerTurn = false; break; case 'EANO 20': // force opponent to play a random card break; } }

document.addEventListener('DOMContentLoaded', startGame);

