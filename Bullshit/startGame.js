import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { db } from "./firebaseConfig.js";

export async function startGame(gameId) {
    try {
        const gameRef = ref(db, `games/${gameId}`);
        const gameSnapshot = await (await ref(db, `games/${gameId}`)).get();

        if (!gameSnapshot.exists()) {
            alert("Game not found. Unable to start.");
            return;
        }

        const gameData = gameSnapshot.val();

        if (gameData.playerCount < gameData.maxPlayers) {
            alert("The lobby is not full yet. Waiting for more players...");
            return;
        }

        await set(ref(db, `games/${gameId}/status`), "in-progress");

        alert("Game started!");
        console.log(`Game ${gameId} has started.`);
    } catch (error) {
        console.error("Error starting game:", error);
        alert("Failed to start the game.");
    }
}
