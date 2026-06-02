import app from "./src/app";
import connectDB from "./src/config/db";
import { env } from "./src/config/env";

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer().catch((error: Error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
