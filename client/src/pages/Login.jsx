import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login-user", { email, password });
            
            if (res.data.success) {
                // User ki details local storage mein save kar rahe hain
                localStorage.setItem("user", JSON.stringify(res.data.data.user));
                localStorage.setItem("accessToken", res.data.data.accessToken);
                
                navigate("/chat"); // Seedha chat window par bhej do
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700"
            >
                {/* Logo Section */}
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 p-4 rounded-full shadow-lg shadow-blue-500/20">
                        <MessageSquare size={32} className="text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-center mb-8 text-sm">LinguaChat mein aapka swagat hai!</p>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            className="w-full pl-10 p-3 bg-gray-700 rounded-lg outline-none border border-transparent focus:border-blue-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="w-full pl-10 p-3 bg-gray-700 rounded-lg outline-none border border-transparent focus:border-blue-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold transition-all transform active:scale-95 cursor-pointer ${
                            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? "Checking..." : "Login to Chat"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    if you don't have a account 
                    <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold ml-1">
                        Register First!
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;