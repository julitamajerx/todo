import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";
import { UserModel } from "../models/user.model";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email, password });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.send({
    id: user.id,
    email: user.email,
    name: user.name,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("access_token");
  res.send({ message: "Logged out" });
});
