import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Internal server error",
  });
};
