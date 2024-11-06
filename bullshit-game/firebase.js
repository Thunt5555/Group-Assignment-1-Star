// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { doc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


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

//initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

//function to host a game
async function hostGame(hostId) {
    try {
        const gameDocRef = doc(db, "games", hostId);
        await setDoc(gameDocRef, {
            host: hostId,
            players: [hostId],
            status: "waiting",
            createdAt: new Date()
        });
        console.log("Game hosted successfully");
        return gameDocRef;
    } catch (error) {
        console.error("Error hosting game:", error);
    }
}

// function to join a game
async function joinGame(gameId, playerId) {
    try {
        const gameDocRef = doc(db, "games", gameId);
        await updateDoc(gameDocRef, {
            players: arrayUnion(playerId)
        });
        console.log("Joined game successfully");
    } catch (error) {
        console.error("Error joining game:", error);
    }
}

function listenToGameUpdates(gameId) {
    const gameDocRef = doc(db, "games", gameId);
    onSnapshot(gameDocRef, (doc) => {
        console.log("Current game data:", doc.data());
    });
}


listenToGameUpdates(gameId);



