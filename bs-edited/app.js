// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const db = getDatabase(app);

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
      const user = userCredential.user;
      alert("User signed up successfully: " + user.email);
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

document.getElementById('signupForm').addEventListener('submit', signUp);

// Sign-in function
function signIn(event) {
  event.preventDefault();
  
  const email = document.getElementById('emailSignIn').value;
  const password = document.getElementById('passwordSignIn').value;

  if (password.length > 256) {
    alert("Password is too long. Maximum allowed length is 256 characters.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("User signed in successfully: " + user.email);
      showMainMenu(); 
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

function showMainMenu() {
  document.getElementById('mainMenu').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('signInForm').style.display = 'none';
  document.querySelector('#authSection h2:nth-of-type(1)').style.display = 'none';
  document.querySelector('#authSection h2:nth-of-type(2)').style.display = 'none';
  document.getElementById('guestButton').style.display = 'none';
}

document.getElementById('signInForm').addEventListener('submit', signIn);

function signInGuest(event) {
  event.preventDefault();

  signInAnonymously(auth)
    .then(() => {
      alert("Guest user signed in successfully");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

document.getElementById('guestButton').addEventListener('click', signInGuest);

function sendMessage(e) {
  e.preventDefault();

  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  const username = auth.currentUser.email || "Guest";

  messageInput.value = "";

  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  set(ref(db, "messages/" + timestamp), {
    username,
    message,
  });
}

document.getElementById("message-form").addEventListener("submit", sendMessage);

function showChatMenu() {
  const chatMenu = document.getElementById('chatMenu');
  chatMenu.style.display = 'block';

  const username = auth.currentUser.email || "Guest";

  const fetchChat = ref(db, "messages/");
  onChildAdded(fetchChat, (snapshot) => {
    const messages = snapshot.val();
    const message = `<li class=${
      username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
    document.getElementById("messages").innerHTML += message;
  });
}

document.getElementById('chatButton').addEventListener('click', showChatMenu);
