import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join Restaurant Room
    socket.on("joinRestaurant", (restaurantId) => {
      const roomName = `restaurant_${restaurantId}`;
      socket.join(roomName);
      console.log("🔥 Joined restaurant room:", roomName, "by socket:", socket.id);
    });

    // 🔥 Join Order Room (for customer-specific updates)
    socket.on("joinOrderRoom", (orderToken) => {
      const roomName = `order_${orderToken}`;
      socket.join(roomName);
      console.log("🔥 Joined order room:", roomName, "by socket:", socket.id);
    });

    // 🔥 Track all events for debugging
    socket.onAny((eventName, ...args) => {
      console.log("📡 Socket Event Received:", eventName, args);
    });

    // Join User Room
    socket.on("joinUserRoom", (userId) => {
      socket.join(userId);
      console.log("Joined user room:", userId);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};