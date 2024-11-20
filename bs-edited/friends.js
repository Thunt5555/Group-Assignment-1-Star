// Import necessary objects and functions from firebase.js
import { auth, db } from "./firebase.js"; // Use db for Firestore as set up in firebase.js
import { setDoc, doc, getDoc, getDocs, collection, updateDoc, arrayUnion, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Function to show the Add Friend section
function addFriendsMenu() {
    document.getElementById('addFriendSection').style.display = 'block';
}

function retrieveFriendMenu() {
    document.getElementById('friendRequestsSection').style.display = 'block';
}

// Function to send a friend request
async function sendFriendRequest(event) {
    event.preventDefault();
    const friendEmail = document.getElementById('friendEmail').value;
    const user = auth.currentUser;

    if (!user) {
        alert("You must be signed in to send friend requests.");
        return;
    }

    try {
        // Check if the friend exists in the `users` collection
        const friendDocRef = doc(db, "users", friendEmail); // Use db here
        const friendSnap = await getDoc(friendDocRef);

        if (friendSnap.exists()) {
            // Add a friend request to the `friendRequests` collection
            await setDoc(doc(db, "friendRequests", `${user.uid}_${friendEmail}`), { // Use db here
                sender: user.email,
                recipient: friendEmail,
                status: "pending"
            });

            alert(`Friend request sent to ${friendEmail}`);
            document.getElementById('friendEmail').value = ""; // Clear input
        } else {
            alert("No user found with that email address.");
        }
    } catch (error) {
        console.error("Error sending friend request: ", error);
        alert("Error sending friend request.");
    }
}

// Function to accept a friend request
async function acceptFriendRequest(request) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        // Query for the specific friend request document if the ID is unknown
        const friendRequestRef = doc(db, "friendRequests", `${request.sender}_${request.recipient}`);
        const friendRequestSnapshot = await getDoc(friendRequestRef);

        if (!friendRequestSnapshot.exists()) {
            throw new Error("Friend request document not found.");
        }

        // Update the request status to accepted
        await updateDoc(friendRequestRef, {
            status: "accepted"
        });

        // Add each other as friends in their respective user documents
        const userDocRef = doc(db, "users", user.uid);
        const friendDocRef = doc(db, "users", request.sender);

        // Update both users' friends lists
        await updateDoc(userDocRef, {
            friends: arrayUnion(request.sender)
        });
        await updateDoc(friendDocRef, {
            friends: arrayUnion(user.email)
        });

        alert(`Friend request accepted from ${request.sender}`);
        retrieveFriendRequests(); // Refresh the friend request list
    } catch (error) {
        console.error("Error accepting friend request:", error);
        alert("Error accepting friend request.");
    }
}

// Function to decline a friend request (remove it)
async function declineFriendRequest(request) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        // Query for the specific friend request document
        const friendRequestRef = doc(db, "friendRequests", `${request.sender}_${request.recipient}`);
        const friendRequestSnapshot = await getDoc(friendRequestRef);

        if (!friendRequestSnapshot.exists()) {
            throw new Error("Friend request document not found.");
        }

        // Remove the document from Firestore
        await deleteDoc(friendRequestRef);

        alert(`Friend request declined and removed from ${request.sender}`);
        retrieveFriendRequests(); // Refresh the list
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
    const friendRequestsList = document.getElementById('friendRequestsList');
    friendRequestsList.innerHTML = ""; // Clear old list

    // Retrieve friend requests
    getDocs(collection(db, "friendRequests")) // Use db here
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const request = doc.data();
                if (request.recipient === user.email && request.status === "pending") {
                    const li = document.createElement('li');
                    li.textContent = `Friend request from: ${request.sender}`;
                    
                    // Accept and decline buttons
                    const acceptButton = document.createElement('button');
                    acceptButton.textContent = "Accept";
                    acceptButton.onclick = () => acceptFriendRequest(request);

                    const declineButton = document.createElement('button');
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


async function showFriends() {
    const user = auth.currentUser; // Ensure the user is authenticated
    if (!user) {
        alert("You must be signed in to view friends.");
        return;
    }

    const db = firebase.firestore(); // Initialize Firestore
    const friendListElement = document.getElementById('friendsList'); // The container for displaying the friends

    try {
        // Query Firestore for friendRequests with 'accepted' status for the current user
        const friendsQuery = await db
            .collection('friendRequests')
            .where('status', '==', 'accepted')
            .where('userId', '==', user.uid) // Filter for the current user's friends
            .get();

        friendListElement.innerHTML = ""; // Clear existing content

        if (friendsQuery.empty) {
            // Handle no friends found
            friendListElement.innerHTML = "<p>No friends found.</p>";
            return;
        }

        // Iterate through the results and display them
        friendsQuery.forEach(doc => {
            const friendData = doc.data();
            const friendItem = document.createElement('div');
            friendItem.textContent = `Friend: ${friendData.friendName || "Unknown"}`; // Display friend name
            friendListElement.appendChild(friendItem);
        });
    } catch (error) {
        console.error("Error fetching friends:", error);
        alert("Unable to fetch friends at this time.");
    }
}


// Attach event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("buttonAddFriends");
    const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');
    const backButtonFriendList = document.getElementById('backToMainMenuButtonFromFriendList');
    const backButtonAddList = document.getElementById('backToMainMenuButtonFromAddList');
    const retrieveButton = document.getElementById("friendsButton");

    sendButton.addEventListener("click", addFriendsMenu); // Show the input section on button click
    retrieveButton.addEventListener("click", function () { 
        // Show the friends list section and call the showFriends function
        document.getElementById('friendsListSection').style.display = 'block';
        showFriends(); 
    }); 

    sendFriendRequestButton.addEventListener("click", sendFriendRequest); // Handle sending friend requests

    backButtonFriendList.addEventListener("click", function () { 
        // Hide the friends list section on back button click
        document.getElementById('friendsListSection').style.display = 'none';
    });

    backButtonAddList.addEventListener("click", function () { 
        // Hide the add friend section on back button click
        document.getElementById('addFriendSection').style.display = 'none';
    });
});

// In friends.js
document.getElementById("friendsButton").addEventListener("click", () => {
    retrieveFriendMenu(); // Show the friendRequestsSection
    retrieveFriendRequests(); // Load friend requests into the list
});


// Export functions if needed
export { sendFriendRequest, acceptFriendRequest, declineFriendRequest, retrieveFriendRequests };
