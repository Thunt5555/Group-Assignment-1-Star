// main.js
import { auth } from './firebase.js';
import { signIn, signUp, signInGuest, showMainMenu } from './auth.js';
import { db } from './firebase.js';
import { ref, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { initializeGameMenu } from "./gameMenu.js";

// Initialize the game menu functionality when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    initializeGameMenu();
});

// Send message function
function sendMessage(e) {
    e.preventDefault();
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
    const username = auth.currentUser ? auth.currentUser.email : "Guest";

    messageInput.value = "";

    document.getElementById("messages").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    set(ref(db, "messages/" + timestamp), {
        username,
        message,
    });
}


document.getElementById("message-form").addEventListener("submit", sendMessage);

function showChatMenu() {
    const chatMenu = document.getElementById('chatMenu');
    chatMenu.style.display = 'block';

    const fetchChat = ref(db, "messages/");
    onChildAdded(fetchChat, (snapshot) => {
        const messages = snapshot.val();
        const message = `<li class=${auth.currentUser.email === messages.username ? "sent" : "receive"}><span>${messages.username}: </span>${messages.message}</li>`;
        document.getElementById("messages").innerHTML += message;
    });
}

document.getElementById('chatButton').addEventListener('click', showChatMenu);
