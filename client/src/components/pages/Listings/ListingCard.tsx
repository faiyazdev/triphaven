import type { IListing } from "@/types/types";
import React from "react";

interface ListingCardProps {
  listing: IListing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={listing.image?.url}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{listing.title}</h2>
        <p className="text-gray-500 text-sm">
          {listing.location}, {listing.country}
        </p>
        <p className="mt-2 text-gray-700">{listing.description}</p>
        <p className="mt-2 font-bold">${listing.price} / night</p>
      </div>
    </div>
  );
};

export default ListingCard;
