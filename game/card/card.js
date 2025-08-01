const suits = ['Trust', 'Marketplace', 'Community', 'Innovation'];
const suitAbbreviations = { Trust: 'TRS', Marketplace: 'MKP', Community: 'CMY', Innovation: 'INV' };
const specialShapes = ['Square', 'Circle', 'Triangle', 'Block'];
const specialEffects = {
  Square: 'Pick2',
  Circle: 'Freeze',
  Triangle: 'Wild',
  Block: 'Reverse'
};

let playerHand = [], aiHand = [], deck = [], pile = [], playerTurn = true;

const drawPileEl = document.getElementById('draw-pile');
const playPileEl = document.getElementById('play-pile');
const playerHandEl = document.getElementById('player-hand');
const aiHandEl = document.getElementById('ai-hand');
const statusEl = document.getElementById('status');
const playerSpeech = document.querySelector('.player-avatar .speech-bubble');
const aiSpeech = document.querySelector('.ai-avatar .speech-bubble');

function createDeck() {
  const cards = [];
  for (const suit of suits) {
    for (let i = 1; i <= 14; i++) {
      cards.push({ suit, number: i });
    }
  }
  for (const shape of specialShapes) {
    cards.push({ shape, number: 20, effect: specialEffects[shape] });
  }
  return shuffle(cards);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderHand(hand, element, isAi = false) {
  element.innerHTML = '';
  hand.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.style.backgroundImage = isAi ? `url(../assets/back-card.png)` : 'none';
    cardDiv.textContent = isAi ? '' : `${card.shape || card.number} ${card.shape ? '' : suitAbbreviations[card.suit]}`;
    if (!isAi) {
      cardDiv.addEventListener('click', () => playCard(index));
    }
    element.appendChild(cardDiv);
  });
}

function renderPile() {
  const topCard = pile[pile.length - 1];
  playPileEl.textContent = topCard ? `${topCard.shape || topCard.number} ${topCard.shape ? '' : suitAbbreviations[topCard.suit]}` : '';
  drawPileEl.textContent = `${deck.length} left`;
}

// Rest of the functions (startGame, updateGame, etc.) remain unchanged
