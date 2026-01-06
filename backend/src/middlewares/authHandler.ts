import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";
import asyncHandler from "express-async-handler";

export const authHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
      throw new AppError(401, "You are not logged in.");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
      };
      req.user = decoded;
      next();
    } catch (error) {
      throw new AppError(401, "Wrong token.");
    }
  }
);
