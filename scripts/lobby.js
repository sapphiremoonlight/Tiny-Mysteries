document.addEventListener("DOMContentLoaded", () => {
  // ==== CONFIG ====
  // Prompt user for room code (join) or generate a new one
  const roomId = prompt("Enter room code (leave blank to create a new room):") 
    || Math.random().toString(36).substring(2, 8);
  const playerName = prompt("Enter your name:") || "Player";

  // ==== FIREBASE REFERENCE ====
  // Assumes Firebase is already initialized in game.js
  const db = firebase.database();

  // ==== ANONYMOUS AUTH ====
  firebase.auth().signInAnonymously()
    .then(() => {
      console.log("Signed in anonymously");

      const roomRef = db.ref(`rooms/${roomId}`);
      const playersRef = db.ref(`rooms/${roomId}/players`);

      // ==== ADD PLAYER ====
      playersRef.child(playerName).set({ name: playerName })
        .then(() => console.log(`Added player: ${playerName}`))
        .catch(err => console.error("Failed to add player:", err));

      // ==== DISPLAY ROOM CODE ====
      const roomCodeEl = document.getElementById("room-code");
      if (roomCodeEl) roomCodeEl.textContent = roomId;

      // ==== LISTEN TO PLAYERS ====
      const playerListEl = document.getElementById("player-list");
      playersRef.on("value", (snapshot) => {
        const players = snapshot.val() || {};
        if (playerListEl) {
          playerListEl.innerHTML = Object.values(players)
            .map(p => `<li>${p.name}</li>`)
            .join("");
        }
      });

      // ==== START GAME BUTTON ====
      const startBtn = document.getElementById("start-game");
      if (startBtn) {
        startBtn.addEventListener("click", () => {
          // Only host (first player) can start
          playersRef.once("value").then(snapshot => {
            const playerKeys = Object.keys(snapshot.val() || {});
            if (playerKeys[0] === playerName) {
              roomRef.child("currentClueIndex").set(0)
                .then(() => {
                  alert("Game started! All players will see the first clue.");
                  // TODO: redirect to main game view
                })
                .catch(err => console.error("Failed to start game:", err));
            } else {
              alert("Only the host can start the game.");
            }
          });
        });
      }

    })
    .catch(err => console.error("Anonymous sign-in failed:", err));
});
