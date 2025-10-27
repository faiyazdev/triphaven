import type { Request, Response } from "express";
import User, { type IUser } from "../models/user.model.js";
import handleAsync from "../utils/HandleAsync.js";
import { deleteFile, uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// ========================================================
// 🧑‍💼 Get All Users (Admin Only)
// ========================================================
export const getAllUsers = handleAsync(async (req: Request, res: Response) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "faiyaz@gmail.com";
  console.log(req.user?.email);
  if (req.user?.email !== ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access: Admin privileges required.",
    });
  }

  const users = (await User.find({})
    .sort({ createdAt: -1 })
    .populate({
      path: "listings",
      populate: { path: "author", select: "name email" },
    })
    .lean()) as (IUser & { listings?: any[] })[];

  const normalizedUsers = users.map((user) => ({
    ...user,
    listings: user.listings || [],
  }));

  return res.status(200).json({
    success: true,
    count: users.length,
    data: users,
    message: users.length ? "Users fetched successfully." : "No users found.",
  });
});

// ========================================================
// 👤 Get Authenticated User Profile
// ========================================================
export const getMyProfile = handleAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized — please log in first.",
    });
  }

  const userProfile = await User.findById(userId)
    .populate({
      path: "listings",
      populate: {
        path: "author",
        select: "name email",
      },
    })
    .lean();

  if (!userProfile) {
    return res.status(404).json({
      success: false,
      message: "User profile not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: userProfile,
    message: "User profile fetched successfully.",
  });
});

// ========================================================
// ✏️ Update Authenticated User Profile
// ========================================================
export const updateMyProfile = handleAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — please log in first.",
      });
    }

    // Whitelist allowed fields
    const allowedUpdates = ["name", "bio", "location"];
    const updates: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // ✅ Handle avatar upload if provided
    if (req.file) {
      // Upload new avatar to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.path);

      // delete the temp file
      deleteFile(req.file.path);

      // Assign Cloudinary URL to user
      updates.avatar = uploadResult?.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully.",
    });
  }
);
