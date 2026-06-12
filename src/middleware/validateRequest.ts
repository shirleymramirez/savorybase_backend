import { type NextFunction, type Request, type RequestHandler, type Response } from "express";
import { z, ZodError, type ZodTypeAny } from "zod";

import { sendError } from "../utils/apiResponse.ts";

const validate = <T extends ZodTypeAny>(schema: T): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedData = schema.parse(req.body) as z.infer<T>;
      next();
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        sendError(
          res,
          400,
          "Validation failed",
          error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        );
        return;
      }

      next(error);
    }
  };
};

export default validate;
