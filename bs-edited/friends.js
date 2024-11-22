// Import necessary objects and functions from firebase.js
import { auth, db } from "./firebase.js";
import { setDoc, arrayRemove, doc, getDoc, getDocs, collection, updateDoc, arrayUnion, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Centralized function to toggle sections
function showSection(sectionId) {
    const sections = ["addFriendSection", "friendRequestsSection", "friendsListSection", "mainMenu", "chatMenu"];
    sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = id === sectionId ? "block" : "none";
        }
    });
}

// Function to show Add Friends Menu
function addFriendsMenu() {
    showSection("addFriendSection");
}

// Function to send a friend request
async function sendFriendRequest(event) {
    event.preventDefault();
    const friendEmail = document.getElementById("friendEmail").value;
    const user = auth.currentUser;

    if (!user) {
        alert("You must be signed in to send friend requests.");
        return;
    }

    try {
        const friendQuery = query(collection(db, "users"), where("email", "==", friendEmail));
        const friendSnapshot = await getDocs(friendQuery);

        if (!friendSnapshot.empty) {
            const friendData = friendSnapshot.docs[0].data();
            const friendUid = friendData.uid;

            await setDoc(doc(db, "friendRequests", `${user.uid}_${friendUid}`), {
                sender: user.uid,
                recipient: friendUid,
                status: "pending",
            });

            alert(`Friend request sent to ${friendEmail}`);
            document.getElementById("friendEmail").value = "";
        } else {
            alert("No user found with that email address.");
        }
    } catch (error) {
        console.error("Error sending friend request:", error);
        alert("Error sending friend request.");
    }
}

// Function to accept a friend request
async function acceptFriendRequest(request) {
    const user = auth.currentUser;

    if (!user) {
        console.error("No authenticated user found.");
        return;
    }

    try {
        // Update friend request status to "accepted"

        const requestRef = doc(db, "friendRequests", `${request.sender}_${request.recipient}`);
        await updateDoc(requestRef, { status: "accepted" });
        
        // Update friends list for both users
        const userRef = doc(db, "users", user.uid);
        const friendRef = doc(db, "users", request.sender);

        await updateDoc(userRef, { friends: arrayUnion(request.sender) });
        await updateDoc(friendRef, { friends: arrayUnion(user.uid) });

    // Fetch the friend's details for the confirmation alert
    const friendDoc = await getDoc(friendRef);
    if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        const friendName = friendData.username || friendData.email.split("@")[0]; // Use username or part of email
        alert(`Friend request accepted from ${friendName}`);
    } else {
        alert("Friend request accepted, but the sender's details could not be retrieved.");
    }        
    
    retrieveFriendRequests();
    } catch (error) {
        console.error("Error accepting friend request:", error);
        alert("Error accepting friend request.");
    }
}

// Function to decline a friend request
async function declineFriendRequest(request) {
    try {
        const requestRef = doc(db, "friendRequests", `${request.sender}_${request.recipient}`);
        await updateDoc(requestRef, { status: "declined" });

        // Fetch the friend's details for the confirmation alert
        const friendRef = doc(db, "users", request.sender);
        const friendDoc = await getDoc(friendRef);
        if (friendDoc.exists()) {
            const friendData = friendDoc.data();
            const friendName = friendData.username || friendData.email.split("@")[0]; // Use username or part of email
            alert(`Friend request declined from ${friendName}`);
        } else {
            alert("Friend request declined, but the sender's details could not be retrieved.");
        }

        retrieveFriendRequests(); // Refresh the friend requests list
    } catch (error) {
        console.error("Error declining friend request:", error);
        alert("Error declining friend request.");
    }
}


