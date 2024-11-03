// friends.js
import { auth, db } from "./firebase.js";
import { doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Send friend request function
document.getElementById('sendFriendRequestButton').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default submission
  
    const friendEmail = document.getElementById('friendEmail').value; // Input friend's email
    const user = auth.currentUser; // Get the currently signed-in user
  
    if (!user) {
        alert("You must be signed in to send friend requests.");
        return;
    }
  
    try {
        // Create new document in friendRequests collection
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
  });
  
  
  function toggleFriendsMenu() {
      const friendsMenu = document.getElementById('friendsMenu');
      if (friendsMenu.style.display === 'none' || friendsMenu.style.display === '') {
          friendsMenu.style.display = 'block';
      } else {
          friendsMenu.style.display = 'none';
      }
  }
  
  // Menu for the friends button click
  document.getElementById('friendsButton').addEventListener('click', toggleFriendsMenu);
  document.getElementById('mainMenuButton').addEventListener('click', () => {
    document.getElementById('friendsMenu').style.display = 'none';
  });
  
  
  // Friends butto dropdown
  document.getElementById('viewFriendsButton').addEventListener('click', function() {
      document.getElementById('friendsListSection').style.display = 'block'; // Show friends list
      document.getElementById('addFriendSection').style.display = 'none'; // Add friend section
      document.getElementById('friendRequestsSection').style.display = 'none'; // Friend requests
  });
  
  // Add Friends button dropdown
  document.getElementById('addFriendsButton').addEventListener('click', function() {
      document.getElementById('addFriendSection').style.display = 'block'; 
      document.getElementById('friendsListSection').style.display = 'none'; 
      document.getElementById('friendRequestsSection').style.display = 'none'; 
  });
  
  // Friend Requests button dropdown
  document.getElementById('friendRequestsButton').addEventListener('click', () => {
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
  });
  