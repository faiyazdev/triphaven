import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, DollarSign } from "lucide-react";
import {
  useDeleteListingByIdMutation,
  useGetListingByIdQuery,
} from "@/redux/api/services/listingApi";
import { Button } from "@/components/ui/button";

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetListingByIdQuery(id!);
  const [deleteListing] = useDeleteListingByIdMutation();
  const listing = data?.data;
  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const res = await deleteListing(id!);
      if (res?.data?.success) {
        console.log(res?.data?.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading) {
    return (
      <Card className="max-w-lg mx-auto mt-10">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-2xl mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  if (!listing) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Listing not found or failed to load.
      </p>
    );
  }

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {listing.title}
        </CardTitle>
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {listing.location}, {listing.country}
        </div>
      </CardHeader>
      <CardContent>
        <img
          src={listing.image?.url}
          alt={listing.image?.filename || listing.title}
          className="w-full h-64 object-cover rounded-2xl mb-4"
        />
        <p className="text-gray-700 mb-3">{listing.description}</p>
        <div className="flex items-center text-lg font-medium">
          <DollarSign className="w-5 h-5 text-green-600 mr-1" />
          {listing.price.toLocaleString()}
        </div>
        <div className="gap-2 mt-2 grid">
          <Button type="button" asChild>
            <Link to={`/listings/update/${listing._id}`}>Update Listing</Link>
          </Button>
          <Button onClick={handleDelete} type="button">
            Delete Listing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingDetails;
