import PriceData from "../models/PriceData";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server; // Declare io at the module level

// Function to send data to all connected clients
const sendDataToClients = async () => {
  try {
    console.log("Sending data to client")
    const symbols = ["bitcoin", "ethereum", "dogecoin", "ripple", "litecoin"];
    const allData: { [key: string]: any[] } = {}; // Explicitly define the type

    // Query MongoDB for each symbol and collect the latest 20 entries
    await Promise.all(
      symbols.map(async (symbol) => {
        const data = await PriceData.find({ symbol })
          .sort({ timestamp: -1 })
          .limit(20)
          .lean();

        allData[symbol] = data;
      })
    );

    // Send data to all connected clients
    io.emit("latestEntries", allData);
  } catch (error) {
    console.error("Error sending data to clients:", error);
  }
};

const setupWebSocketServer = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins or specify your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A new connection has been established ->", socket.id);
  });
};

export { setupWebSocketServer, sendDataToClients };
