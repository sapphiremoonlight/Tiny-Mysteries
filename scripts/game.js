document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("main.container");
  const backHomeBtn = document.getElementById("back-home");
  backHomeBtn.addEventListener("click", () => window.location.href = "index.html");

  const storyPath = localStorage.getItem("selectedStory");
  if (!storyPath) {
    container.innerHTML = "<p>No story selected! Go back and pick one.</p>";
    return;
  }

  fetch(storyPath)
    .then(res => res.json())
    .then(story => {
      let currentClueIndex = 0;

      function showIntro() {
        container.innerHTML = `
          <h1>${story.title}</h1>
          <p>${story.intro}</p>
          <button id="next-clue">Reveal First Clue</button>
        `;
        document.getElementById("next-clue").addEventListener("click", showNextClue);
      }

      function showNextClue() {
        if (currentClueIndex >= story.clues.length) return showSuspects();
        const clue = story.clues[currentClueIndex++];
        container.innerHTML = `
          <h1>${story.title}</h1>
          <p>Clue ${currentClueIndex} of ${story.clues.length}</p>
          <div class="clue-card"><p>${clue}</p></div>
          <button id="next-clue">${currentClueIndex < story.clues.length ? "Next Clue" : "Reveal Suspects"}</button>
        `;
        document.getElementById("next-clue").addEventListener("click", showNextClue);
      }

      function showSuspects() {
        const suspectsHTML = story.suspects.map(s => `<button class="suspect-btn">${s}</button>`).join("");
        container.innerHTML = `
          <h1>${story.title}</h1>
          <p>Who is the killer?</p>
          <div class="suspects">${suspectsHTML}</div>
        `;
        document.querySelectorAll(".suspect-btn").forEach(btn => {
          btn.addEventListener("click", () => checkAnswer(btn.textContent));
        });
      }

      function checkAnswer(selected) {
        container.innerHTML = `
          <h1>${story.title}</h1>
          <div class="result-card">
            <p>${selected === story.killer ? "🎉 Correct!" : "❌ Wrong!"}</p>
            <p>The killer was: <strong>${story.killer}</strong></p>
          </div>
          <button id="play-again">Play Again</button>
        `;
        document.getElementById("play-again").addEventListener("click", () => window.location.href = "index.html");
      }

      showIntro();
    })
    .catch(err => {
      container.innerHTML = "<p>Failed to load story.</p>";
      console.error(err);
    });
});
