import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.ts";

export type JwtPayload = {
  sessionId: string;
  role: "admin";
  username: string;
};

const signToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export default signToken;
