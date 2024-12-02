import { hostLobby } from './hostLobby.js';
import { viewLobbies } from './viewLobbies.js';
import { auth } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameOptionsButton = document.getElementById('gameOptionsButton');
    const gameOptionsSection = document.getElementById('gameOptionsSection');
    const mainMenu = document.getElementById('mainMenu');
    const hostGameDropdown = document.getElementById('hostGameDropdown');
    const lobbiesList = document.getElementById('lobbiesList');
    const viewLobbiesButton = document.getElementById('viewLobbiesButton');
    const lobbyNameInput = document.getElementById('lobbyNameInput');
    let isPrivate = false; // Default to public

    // Game Options Button
    if (gameOptionsButton) {
        gameOptionsButton.addEventListener('click', () => {
            mainMenu.style.display = 'none';
            gameOptionsSection.style.display = 'block';
        });
    }

    // Back to Main Menu
    const backButton = document.getElementById('backToMainMenuButtonFromGameOptions');
    if (backButton) {
        backButton.addEventListener('click', () => {
            gameOptionsSection.style.display = 'none';
            mainMenu.style.display = 'block';
        });
    }

    // Host Game Button
    const hostGameButton = document.getElementById('hostGameButton');
    const cancelHostLobbyButton = document.getElementById('cancelHostLobbyButton');
    const createLobbyButton = document.getElementById('createLobbyButton');
    const privateLobbyYes = document.getElementById('privateLobbyYes');
    const privateLobbyNo = document.getElementById('privateLobbyNo');

    if (hostGameButton) {
        hostGameButton.addEventListener('click', () => {
            // Toggle the Host Game Dropdown
            const isDropdownVisible = hostGameDropdown.style.display === 'block';
            hostGameDropdown.style.display = isDropdownVisible ? 'none' : 'block';
        });
    }

    if (cancelHostLobbyButton) {
        cancelHostLobbyButton.addEventListener('click', () => {
            hostGameDropdown.style.display = 'none'; // Hide the dropdown
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

            hostGameDropdown.style.display = 'none'; // Hide the dropdown
            lobbyNameInput.value = ''; // Reset input
        });
    }

    // View Lobbies
    if (viewLobbiesButton) {
        viewLobbiesButton.addEventListener('click', async () => {
            const lobbies = await viewLobbies(); // Fetch lobbies from Firestore
            lobbiesList.innerHTML = ''; // Clear previous list

            if (lobbies.length === 0) {
                lobbiesList.innerHTML = '<p>No lobbies available.</p>';
                return;
            }

            // Display each lobby
            lobbies.forEach((lobby) => {
                const lobbyItem = document.createElement('div');
                lobbyItem.classList.add('lobby-item');
                lobbyItem.innerHTML = `
                    <p><strong>${lobby.name}</strong> (Host: ${lobby.hostId})</p>
                    <p>Players: ${lobby.playerCount}/${lobby.maxPlayers}</p>
                    <button class="joinLobbyButton" data-lobby-id="${lobby.id}">Join Lobby</button>
                `;
                lobbiesList.appendChild(lobbyItem);
            });

            // Add event listeners to join buttons
            document.querySelectorAll('.joinLobbyButton').forEach((button) => {
                button.addEventListener('click', (e) => {
                    const lobbyId = e.target.dataset.lobbyId;
                    alert(`Joining lobby: ${lobbyId}`); // Handle joining logic here
                });
            });
        });
    }
});
