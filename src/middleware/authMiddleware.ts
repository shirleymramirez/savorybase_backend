import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { sendError } from "../utils/apiResponse";
import { touchSession } from "../utils/sessionStore";
import { JwtPayload } from "../utils/signToken";

const isJwtPayload = (decoded: string | jwt.JwtPayload): decoded is JwtPayload => {
  return (
    typeof decoded !== "string" &&
    typeof decoded.sessionId === "string" &&
    decoded.role === "admin" &&
    typeof decoded.username === "string"
  );
};

const protect = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, 401, "Authorization token is required");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (!isJwtPayload(decoded)) {
      sendError(res, 401, "Invalid or expired token");
      return;
    }

    const session = touchSession({
      sessionId: decoded.sessionId,
      idleTimeoutMs: env.sessionIdleTimeoutMs
    });

    if (!session.valid) {
      sendError(res, 401, "Session expired due to inactivity");
      return;
    }

    req.user = decoded;
    next();
  } catch (_error) {
    sendError(res, 401, "Invalid or expired token");
  }
};

export { protect };
