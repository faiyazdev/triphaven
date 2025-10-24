import express from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createListing,
  deleteListing,
  getAllListings,
  updateListing,
  getListingById,
} from "../controllers/listing.controller.js";
const router = express.Router();

router.get("/", authenticate, getAllListings);
router.post("/", authenticate, upload.single("image"), createListing);
router.get("/:id", getListingById);
router.put("/:id", upload.single("image"), updateListing);
router.delete("/:id", authenticate, deleteListing);

export default router;
