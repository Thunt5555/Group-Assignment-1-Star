// Import Firebase objects and methods
import { auth, db } from "./firebase.js";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Display the chat section
function openChat() {
    const chatSection = document.getElementById("chatSection");
    chatSection.style.display = "block";

    loadPublicChat();
}

// Close the chat section
function closeChat() {
    const chatSection = document.getElementById("chatSection");
    chatSection.style.display = "none";
}

// Render a single message
function renderMessage(messageData, isCurrentUser) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", isCurrentUser ? "sent" : "received");
    const senderName = messageData.senderUsername || "Unknown";
    messageDiv.innerHTML = `<strong>${senderName}:</strong> ${messageData.text}`;
    return messageDiv;
}

let unsubscribe; // Global unsubscribe for real-time listener

// Load public chat messages
function loadPublicChat() {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = ""; // Clear old messages

    if (unsubscribe) {
        unsubscribe(); // Unsubscribe from previous listener
    }

    const messagesQuery = query(
        collection(db, "publicChat"),
        orderBy("timestamp", "asc")
    );

    unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        messageContainer.innerHTML = ""; // Clear old messages
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const isCurrentUser = messageData.senderId === auth.currentUser.uid;
            const messageDiv = renderMessage(messageData, isCurrentUser);
            messageContainer.appendChild(messageDiv);
        });

        // Scroll to the bottom of the chat
        messageContainer.scrollTop = messageContainer.scrollHeight;
    });
}

// Send a message to public chat
async function sendChatMessage() {
    const chatInput = document.getElementById("chatInput");
    const message = chatInput.value.trim();

    if (message === "") return;

    try {
        await addDoc(collection(db, "publicChat"), {
            senderId: auth.currentUser.uid,
            senderUsername: auth.currentUser.email.split("@")[0],
            text: message,
            timestamp: serverTimestamp(),
        });

        chatInput.value = ""; // Clear input field
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("chatButton").addEventListener("click", openChat);
    document.getElementById("closeChatButton").addEventListener("click", closeChat);
    document.getElementById("sendChatButton").addEventListener("click", sendChatMessage);
});

export { openChat, closeChat, sendChatMessage };
