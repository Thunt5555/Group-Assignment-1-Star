// Import the necessary objects and functions from your firebase.js file
import { auth, db } from "./firebase.js";
import { setDoc, doc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Function to show the Add Friend section
function testAdd() {
    // Show the add friend section
    document.getElementById('addFriendSection').style.display = 'block';
}

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




// Attach event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("buttonAddFriends");
    const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');

    if (button) {
        button.addEventListener("click", testAdd); // Show the input section on button click
    }

    if (sendFriendRequestButton) {
        sendFriendRequestButton.addEventListener("click", sendFriendRequest); // Handle sending friend requests
    }
});

// Export functions if needed
export { sendFriendRequest };
