import { Server } from "socket.io";

const users = {};

const setupSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket Connected:", socket.id);

    // USER JOIN
    socket.on("join", (userId) => {
      if (!userId) return;

      users[userId] = socket.id;
      socket.userId = userId;

      console.log(`👤 User Joined: ${userId}`);
      console.log("📌 Users Map:", users);
    });

    // SEND MESSAGE
    socket.on("send_message", (data) => {

      const senderId = String(data.senderId).trim();
      const receiverId = String(data.receiverId).trim();
      
      console.log("All users:", users);
      console.log("Sender:", senderId, "Receiver:", receiverId);

      const message = data.message;

      const receiverSocket = users[receiverId];

      const payload = {
        senderId,
        text: message
      };

      console.log("📤 Sending:", senderId, "→", receiverId);
      console.log("Receiver Socket:", receiverSocket);

      // SEND TO RECEIVER
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", payload);
      }
  });

    socket.on("disconnect", () => {

      if (socket.userId) {
        delete users[socket.userId];
        console.log(`🔴 User Disconnected: ${socket.userId}`);
      }

    });

  });

  return io;
};

export default setupSocket;