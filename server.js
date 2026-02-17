

// // server.js
// import http from "http";
// import app from "./app.js";
// import { Server } from "socket.io";
// import connectDB from "./database/database.js";

// const PORT = process.env.PORT || 4000;

// // ✅ Create HTTP server
// const server = http.createServer(app);

// // ✅ Socket.IO setup
// export const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", 
//     credentials: true,
//   }
// });

// // ✅ Make io accessible globally
// global.io = io;

// // ✅ Socket logic
// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);

//   // Optional: join room
//   socket.on("join", (userId) => {
//     socket.join(userId);
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

// // ✅ Connect to DB and start server
// connectDB();
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });




// server.js
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import connectDB from "./database/database.js";
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 4000;

// ✅ Create HTTP server
const server = http.createServer(app);

// // ✅ Setup Socket.IO
// export const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   },
// });

// // ✅ Socket Logic
// io.on("connection", (socket) => {
//   console.log("✅ Socket connected:", socket.id);

//   // 🔥 Join restaurant room

//   socket.on("joinRestaurant", (restaurantId) => {
//     if (!restaurantId) return;

//     const roomName = `restaurant_${restaurantId}`;
//     socket.join(roomName);

//     console.log(`📦 Socket ${socket.id} joined ${roomName}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Socket disconnected:", socket.id);
//   });
// });

initSocket(server)

// ✅ Connect DB and Start Server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err);
  });