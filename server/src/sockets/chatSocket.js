import { Server } from "socket.io";

const chatSocketMap = {}; 

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`🟢 New Connection: ${socket.id}`);

    socket.on("join", (userId) => {
      if (userId) {
        chatSocketMap[userId] = socket.id;
        socket.userId = userId;
        console.log(`👤 User ${userId} is online.`);
      }
    });

    socket.on("send_message", async (data) => {
      const { senderId, receiverId, message } = data;

      const receiverSocketId = chatSocketMap[receiverId];
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", {
          senderId,
          text: message,
          originalText: message
        });
        console.log(`📩 Message sent from ${senderId} to ${receiverId}`);
      } else {
        console.log(`⚠️ Receiver ${receiverId} is offline.`);
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        delete chatSocketMap[socket.userId]; // Map se hata do
        console.log(`🔴 User ${socket.userId} disconnected.`);
      }
    });
  });

  return io;
};

export default setupSocket;