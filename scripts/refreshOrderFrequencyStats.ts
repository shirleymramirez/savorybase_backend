import mongoose from "mongoose";

import connectDB from "../src/config/db";
import { refreshOrderFrequencyStats } from "../src/services/orderFrequencyStatsService";

const refreshStats = async (): Promise<void> => {
  await connectDB();

  const stats = await refreshOrderFrequencyStats();

  console.log(`Refreshed ${stats.length} order frequency stat rows.`);
};

refreshStats()
  .catch((error: Error) => {
    console.error("Order frequency stats refresh failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
