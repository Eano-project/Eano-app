// card.js
document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.querySelector('.play-btn');
  const gameContainer = document.querySelector('.game-container');
  const drawDeck = document.getElementById('draw-deck');
  const playPile = document.getElementById('play-pile');
  const playerHand = document.getElementById('player-hand');
  const cpuHand = document.getElementById('cpu-hand');
  const statusText = document.getElementById('status');

  // Simulated card data
  const deck = [
    '🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪'
  ];

  let playerCards = [];
  let cpuCards = [];

  // Start the game when play button is clicked
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      initializeGame();
    });
  }

  function initializeGame() {
    // Shuffle deck
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    playerCards = shuffled.slice(0, 3);
    cpuCards = shuffled.slice(3, 6);

    // Display cards
    displayHand(playerHand, playerCards);
    displayHand(cpuHand, cpuCards, true); // hide CPU cards
    statusText.textContent = 'Your turn: Draw or Play a card.';
  }

  function displayHand(container, cards, hidden = false) {
    container.innerHTML = '';
    cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.textContent = hidden ? '🂠' : card;
      cardEl.style.display = 'inline-block';
      cardEl.style.margin = '5px';
      cardEl.style.fontSize = '2rem';
      container.appendChild(cardEl);
    });
  }

  // Optional: Handle click on draw deck
  drawDeck.addEventListener('click', () => {
    if (deck.length === 0) {
      statusText.textContent = 'No more cards to draw.';
      return;
    }
    const drawnCard = deck.pop();
    playerCards.push(drawnCard);
    displayHand(playerHand, playerCards);
    statusText.textContent = `You drew a card: ${drawnCard}`;
  });
});
