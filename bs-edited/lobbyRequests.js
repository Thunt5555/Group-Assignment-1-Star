import { db } from './firebase.js';
import { getDoc, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

export async function manageJoinRequests() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        alert('You must be signed in to manage requests.');
        return;
    }

    const lobbyRef = doc(db, 'lobbies', currentUser.uid); // Assuming hostId is the document ID
    const lobbyDoc = await getDoc(lobbyRef);

    if (!lobbyDoc.exists()) {
        alert('Lobby not found.');
        return;
    }

    const requests = lobbyDoc.data().joinRequests || [];
    console.log('Join Requests:', requests);

    requests.forEach((request) => {
        // Display requests and allow approval/denial
        console.log(`Request from: ${request}`);
    });
}
