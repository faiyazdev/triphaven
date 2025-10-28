import { Button } from "@/components/ui/button";
import type { IListing } from "@/types/types";
import React from "react";
import { Link } from "react-router";

interface ListingCardProps {
  listing: IListing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="border text-custom font-['Geist'] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={listing.image?.url}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{listing.title}</h2>
        <p className=" text-sm">
          {listing.location}, {listing.country}
        </p>
        <p className="mt-2 ">{listing.description}</p>
        <p className="mt-2 font-bold">${listing.price} / night</p>
      </div>
      <Link to={`/listings/${listing._id}`}>
        <Button variant={"outline"}>View more!</Button>
      </Link>
    </div>
  );
};

export default ListingCard;
