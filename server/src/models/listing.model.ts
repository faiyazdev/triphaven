import { Model, model, Schema, Types } from "mongoose";
import Review from "./Review.model.js";
import type { IReview } from "./Review.model.js";
import type { IUser } from "./user.model.js";
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
  author: Types.ObjectId | IUser;
  // The reviews are ObjectId references to Review documents
  reviews: (Types.ObjectId | IReview)[];
}
const listingSchema = new Schema<IListing>({
  title: String,
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Listing: Model<IListing> = model<IListing>("Listing", listingSchema);
export default Listing;
