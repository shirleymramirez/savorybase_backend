const mongoose = require("mongoose");

const connectDB = require("../src/config/db");
const { refreshOrderFrequencyStats } = require("../src/services/orderFrequencyStatsService");

const refreshStats = async () => {
  await connectDB();

  const stats = await refreshOrderFrequencyStats();

  console.log(`Refreshed ${stats.length} order frequency stat rows.`);
};

refreshStats()
  .catch((error) => {
    console.error("Order frequency stats refresh failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
