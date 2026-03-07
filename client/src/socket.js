import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BASE_URL; 

export const socket = io(SOCKET_URL, {
    autoConnect: false, // Isse connection tabhi banega jab hum manually socket.connect() bolenge
    withCredentials: true, // for cookies
});