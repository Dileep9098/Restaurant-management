// import app from "./app.js"; // 👈 Make sure to include the `.js` extension if using ESM
// import connectDB from "./database/database.js";
// import ngrok from "ngrok"
// const PORT = 5001;

// connectDB()

// app.listen(PORT, async() => {
//     console.log(`Server is working on http://localhost:${PORT}`);
//     const url = await ngrok.connect(PORT);
//     console.log(`Ngrok URL: ${url}`); 
// });


// import app from "./app.js";  
// import connectDB from "./database/database.js";

// const PORT = 5000; 

// connectDB();

// app.listen(PORT, async () => {
//     console.log(`Server is working on http://localhost:${PORT}`);

    
// });


// server.js
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import connectDB from "./database/database.js";

const PORT = process.env.PORT || 4000;

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    credentials: true,
  }
});

// ✅ Make io accessible globally
global.io = io;

// ✅ Socket logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Optional: join room
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// ✅ Connect to DB and start server
connectDB();
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
