import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser {
  _id: mongoose.Types.ObjectId | string;
  username: string;
  name?: string;
  email: string;
  picture?: string;
  password?: string; // optional because OAuth users may not have a password
  refreshToken?: string;
  provider: "google" | "manual";
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Instance methods for a User document
 */
export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

/**
 * If you prefer, you can create a type alias for the full model:
 * type UserModel = Model<IUser, {}, IUserMethods>;
 */

const userSchema = new Schema<
  IUser,
  Model<IUser, {}, IUserMethods>,
  IUserMethods
>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["google", "manual"],
      default: "manual",
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook — use async function and type `this` so TS knows about `isModified`.
 * We hash the password only if it was modified.
 */
userSchema.pre("save", async function (next) {
  // TypeScript: 'this' is a Mongoose Document with IUser properties
  const doc = this as mongoose.Document & IUser;

  try {
    if (!doc.isModified("password") || !doc.password) {
      return next();
    }

    const saltRounds = 10;
    doc.password = await bcrypt.hash(doc.password, saltRounds);
    next();
  } catch (err) {
    next(err as any);
  }
});
/**
 * Instance methods
 */
userSchema.methods.isPasswordCorrect = async function (
  this: IUser & IUserMethods,
  password: string
): Promise<boolean> {
  if (!this.password) return false; // no password stored (e.g. google provider)
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: IUser): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret)
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment");
  return jwt.sign({ userId: this._id, email: this.email }, secret, {
    expiresIn: "15m",
  });
};

userSchema.methods.generateRefreshToken = function (this: IUser): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret)
    throw new Error("REFRESH_TOKEN_SECRET is not defined in environment");
  return jwt.sign({ userId: this._id }, secret, { expiresIn: "7d" });
};

const User = mongoose.model<IUser, Model<IUser, {}, IUserMethods>>(
  "User",
  userSchema
);

export default User;
