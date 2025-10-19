import { Model, model, Schema } from "mongoose";

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
});

const Listing: Model<IListing> = model<IListing>("Listing", listingSchema);
export default Listing;
