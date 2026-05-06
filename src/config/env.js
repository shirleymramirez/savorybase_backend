const dotenv = require("dotenv");

dotenv.config();

const SESSION_IDLE_TIMEOUT_MS = 5 * 60 * 1000;

const requiredVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD"
];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  sessionIdleTimeoutMs: SESSION_IDLE_TIMEOUT_MS,
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  frontendUrls: (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
};

module.exports = { env };
