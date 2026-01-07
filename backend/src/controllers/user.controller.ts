import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import cloudinary from "../configs/cloudinary.config";
import fs from "fs";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    message: "Logged in successfully.",
  });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const file = req.file;

  try {
    const cleanName = name?.trim();
    const cleanEmail = email?.trim();
    const cleanPassword = password?.trim();

    if (!cleanName) {
      throw new AppError(400, "Name cannot be empty or just spaces");
    }

    if (!cleanEmail) {
      throw new AppError(400, "Email cannot be empty");
    }

    if (!cleanPassword) {
      throw new AppError(400, "Password cannot be empty");
    }

    if (!file) {
      throw new AppError(400, "Profile picture cannot be empty");
    }

    const userExists = await UserModel.findOne({ email: cleanEmail });
    if (userExists) {
      throw new AppError(409, "User with this email already exists");
    }

    let avatarUrl = "";
    if (file) {
      try {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: "avatars",
          transformation: [
            { width: 60, height: 60, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });
        avatarUrl = uploadRes.secure_url;
      } catch (error) {
        throw new AppError(
          500,
          "Error. We couldn't upload your photo. Try again later"
        );
      }
    }

    const encryptedPassword = await bcrypt.hash(cleanPassword, 10);

    const newUser = new UserModel({
      name: cleanName,
      email: cleanEmail,
      password: encryptedPassword,
      avatarUrl: avatarUrl,
    });

    await newUser.save();
    
    res.status(201).json({ message: "New account created. You can log in." });
  } finally {
    if (file && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    }
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
});
