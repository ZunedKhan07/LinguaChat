import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Languages, User as UserIcon } from "lucide-react";

const SOCKET_URL = "http://localhost:7000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

const ChatSimulation = () => {

  const users = [
    { _id: "A", name: "User A" },
    { _id: "B", name: "User B" },
  ];

  const [messages, setMessages] = useState({
    A: [],
    B: [],
  });

  const [inputs, setInputs] = useState({
    A: "",
    B: "",
  });

  const [translations, setTranslations] = useState({});

  useEffect(() => {

    socket.connect();

    users.forEach((user) => {
      socket.emit("join", user._id);
    });

    socket.on("receive_message", (data) => {

      const { senderId, text } = data;

      const receiverId = senderId === "A" ? "B" : "A";

      setMessages((prev) => ({
        ...prev,
        [receiverId]: [
          ...prev[receiverId],
          { senderId, text, self: false },
        ],
      }));

    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };

  }, []);

  const handleSendMessage = (senderId) => {

    const receiverId = senderId === "A" ? "B" : "A";

    const message = inputs[senderId].trim();

    if (!message) return;

    const messageData = {
      senderId,
      receiverId,
      message,
    };

    socket.emit("send_message", messageData);

    setMessages((prev) => ({
      ...prev,
      [senderId]: [
        ...prev[senderId],
        { senderId, text: message, self: true },
      ],
    }));

    setInputs((prev) => ({
      ...prev,
      [senderId]: "",
    }));

  };

  const handleTranslate = async (userId, index) => {

    const msg = messages[userId][index];

    if (!msg || translations[`${userId}_${index}`]) return;

    try {

      const res = await fetch(
        "http://localhost:7000/api/v1/translate/translate-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: msg.text,
            targetLang: "hi",
          }),
        }
      );

      const data = await res.json();

      setTranslations((prev) => ({
        ...prev,
        [`${userId}_${index}`]: data.data.translatedText,
      }));

    } catch (err) {

      console.error("Translation error:", err);

    }

  };

  return (

    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-sans gap-2 p-2">

      {users.map((user) => (

        <div
          key={user._id}
          className="flex-1 flex flex-col border border-gray-700 rounded-xl overflow-hidden"
        >

          <div className="p-3 bg-gray-800 flex items-center gap-2 border-b border-gray-700">
            <div className="bg-blue-600 p-2 rounded-full">
              <UserIcon size={20} />
            </div>
            <h2 className="font-bold">{user.name}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-900">

            {messages[user._id].map((msg, i) => (

              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex ${
                  msg.self ? "justify-end" : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                    msg.self
                      ? "bg-blue-600 rounded-tr-none"
                      : "bg-gray-800 rounded-tl-none border border-gray-700"
                  }`}
                >

                  <p className="text-sm font-semibold opacity-70 mb-1">
                    {msg.self ? "Me" : "Partner"}
                  </p>

                  <p className="text-md leading-relaxed">
                    {msg.text}
                  </p>

                  <AnimatePresence>

                    {translations[`${user._id}_${i}`] && (

                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-2 pt-2 border-t border-white/20 text-blue-100 italic text-sm"
                      >

                        {translations[`${user._id}_${i}`]}

                      </motion.div>

                    )}

                  </AnimatePresence>

                  {!msg.self && (

                    <button
                      onClick={() =>
                        handleTranslate(user._id, i)
                      }
                      className="mt-2 flex items-center gap-1 text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-full transition-all cursor-pointer"
                    >

                      <Languages size={12} />

                      Translate

                    </button>

                  )}

                </div>

              </motion.div>

            ))}

          </div>

          <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">

            <input
              className="flex-1 bg-gray-700 p-2 rounded-xl outline-none border border-transparent focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Type message here..."
              value={inputs[user._id]}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [user._id]: e.target.value,
                }))
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleSendMessage(user._id)
              }
            />

            <button
              onClick={() =>
                handleSendMessage(user._id)
              }
              className="bg-blue-600 p-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >

              <Send size={18} />

            </button>

          </div>

        </div>

      ))}

    </div>

  );

};

export default ChatSimulation;