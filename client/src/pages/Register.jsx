import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        preferredLanguage: "en"
    });
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register-user", formData);
            if (res.data.success) {
                alert("✅ Account Successfully Created!");
                navigate("/");
            }
        } catch (err) {
            alert(err.response?.data?.message || "❌ Registration fail!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700"
                >

                <div className="flex justify-center mb-6 text-blue-600"><UserPlus size={40} /></div>
                <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
                
                <form onSubmit={handleSignup} className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full p-3 bg-gray-700 rounded-lg outline-none border border-transparent focus:border-green-500"
                        onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    
                    <input type="email" placeholder="Email" className="w-full p-3 bg-gray-700 rounded-lg outline-none border border-transparent focus:border-green-500"
                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    
                    <input type="password" placeholder="Password" className="w-full p-3 bg-gray-700 rounded-lg outline-none border border-transparent focus:border-green-500"
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Translation Language(Which Language to Convert)</label>
                        <select 
                            className="w-full p-3 bg-gray-700 rounded-lg outline-none border border-transparent focus:border-green-500 text-white"
                            onChange={(e) => setFormData({...formData, preferredLanguage: e.target.value})}
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi (हिंदी)</option>
                            <option value="es">Spanish (Español)</option>
                            <option value="fr">French (Français)</option>
                            <option value="ar">Arabic (العربية)</option>
                        </select>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all">Sign Up</button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-400">Already have an account? <Link to="/" className="text-blue-600 hover:text-blue-400">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;