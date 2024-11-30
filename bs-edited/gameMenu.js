
import { hostGame } from "./hostGame.js";
import { auth } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
    const gameOptionsButton = document.getElementById("gameOptionsButton");
    const gameOptionsSection = document.getElementById("gameOptionsSection");
    const mainMenu = document.getElementById("mainMenu");

    if (gameOptionsButton) {
        gameOptionsButton.addEventListener("click", () => {
            // Hide Main Menu and Show Game Options Section
            if (mainMenu && gameOptionsSection) {
                mainMenu.style.display = "none";
                gameOptionsSection.style.display = "block";
                console.log("Switched to Game Options section.");
            } else {
                console.error("Main Menu or Game Options section not found!");
            }
        });
    } else {
        console.error("Game Options button not found in the DOM!");
    }

    // Add a "Back" button to return to the Main Menu
    const backButton = document.getElementById("backToMainMenuButtonFromGameOptions");
    if (backButton) {
        backButton.addEventListener("click", () => {
            if (mainMenu && gameOptionsSection) {
                gameOptionsSection.style.display = "none";
                mainMenu.style.display = "block";
                console.log("Switched to Main Menu.");
            } else {
                console.error("Main Menu or Game Options section not found!");
            }
        });
    }


    // Host Game button
    const hostGameButton = document.getElementById("hostGameButton");
    if (hostGameButton) {
        hostGameButton.addEventListener("click", async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert("You must be signed in to host a game.");
                return;
            }

            const hostId = currentUser.uid; // Get the current user's UID
            await hostGame(hostId); // Call the hostGame function
        });
    }
});

