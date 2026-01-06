import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import cloudinary from "../configs/cloudinary.config";
import fs from "fs";

export const login = asyncHandler(async (req, res) => {
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
    secure: false, //zmianka na prod na rtrue
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.send({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    message: "Logged in successfully.",
  });
});

export const register = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;
  const file = req.file;

  const cleanupFile = () => {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  };

  const cleanName = name?.trim();
  const cleanEmail = email?.trim();
  const cleanPassword = password?.trim();

  if (!cleanName || cleanName.length === 0) {
    cleanupFile();
    throw new AppError(400, "Name cannot be empty or just spaces");
  }

  if (!cleanEmail || cleanEmail.length === 0) {
    cleanupFile();
    throw new AppError(400, "Email cannot be empty");
  }

  if (!cleanPassword || cleanPassword.length === 0) {
    cleanupFile();
    throw new AppError(400, "Password cannot be empty");
  }

  const user = await UserModel.findOne({ email });

  if (user) {
    cleanupFile();
    throw new AppError(401, "User with this email already exist.");
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
    } finally {
      cleanupFile();
    }
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    name: cleanName,
    email: cleanEmail,
    password: encryptedPassword,
    avatarUrl: avatarUrl,
  });

  await newUser.save();
  res.status(201).json({ message: "New account created. You can log in." });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("access_token");
  res.send({ message: "Logged out" });
});
