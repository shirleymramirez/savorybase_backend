import { ErrorRequestHandler, Request, Response } from "express";

import { sendError } from "../utils/apiResponse";

type HttpError = Error & {
  name?: string;
  type?: string;
};

const notFound = (req: Request, res: Response): void => {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

const errorHandler: ErrorRequestHandler = (error: HttpError, _req, res, _next) => {
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

  if (error.type === "entity.too.large") {
    statusCode = 413;
    message = "Uploaded image is too large";
  }

  sendError(res, statusCode, message);
};

export {
  notFound,
  errorHandler
};
