import React from "react";
import ListingCard from "./ListingCard";
import { useGetListingsQuery } from "@/redux/api/services/listingApi";
import ListingCardSkeleton from "@/components/ListingCardSkeleton";

// Define how many skeleton cards to show while loading
const SKELETON_COUNT = 8;

// Define a large number of cards to ensure the grid fills the screen
const MAX_CARDS_TO_SHOW = 30;

const Listings: React.FC = () => {
  const { data: response, isLoading } = useGetListingsQuery();

  // Extract the listings array
  const listings = response?.data;

  // The grid class definition is what controls the responsiveness:
  const gridClasses =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

  // --- Loading State: Display Skeletons ---
  if (isLoading) {
    return (
      <div className={`text-custom mx-auto px-4 py-8 ${gridClasses}`}>
        {/* Render a fixed number of skeletons to demonstrate the grid layout */}
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // --- Empty State ---
  if (!listings?.length)
    return <p className="text-center mt-10">No listings found. 😔</p>;

  // --- Loaded State: Display Listing Cards ---
  return (
    // The grid structure handles filling the viewport based on breakpoints
    <div className={`text-custom mx-auto px-4 py-8 ${gridClasses}`}>
      {listings
        // Limit the rendering to a large number of items for performance and clear demonstration
        .slice(0, MAX_CARDS_TO_SHOW)
        .map((listing, idx) => (
          <ListingCard key={idx} listing={listing} />
        ))}
    </div>
  );
};

export default Listings;
