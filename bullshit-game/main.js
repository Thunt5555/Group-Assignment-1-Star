import { auth, db } from "./firebase.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

function showMainMenu() {
    document.getElementById('mainMenu').style.display = 'block';
    // Hide the signup and signin page
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('signInForm').style.display = 'none';

    document.querySelector('#authSection h2:nth-of-type(1)').style.display = 'none';
    document.querySelector('#authSection h2:nth-of-type(2)').style.display = 'none';
    // hide guest button
    document.getElementById('guestButton').style.display = 'none';
}
// Function to toggle the friends menu
function toggleFriendsMenu() {
    const friendsMenu = document.getElementById('friendsMenu');
    if (friendsMenu.style.display === 'none' || friendsMenu.style.display === '') {
        friendsMenu.style.display = 'block';
    } else {
        friendsMenu.style.display = 'none';
    }
}

// Get references to elements
const friendsButton = document.getElementById('friendsButton');
const mainMenuButton = document.getElementById('mainMenuButton');
const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');

// Attach event listeners if elements exist
if (friendsButton) {
    friendsButton.addEventListener('click', toggleFriendsMenu);
}

if (mainMenuButton) {
    mainMenuButton.addEventListener('click', () => {
        document.getElementById('friendsMenu').style.display = 'none';
    });
}

if (sendFriendRequestButton) {
    sendFriendRequestButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default submission

        const friendEmail = document.getElementById('friendEmail').value;
        const user = auth.currentUser;

        if (!user) {
            alert("You must be signed in to send friend requests.");
            return;
        }

        try {
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
    });
}

// Export the showMainMenu function
export { showMainMenu };