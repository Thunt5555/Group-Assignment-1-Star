
import { db } from './firebase';
import { collection, addDoc, doc, getDoc, updateDoc, FieldValue } from 'firebase/firestore';

// Function to create a room
async function createRoom(roomName, userId) {
    try {

        const roomRef = await addDoc(collection(db, "rooms"), {
            name: roomName,
            players: [userId],
            gameState: "waiting",
        });
        console.log("Room created with ID:", roomRef.id);
        return roomRef.id;
    } catch (error) {
        console.error("Error creating room:", error);
        throw new Error("Failed to create room");
    }
}

// Function to join an existing room
async function joinRoom(roomId, userId) {
    try {
        const roomRef = doc(db, "rooms", roomId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
            const roomData = roomSnap.data();

            if (roomData.players.length < 4) {

                await updateDoc(roomRef, {
                    players: FieldValue.arrayUnion(userId),
                });
                console.log("Player added to room:", roomId);
                return roomData;
            } else {
                console.log("Room is full.");
                return null;
            }
        } else {
            console.log("Room does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error joining room:", error);
        throw new Error("Failed to join room.");
    }
}


export { createRoom, joinRoom,};
