import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { db } from "./app.js";

export async function addBotsToLobby(gameId, botCount) {
    try {
        for (let i = 1; i <= botCount; i++) {
            const botId = `bot_${i}`;
            const botRef = ref(db, `games/${gameId}/players/${botId}`);
            await set(botRef, {
                role: "bot",
                status: "active",
            });
            console.log(`Bot ${botId} added to game ${gameId}`);
        }
    } catch (error) {
        console.error("Error adding bots to lobby:", error);
    }
}
