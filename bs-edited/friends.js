// Import necessary objects and functions from firebase.js
import { auth, db } from "./firebase.js"; // Use db for Firestore
import { query, where, setDoc, doc, getDoc, getDocs, collection, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Centralized function to toggle sections
function showSection(sectionId) {
    const sections = ["addFriendSection", "friendRequestsSection", "friendsListSection", "mainMenu"];
    sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = id === sectionId ? "block" : "none";
        }
    });
}

// Function to show Add Friends Menu
function addFriendsMenu() {
    showSection("addFriendSection");
}

// Function to show Friend Requests Menu
function retrieveFriendMenu() {
    showSection("friendRequestsSection");
    retrieveFriendRequests(); // Load pending friend requests
}

// Function to send a friend request
async function sendFriendRequest(event) {
    event.preventDefault();
    console.log("Send Friend Request triggered"); // Debugging
    const friendEmail = document.getElementById('friendEmail').value;
    console.log("Friend email entered:", friendEmail);

    const user = auth.currentUser;

    if (!user) {
        alert("You must be signed in to send friend requests.");
        return;
    }

    try {
        // Check if the friend exists in the `users` collection
        const friendDocRef = doc(db, "users", friendEmail);
        const friendSnap = await getDoc(friendDocRef);
        console.log("Friend document:", friendSnap.exists() ? friendSnap.data() : "No friend found");

        if (friendSnap.exists()) {
            // Add a friend request to the `friendRequests` collection
            await setDoc(doc(db, "friendRequests", `${user.uid}_${friendEmail}`), {
                sender: user.email,
                recipient: friendEmail,
                status: "pending",
            });

            alert(`Friend request sent to ${friendEmail}`);
            document.getElementById('friendEmail').value = ""; // Clear input
        } else {
            alert("No user found with that email address.");
        }
    } catch (error) {
        console.error("Error sending friend request:", error); // Log the error for debugging
        alert("Error sending friend request.");
    }
}

// Function to accept a friend request

async function acceptFriendRequest(request) {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return;
    }

    try {
        console.log("Accepting friend request:", request);

        // Query to find the matching friend request
        const q = query(
            collection(db, "friendRequests"),
            where("sender", "==", request.sender),
            where("recipient", "==", request.recipient)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.error("No matching friend request found.");
            alert("Error: Friend request not found.");
            return;
        }

        // Get the friend request document reference
        const docRef = querySnapshot.docs[0].ref;

        // Update friend request status to "accepted"
        await updateDoc(docRef, { status: "accepted" });
        console.log("Friend request status updated to 'accepted'.");

        // Query to find the authenticated user's document
        const userQuery = query(collection(db, "users"), where("email", "==", user.email));
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.empty) {
            console.error("No matching user document found for authenticated user.");
            alert("Error: User document not found.");
            return;
        }
        const userDocRef = userSnapshot.docs[0].ref;

        // Query to find the sender's document
        const friendQuery = query(collection(db, "users"), where("email", "==", request.sender));
        const friendSnapshot = await getDocs(friendQuery);
        if (friendSnapshot.empty) {
            console.error("No matching user document found for sender.");
            alert("Error: Sender document not found.");
            return;
        }
        const friendDocRef = friendSnapshot.docs[0].ref;

        // Update the friends list for both users
        await updateDoc(userDocRef, {
            friends: arrayUnion(request.sender),
        });
        console.log("Authenticated user's friends list updated.");

        await updateDoc(friendDocRef, {
            friends: arrayUnion(user.email),
        });
        console.log("Sender's friends list updated.");

        alert(`Friend request accepted from ${request.sender}`);
        retrieveFriendRequests(); // Refresh the friend request list
    } catch (error) {
        console.error("Error accepting friend request:", error);
        alert("Error accepting friend request.");
    }
}



async function declineFriendRequest(request) {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return;
    }

    try {
        console.log("Declining friend request:", request);

        // Query to find the matching friend request
        const q = query(
            collection(db, "friendRequests"),
            where("sender", "==", request.sender),
            where("recipient", "==", request.recipient)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.error("No matching friend request found.");
            alert("Error: Friend request not found.");
            return;
        }

        // Get the friend request document reference
        const docRef = querySnapshot.docs[0].ref;

        // Update friend request status to "declined"
        await updateDoc(docRef, { status: "declined" });

        alert(`Friend request declined from ${request.sender}`);
        retrieveFriendRequests(); // Refresh the friend request list
    } catch (error) {
        console.error("Error declining friend request:", error);
        alert("Error declining friend request.");
    }
}



// Function to retrieve friend requests
function retrieveFriendRequests() {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be signed in to view friend requests.");
        return;
    }

    const friendRequestsList = document.getElementById("friendRequestsList");
    friendRequestsList.innerHTML = ""; // Clear old list

    getDocs(collection(db, "friendRequests"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const request = doc.data();
                if (request.recipient === user.email && request.status === "pending") {
                    const li = document.createElement("li");
                    li.textContent = `Friend request from: ${request.sender}`;

                    const acceptButton = document.createElement("button");
                    acceptButton.textContent = "Accept";
                    acceptButton.onclick = () => acceptFriendRequest(request);

                    const declineButton = document.createElement("button");
                    declineButton.textContent = "Decline";
                    declineButton.onclick = () => declineFriendRequest(request);

                    li.appendChild(acceptButton);
                    li.appendChild(declineButton);
                    friendRequestsList.appendChild(li);
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching friend requests:", error);
            alert("Error fetching friend requests.");
        });
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("buttonAddFriends").addEventListener("click", addFriendsMenu);
    document.getElementById("friendsButton").addEventListener("click", retrieveFriendMenu);

    // Back button for "Add Friend" section
    document.getElementById("backToMainMenuButtonFromAddList").addEventListener("click", () => showSection("mainMenu"));

    // Back button for "Friend Requests" section
    document.getElementById("backToFriendsMenuButtonFromRequests").addEventListener("click", () => showSection("mainMenu"));

    // Back button for "Friends List" section
    document.getElementById("backToMainMenuButtonFromFriendList").addEventListener("click", () => showSection("mainMenu"));

    const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');
    if (sendFriendRequestButton) {
        sendFriendRequestButton.addEventListener("click", sendFriendRequest);
    } else {
        console.error("Send Friend Request button not found in the DOM.");
    }
});

// Export functions
export { sendFriendRequest, acceptFriendRequest, declineFriendRequest, retrieveFriendRequests };
