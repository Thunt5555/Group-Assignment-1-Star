// Import the necessary objects and functions from your firebase.js file
import { auth, db } from "./firebase.js";
import { setDoc, getDoc, doc, updateDoc, arrayUnion, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Function to show the Add Friend section
function showAddFriendSection() {
    document.getElementById('addFriendSection').style.display = 'block';
}

// Function to add a friend by email with a status check
async function addFriendByEmail(friendEmail) {
    const currentUser = auth.currentUser;
    
    // Check if the user is logged in and not a guest
    if (!currentUser || !currentUser.email) {
        alert("Only registered users can add friends. Please log in with a registered account.");
        return;
    }

    try {
        // Reference to the friend user document
        const friendDocRef = doc(db, "users", friendEmail);
        const friendSnap = await getDoc(friendDocRef);

        if (friendSnap.exists()) {
            // Add friend to the current user's friend list
            const userDocRef = doc(db, "users", currentUser.uid);
            await updateDoc(userDocRef, {
                friends: arrayUnion(friendEmail) // Add friend email to friends array
            });

            alert(`Friend request sent to ${friendEmail}`);
        } else {
            alert("No user found with that email address.");
        }
    } catch (error) {
        console.error("Error adding friend: ", error);
        alert("Error adding friend.");
    }
}

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const addFriendsButton = document.getElementById("buttonAddFriends");
    const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');

    if (addFriendsButton) {
        addFriendsButton.addEventListener("click", async () => {
            const friendEmail = prompt("Enter your friend's email:");
            if (friendEmail) {
                await addFriendByEmail(friendEmail);
            }
        });
    }

    if (sendFriendRequestButton) {
        sendFriendRequestButton.addEventListener("click", showAddFriendSection); // Show the input section on button click
    }
});

// Export functions if needed
export { addFriendByEmail, showAddFriendSection };
