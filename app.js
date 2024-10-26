const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketio(server);

// Set up EJS if using templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Root route for main page
app.get("/", (req, res) => {
    res.render("index");  // Use for EJS; if HTML, ensure index.html is in 'public' folder
});

// Socket.io connection
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
