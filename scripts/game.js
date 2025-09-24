// ============================
// FIREBASE SETUP
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyDIPpW7iJTaj9ZzmJEqYcPguIi-U0HzJ_o",
  authDomain: "tiny-mysteries.firebaseapp.com",
  projectId: "tiny-mysteries",
  storageBucket: "tiny-mysteries.appspot.com",
  messagingSenderId: "406430975744",
  appId: "1:406430975744:web:dd59b02ea57a23526695e5",
  measurementId: "G-3CFRNFG9K5"
};

// Initialize Firebase (global)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // BASIC GAME LOGIC (PROTOTYPE)
  // ============================

  // Select buttons
  const createBtn = document.getElementById("create-game");
  const joinBtn = document.getElementById("join-game");

  // Global game state
  let currentStory = null;
  let currentClueIndex = 0;

  // ============================
  // BUTTON EVENTS
  // ============================
  createBtn.addEventListener("click", () => {
    loadStory("stories/dinner_party_disaster.json");
  });

  joinBtn.addEventListener("click", () => {
    const code = prompt("Enter Room Code:");
    if (code) {
      alert(`Joining game ${code}... (multiplayer to be implemented)`);
      loadStory("stories/dinner_party_disaster.json");
    }
  });

  // ============================
  // LOAD STORY JSON
  // ============================
  function loadStory(path) {
  console.log("Loading story:", path);
  fetch(path)
    .then((res) => {
      console.log("Fetch response:", res);
      if (!res.ok) throw new Error("Story not found");
      return res.json();
    })
    .then((data) => {
      console.log("Story data loaded:", data);
      currentStory = data;
      currentClueIndex = 0;
      showIntro();
    })
    .catch((err) => console.error("Failed to load story:", err));
}

  // ============================
  // DISPLAY FUNCTIONS
  // ============================
  function showIntro() {
  const container = document.querySelector(".container");
  container.innerHTML = `
    <header>
      <h1>${currentStory.title}</h1>
      <p>${currentStory.intro}</p>
    </header>
    <main>
      <button id="next-clue">Reveal First Clue</button>
    </main>
  `;
  document.getElementById("next-clue").addEventListener("click", showNextClue);
}

function showNextClue() {
  if (currentClueIndex >= currentStory.clues.length) {
    showSuspects();
    return;
  }

  const clue = currentStory.clues[currentClueIndex];
  currentClueIndex++;

  const container = document.querySelector(".container");
  container.innerHTML = `
    <header>
      <h1>${currentStory.title}</h1>
      <p>Clue ${currentClueIndex} of ${currentStory.clues.length}</p>
    </header>
    <main>
      <div class="clue-card">
        <p>${clue}</p>
      </div>
      <button id="next-clue">${currentClueIndex < currentStory.clues.length ? "Next Clue" : "Reveal Suspects"}</button>
    </main>
  `;
  document.getElementById("next-clue").addEventListener("click", showNextClue);
}

function showSuspects() {
  const container = document.querySelector(".container");
  const suspectsHTML = currentStory.suspects.map(
    (s, index) => `<button class="suspect-btn" data-index="${index}">${s}</button>`
  ).join("");

  container.innerHTML = `
    <header>
      <h1>${currentStory.title}</h1>
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
  const container = document.querySelector(".container");
  const correct = currentStory.killer;

  container.innerHTML = `
    <header>
      <h1>${currentStory.title}</h1>
    </header>
    <main>
      <div class="result-card">
        <p>${selected === correct ? "🎉 Correct!" : "❌ Wrong!"}</p>
        <p>The killer was: <strong>${correct}</strong></p>
      </div>
      <button id="play-again">Play Again</button>
    </main>
  `;

  document.getElementById("play-again").addEventListener("click", () => window.location.reload());
}

  // ============================
  // EXAMPLE FIREBASE USAGE
  // ============================
  db.ref('test').set({ message: "Hello Firebase!" });

});

