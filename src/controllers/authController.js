const asyncHandler = require("../middleware/asyncHandler");
const { env } = require("../config/env");
const signToken = require("../utils/signToken");
const { sendError, sendSuccess } = require("../utils/apiResponse");

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.validatedData;

  if (username !== env.adminUsername || password !== env.adminPassword) {
    return sendError(res, 401, "Invalid admin credentials");
  }

  const token = signToken({
    role: "admin",
    username
  });

  return sendSuccess(res, 200, "Login successful", {
    token
  });
});

module.exports = {
  loginAdmin
};
