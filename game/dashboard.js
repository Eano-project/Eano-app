document.addEventListener("DOMContentLoaded", () => {
  const gameData = [
    {
      title: "EANO Cards",
      icon: "assets/card-icon.png",
      description: "A strategic card-matching game with EANO-themed symbols. Outsmart the EANO AI in this crypto-inspired challenge!",
      link: "card/index.html" // Navigates to the game
    },
    {
      title: "Coming Soon...",
      icon: "assets/coming-soon.png",
      description: "New EANO challenges are being prepared. Stay tuned!",
      link: null // No link for placeholders
    }
  ];

  const container = document.querySelector(".container");
  if (!container) {
    console.error("Container element not found!");
    return;
  }

  function createGameCard({ title, icon, description, link }) {
    const card = document.createElement("div");
    card.className = `game-card ${link ? "" : "disabled"}`;
    card.setAttribute("aria-label", `Select ${title} game`);
    if (link) {
      card.onclick = () => window.location.href = link;
    } else {
      card.onclick = () => alert(`${title}\n\n${description}`);
    }

    const img = document.createElement("img");
    img.src = icon;
    img.alt = title;
    img.onerror = () => { img.src = "assets/fallback.png"; }; // Fallback if icon is missing

    const titleEl = document.createElement("h3");
    titleEl.textContent = title;

    const desc = document.createElement("p");
    desc.textContent = description;

    card.appendChild(img);
    card.appendChild(titleEl);
    card.appendChild(desc);
    return card;
  }

  gameData.forEach(game => container.appendChild(createGameCard(game)));
});
