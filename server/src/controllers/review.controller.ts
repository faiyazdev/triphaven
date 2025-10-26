import z from "zod";
import handleAsync from "../utils/HandleAsync.js";
import type { Request, Response } from "express";
import ExpressError from "../utils/ExpressError.js";
import Review from "../models/Review.model.js";
import Listing from "../models/listing.model.js";
import type { Types } from "mongoose";

const reviewSchema = z.object({
  comment: z.string(),
  rating: z.number().min(1).max(5),
});
// type TReview = z.infer<typeof reviewSchema>;

export const createReview = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Check if listing exists
  const listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "username email", // optional — only bring what you need
    },
  });
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    // Validation failed
    const firstIssue = parsed.error.issues[0];
    throw new ExpressError(400, firstIssue.message);
  }

  const newReview = await Review.create({
    comment: parsed.data.comment,
    rating: parsed.data.rating,
    user: req.user?.userId,
  });
  // Push review ID to the listing’s reviews array
  listing.reviews.push(newReview._id);
  await listing.save();

  res.status(200).json({
    success: true,
    data: newReview,
    message: "Review created successfully",
  });
});
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id: listingId, reviewId } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "listing not found" });
    }
    // Find the review
    const review = await Review.findById(reviewId).populate("user");
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    console.log(review.user._id, userId);
    if (review.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Remove reference from listing
    await Listing.findByIdAndUpdate(listingId, {
      $pull: { reviews: reviewId },
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting review",
    });
  }
};
