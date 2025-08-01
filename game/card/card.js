const suits = ['Community', 'Marketplace', 'Trust', 'Innovation', 'Mainnet'];
const specialShapes = ['Square', 'Circle', 'Triangle', 'Block'];
const specialNumbers = {
  1: 'Hold On',
  2: 'Pick Two',
  8: 'Suspension',
  14: 'Marketplace'
};
const specialEffects = {
  Square: 'Pick2', Circle: 'Freeze', Triangle: 'Wild', Block: 'Reverse',
  ...Object.fromEntries(Object.entries(specialNumbers).map(([k, v]) => [k, v]))
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
  if (!hand || hand.length === 0) {
    console.warn('Hand is empty or undefined, attempting to start game:', hand);
    startGame();
    return;
  }
  hand.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    if (isAi && !document.querySelector('../assets/back-card.png')) {
      console.error('Back card image not found at ../assets/back-card.png');
      cardDiv.style.backgroundColor = '#ccc'; // Fallback color
    } else {
      cardDiv.style.backgroundImage = isAi ? `url(../assets/back-card.png)` : 'none';
    }
    cardDiv.textContent = isAi ? '' : `${card.shape || card.number} ${card.suit || ''}`;
    if (!isAi) {
      cardDiv.addEventListener('click', () => playCard(index));
    }
    element.appendChild(cardDiv);
  });
}

function renderPile() {
  const topCard = pile[pile.length - 1] || { number: 0, suit: '' };
  playPileEl.textContent = `${topCard.shape || topCard.number} ${topCard.suit || ''}`;
  drawPileEl.textContent = `${deck.length} left`;
}

function startGame() {
  deck = createDeck();
  if (deck.length < 14) {
    console.error('Deck creation failed, length:', deck.length);
    return;
  }
  playerHand = deck.splice(0, 7);
  aiHand = deck.splice(0, 7);
  pile = [deck.pop()];
  playerTurn = true;
  updateGame();
  statusEl.textContent = 'Your turn. Draw or play a card.';
  console.log('Game started. Player hand:', playerHand, 'AI hand:', aiHand, 'Deck left:', deck.length, 'Elements:', { drawPileEl, playPileEl, playerHandEl, aiHandEl, statusEl });
}

function updateGame() {
  if (!playerHandEl || !aiHandEl || !playPileEl || !drawPileEl || !statusEl) {
    console.error('Game elements missing:', { playerHandEl, aiHandEl, playPileEl, drawPileEl, statusEl });
    return;
  }
  renderHand(playerHand, playerHandEl);
  renderHand(aiHand, aiHandEl, true);
  renderPile();
}

function playCard(index) {
  if (!playerTurn) return;
  const selected = playerHand[index];
  const top = pile[pile.length - 1];
  if (canPlay(selected, top)) {
    pile.push(playerHand.splice(index, 1)[0]);
    playSound('marketplace-sound');
    applySpecialEffect(selected);
    updateGame();
    checkEnd();
    if (playerHand.length > 0) {
      playerTurn = false;
      showSpeech(playerSpeech, 'Nice move!', 'happy');
      setTimeout(aiTurn, 1000);
    } else {
      playSound('last-card-sound');
      showSpeech(playerSpeech, 'Played last card!', 'happy');
    }
  } else {
    showSpeech(playerSpeech, 'Invalid move!', 'sad');
  }
}

function canPlay(card, top) {
  return card.suit === top.suit || card.number === top.number || card.shape || top.shape || (specialNumbers[card.number] && specialNumbers[top.number]);
}

function applySpecialEffect(card) {
  if (card.shape || specialNumbers[card.number]) {
    const effect = card.effect || specialNumbers[card.number];
    switch (effect) {
      case 'Pick Two':
        playSound('pick-two-sound');
        for (let i = 0; i < 2 && deck.length > 0; i++) {
          aiHand.push(deck.pop());
        }
        showSpeech(aiSpeech, 'Pick Two!', 'sad');
        break;
      case 'Suspension':
        playSound('suspension-sound');
        playerTurn = true;
        showSpeech(aiSpeech, 'Suspended!', 'angry');
        break;
      case 'Hold On':
        playSound('hold-on-sound');
        playerTurn = false;
        showSpeech(playerSpeech, 'Hold On!', 'sad');
        setTimeout(aiTurn, 1000);
        break;
      case 'Marketplace':
        playSound('marketplace-sound');
        const newSuit = suits[Math.floor(Math.random() * suits.length)];
        pile[pile.length - 1].suit = newSuit;
        showSpeech(playerSpeech, `Changed to ${newSuit}!`, 'happy');
        break;
      case 'Wild':
        const newSuit = suits[Math.floor(Math.random() * suits.length)];
        pile[pile.length - 1].suit = newSuit;
        showSpeech(playerSpeech, `Wild to ${newSuit}!`, 'happy');
        break;
      case 'Freeze':
        playerTurn = true;
        showSpeech(aiSpeech, 'Frozen!', 'angry');
        break;
      case 'Reverse':
        showSpeech(aiSpeech, 'Reversed, huh?', 'surprised');
        break;
    }
  }
}

function drawCard() {
  if (deck.length > 0 && playerTurn) {
    playerHand.push(deck.pop());
    updateGame();
    playerTurn = false;
    showSpeech(playerSpeech, 'Drew a card', 'neutral');
    setTimeout(aiTurn, 1000);
  } else {
    showSpeech(playerSpeech, 'No cards left to draw!', 'sad');
  }
}

function aiTurn() {
  const top = pile[pile.length - 1];
  let played = false;
  for (let i = 0; i < aiHand.length; i++) {
    if (canPlay(aiHand[i], top)) {
      pile.push(aiHand.splice(i, 1)[0]);
      applySpecialEffect(pile[pile.length - 1]);
      played = true;
      showSpeech(aiSpeech, 'Take that!', 'happy');
      break;
    }
  }
  if (!played && deck.length > 0) {
    aiHand.push(deck.pop());
    showSpeech(aiSpeech, 'Drawing...', 'neutral');
  }
  updateGame();
  checkEnd();
  if (aiHand.length > 0) {
    playerTurn = true;
    statusEl.textContent = 'Your turn. Draw or play a card.';
  }
}

function showSpeech(bubble, text, emotion) {
  bubble.textContent = text;
  bubble.classList.add(emotion);
  bubble.style.display = 'block';
  setTimeout(() => {
    bubble.style.display = 'none';
    bubble.classList.remove(emotion);
  }, 2000);
}

function playSound(soundId) {
  document.getElementById(soundId)?.play().catch(e => console.error('Sound error:', e));
}

function checkEnd() {
  if (playerHand.length === 0) {
    playSound('game-up-sound');
    alert('EANO Game Up! You Win!');
    resetGame();
  } else if (aiHand.length === 0) {
    playSound('game-up-sound');
    alert('EANO Game Up! EANO AI Wins!');
    resetGame();
  } else if (deck.length === 0 && !canPlayAny(playerHand, pile[pile.length - 1]) && !canPlayAny(aiHand, pile[pile.length - 1])) {
    alert('Game Over: Draw!');
    resetGame();
  }
}

function canPlayAny(hand, top) {
  return hand.some(card => canPlay(card, top));
}

function resetGame() {
  playerHand = [];
  aiHand = [];
  deck = [];
  pile = [];
  updateGame();
  statusEl.textContent = 'Game over. Start a new game.';
}

drawPileEl.addEventListener('click', drawCard);
document.addEventListener('DOMContentLoaded', startGame);
