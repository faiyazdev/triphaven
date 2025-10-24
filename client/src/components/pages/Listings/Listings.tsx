import React from "react";
import ListingCard from "./ListingCard";
import { useGetListingsQuery } from "@/redux/api/services/listingApi";

const Listings: React.FC = () => {
  const { data: response, isLoading } = useGetListingsQuery();
  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  const listings = response?.data; // <-- extract the array
  if (!listings?.length)
    return <p className="text-center mt-10">No listings found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {listings?.map((listing, idx) => (
        <ListingCard key={idx} listing={listing} />
      ))}
    </div>
  );
};

export default Listings;
