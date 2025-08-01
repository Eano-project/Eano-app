document.addEventListener("DOMContentLoaded", () => {
  const gameData = [
    {
      title: "EANO Cards",
      icon: "assets/card-icon.png",
      description: "A strategic card-matching game with EANO-themed symbols. Outsmart the EANO AI in this crypto-inspired challenge!",
      link: "card/index.html"
    },
    {
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
    img.onerror = () => { img.src = "assets/fallback.png"; };

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
