// auth.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Signup function
function signUp(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (password.length > 256) {
        alert("Password is too long. Maximum length is 256 characters.");
        return;
    }

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

document.getElementById('signInForm').addEventListener('submit', signIn);

// Guest sign-in function
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

function showMainMenu() {
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('signInForm').style.display = 'none';
    document.querySelector('#authSection h2:nth-of-type(1)').style.display = 'none';
    document.querySelector('#authSection h2:nth-of-type(2)').style.display = 'none';
    document.getElementById('guestButton').style.display = 'none';
}

export { signIn, signUp, signInGuest, showMainMenu };
