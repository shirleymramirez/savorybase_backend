const { sendError } = require("../utils/apiResponse");

const notFound = (req, res) => {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

const errorHandler = (error, _req, res, _next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = error.message || "Internal server error";

  if (error.name === "MulterError") {
    statusCode = 400;
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
  }

  sendError(res, statusCode, message);
};

module.exports = {
  notFound,
  errorHandler
};
