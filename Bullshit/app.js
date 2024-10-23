// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

// Function to store email and password in Firebase
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
e.preventDefault();

const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// Push data to Firebase database
const userRef = database.ref('users');
userRef.push({
    email: email,
    password: password
})
.then(() => {
    alert('User data saved successfully');
    signupForm.reset();
})
.catch(error => {
    console.error("Error saving data: ", error);
});
});
  