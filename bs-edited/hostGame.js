
// Import necessary objects and functions from firebase.js
import { db } from "./firebase.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


export async function hostGame(hostId) {
    try {
        const gameId = `game_${Date.now()}`; // Generate a unique game ID
        const gameRef = doc(db, "games", gameId); // Reference to Firestore document

        await setDoc(gameRef, {
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
