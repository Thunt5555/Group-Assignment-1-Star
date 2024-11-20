// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import { hostGame } from "./hostGame.js";
import { joinGame } from "./joinGame.js";
import { startGame } from "./startGame.js";
import { addBotsToLobby } from "./addBotsToLobby.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB44xbxuYHv3_VjpQ1zcuiKHkOesal50xM",
    authDomain: "bsregistration.firebaseapp.com",
    projectId: "bsregistration",
    storageBucket: "bsregistration.appspot.com",
    messagingSenderId: "203675511936",
    appId: "1:203675511936:web:c7f469220ea8402f580a65",
    measurementId: "G-2DMHJZMW1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);



// Signup function
function signUp(event) {
  event.preventDefault(); // Prevent form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (password.length > 256) {
    alert("Password is too long. Maximum length is 256 characters.");
    return;
  }
  // Firebase signup function
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("User signed up successfully: " + user.email);
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

document.getElementById('signupForm').addEventListener('submit', signUp);

// Sign-in function
function signIn(event) {
  event.preventDefault();
  
  const email = document.getElementById('emailSignIn').value;
  const password = document.getElementById('passwordSignIn').value;

  if (password.length > 256) {
    alert("Password is too long. Maximum allowed length is 256 characters.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("User signed in successfully: " + user.email);
      showMainMenu(); 
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

function showMainMenu() {
  document.getElementById('mainMenu').style.display = 'block';
  document.getElementById('gameSection').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('signInForm').style.display = 'none';
  document.querySelector('#authSection h2:nth-of-type(1)').style.display = 'none';
  document.querySelector('#authSection h2:nth-of-type(2)').style.display = 'none';
  document.getElementById('guestButton').style.display = 'none';
}



document.getElementById('signInForm').addEventListener('submit', signIn);

function signInGuest(event) {
  event.preventDefault();

  signInAnonymously(auth)
    .then(() => {
      alert("Guest user signed in successfully");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

document.getElementById('guestButton').addEventListener('click', signInGuest);

function sendMessage(e) {
  e.preventDefault();

  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  const username = auth.currentUser.email || "Guest";

  messageInput.value = "";

  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  set(ref(db, "messages/" + timestamp), {
    username,
    message,
  });
}

document.getElementById("message-form").addEventListener("submit", sendMessage);

function showChatMenu() {
  const chatMenu = document.getElementById('chatMenu');
  chatMenu.style.display = 'block';

  const username = auth.currentUser.email || "Guest";

  const fetchChat = ref(db, "messages/");
  onChildAdded(fetchChat, (snapshot) => {
    const messages = snapshot.val();
    const message = `<li class=${
      username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
    document.getElementById("messages").innerHTML += message;
  });
}

document.getElementById('chatButton').addEventListener('click', showChatMenu);

function sendPrivateMessage(e) {
  e.preventDefault();

  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const recipientInput = document.getElementById("recipient-input"); // Field for recipient
  const message = messageInput.value;
  const recipient = recipientInput.value.trim(); // Email or user ID of the recipient
  const sender = auth.currentUser.email; // Current user's email as the sender

  if (!recipient) {
    alert("Please specify a recipient.");
    return;
  }

  if (!message) {
    alert("Message cannot be empty.");
    return;
  }

  messageInput.value = "";

  // Generate a unique conversation ID (e.g., sorted by sender and recipient)
  const conversationId = sender < recipient ? `${sender}_${recipient}` : `${recipient}_${sender}`;

  // Save the message in the database under the conversation ID
  set(ref(db, `privateMessages/${conversationId}/${timestamp}`), {
    sender,
    recipient,
    message,
    timestamp,
  })
    .then(() => {
      console.log("Message sent successfully!");
      document
        .getElementById("privateChat")
        .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    });
}

document.getElementById('privateChatButton').addEventListener('click', sendPrivateMessage);

document.getElementById('hostGameButton').addEventListener('click', async () => {
  const hostId = auth.currentUser ? auth.currentUser.uid : "guest";
  await hostGame(hostId);
});

document.getElementById('joinGameButton').addEventListener('click', async () => {
  const gameId = document.getElementById('gameIdInput').value;
  const playerId = auth.currentUser ? auth.currentUser.uid : "guest";
  await joinGame(gameId, playerId);
});

document.getElementById('startGameButton')?.addEventListener('click', async () => {
  const gameId = prompt("Enter your Game ID to start the game:");
  await startGame(gameId);
});

document.getElementById('addBotsButton')?.addEventListener('click', async () => {
  const gameId = prompt("Enter your Game ID to add bots:");
  const botCount = parseInt(prompt("How many bots to add?"), 10);
  await addBotsToLobby(gameId, botCount);
}
});