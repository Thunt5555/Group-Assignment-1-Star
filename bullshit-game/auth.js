// Import Firebase SDK and functions
import { auth } from "./firebase.js";
import { showMainMenu } from "./main.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Signup function
function signUp(event) {
    event.preventDefault();// Signup with default entry prevented
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (password.length > 256) {
        alert("Password is too long. Maximum length is 256 characters.");
        return;
    }
    document.body.classList.add('background-signup');


    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("User signed up successfully: " + user.email);
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}


// Sign in function for Email/Password
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
// Guest sign-in function
// Sign in as a guest
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
  
// Sign in with Google (if using OAuth)
function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            alert("User signed in with Google: " + user.email);
            showMainMenu();
        })
        .catch((error) => {
            alert("Error during Google sign-in: " + error.message);
        });
}


// Attach event listeners
document.getElementById('signupForm').addEventListener('submit', signUp);
document.getElementById('signInForm').addEventListener('submit', signIn);
document.getElementById('guestButton').addEventListener('click', signInGuest);

// Optional: Attach event listener for Google sign-in
document.getElementById('googleSignInButton')?.addEventListener('click', signInWithGoogle);

export { signUp, signIn, signInGuest, signInWithGoogle }; 