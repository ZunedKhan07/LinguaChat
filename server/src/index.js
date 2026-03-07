import express from "express";
import cors from "cors";
import connect_DB from "./config/db.js";
import cookieParser from "cookie-parser";
import http from "http";
import setupSocket from "./sockets/chatSocket.js"

const app = express();
const server = http.createServer(app);

const io = setupSocket(server);

connect_DB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("✅ Hello 👋, This is the backend of CareerWithAI!");
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> {
    console.log(`\n ✅ Server is screaming on port ${PORT}`);
    
})