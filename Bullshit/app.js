// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

// Signup function
function signUp(event) {
  event.preventDefault(); // Prevent form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (password.length > 256) {
    alert("Password is too long. Maximum length is 256 characters.");
    return;
  }
  // Firebase signup function
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

// Attach the event listener to the form
document.getElementById('signupForm').addEventListener('submit', signUp);

// Sign-in function
function signIn(event) {
  event.preventDefault();  // Prevents the form from submitting and reloading the page
  
  // Get email and password values from the form inputs
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

// Show the main menu
function showMainMenu() {
  document.getElementById('mainMenu').style.display = 'block';
  // Hide the signup and signin forms
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('signInForm').style.display = 'none';

  document.querySelector('#authSection h2:nth-of-type(1)').style.display = 'none'; // Hide Sign Up header
  document.querySelector('#authSection h2:nth-of-type(2)').style.display = 'none'; // Hide Sign In header
 

  // hide the guest button
  document.getElementById('guestButton').style.display = 'none';
}


// Attach the event listener to the form
document.getElementById('signInForm').addEventListener('submit', signIn);

function signInGuest(event) {
  event.preventDefault();

  signInAnonymously(auth)
    .then(() => {
      // Signed in..
      alert("Guest user signed in successfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
}

document.getElementById('guestButton').addEventListener('click', signInGuest);


// Add friends functionality
function showFriendsMenu() {
  const friendsMenu = document.getElementById('friendsMenu');
  friendsMenu.style.display = 'block'; // Show the friends menu
  // You can hide other sections if necessary
}