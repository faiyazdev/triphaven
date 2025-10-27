import { Schema, model, Types, Document, Model } from "mongoose";
import type { IUser } from "./user.model.js";
import type { IReview } from "./Review.model.js";

// Document interface
export interface IListing {
  title: string;
  description: string;
  image: {
    filename: string;
    url: string;
  };
  price: number;
  location: string;
  country: string;
  author?: Types.ObjectId | IUser;
  reviews?: (Types.ObjectId | IReview)[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional: Mongoose Document interface
export interface IListingDocument extends IListing, Document {}

const listingSchema = new Schema<IListingDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      filename: { type: String, required: true },
      url: { type: String, required: true },
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Listing: Model<IListingDocument> = model<IListingDocument>(
  "Listing",
  listingSchema
);

export default Listing;
