import type { JwtPayload } from "../utils/signToken";

declare global {
  namespace Express {
    interface Request {
      validatedData?: unknown;
      user?: JwtPayload;
      file?: Multer.File;
    }
  }
}

export {};
