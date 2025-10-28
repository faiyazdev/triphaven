import React from "react";
import { useGetMyProfileQuery } from "@/redux/api/services/userApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import type { IUser } from "@/types/user.types";

const UserProfile: React.FC = () => {
  const { data, isLoading, isError } = useGetMyProfileQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  if (isError) {
    const errorMessage = "Something went wrong";
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <AlertCircle className="mb-2" />
        <p>{errorMessage}</p>
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
  console.log(user);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={user.avatar || "/default-avatar.png"}
              alt={user.name || user.username}
            />
            <AvatarFallback>
              {user.name ? (
                <div className="text-4xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                "U"
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-semibold">
              {user.name || user.username}
            </CardTitle>
            <p className="text-gray-500">{user.email}</p>
            {/* <p className="text-sm text-gray-400 capitalize">
              Provider: {user.provider}
            </p> */}
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
    </div>
  );
};

export default UserProfile;
