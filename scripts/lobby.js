document.addEventListener("DOMContentLoaded", () => {
  // ==== CONFIG ====
  const roomId = prompt("Enter room code (or leave blank to create a new room):") || Math.random().toString(36).substring(2, 8);
  const playerName = prompt("Enter your name:") || "Player";

  // ==== FIREBASE SETUP ====
  const firebaseConfig = {
  apiKey: "AIzaSyDIPpW7iJTaj9ZzmJEqYcPguIi-U0HzJ_o",
  authDomain: "tiny-mysteries.firebaseapp.com",
  projectId: "tiny-mysteries",
  storageBucket: "tiny-mysteries.appspot.com",
  messagingSenderId: "406430975744",
  appId: "1:406430975744:web:dd59b02ea57a23526695e5"
  measurementId: "G-3CFRNFG9K5"
};

// Initialize Firebase (global)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

  const roomRef = db.ref(`rooms/${roomId}`);
  const playersRef = db.ref(`rooms/${roomId}/players`);

  // ==== ADD PLAYER ====
  playersRef.child(playerName).set({ name: playerName });

  // ==== DISPLAY ROOM CODE ====
  document.getElementById("room-code").textContent = roomId;

  // ==== LISTEN TO PLAYERS ====
  playersRef.on("value", (snapshot) => {
    const players = snapshot.val() || {};
    const playerListEl = document.getElementById("player-list");
    playerListEl.innerHTML = Object.values(players)
      .map((p) => `<li>${p.name}</li>`)
      .join("");
  });

  // ==== START GAME BUTTON ====
  const startBtn = document.getElementById("start-game");
  startBtn.addEventListener("click", () => {
    // Only host can start — we'll assume the first player is host
    playersRef.once("value").then((snapshot) => {
      const players = Object.keys(snapshot.val() || {});
      if (players[0] === playerName) {
        // Set current clue index to 0 to start the game
        roomRef.child("currentClueIndex").set(0);
        alert("Game started! All players will see the first clue.");
        // TODO: redirect to main game view
      } else {
        alert("Only the host can start the game.");
      }
    });
  });
});
