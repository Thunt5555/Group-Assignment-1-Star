import { doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from "./firebase.js";

export async function joinGame(gameId, playerId) {
    try {
        // Get reference to the game document
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);

        if (!gameSnapshot.exists()) {
            alert("Game not found. Please check the Game ID and try again.");
            console.error("Game not found:", gameId);
            return;
        }

        const gameData = gameSnapshot.data();
        console.log("Fetched game data:", gameData);

        // Check if the game room is full
        if (gameData.playerCount >= gameData.maxPlayers) {
            alert("This game room is full. You cannot join.");
            console.error("Game room is full:", gameId);
            return;
        }

        // Add the player to the game
        const newPlayerRef = doc(db, `games/${gameId}/players`, playerId);
        await setDoc(newPlayerRef, {
            role: "player",
            status: "active",
        });

        // Increment the player count
        const updatedPlayerCount = gameData.playerCount + 1;
        await updateDoc(gameRef, { playerCount: updatedPlayerCount });

        // Debugging logs
        console.log(`Player ${playerId} added to game ${gameId}. New player count: ${updatedPlayerCount}`);
        alert(`Joined game successfully! Welcome, player ${playerId}`);
    } catch (error) {
        console.error("Error joining game:", error);
        alert("Failed to join game. Please try again.");
    }
}
