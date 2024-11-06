// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// Export the initialized auth and database
export { auth, db };
