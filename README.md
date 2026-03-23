# Chat-Com: Real-Time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Express, and Socket.io. Users can register, authenticate, search for other users, and engage in instant messaging with live online status indicators.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Real-Time Messaging**: Instant message delivery using Socket.io
- **Online Status**: Live indicators showing when users are online
- **User Search**: Search for users by name or username
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Secure Communication**: HTTP-only cookies for JWT storage
- **Auto-Generated Avatars**: Profile pictures generated automatically
- **Message History**: Persistent conversation history stored in MongoDB

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **DaisyUI** - Component library
- **Zustand** - State management
- **Socket.io Client** - Real-time communication
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-com
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

## 🚀 Usage

### Development

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

### Production Build

1. **Build the application**
   ```bash
   cd backend
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Messages
- `POST /api/message/send/:id` - Send message to user
- `GET /api/message/:id` - Get conversation messages

### Users
- `GET /api/user/search?search=query` - Search users
- `GET /api/user/currentChatters` - Get users with active conversations

## 🏗️ Project Structure

```
chat-com/
├── backend/
│   ├── DB/
│   │   └── connectDB.js
│   ├── middlewares/
│   │   └── isLoggedIn.js
│   ├── models/
│   │   ├── conversationModel.js
│   │   ├── messagesModel.js
│   │   └── userModel.js
│   ├── routeControllers/
│   │   ├── messagerouteController.js
│   │   ├── userhandlerController.js
│   │   └── userrouteController.js
│   ├── routes/
│   │   ├── authUser.js
│   │   ├── messageRoute.js
│   │   └── userRoute.js
│   ├── socket/
│   │   └── socket.js
│   ├── utils/
│   │   └── jwtwebToken.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── context/
    │   ├── home/
    │   ├── login/
    │   ├── register/
    │   ├── utils/
    │   ├── Zustand/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── README.md
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT tokens stored in HTTP-only cookies
- CORS protection
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Avatar generation powered by [avatar.iran.liara.run](https://avatar.iran.liara.run)
- UI components from DaisyUI
- Icons from React Icons</content>
<parameter name="filePath">c:\Users\Admin\Desktop\chat-com\README.md