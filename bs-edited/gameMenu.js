// Game Menu
import { hostLobby } from './hostLobby.js';
import { auth } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameOptionsButton = document.getElementById('gameOptionsButton');
    const gameOptionsSection = document.getElementById('gameOptionsSection');
    const mainMenu = document.getElementById('mainMenu');
    const hostGameSection = document.getElementById('hostGameSection');
    const lobbyNameInput = document.getElementById('lobbyNameInput');
    let isPrivate = false; // Default to public

    // Show Game Options
    if (gameOptionsButton) {
        gameOptionsButton.addEventListener('click', () => {
            mainMenu.style.display = 'none';
            gameOptionsSection.style.display = 'block';
        });
    }

    // Back Button
    const backButton = document.getElementById('backToMainMenuButtonFromGameOptions');
    if (backButton) {
        backButton.addEventListener('click', () => {
            gameOptionsSection.style.display = 'none';
            mainMenu.style.display = 'block';
        });
    }

    // Host Game Flow
    const hostGameButton = document.getElementById('hostGameButton');
    const cancelHostLobbyButton = document.getElementById('cancelHostLobbyButton');
    const createLobbyButton = document.getElementById('createLobbyButton');
    const privateLobbyYes = document.getElementById('privateLobbyYes');
    const privateLobbyNo = document.getElementById('privateLobbyNo');

    if (hostGameButton) {
        hostGameButton.addEventListener('click', () => {
            console.log('Host Game Button Clicked'); // Debugging message
            // Transition to the Host Game Section
            gameOptionsSection.style.display = 'none';
            if (hostGameSection) {
                hostGameSection.style.display = 'block';
                console.log('Host Game Section is now visible.');
            } else {
                console.error('Host Game Section element not found!');
            }
        });
    }

    if (cancelHostLobbyButton) {
        cancelHostLobbyButton.addEventListener('click', () => {
            // Return to Game Options Section and Reset Inputs
            hostGameSection.style.display = 'none';
            gameOptionsSection.style.display = 'block';
            lobbyNameInput.value = ''; // Reset input
        });
    }

    // Set Lobby Privacy
    if (privateLobbyYes && privateLobbyNo) {
        privateLobbyYes.addEventListener('click', () => {
            isPrivate = true;
            alert('Lobby set to private');
        });

        privateLobbyNo.addEventListener('click', () => {
            isPrivate = false;
            alert('Lobby set to public');
        });
    }

    // Create Lobby
    if (createLobbyButton) {
        createLobbyButton.addEventListener('click', async () => {
            const lobbyName = lobbyNameInput.value.trim();
            if (!lobbyName) {
                alert('Please enter a valid lobby name.');
                return;
            }

            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert('You must be signed in to host a lobby.');
                return;
            }

            const hostId = currentUser.uid;
            await hostLobby(hostId, lobbyName, isPrivate);

            // Reset the UI and Inputs
            hostGameSection.style.display = 'none';
            gameOptionsSection.style.display = 'block';
            lobbyNameInput.value = ''; // Reset input
        });
    }
});
