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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Sign in anonymously so users can interact
firebase.auth().signInAnonymously()
  .then(() => console.log("✅ Signed in anonymously"))
  .catch(err => console.error("❌ Auth error:", err));

document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // SELECT BUTTONS
  // ============================
  const createBtn = document.getElementById("create-game");
  const joinBtn = document.getElementById("join-game");

  // Global state
  let currentStory = null;
  let currentClueIndex = 0;
  let roomId = null;
  let playerName = "Player-" + Math.floor(Math.random() * 1000);

  // ============================
  // CREATE GAME
  // ============================
  createBtn.addEventListener("click", async () => {
    // Generate room code
    roomId = Math.random().toString(36).substring(2, 8);

    // Load story JSON
    const res = await fetch("stories/dinner_party_disaster.json");
    currentStory = await res.json();

    // Create room in Firebase
    await db.ref(`rooms/${roomId}`).set({
      host: playerName,
      story: currentStory,
      currentClueIndex: 0,
      players: { [playerName]: { name: playerName } }
    });

    alert(`✅ Room created! Code: ${roomId}`);
    listenForRoomUpdates();
  });

  // ============================
  // JOIN GAME
  // ============================
  joinBtn.addEventListener("click", async () => {
    const code = prompt("Enter Room Code:");
    if (!code) return;
    roomId = code;

    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.get();

    if (!snapshot.exists()) {
      alert("❌ Room not found!");
      return;
    }

    // Add player to Firebase
    await db.ref(`rooms/${roomId}/players/${playerName}`).set({ name: playerName });
    alert(`🎉 Joined room ${roomId}`);

    listenForRoomUpdates();
  });

  // ============================
  // LISTEN FOR ROOM UPDATES
  // ============================
  function listenForRoomUpdates() {
    const roomRef = db.ref(`rooms/${roomId}`);
    roomRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      currentStory = data.story;
      currentClueIndex = data.currentClueIndex || 0;

      console.log("📡 Room updated:", data);

      // Show game screen if story is loaded
      if (currentStory) {
        showGameState();
      }
    });
  }

  // ============================
  // SHOW GAME STATE (CLUES)
  // ============================
  function showGameState() {
    if (currentClueIndex < currentStory.clues.length) {
      showClue(currentStory.clues[currentClueIndex]);
    } else {
      showSuspects();
    }
  }

  function showClue(clue) {
    const container = document.querySelector(".container");
    container.innerHTML = `
      <header>
        <h1>${currentStory.title}</h1>
        <p>Clue ${currentClueIndex + 1} of ${currentStory.clues.length}</p>
      </header>
      <main>
        <div class="clue-card">
          <p>${clue}</p>
        </div>
        <button id="next-clue">Next</button>
      </main>
    `;

    document.getElementById("next-clue").addEventListener("click", () => {
      // Only host can advance the game
      db.ref(`rooms/${roomId}/host`).get().then(snapshot => {
        if (snapshot.val() === playerName) {
          db.ref(`rooms/${roomId}/currentClueIndex`).set(currentClueIndex + 1);
        } else {
          alert("Only the host can reveal the next clue!");
        }
      });
    });
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
});
