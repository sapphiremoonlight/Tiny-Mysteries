// scripts/game.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container main");
  const storyPath = localStorage.getItem("selectedStory");

  if (!storyPath) {
    container.innerHTML = "<p>No story selected! Go back and pick one.</p>";
    return;
  }

  // Load story JSON
  fetch(storyPath)
    .then(res => res.json())
    .then(story => {
      let currentClueIndex = 0;

      function showIntro() {
        container.innerHTML = `
          <header>
            <h1>${story.title}</h1>
            <p>${story.intro}</p>
          </header>
          <main>
            <button id="next-clue">Reveal First Clue</button>
          </main>
        `;
        document.getElementById("next-clue").addEventListener("click", showNextClue);
      }

      function showNextClue() {
        if (currentClueIndex >= story.clues.length) {
          showSuspects();
          return;
        }
        const clue = story.clues[currentClueIndex];
        currentClueIndex++;
        container.innerHTML = `
          <header>
            <h1>${story.title}</h1>
            <p>Clue ${currentClueIndex} of ${story.clues.length}</p>
          </header>
          <main>
            <div class="clue-card"><p>${clue}</p></div>
            <button id="next-clue">${currentClueIndex < story.clues.length ? "Next Clue" : "Reveal Suspects"}</button>
          </main>
        `;
        document.getElementById("next-clue").addEventListener("click", showNextClue);
      }

      function showSuspects() {
        const suspectsHTML = story.suspects.map(
          (s, index) => `<button class="suspect-btn" data-index="${index}">${s}</button>`
        ).join("");
        container.innerHTML = `
          <header>
            <h1>${story.title}</h1>
            <p>Who is the killer?</p>
          </header>
          <main>
            <div class="suspects">${suspectsHTML}</div>
          </main>
        `;
        document.querySelectorAll(".suspect-btn").forEach((btn) => {
          btn.addEventListener("click", () => checkAnswer(btn.textContent));
        });
      }

      function checkAnswer(selected) {
        container.innerHTML = `
          <header><h1>${story.title}</h1></header>
          <main>
            <div class="result-card">
              <p>${selected === story.killer ? "🎉 Correct!" : "❌ Wrong!"}</p>
              <p>The killer was: <strong>${story.killer}</strong></p>
            </div>
            <button id="play-again">Play Again</button>
          </main>
        `;
        document.getElementById("play-again").addEventListener("click", () => {
          window.location.href = "index.html";
        });
      }

      // Start with intro
      showIntro();
    })
    .catch(err => {
      container.innerHTML = "<p>Failed to load story.</p>";
      console.error(err);
    });
});
