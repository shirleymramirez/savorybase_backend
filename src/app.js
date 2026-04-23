const express = require("express");
const cors = require("cors");
const path = require("path");

const foodRoutes = require("./routes/foodRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { env } = require("./config/env");

const app = express();

const allowedOrigins = env.frontendUrls;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    }
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

module.exports = app;
