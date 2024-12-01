import { db } from './firebase.js';
import { getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

export async function viewLobbies() {
    const lobbiesList = document.getElementById('lobbiesList');
    lobbiesList.innerHTML = ''; // Clear the list.

    try {
        const lobbiesRef = collection(db, 'lobbies');
        const snapshot = await getDocs(lobbiesRef);

        snapshot.forEach((doc) => {
            const lobby = doc.data();

            const listItem = document.createElement('li');
            listItem.textContent = `${lobby.name} (${lobby.playerCount}/${lobby.maxPlayers})`;

            const actionButton = document.createElement('button');
            actionButton.textContent = lobby.playerCount < lobby.maxPlayers ? 'Join' : 'Request to Join';

            actionButton.addEventListener('click', () => {
                // Handle join or request logic here
                console.log(`Clicked on ${doc.id}`);
            });

            listItem.appendChild(actionButton);
            lobbiesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching lobbies:', error);
        alert('Failed to fetch lobbies.');
    }
}
