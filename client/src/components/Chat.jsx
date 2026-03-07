import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:7000"); 

const Chat = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [userId, setUserId] = useState(""); // only for testing
    const [receiverId, setReceiverId] = useState("");

    useEffect(() => {
        // Socket listeners
        socket.on("receive_message", (data) => {
            setChat((prev) => [...prev, data]);
        });

        return () => socket.off("receive_message");
    }, []);

    const joinRoom = () => {
        if (userId !== "") {
            socket.emit("join", userId);
            alert(`✅ User ${userId} joined!`);
        }
    };

    const sendMessage = () => {
        const messageData = {
            senderId: userId,
            receiverId: receiverId,
            message: message,
        };

        socket.emit("send_message", messageData);
        setChat((prev) => [...prev, { ...messageData, self: true }]);
        setMessage("");
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>LinguaChat MVP 🚀</h2>
            
            <input 
                placeholder="Apni ID (e.g. 123)" 
                onChange={(e) => setUserId(e.target.value)} 
            />
            <button onClick={joinRoom}>Join</button>
            <br /><br />
            
            <input 
                placeholder="Receiver ID (e.g. 456)" 
                onChange={(e) => setReceiverId(e.target.value)} 
            />
            <br /><br />

            <div style={{ height: '300px', border: '1px solid black', overflowY: 'scroll', marginBottom: '10px' }}>
                {chat.map((msg, i) => (
                    <div key={i} style={{ textAlign: msg.self ? 'right' : 'left' }}>
                        <p><strong>{msg.senderId}:</strong> {msg.text}</p>
                    </div>
                ))}
            </div>

            <input 
                value={message}
                placeholder="Message likho..." 
                onChange={(e) => setMessage(e.target.value)} 
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;