// Function to retrieve friend requests
function retrieveFriendRequests() {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be signed in to view friend requests.");
        return;
    }

    const friendRequestsList = document.getElementById("friendRequestsList");
    friendRequestsList.innerHTML = ""; // Clear old list

    getDocs(query(collection(db, "friendRequests"), where("recipient", "==", user.uid), where("status", "==", "pending")))
        .then(async (querySnapshot) => {
            if (querySnapshot.empty) {
                friendRequestsList.innerHTML = "<li>No friend requests at the moment.</li>";
                return;
            }

            for (const docSnapshot of querySnapshot.docs) {
                const request = docSnapshot.data();
                const senderUid = request.sender;

                try {
                    // Fetch sender's details
                    const senderRef = doc(db, "users", senderUid);
                    const senderDoc = await getDoc(senderRef);

                    let senderName = senderUid; // Default to UID if details cannot be retrieved
                    if (senderDoc.exists()) {
                        const senderData = senderDoc.data();
                        senderName = senderData.username || senderData.email.split("@")[0];
                    }

                    const li = document.createElement("li");
                    li.textContent = `Friend request from: ${senderName}`;

                    const acceptButton = document.createElement("button");
                    acceptButton.textContent = "Accept";
                    acceptButton.classList.add("accept-button"); // Add green styling
                    acceptButton.onclick = () => acceptFriendRequest(request);

                    const declineButton = document.createElement("button");
                    declineButton.textContent = "Decline";
                    declineButton.classList.add("decline-button"); // Add red styling
                    declineButton.onclick = () => declineFriendRequest(request);

                    li.appendChild(acceptButton);
                    li.appendChild(declineButton);
                    friendRequestsList.appendChild(li);
                } catch (error) {
                    console.error(`Error fetching sender details for UID: ${senderUid}`, error);
                }
            }
        })
        .catch((error) => {
            console.error("Error fetching friend requests:", error);
            alert("Error fetching friend requests.");
        });
}



// Function to display friends list
async function displayFriendsList() {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be signed in to view your friends.");
        return;
    }

    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML = ""; // Clear old list

    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const friends = userDoc.data().friends;

            if (!friends || friends.length === 0) {
                friendsList.innerHTML = "<li>You have no friends added yet.</li>";
                return;
            }

            for (const friendUid of friends) {
                const friendRef = doc(db, "users", friendUid);
                const friendDoc = await getDoc(friendRef);

                if (friendDoc.exists()) {
                    const friendData = friendDoc.data();
                    const li = document.createElement("li");
                    li.textContent = `Friend: ${friendData.username} (${friendData.email})`;

                    // Add Remove button
                    const removeButton = document.createElement("button");
                    removeButton.textContent = "Remove";
                    removeButton.classList.add("remove-button"); // Apply CSS class for styling
                    removeButton.addEventListener("click", () => {
                        if (confirm(`Are you sure you want to remove ${friendData.username}?`)) {
                            removeFriend(friendUid);
                        }
                    });

                    li.appendChild(removeButton);
                    friendsList.appendChild(li);
                } else {
                    console.error(`Friend document not found for UID: ${friendUid}`);
                }
            }
        } else {
            alert("Error: User document not found.");
        }
    } catch (error) {
        console.error("Error displaying friends list:", error);
        alert("Error displaying friends list.");
    }
}


// Function to remove a friend
async function removeFriend(friendUid) {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be signed in to remove friends.");
        return;
    }

    try {
        // Remove friendUid from the current user's friends list
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            friends: arrayRemove(friendUid),
        });

        // Remove current user's UID from the friend's friends list
        const friendRef = doc(db, "users", friendUid);
        await updateDoc(friendRef, {
            friends: arrayRemove(user.uid),
        });

        alert("Friend removed successfully.");
        displayFriendsList(); // Refresh the friends list
    } catch (error) {
        console.error("Error removing friend:", error);
        alert("Error removing friend.");
    }
}


// Attach event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("buttonAddFriends").addEventListener("click", addFriendsMenu);

    document.getElementById("friendsButton").addEventListener("click", () => {
        showSection("friendsListSection");
        displayFriendsList();
    });
    document.getElementById("sendFriendRequestButton").addEventListener("click", sendFriendRequest);


    document.getElementById("viewFriendRequestsButton").addEventListener("click", () => {
        showSection("friendRequestsSection");
        retrieveFriendRequests();
    });

    document.getElementById("backToAddFriendsButton").addEventListener("click", () => {
        showSection("addFriendSection");
    });

    document.getElementById("backToMainMenuButtonFromAddList").addEventListener("click", () => {
        showSection("mainMenu");
    });

    document.getElementById("backToMainMenuButtonFromFriendList").addEventListener("click", () => {
        showSection("mainMenu");
    });
});

export { sendFriendRequest, acceptFriendRequest, declineFriendRequest, retrieveFriendRequests };
