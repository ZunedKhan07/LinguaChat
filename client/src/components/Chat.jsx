import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Languages, User as UserIcon, LogOut } from 'lucide-react';

const Chat = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [translations, setTranslations] = useState({}); // Stores translated text by msg index
    const [loading, setLoading] = useState({}); // Translation loading state
    
    // Auth data (Local storage se uthayenge real logic mein)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [receiverId, setReceiverId] = useState(""); 

    useEffect(() => {
        socket.connect();
        socket.emit("join", user._id);

        socket.on("receive_message", (data) => {
            setChat((prev) => [...prev, { ...data, self: false }]);
        });

        return () => {
            socket.off("receive_message");
            socket.disconnect();
        };
    }, [user._id]);

    const handleSendMessage = () => {
        if (!message.trim() || !receiverId) return;

        const messageData = {
            senderId: user._id,
            receiverId: receiverId,
            message: message,
        };

        socket.emit("send_message", messageData);
        setChat((prev) => [...prev, { senderId: user._id, text: message, self: true }]);
        setMessage("");
    };

    const handleTranslate = async (index, text) => {
        if (translations[index]) return; // Already translated

        setLoading(prev => ({ ...prev, [index]: true }));
        try {
            const res = await api.post("/translate/process", {
                text,
                targetLang: user.preferredLanguage || "hi",
                senderId: user._id,
                receiverId: receiverId
            });
            
            setTranslations(prev => ({ ...prev, [index]: res.data.data.translatedText }));
        } catch (err) {
            console.error("Translation fail!", err);
        } finally {
            setLoading(prev => ({ ...prev, [index]: false }));
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
            {/* Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-full"><UserIcon size={20}/></div>
                    <h1 className="text-xl font-bold tracking-tight">LinguaChat</h1>
                </div>
                <button className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"><LogOut size={20}/></button>
            </div>

            {/* Receiver Input Placeholder (MVP ke liye) */}
            <div className="p-2 bg-gray-800/50">
                <input 
                    className="w-full bg-transparent border-b border-gray-700 p-2 outline-none text-sm text-gray-400"
                    placeholder="Enter Receiver ID ..."
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                />
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chat.map((msg, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={i} 
                        className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-3 rounded-2xl shadow-md ${msg.self ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-800 rounded-tl-none border border-gray-700'}`}>
                            <p className="text-sm font-semibold opacity-70 mb-1">{msg.senderId === user._id ? "Me" : "Partner"}</p>
                            <p className="text-md leading-relaxed">{msg.text}</p>
                            
                            {/* Translation Result */}
                            <AnimatePresence>
                                {translations[i] && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mt-2 pt-2 border-t border-white/20 text-blue-100 italic text-sm"
                                    >
                                        {translations[i]}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Translate Button (Sirf received messages ke liye) */}
                            {!msg.self && (
                                <button 
                                    onClick={() => handleTranslate(i, msg.text)}
                                    className="mt-2 flex items-center gap-1 text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-full transition-all cursor-pointer"
                                    disabled={loading[i]}
                                >
                                    <Languages size={12}/> {loading[i] ? "Translating..." : "Translate"}
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="flex gap-2 items-center max-w-4xl mx-auto">
                    <input 
                        className="flex-1 bg-gray-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent"
                        placeholder="for messages..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                        onClick={handleSendMessage}
                        className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;