import { Game } from "./gameLogic.js"; // Import your game logic

// DOM Elements
const mainMenu = document.getElementById("mainMenu");
const gameOptionsSection = document.getElementById("gameOptionsSection");
const lobbiesList = document.getElementById("lobbiesList");
const gameArea = document.createElement("div"); // Create a game area dynamically
gameArea.id = "gameArea";
gameArea.style.display = "none";
document.body.appendChild(gameArea);

// Game Initialization
const game = new Game();
let currentPlayerIndex = 0; // Tracks the current player

// Event Listeners
document.getElementById("hostGameButton").addEventListener("click", () => {
  gameOptionsSection.style.display = "none";
  startGame(); // Start the game
});

document.getElementById("viewLobbiesButton").addEventListener("click", () => {
  fetchLobbies();
});

document.getElementById("createLobbyButton").addEventListener("click", () => {
  const lobbyName = document.getElementById("lobbyNameInput").value.trim();
  createLobby(lobbyName);
});

// Function to start the game
function startGame() {
  mainMenu.style.display = "none";
  gameArea.style.display = "block";

  // Render game UI
  renderGameUI();
}

// Function to fetch and display available lobbies
function fetchLobbies() {
  lobbiesList.innerHTML = "";
  const mockLobbies = ["Lobby 1", "Lobby 2", "Lobby 3"]; // Replace with real lobby data
  mockLobbies.forEach((lobby) => {
    const lobbyItem = document.createElement("div");
    lobbyItem.textContent = lobby;
    lobbiesList.appendChild(lobbyItem);
  });
}

// Function to create a lobby
function createLobby(lobbyName) {
  if (!lobbyName) {
    alert("Please enter a lobby name.");
    return;
  }
  alert(`Lobby "${lobbyName}" created!`);
  gameOptionsSection.style.display = "none";
}

// Function to render the game UI
function renderGameUI() {
  gameArea.innerHTML = `
    <h2>Game Started</h2>
    <div id="playerHand"></div>
    <div id="currentRank">Current Rank: <span id="rankDisplay">Ace</span></div>
    <button id="playButton" disabled>Play Selected Cards</button>
    <button id="bsButton" disabled>Call BS</button>
  `;

  const playerHand = document.getElementById("playerHand");
  const playButton = document.getElementById("playButton");
  const bsButton = document.getElementById("bsButton");

  // Example cards for the current player
  const currentPlayer = game.getPlayers()[currentPlayerIndex];
  const cards = currentPlayer.getHand(); // Replace with game logic

  // Render player hand
  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.textContent = `${card.rank} of ${card.suit}`;
    cardElement.dataset.index = index;

    cardElement.addEventListener("click", () => {
      cardElement.classList.toggle("selected");
      const selectedCards = document.querySelectorAll(".card.selected");
      playButton.disabled = selectedCards.length === 0;
    });

    playerHand.appendChild(cardElement);
  });

  // Play selected cards
  playButton.addEventListener("click", () => {
    const selectedCards = document.querySelectorAll(".card.selected");
    selectedCards.forEach((card) => {
      const index = parseInt(card.dataset.index, 10);
      currentPlayer.playCard(index); // Replace with game logic
      card.remove();
    });
    playButton.disabled = true;
    alert("Cards played!");
  });

  // Call BS functionality
  bsButton.addEventListener("click", () => {
    alert("BS called!"); // Replace with game logic for calling BS
  });

  // Enable BS button for demo purposes
  bsButton.disabled = false;
}
