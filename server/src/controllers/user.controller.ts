import type { Request, Response } from "express";
import handleAsync from "../utils/HandleAsync.js";
import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";
import { signinUserSchema, signupUserSchema } from "../schemas/user.schema.js";
import { deleteFile, uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import jwt from "jsonwebtoken";

export const signup = handleAsync(async (req: Request, res: Response) => {
  // 1️⃣ Validate input using Zod
  const parsed = signupUserSchema.safeParse(req.body);
  if (!parsed.success) {
    // Validation failed
    const firstIssue = parsed.error.issues[0];
    throw new ExpressError(400, firstIssue.message);
  }

  const { name, username, email, password } = parsed.data;

  // 2️⃣ Check if user already exists (username OR email)
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ExpressError(400, "User already exists in the database");
  }

  const picture = req.file;
  let pictureUrl;
  if (picture) {
    pictureUrl = await uploadToCloudinary(picture.path);
  }

  // 3️⃣ Create user
  const newUser = new User({
    username,
    name,
    email,
    password,
    picture: pictureUrl?.url || "",
  });

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();
  newUser.refreshToken = refreshToken;
  await newUser.save();
  if (picture && pictureUrl) {
    deleteFile(picture.path);
  }
  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  // 4️⃣ Respond
  res.status(201).json({
    success: true,
    user: {
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    },
    accessToken,
  });
});
export const signin = handleAsync(async (req: Request, res: Response) => {
  // 1️⃣ Validate input using Zod
  const parsed = signinUserSchema.safeParse(req.body);
  if (!parsed.success) {
    // Validation failed
    const firstIssue = parsed.error.issues[0];
    throw new ExpressError(400, firstIssue.message);
  }

  const { email, password } = parsed.data;

  // 2️⃣ Check if user already exists (username OR email)
  const existingUser = await User.findOne({
    email,
  });
  if (!existingUser) {
    throw new ExpressError(400, "User doesn't exist in the database");
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);
  if (!isPasswordValid)
    throw new ExpressError(
      400,
      "password isn't valid, please type in correct password"
    );

  const accessToken = existingUser.generateAccessToken();
  const refreshToken = existingUser.generateRefreshToken();
  existingUser.refreshToken = refreshToken;
  await existingUser.save();

  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  // 4️⃣ Respond
  res.status(201).json({
    success: true,
    message: "user logged in successfully",
    user: {
      id: existingUser._id,
      name: existingUser.name,
      username: existingUser.username,
      email: existingUser.email,
    },
    accessToken,
  });
});
export const signout = handleAsync(async (req: Request, res: Response) => {
  // 1️⃣ Find the user (optional, in case you want to invalidate the refresh token)
  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  // 2️⃣ Remove refresh token from DB
  user.refreshToken = "";
  await user.save();

  // 3️⃣ Clear the refresh-token cookie
  res.clearCookie("refresh-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
  });

  // 4️⃣ Respond
  res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
});
export const refreshAccessToken = handleAsync(
  async (req: Request, res: Response) => {
    // 1️⃣ Get refresh token from cookies
    const oldRefreshToken = req.cookies["refresh-token"];
    if (!oldRefreshToken) {
      return res
        .status(401)
        .json({ error: "Refresh token is missing or invalid" });
    }

    // 2️⃣ Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    // 3️⃣ Find user and check token matches
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== oldRefreshToken) {
      return res.status(401).json({ error: "Refresh token is invalid" });
    }

    // 4️⃣ Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // 5️⃣ Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    // 6️⃣ Send cookie & response
    res.cookie("refresh-token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  }
);
