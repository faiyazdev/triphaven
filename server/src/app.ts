import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
const app = express();
import userRoutes from "./routes/user.routes.js";

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/auth", userRoutes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  console.log(message);
  res.status(status).json({ success: false, message });
});

export default app;
