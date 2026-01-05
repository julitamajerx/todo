import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";

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
    message: "Logged in successfully.",
  });
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user) {
    throw new AppError(401, "User with this email already exist.");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    name,
    email,
    password: encryptedPassword,
  });

  const saveUser = await newUser.save();
  res.status(201).json({ message: "New account created. You can log in." });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("access_token");
  res.send({ message: "Logged out" });
});
