import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", getAllUsers);
router.get("me", authenticate, getMyProfile);
router.put("/me", authenticate, upload.single("avatar"), updateMyProfile);

export default router;
