// hostLobby.js
import { db } from './firebase.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

export async function hostLobby(hostId, lobbyName, isPrivate) {
    try {
        const lobbyId = `lobby_${Date.now()}`; // Generate unique ID
        const lobbyRef = doc(db, 'lobbies', lobbyId);

        await setDoc(lobbyRef, {
            hostId,
            name: lobbyName,
            isPrivate,
            maxPlayers: 6,
            playerCount: 1,
            status: 'waiting',
            players: {
                [hostId]: {
                    role: 'host',
                    status: 'active',
                },
            },
        });

        alert(`Lobby "${lobbyName}" created successfully!`);
    } catch (error) {
        console.error('Error hosting lobby:', error);
        alert('Failed to create lobby. Please try again.');
    }
}
