import mongoose from "mongoose";

import { env } from "./env.ts";

const connectDB = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
};

export default connectDB;
