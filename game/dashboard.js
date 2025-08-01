// dashboard.js - Dynamic logic for EANO Game Hub

document.addEventListener('DOMContentLoaded', () => { const games = [ { id: 'eano-card', name: 'EANO 20 (Card Game)', description: 'Challenge AI or friends in a crypto card game.', link: 'card.html', status: 'playable' }, { id: 'eano-conquest', name: 'EANO Conquest (Ludo-style)', description: 'Coming soon: Battle for EANO dominance in a strategic conquest game.', link: '#', status: 'coming-soon' }, { id: 'eano-path', name: 'EANO Path (Snake & Ladder)', description: 'Coming soon: Navigate your character through EANO ladders and traps.', link: '#', status: 'coming-soon' } ];

const container = document.querySelector('.hub-container');

games.forEach(game => { const tile = document.createElement('div'); tile.className = 'game-tile';

const title = document.createElement('h2');
title.textContent = game.name;

const desc = document.createElement('p');
desc.textContent = game.description;

const button = document.createElement('button');
button.textContent = game.status === 'playable' ? 'Play Now' : 'Coming Soon';
button.disabled = game.status !== 'playable';

if (game.status === 'playable') {
  button.addEventListener('click', () => {
    window.location.href = game.link;
  });
}

tile.appendChild(title);
tile.appendChild(desc);
tile.appendChild(button);
container.appendChild(tile);

}); });

