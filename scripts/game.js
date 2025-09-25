document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container main");
  const backHomeBtn = document.getElementById("back-home");

  // Always attach back-home event
  backHomeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

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
          <button id="back-home">← Back Home</button>
        `;
        document.getElementById("next-clue").addEventListener("click", showNextClue);
        document.getElementById("back-home").addEventListener("click", () => window.location.href = "index.html");
      }

      function showNextClue() {
        if (currentClueIndex >= story.clues.length) {
          showSuspects();
          return;
        }
        const clue = story.clues[currentClueIndex];
        currentClueIndex++;
        container.innerHTML = `
          <h1>${story.title}</h1>
          <p>Clue ${currentClueIndex} of ${story.clues.length}</p>
          <div class="clue-card"><p>${clue}</p></div>
          <button id="next-clue">${currentClueIndex < story.clues.length ? "Next Clue" : "Reveal Suspects"}</button>
          <button id="back-home">← Back Home</button>
        `;
        document.getElementById("next-clue").addEventListener("click", showNextClue);
        document.getElementById("back-home").addEventListener("click", () => window.location.href = "index.html");
      }

      function showSuspects() {
        const suspectsHTML = story.suspects.map(
          s => `<button class="suspect-btn">${s}</button>`
        ).join("");
        container.innerHTML = `
          <h1>${story.title}</h1>
          <p>Who is the killer?</p>
          <div class="suspects">${suspectsHTML}</div>
          <button id="back-home">← Back Home</button>
        `;
        document.querySelectorAll(".suspect-btn").forEach(btn => {
          btn.addEventListener("click", () => checkAnswer(btn.textContent));
        });
        document.getElementById("back-home").addEventListener("click", () => window.location.href = "index.html");
      }

      function checkAnswer(selected) {
        container.innerHTML = `
          <h1>${story.title}</h1>
          <div class="result-card">
            <p>${selected === story.killer ? "🎉 Correct!" : "❌ Wrong!"}</p>
            <p>The killer was: <strong>${story.killer}</strong></p>
          </div>
          <button id="play-again">Play Again</button>
          <button id="back-home">← Back Home</button>
        `;
        document.getElementById("play-again").addEventListener("click", () => window.location.href = "index.html");
        document.getElementById("back-home").addEventListener("click", () => window.location.href = "index.html");
      }

      showIntro();
    })
    .catch(err => {
      container.innerHTML = "<p>Failed to load story.</p>";
      console.error(err);
    });
});
