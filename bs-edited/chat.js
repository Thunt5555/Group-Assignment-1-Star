// Import Firebase objects and methods
import { auth, db } from "./firebase.js";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    doc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Global unsubscribe for private chat
let privateChatUnsubscribe;

// ---------------- PUBLIC CHAT FUNCTIONS -----------------

// Render a single message
function renderMessage(messageData, isCurrentUser) {
    console.log("Rendering message:", messageData); // Log message data
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", isCurrentUser ? "sent" : "received");
    const senderName = messageData.senderUsername || "Unknown";
    messageDiv.innerHTML = `<strong>${senderName}:</strong> ${messageData.text}`;
    return messageDiv;
}

let publicChatUnsubscribe; // Global unsubscribe for public chat listener

// Load public chat messages
function loadPublicChat() {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = ""; // Clear old messages

    if (publicChatUnsubscribe) {
        publicChatUnsubscribe(); // Unsubscribe from previous listener
    }

    const messagesQuery = query(
        collection(db, "publicChat"),
        orderBy("timestamp", "asc")
    );

    publicChatUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
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
async function sendPublicMessage() {
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

// ---------------- PRIVATE CHAT FUNCTIONS -----------------

// Load friends for private chat selection
async function loadFriendsForPrivateChat() {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be signed in to view your friends.");
        return;
    }

    const friendsList = document.getElementById("friendListForChat");
    friendsList.innerHTML = ""; // Clear previous friends

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const friends = userDoc.data().friends || [];
            if (friends.length === 0) {
                friendsList.innerHTML = "<li>You have no friends to chat with.</li>";
                return;
            }

            friends.forEach(async (friendUid) => {
                const friendDoc = await getDoc(doc(db, "users", friendUid));
                if (friendDoc.exists()) {
                    const friendData = friendDoc.data();
                    const li = document.createElement("li");
                    li.textContent = `${friendData.username || friendData.email.split("@")[0]}`;

                    // Add a "Chat" button for each friend
                    const chatButton = document.createElement("button");
                    chatButton.textContent = "Chat";
                    chatButton.addEventListener("click", () =>
                        openPrivateChat(friendUid, friendData.username || friendData.email.split("@")[0])
                    );

                    li.appendChild(chatButton);
                    friendsList.appendChild(li);
                }
            });
        } else {
            friendsList.innerHTML = "<li>Error fetching your friends list.</li>";
        }
    } catch (error) {
        console.error("Error loading friends for private chat:", error);
        alert("Error loading friends for private chat.");
    }
}

// Open private chat window with a specific friend
function openPrivateChat(friendUid, friendName) {
    document.getElementById("privateChatFriendList").style.display = "none";
    document.getElementById("privateChatWindow").style.display = "block";
    const privateChatHeader = document.getElementById("privateChatHeader");
    privateChatHeader.textContent = `Chat with ${friendName}`;
    privateChatHeader.setAttribute("data-friend-uid", friendUid); // Set friend UID
    loadPrivateChat(friendUid);
}


// Load private chat messages
async function loadPrivateChat(friendUid) {
    const privateMessagesContainer = document.getElementById("privateMessages");
    privateMessagesContainer.innerHTML = ""; // Clear old messages

    if (privateChatUnsubscribe) {
        privateChatUnsubscribe(); // Unsubscribe from previous listener
    }

    const chatId = [auth.currentUser.uid, friendUid].sort().join("_");
    const messagesQuery = query(
        collection(db, `privateChats/${chatId}/messages`),
        orderBy("timestamp", "asc")
    );

    privateChatUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        console.log("Private chat snapshot updated:", snapshot.docs.map(doc => doc.data())); // Log data
        privateMessagesContainer.innerHTML = ""; // Clear old messages
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const isCurrentUser = messageData.senderId === auth.currentUser.uid;
            const messageDiv = renderMessage(messageData, isCurrentUser);
            privateMessagesContainer.appendChild(messageDiv);
        });
    
        // Scroll to the bottom of the chat
        privateMessagesContainer.scrollTop = privateMessagesContainer.scrollHeight;
    });
    
}


// Send a private message
async function sendPrivateMessage(friendUid) {
    const privateMessageInput = document.getElementById("privateMessageInput");
    const message = privateMessageInput.value.trim();

    if (message === "") return;

    const chatId = [auth.currentUser.uid, friendUid].sort().join("_");

    // Show message locally for sender
    const privateMessagesContainer = document.getElementById("privateMessages");
    const tempMessage = {
        senderId: auth.currentUser.uid,
        senderUsername: auth.currentUser.email.split("@")[0],
        text: message,
        timestamp: new Date(), // Temporary timestamp
    };
    const messageDiv = renderMessage(tempMessage, true);
    privateMessagesContainer.appendChild(messageDiv);
    privateMessagesContainer.scrollTop = privateMessagesContainer.scrollHeight;
    console.log("Scrolled to bottom");

    try {
        await addDoc(collection(db, `privateChats/${chatId}/messages`), {
            senderId: auth.currentUser.uid,
            senderUsername: auth.currentUser.email.split("@")[0],
            text: message,
            timestamp: serverTimestamp(),
        });

        privateMessageInput.value = ""; // Clear input field
    } catch (error) {
        console.error("Error sending private message:", error);
    }
}




// ---------------- EVENT LISTENERS -----------------

document.addEventListener("DOMContentLoaded", () => {
    // Open Chat Menu
    document.getElementById("chatButton").addEventListener("click", () => {
        document.getElementById("chatMenu").style.display = "block";
    });

    // Close Chat Menu
    document.getElementById("closeChatMenuButton").addEventListener("click", () => {
        document.getElementById("chatMenu").style.display = "none";
    });

    // Public Chat
    document.getElementById("publicChatButton").addEventListener("click", () => {
        document.getElementById("chatMenu").style.display = "none";
        document.getElementById("chatSection").style.display = "block";
        loadPublicChat();
    });

    document.getElementById("closeChatButton").addEventListener("click", () => {
        document.getElementById("chatSection").style.display = "none";
        if (publicChatUnsubscribe) publicChatUnsubscribe();
    });

    document.getElementById("sendChatButton").addEventListener("click", sendPublicMessage);

    // Private Chat
    document.getElementById("privateChatButton").addEventListener("click", () => {
        document.getElementById("chatMenu").style.display = "none";
        document.getElementById("privateChatFriendList").style.display = "block";
        loadFriendsForPrivateChat();
    });

    document.getElementById("closePrivateChatFriendListButton").addEventListener("click", () => {
        document.getElementById("privateChatFriendList").style.display = "none";
    });

    document.getElementById("closePrivateChatButton").addEventListener("click", () => {
        document.getElementById("privateChatWindow").style.display = "none";
        if (privateChatUnsubscribe) privateChatUnsubscribe();
    });

    document.getElementById("sendPrivateMessageButton").addEventListener("click", () => {
        const privateChatHeader = document.getElementById("privateChatHeader");
        const friendUid = privateChatHeader.getAttribute("data-friend-uid");
        if (!friendUid) {
            console.error("Friend UID not found. Unable to send message.");
            return;
        }
        sendPrivateMessage(friendUid);
    });
    
});

export {
    loadPublicChat,
    sendPublicMessage,
    loadPrivateChat,
    openPrivateChat,
    sendPrivateMessage,
};
