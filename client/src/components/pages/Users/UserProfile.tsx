import React from "react";
import { useGetMyProfileQuery } from "@/redux/api/services/userApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { IUser } from "@/types/user.types";
import UpdateProfileForm from "./UpdateProfile";
import UpdateProfileSkeleton from "@/components/skeletons/UserProfileSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfile: React.FC = () => {
  const { data, isLoading: profileLoading, isError } = useGetMyProfileQuery();

  // ✅ Skeleton state
  if (profileLoading) {
    return (
      <div className="max-w-full mx-auto p-6 lg:grid lg:grid-cols-2 lg:gap-10">
        {/* Profile Skeleton */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-40 h-5 rounded-md" />
              <Skeleton className="w-60 h-4 rounded-md" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Skeleton className="w-16 h-4 mb-2 rounded-md" />
              <Skeleton className="w-full h-10 rounded-md" />
            </div>
            <div>
              <Skeleton className="w-20 h-4 mb-2 rounded-md" />
              <Skeleton className="w-2/3 h-10 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Skeleton for Update Form */}
        <UpdateProfileSkeleton />
      </div>
    );
  }

  // ❌ Error state
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <AlertCircle className="mb-2 w-6 h-6" />
        <p>Something went wrong while loading your profile.</p>
      </div>
    );
  }

  const user: IUser | undefined = data?.data;
  if (!user) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Profile not found or not authorized.
      </div>
    );
  }

  // ✅ Main content
  return (
    <div className="max-w-full mx-auto p-6 lg:grid lg:grid-cols-2 lg:gap-10">
      {/* Profile Card */}
      <Card className="rounded-2xl shadow-md transition hover:shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={user.avatar || "/default-avatar.png"}
              alt={user.name || user.username}
            />
            <AvatarFallback>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-semibold">
              {user.name || user.username}
            </CardTitle>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Bio</h3>
            <p className="text-gray-600">{user.bio || "No bio available."}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Listings</h3>
            <p className="text-gray-600">
              {user.listingsLength
                ? `${user.listingsLength} listings created`
                : "No listings yet."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Update Form */}
      <UpdateProfileForm />
    </div>
  );
};

export default UserProfile;
