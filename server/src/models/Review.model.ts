import { Schema, model, Types, Model, Document } from "mongoose";
import type { IUser } from "./user.model.js";

// Document interface
export interface IReview {
  comment: string;
  rating: number;
  user: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional: interface for the Mongoose Document
export interface IReviewDocument extends IReview, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    comment: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Review: Model<IReviewDocument> = model<IReviewDocument>(
  "Review",
  reviewSchema
);

export default Review;
