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


document.addEventListener('DOMContentLoaded', () => {

  function signUp(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (password.length > 256) {
      alert("Password is too long. Maximum length is 256 characters.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert("User signed up successfully: " + user.email);
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
  }

  document.getElementById('signupForm')?.addEventListener('submit', signUp);


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

  document.getElementById('signInForm')?.addEventListener('submit', signIn);

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

  document.getElementById('guestButton')?.addEventListener('click', signInGuest);

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

  document.getElementById("message-form")?.addEventListener("submit", sendMessage);

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

  document.getElementById('chatButton')?.addEventListener('click', showChatMenu);

  function sendPrivateMessage(e) {
    e.preventDefault();
  
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const recipientInput = document.getElementById("recipient-input");
    const message = messageInput.value.trim();
    const recipient = recipientInput.value.trim();
    const sender = auth.currentUser ? auth.currentUser.email : null;
  
    if (!sender) {
      console.error("User is not authenticated.");
      alert("You must be logged in to send messages.");
      return;
    }
  
    if (!recipient) {
      alert("Please specify a recipient.");
      return;
    }
  
    if (!message) {
      alert("Message cannot be empty.");
      return;
    }
  
    console.log("Timestamp:", timestamp);
    console.log("Message:", message);
    console.log("Recipient:", recipient);
    console.log("Sender:", sender);
  
    messageInput.value = "";
  
    const conversationId =
      sender < recipient ? `${sender}_${recipient}` : `${recipient}_${sender}`;
    console.log("Conversation ID:", conversationId);
  
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
  
  document.getElementById("private-message-form")?.addEventListener("submit", sendPrivateMessage);

  function showPrivateChatMenu() {
    const chatMenu = document.getElementById("privateChat");
    chatMenu.style.display = "block";
  
    const username = auth.currentUser?.email || "Guest";
  
    const recipientInput = document.getElementById("recipient-input").value.trim();
    if (!recipientInput) {
      alert("Please specify a recipient to view the conversation.");
      return;
    }
  
    const conversationId =
      username < recipientInput
        ? `${username}_${recipientInput}`
        : `${recipientInput}_${username}`;
  
    const fetchChat = ref(db, `privateMessages/${conversationId}/`);
    onChildAdded(fetchChat, (snapshot) => {
      const message = snapshot.val(); // this should be the message object
      const sanitizedMessage = document.createElement("li");
      sanitizedMessage.className = message.sender === username ? "sent" : "receive";
      sanitizedMessage.innerHTML = `<span>${message.sender}: </span>${message.message}`;
    
      document.getElementById("messages").appendChild(sanitizedMessage);
    });
    
  }
  

  document.getElementById('privateChatButton')?.addEventListener('click', showPrivateChatMenu);

  document.getElementById('hostGameButton')?.addEventListener('click', async () => {
    const hostId = auth.currentUser ? auth.currentUser.uid : "guest";
    await hostGame(hostId);
  });

  document.getElementById('joinGameButton')?.addEventListener('click', async () => {
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
    if (isNaN(botCount) || botCount < 1) {
      alert("Please enter a valid number of bots.");
      return;
    }
    await addBotsToLobby(gameId, botCount);
  });
});
