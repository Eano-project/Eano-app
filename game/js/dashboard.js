// Sample game data (expand as needed)
const games = [
  {
    id: 'eano-card-game',
    title: 'EANO Card Game',
    description: "A strategic card-matching game with EANO-themed symbols. Outsmart the EANO AI in this crypto-inspired challenge!",
    image: 'assets/images/eano-card-img.png',
    link: 'card.html'
  }
  // Add more games here
      title: "EANO Conquest",
      icon: "assets/conquest-icon.png",
      description: "Engage in a virtual territory battle. Conquer zones, gain influence, and rise in the EANO world.",
      link: null
    },
    {
      title: "EANO Path",
      icon: "assets/path-icon.png",
      description: "Navigate your EANO avatar through obstacle paths and earn rewards. A mix of puzzle and reflex gameplay.",
      link: null
    },
    {
      title: "Coming Soon...",
      icon: "assets/coming-soon.png",
      description: "New EANO challenges are being prepared. Stay tuned!",
      link: null
    },
    {
      title: "Coming Soon...",
      icon: "assets/coming-soon.png",
      description: "More EANO games will arrive to test your strategy, speed, and skill. Get ready!",
      link: null
    }
];

// Populate game cards
function populateGameCards() {
  const container = document.querySelector('.container');
  if (!container) return;
  container.innerHTML = '';
  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.id = game.id;
    card.innerHTML = `
      <img src="${game.image}" alt="${game.title}">
      <h2>${game.title}</h2>
      <button onclick="window.location.href='${game.link}'">Play Now</button>
    `;
    container.appendChild(card);
  });
}

// Toggle sound (persists across pages using localStorage)
function toggleSound() {
  const isMuted = localStorage.getItem('soundMuted') === 'true';
  localStorage.setItem('soundMuted', !isMuted);
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio => (audio.muted = !isMuted));
  alert(`Sound ${!isMuted ? 'off' : 'on'}`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  populateGameCards();
  // Apply sound settings
  const isMuted = localStorage.getItem('soundMuted') === 'true';
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio => (audio.muted = isMuted));
});
