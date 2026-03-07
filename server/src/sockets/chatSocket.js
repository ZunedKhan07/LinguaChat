import { Server } from "socket.io";

const chatSocketMap = {}; 

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Anyone is connected: ${socket.id}`);

    socket.on("join", (userId) => {
      chatSocketMap[userId] = socket.id;
      console.log(`User ${userId} is online now.`);
    });

    socket.on("send_message", async (data) => {
      const { senderId, receiverId, message, senderLang } = data;

      // 1. Database se receiver ki preferred language uthao (Mongoose model use karke)
      // 2. Gemini ko call karo: message translate karo receiverLang mein
      // 3. Translated text ko receiver ke socket pe emit karo
      
      const receiverSocketId = chatSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", {
          senderId,
          text: message,
          originalText: message
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Anyone is not here!");
    });
  });

  return io;
};

export default setupSocket;