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

export type UserType = {
  name: string;
  email: string;
  username?: string;
};
