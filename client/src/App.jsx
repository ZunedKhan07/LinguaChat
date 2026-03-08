import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Chat from "./components/Chat";
import ChatSimulation from "./components/ChatSimulation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
        <Route path="/chat" element={<ChatSimulation />} />
      </Routes>
    </Router>
  );
}
export default App;