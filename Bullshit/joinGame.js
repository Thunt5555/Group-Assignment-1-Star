import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { db } from "./app.js";
import { addBotsToLobby } from "./addBotsToLobby.js";

export async function joinGame(gameId, playerId) {
    try {
        const gameRef = ref(db, `games/${gameId}`);
        const gameSnapshot = await (await ref(db, `games/${gameId}`)).get();

        if (!gameSnapshot.exists()) {
            alert("Game not found. Please check the Game ID and try again.");
            return;
        }

        const gameData = gameSnapshot.val();

        if (gameData.playerCount >= gameData.maxPlayers) {
            alert("This game room is full. You cannot join.");
            return;
        }

        const newPlayerRef = ref(db, `games/${gameId}/players/${playerId}`);
        await set(newPlayerRef, {
            role: "player",
            status: "active",
        });

        const updatedPlayerCount = gameData.playerCount + 1;
        await set(ref(db, `games/${gameId}/playerCount`), updatedPlayerCount);

        if (updatedPlayerCount < gameData.maxPlayers) {
            addBotsToLobby(gameId, gameData.maxPlayers - updatedPlayerCount);
        }

        alert(`Joined game successfully! Welcome, player ${playerId}`);
        console.log(`Player ${playerId} joined game ${gameId}`);
    } catch (error) {
        console.error("Error joining game:", error);
        alert("Failed to join game. Please try again.");
    }
}
