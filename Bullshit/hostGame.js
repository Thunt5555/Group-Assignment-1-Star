import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { db } from "./firebaseConfig.js";

export async function hostGame(hostId) {
    try {
        const gameId = `game_${Date.now()}`;
        const gameRef = ref(db, `games/${gameId}`);

        await set(gameRef, {
            hostId,
            players: {
                [hostId]: {
                    role: "host",
                    status: "active",
                },
            },
            playerCount: 1,
            maxPlayers: 6,
            status: "waiting",
        });

        alert(`Game hosted successfully! Game ID: ${gameId}`);
        console.log("Game hosted successfully with ID:", gameId);
    } catch (error) {
        console.error("Error hosting game:", error);
        alert("Failed to host game. Please try again.");
    }
}
