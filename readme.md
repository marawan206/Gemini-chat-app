# Gemini - Synchronous Chat App

Gemini is a real-time chat application built using the MERN (MongoDB, Express, React, Node.js) stack. It provides seamless messaging, group chats, file sharing, and emoji support for dynamic conversations. The app supports fully responsive design, making it usable on all device sizes.

## Features
- **Frontend:** React ⚛️
- **UI Components:** ShadCN 🧩
- **Styling:** Tailwind CSS 🎨 (React-icons for icons)
- **Responsiveness:** Fully responsive 📱💻
- **Authentication:** JWT-based authentication 🔑
- **File Handling:** Multer for file and image uploads 📁📷
- **Real-time Messaging:** Socket.io for real-time communication 💬
- **Chat Support:** Group and personal messages 👥
- **Fun Conversations:** Emoji support 😄
- **Backend:** Node.js with Express 🛠️
- **Database:** MongoDB 🗄️
- **State Management:** Zustand 🧠
- **API Calls:** Axios 🌐

## Technologies Used
### Client-side
- Vite
- ShadCN
- TailwindCSS
- PostCSS, Autoprefixer
- React Router DOM
- Axios
- Zustand
- React Lottie
- Moment.js

### Server-side
- Express
- Nodemon
- Dotenv
- Mongoose
- CORSversion: '3.8'
services:
  # MongoDB Service
  mongo:
    image: mongo:latest
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  # Server (Express API)
  server:
    build:
      context: ./server
    container_name: gemini-server
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/syncronus-chat-app
    depends_on:
      - mongo

  # Client (Vite)
  client:
    build:
      context: ./client
    container_name: gemini-client
    ports:
      - "3000:80"  # Map the Vite build to port 3000
    depends_on:
      - server

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: gemini-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl/nginx-selfsigned.crt:/etc/ssl/certs/nginx-selfsigned.crt
      - ./nginx/ssl/nginx-selfsigned.key:/etc/ssl/private/nginx-selfsigned.key
    depends_on:
      - client
      - server

volumes:
  mongo-data:

- Cookie-parser
- Bcrypt
- JWT (JSON Web Tokens)
- Multer
- Socket.io

## Features to add in the future:
- Voice message support
- User presence indicators
- Message receipt status
- Pin conversations
- Notifications

## How to Run Locally
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/gemini-chat-app.git
    ```
2. Navigate to the project directory:
    ```bash
    cd gemini-chat-app
    ```
3. Install dependencies for both client and server:
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```
4. Run the app:
    - For client:
      ```bash
      cd client && npm run dev
      ```
    - For server:
      ```bash
      cd server && npm run dev
      ```

## License
This project is licensed under the MIT License.
