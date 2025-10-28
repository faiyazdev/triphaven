import React, { useState, useEffect } from "react";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/api/services/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

const UpdateProfileForm: React.FC = () => {
  const { data, isLoading: profileLoading } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation();

  // form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // populate current user info when data loads
  useEffect(() => {
    if (data?.data) {
      setName(data.data.name || "");
      setBio(data.data.bio || "");
      setPreview(data.data.avatar || null);
    }
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      const msg = "Failed to update profile. Please try again.";
      console.log(error);
      toast.error(msg);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto mt-8 rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Update Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          encType="multipart/form-data"
        >
          {/* Avatar preview */}
          <div className="flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-2">
              <AvatarImage src={preview || "/default-avatar.png"} />
              <AvatarFallback>
                {name ? name[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>

            <label className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <Upload className="w-4 h-4" />
              Change avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Name field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1"
            />
          </div>

          {/* Bio field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell something about yourself..."
              className="mt-1"
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full rounded-xl"
          >
            {isUpdating && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfileForm;
