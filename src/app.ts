import cors, { CorsOptions } from "cors";
import express from "express";
import path from "path";

import authRoutes from "./routes/authRoutes";
import foodRoutes from "./routes/foodRoutes";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

const app = express();

const allowedOrigins = env.frontendUrls;
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Savorybase API is healthy",
    data: null
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
