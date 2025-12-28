import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value" });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (statusCode !== 500) {
    return res.status(statusCode).json({ message });
  }

  console.error("Błąd serwera:", err);
  return res.status(500).json({ message: "Internal server error" });
};
