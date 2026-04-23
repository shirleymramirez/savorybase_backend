const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const { sendError } = require("../utils/apiResponse");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Authorization token is required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (_error) {
    return sendError(res, 401, "Invalid or expired token");
  }
};

module.exports = { protect };
