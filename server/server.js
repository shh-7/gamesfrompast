const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const PORT = process.env.PORT || 3000;


// Serve the client
app.use(express.static(path.join(__dirname, "../client")));


// Socket connection
io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
    });

});


server.listen(PORT, () => {
    console.log(`Games From Past running at http://localhost:${PORT}`);
});