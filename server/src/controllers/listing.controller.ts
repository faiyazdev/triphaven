import { cloudinary } from "../config/cloudinary.js";
import Listing from "../models/listing.model.js";
import Review from "../models/Review.model.js";
import { deleteFile, uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import handleAsync from "../utils/HandleAsync.js";
import type { Request, Response } from "express";
// h
export const getAllListings = handleAsync(
  async (req: Request, res: Response) => {
    // Optional: support filtering, sorting, pagination
    const filters: any = {};
    const { city, minPrice, maxPrice, guests } = req.query;

    if (city) filters.city = { $regex: city, $options: "i" };
    if (minPrice || maxPrice) {
      filters.pricePerNight = {};
      if (minPrice) filters.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filters.pricePerNight.$lte = Number(maxPrice);
    }
    if (guests) filters.maxGuests = { $gte: Number(guests) };

    const listings = await Listing.find(filters)
      .sort({ createdAt: -1 })
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "username email", // optional — only bring what you need
        },
      })
      .populate("author");

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
      message: listings.length
        ? "Listings fetched successfully"
        : "No listings found",
    });
  }
);

export const getListingById = handleAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID format.",
      });
    }

    // Find listing and optionally populate owner or reviews
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "username email", // optional — only bring what you need
        },
      })
      .populate("author");
    // .populate("owner", "name email avatar") // optional: populate user info
    // .populate("reviews"); // optional: populate reviews if available

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
      message: "Listing fetched successfully.",
    });
  }
);

export const createListing = handleAsync(
  async (req: Request, res: Response) => {
    const { title, description, price, location, country } = req.body;

    // 🧩 1️⃣ Validate required fields
    if (!title || !description || !price || !location || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // 🖼️ 2️⃣ Handle image upload (if provided)
    let imageData = null;

    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(req.file.path);

        if (uploaded?.public_id && uploaded?.secure_url) {
          imageData = {
            filename: uploaded.public_id,
            url: uploaded.secure_url,
          };
        }
      } catch (error) {
        console.error("❌ Cloudinary upload failed:", error);
        return res.status(500).json({
          success: false,
          message: "Image upload failed. Please try again.",
        });
      } finally {
        // Always clean up local file (even if upload fails)
        deleteFile(req.file.path);
      }
    }

    // 🏠 3️⃣ Create the new listing
    const newListing = await Listing.create({
      title,
      description,
      image: imageData,
      price,
      location,
      country,
      author: req.user?.userId,
    });

    // ✅ 4️⃣ Respond to client
    res.status(201).json({
      success: true,
      data: newListing,
      message: "Listing created successfully!",
    });
  }
);

export const updateListing = handleAsync(
  async (req: Request, res: Response) => {
    console.log(req.file);
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    // 🧩 1️⃣ Find existing listing
    const existingListing = await Listing.findById(id).populate("author");
    if (!existingListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found!",
      });
    }

    if (existingListing.author?._id.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing",
      });
    }
    // 🖼️ 2️⃣ Handle image upload (if provided)
    let imageData = existingListing.image;

    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(req.file.path);

        if (uploaded?.public_id && uploaded?.secure_url) {
          imageData = {
            filename: uploaded.public_id,
            url: uploaded.secure_url,
          };

          // Optional: remove old Cloudinary image
          if (existingListing.image?.filename) {
            await cloudinary.uploader.destroy(existingListing.image.filename);
          }
        }
      } catch (error) {
        console.error("❌ Cloudinary upload failed:", error);
        return res.status(500).json({
          success: false,
          message: "Image upload failed. Please try again.",
        });
      } finally {
        deleteFile(req.file.path);
      }
    }

    // 🏠 3️⃣ Update listing fields
    existingListing.title = title || existingListing.title;
    existingListing.description = description || existingListing.description;
    existingListing.price = price || existingListing.price;
    existingListing.location = location || existingListing.location;
    existingListing.country = country || existingListing.country;
    existingListing.image = imageData;

    // 💾 4️⃣ Save updated listing
    const updatedListing = await existingListing.save();

    // ✅ 5️⃣ Respond to client
    res.status(200).json({
      success: true,
      data: updatedListing,
      message: "Listing updated successfully!",
    });
  }
);

export const deleteListing = handleAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    // 1️⃣ Find the listing
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("author");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found!",
      });
    }
    if (listing.author?._id.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }
    // 2️⃣ Remove image from Cloudinary if it exists
    if (listing.image?.filename) {
      try {
        await cloudinary.uploader.destroy(listing.image.filename);
      } catch (error) {
        console.error("❌ Failed to delete image from Cloudinary:", error);
        // Not fatal — we can still delete the listing
      }
    }
    // Ensure reviews array exists
    if (!listing.reviews) {
      listing.reviews = [];
    }
    // reviews as well
    if (listing.reviews.length) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
    // 3️⃣ Delete the listing
    await listing.deleteOne(); // triggers pre-remove hooks if any

    // 4️⃣ Respond to client
    res.status(200).json({
      success: true,
      message: "Listing deleted successfully!",
    });
  }
);
