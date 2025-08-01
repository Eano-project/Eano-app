// card.js (FULL GAME LOGIC)

const playerCardsEl = document.getElementById('playerCards'); const cpuCardsEl = document.getElementById('cpuCards'); const drawDeck = document.getElementById('draw-deck'); const playPile = document.getElementById('play-pile'); const turnInfo = document.getElementById('turn-info'); const gameScreen = document.getElementById('game-screen'); const messageLog = document.getElementById('message-log');

let deck = []; let playerHand = []; let cpuHand = []; let currentCard = null; let playerTurn = true;

const suits = ['Trust', 'Block', 'Circle', 'Triangle', 'Square']; const specialCards = ['Pick 2', 'Pick 3', 'Block', 'Trust']; const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function createDeck() { const fullDeck = []; for (let suit of suits) { for (let num of numbers) { fullDeck.push({ suit, num }); } for (let spec of specialCards) { fullDeck.push({ suit, special: spec }); } } return shuffle(fullDeck); }

function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

function startGame() { document.querySelector('.preview').classList.add('hidden'); gameScreen.classList.remove('hidden');

deck = createDeck(); playerHand = deck.splice(0, 6); cpuHand = deck.splice(0, 6); currentCard = deck.pop();

updateBoard(); log(Game started! You go first.); }

function updateBoard() { playerCardsEl.innerHTML = ''; cpuCardsEl.innerHTML = '';

for (let card of playerHand) { const div = createCardElement(card); div.onclick = () => playCard(card); playerCardsEl.appendChild(div); }

for (let card of cpuHand) { const div = createCardElement({ suit: '?', num: '?' }); cpuCardsEl.appendChild(div); }

playPile.innerText = renderCard(currentCard); turnInfo.innerText = playerTurn ? "Your turn" : "EANO AI's turn..."; }

function drawCard() { if (!playerTurn) return; const card = deck.pop(); if (card) playerHand.push(card); log(You drew a card.); playerTurn = false; updateBoard(); setTimeout(cpuMove, 1000); }

function playCard(card) { if (!playerTurn) return; if (!isValidPlay(card)) { log('Invalid move. Must match number or suit.'); return; } playerHand = playerHand.filter(c => c !== card); currentCard = card; log(You played ${renderCard(card)}); checkWin(); playerTurn = false; updateBoard(); setTimeout(cpuMove, 1000); }

function cpuMove() { const playable = cpuHand.find(card => isValidPlay(card)); if (playable) { cpuHand = cpuHand.filter(c => c !== playable); currentCard = playable; log(EANO played ${renderCard(playable)}); } else { const card = deck.pop(); if (card) { cpuHand.push(card); log(EANO drew a card.); } } checkWin(); playerTurn = true; updateBoard(); }

function isValidPlay(card) { if (card.num && currentCard.num && card.num === currentCard.num) return true; if (card.suit === currentCard.suit) return true; if (card.special && currentCard.special && card.special === currentCard.special) return true; return false; }

function createCardElement(card) { const div = document.createElement('div'); div.className = 'card'; div.innerText = renderCard(card); return div; }

function renderCard(card) { return card.special ? ${card.suit}\n(${card.special}) : ${card.suit}\n${card.num}; }

function checkWin() { if (playerHand.length === 0 || cpuHand.length === 0) { const winner = playerHand.length < cpuHand.length ? 'You Win! 🎉' : 'EANO Wins! 💪'; alert(winner); window.location.reload(); } }

function log(msg) { const p = document.createElement('p'); p.innerText = msg; messageLog.prepend(p); }

