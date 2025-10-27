import { useGetAllUsersQuery } from "@/redux/api/services/userApi";
import React from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserList: React.FC = () => {
  const { data, isLoading, isError, error } = useGetAllUsersQuery();

  if (isLoading)
    return (
      <div className="text-center text-gray-500 p-4">Loading users...</div>
    );

  if (isError) {
    let errorMessage = "Unknown error";

    const baseError = error as FetchBaseQueryError | undefined;

    if (
      baseError?.data &&
      typeof baseError.data === "object" &&
      baseError.data !== null
    ) {
      const errData = baseError.data as { message?: string };
      if (errData.message) {
        errorMessage = errData.message;
      }
    } else if ((error as Error)?.message) {
      errorMessage = (error as Error).message;
    }

    return (
      <div className="text-center text-red-500 p-4">
        Error fetching users: {errorMessage}
      </div>
    );
  }

  const users = data?.data || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div>
                  <h2 className="font-semibold text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-gray-600 text-sm">
                  {user.bio || "No bio provided."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
