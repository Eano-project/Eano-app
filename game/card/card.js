// card.js – EANO Card Game Full AI Logic

const suits = ['Trust', 'Marketplace', 'Community', 'Innovation']; const specialShapes = ['Square', 'Circle', 'Triangle', 'Block']; const cardBack = 'game/assets/eano-card-img.png';

let playerHand = []; let cpuHand = []; let deck = []; let pile = []; let playerTurn = true;

const drawDeckEl = document.getElementById('draw-deck'); const playPileEl = document.getElementById('play-pile'); const playerHandEl = document.getElementById('player-hand'); const cpuHandEl = document.getElementById('cpu-hand'); const statusEl = document.getElementById('status');

function createDeck() { let cards = []; for (let suit of suits) { for (let i = 1; i <= 14; i++) { cards.push({ suit, number: i }); } } for (let shape of specialShapes) { cards.push({ shape, number: 20 }); } return shuffle(cards); }

function shuffle(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

function renderHand(hand, element, isCpu = false) { element.innerHTML = ''; hand.forEach((card, index) => { const cardDiv = document.createElement('div'); cardDiv.className = 'card'; cardDiv.style.backgroundImage = isCpu ? url('${cardBack}') : 'none'; cardDiv.textContent = isCpu ? '' : ${card.shape || card.number} ${card.suit || ''}; if (!isCpu) { cardDiv.addEventListener('click', () => playCard(index)); } element.appendChild(cardDiv); }); }

function startGame() { deck = createDeck(); playerHand = deck.splice(0, 7); cpuHand = deck.splice(0, 7); pile = [deck.pop()]; playerTurn = true; updateGame(); statusEl.textContent = 'Your turn. Draw or play a card.'; }

function updateGame() { renderHand(playerHand, playerHandEl); renderHand(cpuHand, cpuHandEl, true); playPileEl.textContent = ${pile[pile.length - 1].shape || pile[pile.length - 1].number} ${pile[pile.length - 1].suit || ''}; drawDeckEl.textContent = deck.length + ' left'; }

function playCard(index) { const selected = playerHand[index]; const top = pile[pile.length - 1]; if (canPlay(selected, top)) { pile.push(playerHand.splice(index, 1)[0]); updateGame(); checkEnd(); playerTurn = false; setTimeout(cpuTurn, 1000); } else { alert('Invalid move!'); } }

function canPlay(card, top) { return card.suit === top.suit || card.number === top.number || card.shape || top.shape; }

function drawCard() { if (deck.length > 0 && playerTurn) { playerHand.push(deck.pop()); updateGame(); playerTurn = false; setTimeout(cpuTurn, 1000); } }

drawDeckEl.addEventListener('click', drawCard);

function cpuTurn() { let top = pile[pile.length - 1]; let played = false; for (let i = 0; i < cpuHand.length; i++) { if (canPlay(cpuHand[i], top)) { pile.push(cpuHand.splice(i, 1)[0]); played = true; break; } } if (!played && deck.length > 0) { cpuHand.push(deck.pop()); } updateGame(); checkEnd(); playerTurn = true; statusEl.textContent = 'Your turn. Draw or play a card.'; }

function checkEnd() { if (playerHand.length === 0 || cpuHand.length === 0 || deck.length === 0) { let playerScore = playerHand.reduce((acc, card) => acc + (card.number || 0), 0); let cpuScore = cpuHand.reduce((acc, card) => acc + (card.number || 0), 0); let winner = 'Draw'; if (playerScore < cpuScore) winner = 'You Win!'; else if (playerScore > cpuScore) winner = 'CPU Wins!'; alert(${winner} Final Score - You: ${playerScore} | CPU: ${cpuScore}); resetGame(); } }

function resetGame() { playerHand = []; cpuHand = []; deck = []; pile = []; updateGame(); statusEl.textContent = 'Game over. Click Start Game to play again.'; }

// Auto-start if needed document.addEventListener('DOMContentLoaded', () => { updateGame(); });

