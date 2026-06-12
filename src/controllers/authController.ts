import { type Request, type Response } from "express";

import asyncHandler from "../middleware/asyncHandler.ts";
import { env } from "../config/env.ts";
import signToken from "../utils/signToken.ts";
import { sendError, sendSuccess } from "../utils/apiResponse.ts";
import {
  createSession,
  deleteExpiredSessions
} from "../utils/sessionStore.ts";
import { type LoginInput } from "../validators/authValidator.ts";

const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.validatedData as LoginInput;

  if (username !== env.adminUsername || password !== env.adminPassword) {
    return sendError(res, 401, "Invalid admin credentials");
  }

  deleteExpiredSessions({ idleTimeoutMs: env.sessionIdleTimeoutMs });

  const sessionId = createSession({ userId: username });
  const token = signToken({
    sessionId,
    role: "admin",
    username
  });

  return sendSuccess(res, 200, "Login successful", {
    token
  });
});

export {
  loginAdmin
};
