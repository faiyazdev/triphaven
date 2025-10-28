import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UpdateProfileSkeleton: React.FC = () => {
  return (
    <Card className="w-full p-6 mx-auto mt-8 lg:mt-0 rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <Skeleton className="w-40 h-6" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <Skeleton className="w-20 h-20 rounded-full mb-3" />
            <Skeleton className="w-32 h-4" />
          </div>

          {/* Name field */}
          <div className="space-y-2">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>

          {/* Bio field */}
          <div className="space-y-2">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-full h-20 rounded-lg" />
          </div>

          {/* Submit button */}
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdateProfileSkeleton;
