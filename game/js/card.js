const suits = ['Community', 'Marketplace', 'Trust', 'Innovation', 'Mainnet'];
const specialShapes = ['Square', 'Circle', 'Triangle', 'Block'];
const specialNumbers = {
  1: 'Hold On',
  2: 'Pick Two',
  8: 'Suspension',
  14: 'Marketplace'
};
const specialEffects = {
  Square: 'Pick2',
  Circle: 'Freeze',
  Triangle: 'Wild',
  Block: 'Reverse',
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
const playerAvatar = document.querySelector('.player-avatar');
const aiAvatar = document.querySelector('.ai-avatar');

const emotions = {
  happy: { text: ['Nice move!', 'You’re on fire!', 'Well played!'], animation: 'bounce' },
  sad: { text: ['Ouch, that hurt!', 'Invalid move!', 'Not my day...'], animation: 'shake' },
  angry: { text: ['No way!', 'You got me!', 'That’s unfair!'], animation: 'pulse' },
  laugh: { text: ['Haha, nice try!', 'Gotcha!', 'Oh, you’re funny!'], animation: 'bounce' },
  surprised: { text: ['What?!', 'Oh, no way!', 'Didn’t see that!'], animation: 'flash' },
  neutral: { text: ['Hmm...', 'Let’s see...', 'Play fast!'], animation: 'none' }
};

function createDeck() {
  const cards = [];
  for (const suit of suits) {
    for (let i = 1; i <= 14; i++) {
      cards.push({ suit, number: i, effect: specialNumbers[i] || null });
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
  if (!element) {
    console.error('Element not found:', element);
    return;
  }
  element.innerHTML = '';
  if (!hand || hand.length === 0) {
    console.warn('Hand is empty:', hand);
    return;
  }
  hand.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${isAi ? 'ai-card' : 'player-card'}`;
    cardDiv.style.backgroundImage = isAi ? `url(assets/images/back-card.png)` : `url(assets/images/eano-card-img.png)`;
    cardDiv.innerHTML = isAi ? '' : `
      <div class="suit">${card.suit || card.shape}</div>
      <div class="number">${card.shape ? '' : card.number}</div>
    `;
    if (!isAi) {
      cardDiv.addEventListener('click', () => playCard(index));
    }
    element.appendChild(cardDiv);
  });
}

function renderPile() {
  if (!playPileEl || !drawPileEl) {
    console.error('Pile elements missing:', { playPileEl, drawPileEl });
    return;
  }
  const topCard = pile[pile.length - 1] || { number: 0, suit: '' };
  playPileEl.innerHTML = `
    <div class="card">
      <div class="suit">${topCard.suit || topCard.shape}</div>
      <div class="number">${topCard.shape ? '' : topCard.number}</div>
    </div>
  `;
  drawPileEl.textContent = `${deck.length} cards left`;
}

function startGame() {
  if (!playerHandEl || !aiHandEl || !playPileEl || !drawPileEl || !statusEl) {
    console.error('Game elements missing:', { playerHandEl, aiHandEl, playPileEl, drawPileEl, statusEl });
    return;
  }
  deck = createDeck();
  if (deck.length < 54) {
    console.error('Deck creation failed, length:', deck.length);
    return;
  }
  playerHand = deck.splice(0, 7);
  aiHand = deck.splice(0, 7);
  pile = [deck.pop()];
  playerTurn = true;
  updateGame();
  statusEl.textContent = 'Your turn. Draw or play a card.';
  showSpeech(playerSpeech, playerAvatar, 'Let’s start!', 'happy');
}

function updateGame() {
  renderHand(playerHand, playerHandEl);
  renderHand(aiHand, aiHandEl, true);
  renderPile();
}

function playCard(index) {
  if (!playerTurn) {
    showSpeech(playerSpeech, playerAvatar, 'Not your turn!', 'sad');
    return;
  }
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
      showSpeech(playerSpeech, playerAvatar, emotions.happy.text[Math.floor(Math.random() * emotions.happy.text.length)], 'happy');
      setTimeout(aiTurn, 1500);
    } else {
      playSound('last-card-sound');
      showSpeech(playerSpeech, playerAvatar, 'I’m out! Game up!', 'happy');
    }
  } else {
    showSpeech(playerSpeech, playerAvatar, emotions.sad.text[Math.floor(Math.random() * emotions.sad.text.length)], 'sad');
  }
}

function canPlay(card, top) {
  return card.suit === top.suit || card.number === top.number || card.shape || top.shape || (specialNumbers[card.number] && specialNumbers[top.number]);
}

function applySpecialEffect(card) {
  if (card.effect) {
    switch (card.effect) {
      case 'Pick Two':
        playSound('pick-two-sound');
        for (let i = 0; i < 2 && deck.length > 0; i++) {
          aiHand.push(deck.pop());
        }
        showSpeech(aiSpeech, aiAvatar, emotions.sad.text[Math.floor(Math.random() * emotions.sad.text.length)], 'sad');
        break;
      case 'Suspension':
        playSound('suspension-sound');
        playerTurn = true;
        showSpeech(aiSpeech, aiAvatar, 'Suspended! Your turn again.', 'angry');
        break;
      case 'Hold On':
        playSound('hold-on-sound');
        playerTurn = false;
        showSpeech(playerSpeech, playerAvatar, 'Hold on, AI’s turn!', 'sad');
        setTimeout(aiTurn, 1500);
        break;
      case 'Marketplace':
        playSound('marketplace-sound');
        const newSuit = suits[Math.floor(Math.random() * suits.length)];
        pile[pile.length - 1].suit = newSuit;
        showSpeech(playerSpeech, playerAvatar, `Changed to ${newSuit}!`, 'happy');
        break;
      case 'Wild':
        playSound('marketplace-sound');
        const wildSuit = suits[Math.floor(Math.random() * suits.length)];
        pile[pile.length - 1].suit = wildSuit;
        showSpeech(playerSpeech, playerAvatar, `Wild to ${wildSuit}!`, 'happy');
        break;
      case 'Freeze':
        playSound('suspension-sound');
        playerTurn = true;
        showSpeech(aiSpeech, aiAvatar, 'Frozen! Your turn.', 'angry');
        break;
      case 'Reverse':
        playSound('marketplace-sound');
        showSpeech(aiSpeech, aiAvatar, emotions.surprised.text[Math.floor(Math.random() * emotions.surprised.text.length)], 'surprised');
        break;
    }
  }
}

function drawCard() {
  if (deck.length > 0 && playerTurn) {
    playerHand.push(deck.pop());
    updateGame();
    playerTurn = false;
    showSpeech(playerSpeech, playerAvatar, emotions.neutral.text[Math.floor(Math.random() * emotions.neutral.text.length)], 'neutral');
    setTimeout(aiTurn, 1500);
  } else {
    showSpeech(playerSpeech, playerAvatar, 'No cards left to draw!', 'sad');
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
      showSpeech(aiSpeech, aiAvatar, emotions.happy.text[Math.floor(Math.random() * emotions.happy.text.length)], 'happy');
      break;
    }
  }
  if (!played && deck.length > 0) {
    aiHand.push(deck.pop());
    showSpeech(aiSpeech, aiAvatar, emotions.neutral.text[Math.floor(Math.random() * emotions.neutral.text.length)], 'neutral');
  }
  updateGame();
  checkEnd();
  if (aiHand.length > 0) {
    playerTurn = true;
    statusEl.textContent = 'Your turn. Draw or play a card.';
  }
}

function showSpeech(bubble, avatar, text, emotion) {
  if (!bubble || !avatar) {
    console.error('Speech bubble or avatar missing:', { bubble, avatar });
    return;
  }
  bubble.textContent = text;
  bubble.classList.add(emotion);
  avatar.classList.add(`emotion-${emotion}`, emotions[emotion].animation);
  bubble.style.display = 'block';
  setTimeout(() => {
    bubble.style.display = 'none';
    bubble.classList.remove(emotion);
    avatar.classList.remove(`emotion-${emotion}`, emotions[emotion].animation);
  }, 2000);
}

function playSound(soundId) {
  const audio = document.getElementById(soundId);
  if (audio) {
    audio.play().catch(e => console.error('Sound error:', e));
  } else {
    console.warn('Sound not found:', soundId);
  }
}

function checkEnd() {
  if (playerHand.length === 0) {
    playSound('game-up-sound');
    showSpeech(playerSpeech, playerAvatar, 'EANO Game Up! You Win!', 'happy');
    setTimeout(() => alert('EANO Game Up! You Win!'), 1000);
    resetGame();
  } else if (aiHand.length === 0) {
    playSound('game-up-sound');
    showSpeech(aiSpeech, aiAvatar, 'EANO Game Up! I Win!', 'happy');
    setTimeout(() => alert('EANO Game Up! EANO AI Wins!'), 1000);
    resetGame();
  } else if (deck.length === 0 && !canPlayAny(playerHand, pile[pile.length - 1]) && !canPlayAny(aiHand, pile[pile.length - 1])) {
    showSpeech(playerSpeech, playerAvatar, 'Game Over: Draw!', 'neutral');
    setTimeout(() => alert('Game Over: Draw!'), 1000);
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

drawPileEl?.addEventListener('click', drawCard);
document.addEventListener('DOMContentLoaded', startGame);
