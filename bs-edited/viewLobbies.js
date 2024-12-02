import { db } from './firebase.js';
import { getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

export async function viewLobbies() {
    try {
        const lobbiesRef = collection(db, 'lobbies');
        const snapshot = await getDocs(lobbiesRef);

        if (!snapshot || snapshot.empty) {
            console.log('No lobbies found.');
            return []; // Return an empty array if no lobbies exist
        }

        const lobbies = [];
        snapshot.forEach((doc) => {
            const lobby = doc.data();
            if (lobby) {
                lobbies.push({
                    id: doc.id, // Include the lobby ID
                    ...lobby,
                });
            }
        });

        console.log('Fetched lobbies:', lobbies);
        return lobbies; // Return the array of lobbies
    } catch (error) {
        console.error('Error fetching lobbies:', error);
        return []; // Return an empty array in case of an error
    }
}
