import { Button } from "@/components/ui/button";
import type { IListing } from "@/types/types";
import React from "react";
import { Link } from "react-router-dom"; // Changed to react-router-dom for standard usage if not using Next.js router
import { MapPin } from "lucide-react"; // 📌 Import icons

interface ListingCardProps {
  listing: IListing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="border bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={listing.image?.url || "placeholder-image-url"} // Added a placeholder in case url is missing
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-3">
        {" "}
        {/* Added space-y for better vertical rhythm */}
        <h2 className="text-xl font-semibold truncate">{listing.title}</h2>
        {/* Location Row with Icon */}
        <div className="flex items-center text-sm">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" /> {/* 📌 Icon */}
          <p className="truncate">
            {listing.location}, {listing.country}
          </p>
        </div>
        <Link to={`/listings/${listing._id}`} className="block pt-2">
          {" "}
          {/* Increased link margin */}
          <Button variant={"outline"} className="w-full">
            View more!
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;
