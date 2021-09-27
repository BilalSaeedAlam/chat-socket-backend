const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // USER CONNECTED
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id: ${socket.id} joined room: ${data} `);
  });

  // SEND MESSAGE
  socket.on("send_message", (data) => {
    console.log("Message:", data);
    socket.to(data.room).emit("receive_message", data);
  });
  // USER DISCONNECTED
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
