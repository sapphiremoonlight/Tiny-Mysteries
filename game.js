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
  function showIntro() { /* ...your existing code... */ }
  function showNextClue() { /* ...your existing code... */ }
  function showSuspects() { /* ...your existing code... */ }
  function checkAnswer(selected) { /* ...your existing code... */ }

  // ============================
  // EXAMPLE FIREBASE USAGE
  // ============================
  db.ref('test').set({ message: "Hello Firebase!" });

});
