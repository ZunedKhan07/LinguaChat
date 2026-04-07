# 🌍 LinguaChat – Real-Time AI Translation Chat App

LinguaChat is a real-time chat application that enables users to communicate in different languages seamlessly using AI-powered translation.

## 🚀 Features

- 💬 Real-time messaging using Socket.IO
- 🌐 Automatic message translation using LLM (Gemini API)
- 🔐 User authentication (JWT + bcrypt)
- ⚡ Fast and responsive UI with React + Vite
- 📡 REST APIs with Express.js
- 🗄️ MongoDB database integration

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Vite
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- JWT Authentication
- Gemini API (LLM)

## 📂 Project Structure

```
client/   → Frontend (React + Vite)
server/   → Backend (Node.js + Express)
```

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/linguachat.git
cd linguachat
```

### 2. Setup Backend
```bash
cd server
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in server:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
```

## 🎯 Future Improvements

- Group chat support
- Voice-to-text translation
- Message history optimization
- Multi-language UI

## 👨‍💻 Author

Juned Khan
