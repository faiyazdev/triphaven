import express from "express";
import {
  refreshAccessToken,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", upload.single("picture"), signup);
router.post("/signin", signin);
router.post("/signout", authenticate, signout);
router.post("/refresh-access-token", refreshAccessToken);

export default router;
