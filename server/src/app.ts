import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
const app = express();
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import cookieParser from "cookie-parser";

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://triphaven-faiyaz.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  console.log(message);
  res.status(status).json({ success: false, message });
});

export default app;
