// auth.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

let isSigningUp = false;

// Function to handle login logic
function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the email and password from input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call Firebase sign-in function
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("User signed in successfully: " + user.email);
            showMainMenu(); // Show the main menu after successful login
        })
        .catch((error) => {
            alert("Error: " + error.message); // Handle errors
        });
}

// Sign up function
async function signUp(event) {
    event.preventDefault();
    const email = document.getElementById('emailSignup').value;
    const password = document.getElementById('passwordSignup').value;
    const avatar = "default-avatar.png"; // Set a default avatar or allow user to choose

    if (password.length > 256) {
        alert("Password is too long. Maximum length is 256 characters.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Add user data to the 'users' collection in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            username: email.split('@')[0], // Create a default username based on email
            avatar: avatar,
            friends: [], // Initialize with an empty friends array
        });

        alert("User signed up successfully: " + user.email);
        showMainMenu(); // Optionally show main menu after signup
    } catch (error) {
        alert("Error: " + error.message);
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

document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("buttonSetSigningUp");
    button.addEventListener("click", setBool)
});

function toggleSignUp() {
    // Directly show login form and hide sign-up form
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginLinks').style.display = 'block'; // Show login links again
}

// Sign in function
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
            showMainMenu(); // Show main menu on successful sign-in
        })
        .catch((error) => {
            alert("Error: " + error.message); // Handle errors
        });
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
