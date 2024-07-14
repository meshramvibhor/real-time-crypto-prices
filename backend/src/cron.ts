// src/cron.ts

import cron from "node-cron";
import { fetchAndStorePrices } from "./controllers/priceController";

// Schedule the task to run every 5 seconds
cron.schedule("*/5 * * * * *", async () => {
  await fetchAndStorePrices();
});
