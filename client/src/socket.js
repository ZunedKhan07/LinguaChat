import { io } from "socket.io-client";

// URL check karein ki environment variable sahi hai ya nahi
const SOCKET_URL = "http://localhost:7000"; 

const token = localStorage.getItem("token");

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket'],
    reconnectionAttempts: 5,
    query: {
        token: token
    }
});


//import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_BASE_URL; 

// export const socket = io(SOCKET_URL, {
//     autoConnect: false, // Isse connection tabhi banega jab hum manually socket.connect() bolenge
//     withCredentials: true, // for cookies
// });