// Import the necessary objects and functions from your firebase.js file
import { auth, db } from "./firebase.js";
import { setDoc, doc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Function to show the Add Friend section
function addFriendsMenu() {
    // Show the add friend section
    document.getElementById('addFriendSection').style.display = 'block';
}

function retrieveFriendMenu () {
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
            sender: user.email,
            recipient: friendEmail,
            status: "pending"
        });
        alert("Friend request sent to " + friendEmail);
        document.getElementById('friendEmail').value = ""; // Clear input
    } catch (error) {
        console.error("Error sending friend request: ", error);
        alert("Error sending friend request.");
    }
}

function retrieveFriendRequests() {
    const user = auth.currentUser;
  
    if (!user) {
        alert("You must be signed in to view friend requests.");
        return;
    }
  
    const friendRequestsList = document.getElementById('friendRequestsList');
      friendRequestsList.innerHTML = ""; // Clear old list
  
      // Retrieve friend requests 
      getDocs(collection(db, "friendRequests"))
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  const request = doc.data();
                  if (request.to === user.email && request.status === "pending") {
                      const li = document.createElement('li');
                      li.textContent = `Friend request from: ${request.from}`;
                      friendRequestsList.appendChild(li);
                  }
              });
          })
          .catch((error) => {
              console.error("Error fetching friend requests:", error);
              alert("Error fetching friend requests.");
          });
  
      // Show friend requests
    document.getElementById('friendRequestsSection').style.display = 'block'; // Show friend requests 
    document.getElementById('friendsListSection').style.display = 'none'; // friends list
    document.getElementById('addFriendSection').style.display = 'none'; // add friend 
};


// Attach event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const sendButton = document.getElementById("buttonAddFriends");
    const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');
    const backButton = document.getElementById('backToFriendsMenuButtonFromAdd');
    const retrieveButton = document.getElementById("friendsButton");

    sendButton.addEventListener("click", addFriendsMenu); // Show the input section on button click
    retrieveButton.addEventListener("click", retrieveFriendMenu); //Show the current friend requests sent to the user

    sendFriendRequestButton.addEventListener("click", sendFriendRequest); // Handle sending friend requests
    
    backButton.addEventListener("click", function() { // Handle the back button
        document.getElementById('addFriendSection').style.display = 'none';
    });
    
});

// Export functions if needed
export { sendFriendRequest };
