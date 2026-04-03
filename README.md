# 💬 Talk-A-Tive: Real-Time Chat Platform

Talk-A-Tive is a full-stack, real-time chat application built with the **MERN** stack (MongoDB, Express, React, Node.js). It offers a seamless, responsive communication experience with features like one-on-one messaging, group chats, notifications, and live typing indicators.

![Main Interface Placeholder](https://via.placeholder.com/1200x600/2D3748/FFFFFF?text=Talk-A-Tive+Application+UI)

## 🚀 Key Features

-   **Real-Time Communication**: Instant message delivery and receipt powered by [Socket.io](https://socket.io/).
-   **One-on-One & Group Chats**: Create custom group chats with administrative controls (add/remove users, rename).
-   **User Authentication**: Secure JWT-based authentication with password hashing using Bcrypt.js.
-   **Search & Discovery**: Efficiently search for users to start new conversations.
-   **Live Interactions**: Real-time typing indicators and notifications.
-   **Modern UI/UX**: Built with [Chakra UI](https://chakra-ui.com/) for a sleek, responsive, and accessible interface.
-   **Media Hub**: Profile management and data persistence via MongoDB.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Chakra UI v3](https://chakra-ui.com/)
-   **State Management**: React Context API
-   **Animations**: Lottie-React, Framer Motion
-   **Routing**: React Router DOM v7
-   **Networking**: Axios, Socket.io-client

### Backend
-   **Environment**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
-   **Real-time**: [Socket.io](https://socket.io/)
-   **Security**: JSON Web Tokens (JWT), Bcrypt.js

## 📦 Getting Started

### Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/Shivamahajan045/Real-Time-Chat-App---MERN-Stack.git
cd Real-Time-Chat-App---MERN-Stack
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Install Dependencies
```bash
# Install root & backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 4. Run the Application (locally)
```bash
# In the root directory
npm run dev
```
The application will run on `http://localhost:5173` (Vite) and the backend on `http://localhost:5000`.

## 🏗️ Architecture Highlights

### Real-Time Logic (Socket.io)
The server leverages Socket.io for bidirectional communication. Features like `typing`, `stop typing`, and `new message` are handled through event emitters and listeners to ensure minimal latency.

### Secure Authentication
Robust authentication middleware protects private routes. JWTs are used for stateless session management, ensuring only authorized users can access chat data.

### Responsive Design
Chakra UI's flexible grid and flexbox components provide a consistent experience across desktop, tablet, and mobile devices.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---
*Created by [Shivam Mahajan](https://github.com/Shivamahajan045)* 🚀
