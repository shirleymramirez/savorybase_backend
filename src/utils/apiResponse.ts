import { Response } from "express";

export type ApiErrorDetails = unknown[] | Record<string, unknown> | string | null;

const sendSuccess = <T>(res: Response, statusCode: number, message: string, data: T): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  details: ApiErrorDetails = null
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    error: details
  });
};

export {
  sendSuccess,
  sendError
};
