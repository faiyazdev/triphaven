import React from "react";

const ListingCardSkeleton: React.FC = () => {
  return (
    // Outer container matching the main card's layout and shadows
    <div className="border bg-card text-card-foreground rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* 1. Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>

      <div className="p-4 space-y-3">
        {/* 2. Title Placeholder */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

        {/* 3. Location Placeholder (Matches the flex layout) */}
        <div className="flex items-center text-sm">
          {/* Icon Placeholder */}
          <div className="w-4 h-4 mr-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          {/* Text Placeholder */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>

        {/* 4. Button Placeholder (Matches the w-full button) */}
        <div className="pt-2">
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ListingCardSkeleton;
