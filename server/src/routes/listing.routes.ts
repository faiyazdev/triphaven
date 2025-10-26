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
import {
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";
const router = express.Router();

router.get("/", authenticate, getAllListings);
router.post("/", authenticate, upload.single("image"), createListing);
router.get("/:id", getListingById);
router.put("/:id", upload.single("image"), updateListing);
router.delete("/:id", authenticate, deleteListing);
router.post("/:id/reviews", authenticate, createReview);
router.delete("/:id/reviews/:reviewId", authenticate, deleteReview);

export default router;
