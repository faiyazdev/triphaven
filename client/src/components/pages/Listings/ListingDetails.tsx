import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, DollarSign, Star } from "lucide-react";
import {
  useAddReviewMutation,
  useDeleteListingByIdMutation,
  useDeleteReviewMutation,
  useGetListingByIdQuery,
} from "@/redux/api/services/listingApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { IReview } from "@/types/types";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);

  const navigate = useNavigate();
  const { data, isLoading } = useGetListingByIdQuery(id!);
  const [deleteListing] = useDeleteListingByIdMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [addReview] = useAddReviewMutation();
  // review form state
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(5);

  const listing = data?.data;
  console.log(listing?.author);
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
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview({ listingId: id!, reviewId }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !rating) return;

    try {
      const res = await addReview({ id: id!, comment, rating });
      if (res?.data?.success) {
        setComment("");
        setRating(5);
        console.log(res?.data.message);
      }
    } catch (error) {
      console.error("Failed to add review:", error);
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
    <div className="max-w-lg mx-auto mt-10 space-y-6">
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
          {user?.id === listing?.author?._id && (
            <div className="gap-2 mt-2 grid">
              <Button type="button" asChild>
                <Link to={`/listings/update/${listing._id}`}>
                  Update Listing
                </Link>
              </Button>
              <Button onClick={handleDelete} type="button">
                Delete Listing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Reviews Section */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {listing.reviews && listing.reviews.length > 0 ? (
            listing.reviews.map((review: IReview) => (
              <div key={review._id} className="border-b pb-2 mb-2">
                {/* Reviewer Info */}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {review.user?.username || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt!).toLocaleDateString()}
                  </p>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center mb-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700">{review.comment}</p>
                {user?.id === review.user?._id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    {isDeleting ? "Deleting ..." : "Delete"}
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          )}

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="space-y-2">
            <Textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Rating:</label>
              <Input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-20"
              />
            </div>
            <Button type="submit">Add Review</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingDetails;
