export interface IListing {
  _id: string;
  title: string;
  description: string;
  image: {
    filename: string;
    url: string;
  };
  price: number;
  location: string;
  country: string;
  author: UserType;
  // The reviews are ObjectId references to Review documents
  reviews: IReview[];
}

export interface IReview {
  _id: string;
  rating: number;
  comment: string;
  user: {
    username: string;
    email: string;
  };
  createdAt?: Date;
}

export type UserType = {
  _id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
};
