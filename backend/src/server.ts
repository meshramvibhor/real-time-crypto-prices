import express from "express";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db"; // Assuming this file connects to MongoDB
import "./cron"; // Import cron job setup
import cryptoPriceRouter from "./routes/priceRouter";
import { setupWebSocketServer } from "./services/web-socket-service"; // WebSocket server setup
import cors from "cors"; // Import CORS middleware

dotenv.config(); // Load environment variables

const app = express();
// Create HTTP server
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Set up WebSocket server
setupWebSocketServer(server);

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use("/api", cryptoPriceRouter);

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
