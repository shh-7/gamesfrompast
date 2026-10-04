const socket = io();


// ========================================
// ELEMENTS
// ========================================

const gameNameButton = document.getElementById("gameNameButton");
const createRoomButton = document.getElementById("createRoomButton");
const joinRoomButton = document.getElementById("joinRoomButton");


// ========================================
// SOCKET CONNECTION
// ========================================

socket.on("connect", () => {

    console.log(
        "Connected to Project Nostalgia server:",
        socket.id
    );

});


// ========================================
// GET / SET GAME NAME
// ========================================

function getGameName() {

    let gameName = localStorage.getItem("gameName");

    // If name already exists, use it
    if (gameName) {
        return gameName;
    }


    // Ask player for a name
    gameName = prompt("Enter your game name:");

    if (gameName === null) {
        return null;
    }


    gameName = gameName.trim();


    // Empty name
    if (gameName === "") {

        alert("Game name cannot be empty.");

        return null;
    }


    // Name too long
    if (gameName.length > 20) {

        alert("Game name must be 20 characters or less.");

        return null;
    }


    // Save name
    localStorage.setItem("gameName", gameName);

    return gameName;
}


// ========================================
// GAME NAME BUTTON
// ========================================

gameNameButton.addEventListener("click", () => {

    const currentName = localStorage.getItem("gameName");


    const name = prompt(
        "Enter your game name:",
        currentName || ""
    );


    // Player cancelled
    if (name === null) {
        return;
    }


    const trimmedName = name.trim();


    if (trimmedName === "") {

        alert("Game name cannot be empty.");

        return;
    }


    if (trimmedName.length > 20) {

        alert("Game name must be 20 characters or less.");

        return;
    }


    localStorage.setItem("gameName", trimmedName);


    alert(
        `Game name saved as "${trimmedName}"`
    );

});


// ========================================
// CREATE ROOM
// ========================================

createRoomButton.addEventListener("click", () => {

    const gameName = getGameName();


    // Player cancelled name entry
    if (!gameName) {
        return;
    }


    console.log(
        "Creating room for:",
        gameName
    );


    socket.emit("createRoom", gameName);

});


// ========================================
// ROOM CREATED
// ========================================

socket.on("roomCreated", (data) => {

    console.log(
        "Room created:",
        data.roomCode
    );


    // Move player to room
    window.location.href =
        `/room/room.html?code=${data.roomCode}`;

});


// ========================================
// JOIN ROOM
// ========================================

joinRoomButton.addEventListener("click", () => {

    const gameName = getGameName();


    // Player cancelled name entry
    if (!gameName) {
        return;
    }


    // Ask for room code
    const roomCode = prompt(
        "Enter room code:"
    );


    // Player cancelled
    if (roomCode === null) {
        return;
    }


    const trimmedCode =
        roomCode.trim().toUpperCase();


    if (trimmedCode === "") {

        alert(
            "Room code cannot be empty."
        );

        return;
    }


    console.log(
        `Joining room ${trimmedCode} as ${gameName}`
    );


    socket.emit("joinRoom", {

        roomCode: trimmedCode,

        playerName: gameName

    });

});


// ========================================
// ROOM JOINED
// ========================================

socket.on("roomJoined", (data) => {

    console.log(
        "Successfully joined room:",
        data.roomCode
    );


    // Move player to room
    window.location.href =
        `/room/room.html?code=${data.roomCode}`;

});


// ========================================
// JOIN ERROR
// ========================================

socket.on("joinError", (message) => {

    console.error(
        "Failed to join room:",
        message
    );


    alert(
        `❌ ${message}`
    );

});


// ========================================
// DISCONNECT
// ========================================

socket.on("disconnect", () => {

    console.log(
        "Disconnected from Project Nostalgia server."
    );

});