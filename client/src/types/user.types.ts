export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role?: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
  listings?: IListing[];
}

export interface IListing {
  _id: string;
  title: string;
  description: string;
  price: number;
  author: Pick<IUser, "_id" | "name" | "email">;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetAllUsersResponse {
  success: boolean;
  count: number;
  data: IUser[];
  message: string;
}

export interface IGetMyProfileResponse {
  success: boolean;
  data: IUser;
  message: string;
}

export interface IUpdateProfileResponse {
  success: boolean;
  data: IUser;
  message: string;
}
