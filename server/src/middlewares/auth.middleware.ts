import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ExpressError(401, "Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
      email?: string;
    };

    // Attach to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next(); // proceed to the next middleware/controller
  } catch (err: any) {
    next(new ExpressError(401, "Invalid or expired token"));
  }
};
