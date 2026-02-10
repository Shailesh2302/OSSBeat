import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }


  if (process.env.NODE_ENV !== "test") {
    console.error("🔥 Error:", {
      method: req.method,
      path: req.originalUrl,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
