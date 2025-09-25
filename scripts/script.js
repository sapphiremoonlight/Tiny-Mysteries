document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // SELECT BUTTONS
  // ============================
  const createBtn = document.getElementById("create-game");
  const joinBtn = document.getElementById("join-game");
  const container = document.querySelector(".container");

  // Available stories
  const stories = [
    {
      title: "Dinner Party Disaster",
      file: "stories/dinner_party_disaster.json",
      img: "https://i.pinimg.com/1200x/94/8e/3e/948e3ee71188b3071c78ccc3a7a769c3.jpg"
    },
    {
      title: "Museum Heist",
      file: "stories/museum_heist.json",
      img: "https://i.pinimg.com/736x/13/ea/b0/13eab07282d7f25ad347263af6f908a2.jpg"
    },
    {
      title: "Haunted Manor",
      file: "stories/haunted_manor.json",
      img: "https://i.pinimg.com/736x/cc/0e/e6/cc0ee66840fec6166a5855b87a892e7b.jpg"
    },
    {
      title: "Train Mystery",
      file: "stories/train_mystery.json",
      img: "https://i.pinimg.com/736x/30/ea/a4/30eaa4c2eecf6dc5563bc76b5da9e8c4.jpg"
    },
    {
      title: "Island Escape",
      file: "stories/island_escape.json",
      img: "https://i.pinimg.com/736x/d7/c5/e7/d7c5e7887e26619948af2bbeeb871c8b.jpg"
    }
  ];

  // ============================
  // CREATE GAME → SHOW STORY OPTIONS
  // ============================
  createBtn.addEventListener("click", () => {
    container.innerHTML = `
      <header>
        <h1>Choose Your Mystery</h1>
        <p>Select a story to start playing</p>
      </header>
      <main class="story-grid">
        ${stories.map(story => `
          <div class="story-card" data-file="${story.file}">
            <img src="${story.img}" alt="${story.title}">
            <h2>${story.title}</h2>
          </div>
        `).join("")}
      </main>
    `;

    document.querySelectorAll(".story-card").forEach(card => {
      card.addEventListener("click", () => {
        const file = card.dataset.file;
        localStorage.setItem("selectedStory", file);
        window.location.href = "game.html"; // redirect to game page
      });
    });
  });

  // ============================
  // JOIN GAME
  // ============================
  joinBtn.addEventListener("click", () => {
    const story = localStorage.getItem("selectedStory");
    if (story) {
      alert("Joining the last created game...");
      window.location.href = "game.html";
    } else {
      alert("No game created yet! Ask someone to create a game first.");
    }
  });
});
