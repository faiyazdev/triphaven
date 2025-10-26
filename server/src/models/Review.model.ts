import { Model, model, Schema, Types } from "mongoose";
import type { IUser } from "./user.model.js";

export interface IReview {
  _id?: string;
  comment: string;
  rating: number;
  user: Types.ObjectId | IUser;
}

const reviewSchema = new Schema<IReview>(
  {
    comment: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Review: Model<IReview> = model<IReview>("Review", reviewSchema);
export default Review;
