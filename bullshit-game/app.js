// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB44xbxuYHv3_VjpQ1zcuiKHkOesal50xM",
    authDomain: "bsregistration.firebaseapp.com",
    projectId: "bsregistration",
    storageBucket: "bsregistration.appspot.com",
    messagingSenderId: "203675511936",
    appId: "1:203675511936:web:c7f469220ea8402f580a65",
    measurementId: "G-2DMHJZMW1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
function signUp(event) {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (password.length > 256) {
    alert("Password is too long. Maximum length is 256 characters.");
    return;
  }
  // Signup with firebase function
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      alert("User signed up successfully: " + user.email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
}

// Sign-in function
function signIn(event) {
  event.preventDefault();  // Prevents submitting default
  
  // Get email and password from the  inputs
  const email = document.getElementById('emailSignIn').value;
  const password = document.getElementById('passwordSignIn').value;

  if (password.length > 256) {
    alert("Password is too long. Maximum allowed length is 256 characters.");
    return;
  }
  
  // Call Firebase authentication method
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      alert("User signed in successfully: " + user.email);
      showMainMenu(); 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
}

// As guest
function signInGuest(event) {
  event.preventDefault();

  signInAnonymously(auth)
    .then(() => {
      // Signed in
      alert("Guest user signed in successfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
}


// Event listeners for auth forms
document.getElementById('signupForm').addEventListener('submit', signUp);
document.getElementById('signInForm').addEventListener('submit', signIn);
document.getElementById('guestButton').addEventListener('click', signInGuest);


// Show the main menu
function showMainMenu() {
  document.getElementById('mainMenu').style.display = 'block';
  // Hide the signup and signin page
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('signInForm').style.display = 'none';

  document.querySelector('#authSection h2:nth-of-type(1)').style.display = 'none'; // Hide Sign Up header
  document.querySelector('#authSection h2:nth-of-type(2)').style.display = 'none'; // Hide Sign In header
 

  // hide guest button
  document.getElementById('guestButton').style.display = 'none';
}

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


// Back buttons logic
document.getElementById('backToFriendsMenuButton').addEventListener('click', function() {
    document.getElementById('friendsListSection').style.display = 'none'; // Friends list section
});

document.getElementById('backToFriendsMenuButtonFromAdd').addEventListener('click', function() {
    document.getElementById('addFriendSection').style.display = 'none'; // Add friend section
});

document.getElementById('backToFriendsMenuButtonFromRequests').addEventListener('click', function() {
    document.getElementById('friendRequestsSection').style.display = 'none'; // Friend requests section
});

// Main Menu button navigation
document.getElementById('mainMenuButton').addEventListener('click', function() {
    document.getElementById('friendsMenu').style.display = 'none'; // Hide friends menu
    
});



