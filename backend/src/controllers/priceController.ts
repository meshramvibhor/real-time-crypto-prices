// src/controllers/priceController.ts

import axios, { AxiosError } from "axios";
import connectDB from "../config/db";
import PriceData from "../models/PriceData";
import express, { Request, Response } from "express";
import { sendDataToClients } from "../services/web-socket-service";

const API_URL = "https://api.coingecko.com/api/v3/simple/price";
const symbols = ["bitcoin", "ethereum", "dogecoin", "ripple", "litecoin"];

export const fetchAndStorePrices = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        ids: symbols.join(","),
        vs_currencies: "usd",
      },
    });

    // await connectDB();

    // console.log("response -> ", response.data);

    const priceEntries = symbols.map((symbol) => ({
      symbol,
      price: response.data[symbol].usd,
      timestamp: new Date().toISOString(), // Add the current timestamp
    }));

    await PriceData.insertMany(priceEntries);
    sendDataToClients();

    // console.log("Fetched and stored prices successfully.");
  } catch (error) {
    // Log the specific error details for AxiosError
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      // console.error(`Error fetching prices: ${axiosError.message}`);
      if (axiosError.response) {
        // console.error(`Status: ${axiosError.response.status}`);
        // console.error(`Data: ${axiosError.response.data}`);
      }
    } else {
      // console.error("Error fetching prices:", error);
    }
    throw error; // Rethrow the error to handle it further up the call stack
  }
};

export const fetchPriceData = async (req: Request, res: Response) => {
  const { symbol } = req.params;
console.log("symbol is -> ", symbol);
  try {
    // Fetch 20 latest entries for the given symbol
    const data = await PriceData.find({ symbol })
      .sort({ timestamp: -1 })
      .limit(20);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching price data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8080 }); // Choose a suitable port

// WebSocket server
// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
// });

// // Function to send data to all connected clients
// const sendDataToClients = async () => {
//   try {
//     const data = await PriceData.find({ symbol }).sort({ timestamp: -1 }).limit(1).lean();
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(data));
//       }
//     });
//   } catch (error) {
//     console.error('Error sending data to clients:', error);
//   }
// };

// // MongoDB change stream to listen for changes in PriceData collection
// PriceData.watch().on('change', (change) => {
//   console.log('Change detected:', change);
//   sendDataToClients();
// });
