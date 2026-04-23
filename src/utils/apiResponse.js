const sendSuccess = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: details
  });
};

module.exports = {
  sendSuccess,
  sendError
};
