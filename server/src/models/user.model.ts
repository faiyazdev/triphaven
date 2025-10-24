import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  name?: string;
  email: string;
  picture?: string;
  password: string;
  refreshToken: string;
  provider: "google" | "manual";

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
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
      // required: true,
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
userSchema.pre<IUser>("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { userId: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "5s" }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
