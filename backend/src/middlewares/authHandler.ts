import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";

export const authHandler = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw new AppError(401, "Nie jesteś zalogowany");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError(401, "Nieprawidłowy token");
  }
};
