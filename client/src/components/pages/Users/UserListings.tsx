import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useGetUserListingsQuery } from "@/redux/api/services/listingApi";
import ListingCard from "../Listings/ListingCard";

const UserListings: React.FC = () => {
  const { data, isLoading, isError, error } = useGetUserListingsQuery();

  // loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // error state
  if (isError) {
    const errData =
      (error as { data?: { message?: string } })?.data?.message ??
      "Failed to fetch listings.";
    return (
      <div className="flex flex-col items-center justify-center py-10 text-red-500">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>{errData}</p>
      </div>
    );
  }

  const listings = data?.data || [];

  // empty state
  if (listings?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <img
          src="/empty-state.svg"
          alt="No listings"
          className="w-40 h-40 mb-4 opacity-70"
        />
        <p>You haven’t created any listings yet.</p>
      </div>
    );
  }

  // success state
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings?.map((listing, idx) => (
          <ListingCard key={idx} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default UserListings;
