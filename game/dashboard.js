document.addEventListener("DOMContentLoaded", () => {
  const gameData = [
    {
      title: "EANO Cards",
      icon: "assets/card-icon.png",
      description: "A strategic card-matching game where players win points by pairing EANO-themed symbols. Perfect for quick fun and testing your memory.",
    },
    {
      title: "EANO Conquest",
      icon: "assets/conquest-icon.png",
      description: "Engage in a virtual territory battle. Conquer zones, gain influence, and rise in the EANO world. Inspired by classic conquest board games.",
    },
    {
      title: "EANO Path",
      icon: "assets/path-icon.png",
      description: "Navigate your EANO avatar through obstacle paths and earn rewards. A mix of puzzle and reflex gameplay. Fast-paced and skill-based.",
    },
    {
      title: "Coming Soon...",
      icon: "assets/coming-soon.png",
      description: "New EANO challenges are being prepared. Stay tuned for fresh games dropping soon!"
    },
    {
      title: "Coming Soon...",
      icon: "assets/coming-soon.png",
      description: "More EANO games will arrive to test your strategy, speed, and skill. Get ready!"
    }
  ];

  const container = document.querySelector(".container");

  gameData.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.onclick = () => alert(`${game.title}\n\n${game.description}`);

    const img = document.createElement("img");
    img.src = game.icon;
    img.alt = game.title;

    const title = document.createElement("h3");
    title.textContent = game.title;

    const desc = document.createElement("p");
    desc.textContent = game.description;
    desc.style.fontSize = "0.8rem";
    desc.style.marginTop = "10px";
    desc.style.color = "#ccc";

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);

    container.appendChild(card);
  });
});
