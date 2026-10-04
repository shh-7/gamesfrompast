const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, "../client")));


// Store active rooms
const rooms = {};


// Player connects
io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);


    // CREATE ROOM
    socket.on("createRoom", (playerName) => {

        const roomCode = generateRoomCode();

        rooms[roomCode] = {
            players: [
                {
                    id: socket.id,
                    name: playerName
                }
            ]
        };

        socket.join(roomCode);

        socket.emit("roomCreated", {
            roomCode: roomCode,
            playerName: playerName
        });

        console.log(`${playerName} created room ${roomCode}`);
    });


    // JOIN ROOM
    socket.on("joinRoom", ({ roomCode, playerName }) => {

        const room = rooms[roomCode];

        if (!room) {
            socket.emit("joinError", "Room does not exist.");
            return;
        }

        if (room.players.length >= 2) {
            socket.emit("joinError", "Room is already full.");
            return;
        }

        room.players.push({
            id: socket.id,
            name: playerName
        });

        socket.join(roomCode);

        socket.emit("roomJoined", {
            roomCode: roomCode
        });

        io.to(roomCode).emit("playersUpdated", room.players);

        console.log(`${playerName} joined room ${roomCode}`);
    });


    // PLAYER DISCONNECTS
    socket.on("disconnect", () => {

        console.log("Player disconnected:", socket.id);

        for (const roomCode in rooms) {

            const room = rooms[roomCode];

            room.players = room.players.filter(
                player => player.id !== socket.id
            );

            if (room.players.length === 0) {
                delete rooms[roomCode];
                console.log(`Room ${roomCode} deleted.`);
            }
        }
    });

});


// Generate room code
function generateRoomCode() {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for (let i = 0; i < 5; i++) {
        code += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return code;
}


// Start server
server.listen(PORT, () => {

    console.log("Project Nostalgia running at:");
    console.log(`http://localhost:${PORT}`);

});