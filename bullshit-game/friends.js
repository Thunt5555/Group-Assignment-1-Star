// Import the necessary objects and functions from your firebase.js file
import { auth, db } from "./firebase.js";
import { setDoc, doc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Function to send a friend request
async function sendFriendRequest(event) {
    event.preventDefault(); // Prevent default form submission

    const friendEmail = document.getElementById('friendEmail').value; // Input friend's email
    const user = auth.currentUser; // Get the currently signed-in user

    if (!user) {
        alert("You must be signed in to send friend requests.");
        return;
    }

    try {
        // Create a new document in the "friendRequests" collection
        await setDoc(doc(db, "friendRequests", friendEmail), {
            from: user.email,
            to: friendEmail,
            status: "pending"
        });
        alert("Friend request sent to " + friendEmail);
        document.getElementById('friendEmail').value = ""; // Clear input
    } catch (error) {
        console.error("Error sending friend request: ", error);
        alert("Error sending friend request.");
    }
}

// Function to display friend requests
async function displayFriendRequests() {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be signed in to view friend requests.");
        return;
    }

    const friendRequestsList = document.getElementById('friendRequestsList');
    friendRequestsList.innerHTML = ""; // Clear previous list

    try {
        const querySnapshot = await getDocs(collection(db, "friendRequests"));
        querySnapshot.forEach((doc) => {
            const request = doc.data();
            if (request.to === user.email && request.status === "pending") {
                const li = document.createElement('li');
                li.textContent = `Friend request from: ${request.from}`;
                friendRequestsList.appendChild(li);
            }
        });
    } catch (error) {
        console.error("Error fetching friend requests: ", error);
        alert("Error fetching friend requests.");
    }
}

// Function to show the Friends List section
function showFriendsList() {
    document.getElementById('friendsListSection').style.display = 'block';
    document.getElementById('addFriendSection').style.display = 'none';
    document.getElementById('friendRequestsSection').style.display = 'none';
}

// Function to show the Add Friend section
function showAddFriend() {
    document.getElementById('addFriendSection').style.display = 'block';
    document.getElementById('friendsListSection').style.display = 'none';
    document.getElementById('friendRequestsSection').style.display = 'none';
}

// Function to show the Friend Requests section
function showFriendRequests() {
    document.getElementById('friendRequestsSection').style.display = 'block';
    document.getElementById('friendsListSection').style.display = 'none';
    document.getElementById('addFriendSection').style.display = 'none';
}

// Attach event listeners to the buttons
const viewFriendsButton = document.getElementById('viewFriendsButton');
const addFriendsButton = document.getElementById('addFriendsButton');
const friendRequestsButton = document.getElementById('friendRequestsButton');

if (viewFriendsButton) {
    console.log("View Friends Button found and event listener attached");
    viewFriendsButton.addEventListener('click', showFriendsList);
} else {
    console.log("View Friends Button not found");
}

if (addFriendsButton) {
    console.log("Add Friends Button found and event listener attached");
    addFriendsButton.addEventListener('click', showAddFriend);
} else {
    console.log("Add Friends Button not found");
}

if (friendRequestsButton) {
    console.log("Friend Requests Button found and event listener attached");
    friendRequestsButton.addEventListener('click', showFriendRequests);
} else {
    console.log("Friend Requests Button not found");
}

// Export the functions that may be needed elsewhere
export { sendFriendRequest, displayFriendRequests };