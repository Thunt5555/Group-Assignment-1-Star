// auth.js
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

let isSigningUp = false;

// Function to handle login logic
function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("User signed in successfully: " + user.email);
            showMainMenu(); // Show the main menu after successful login
        })
        .catch((error) => {
            if (error.code === "auth/user-not-found") {
                alert("No user found with this email. Please sign up first.");
            } else if (error.code === "auth/wrong-password") {
                alert("Incorrect password. Please try again.");
            } else {
                alert("Error: " + error.message);
            }
        });
}

// Sign up function
async function signUp(event) {
    event.preventDefault();
    const email = document.getElementById('emailSignup').value;
    const password = document.getElementById('passwordSignup').value;
    const avatar = "images/OIP.jpg"; // Fixed avatar path

    if (password.length > 256) {
        alert("Password is too long. Maximum length is 256 characters.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data in Firestore using UID as the document ID
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            username: email.split('@')[0], // Default username based on email
            avatar: avatar,
            friends: [], // Initialize empty friends list
            status: "offline" // Default status
        });

        alert("User signed up successfully: " + user.email);
        showMainMenu();
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("This email is already in use. Please try logging in.");
        } else if (error.code === "auth/weak-password") {
            alert("Your password is too weak. Please choose a stronger password.");
        } else {
            alert("Error: " + error.message);
        }
    }
}

function setBool() {
    isSigningUp = !isSigningUp;
    document.getElementById('signupForm').style.display = isSigningUp ? 'block' : 'none';
    document.getElementById('loginForm').style.display = isSigningUp ? 'none' : 'block';
    document.getElementById('loginLinks').style.display = isSigningUp ? 'none' : 'block'; // Hide or show the login links
}

function handleAuth(event) {
    console.log("called auth with", isSigningUp);
    isSigningUp ? signUp(event) : handleLogin(event);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("buttonSetSigningUp").addEventListener("click", setBool);
});

function toggleSignUp() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginLinks').style.display = 'block'; // Show login links again
}

// Guest sign-in function
function signInGuest(event) {
    event.preventDefault();
    signInAnonymously(auth)
        .then(() => {
            alert("Guest user signed in successfully");
            showMainMenu(); // Optionally show main menu for guest
        })
        .catch((error) => {
            alert("Error: " + error.message); // Handle errors
        });
}

// Function to show the main menu
function showMainMenu() {
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('authSection').style.display = 'none'; // Hide auth section
}

// Event listeners for forms and buttons
document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('signupForm').addEventListener('submit', signUp);
document.getElementById('guestButton').addEventListener('click', signInGuest);

// Export functions for use in other files if needed
export { handleLogin, signUp, signInGuest, showMainMenu, handleAuth };
