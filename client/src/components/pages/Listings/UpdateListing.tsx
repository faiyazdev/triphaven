"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetListingByIdQuery,
  useUpdateListingByIdMutation,
} from "@/redux/api/services/listingApi";

const UpdateListing = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: loadingListing } = useGetListingByIdQuery(id!);
  const [updateListing, { isLoading: updating }] =
    useUpdateListingByIdMutation();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    location: "",
    country: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (data?.data) {
      const l = data.data;
      setFormData({
        title: l.title,
        price: l.price.toString(),
        description: l.description,
        location: l.location,
        country: l.country,
      });
      setPreview(l.image?.url || null);
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("price", formData.price);
    fd.append("description", formData.description);
    fd.append("location", formData.location);
    fd.append("country", formData.country);
    if (imageFile) fd.append("image", imageFile);

    try {
      const res = await updateListing({ id: id!, formData: fd }).unwrap();
      if (res.success) {
        console.log(res.data);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update listing.");
    }
  };

  if (loadingListing) return <p className="text-center mt-10">Loading...</p>;

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Update Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Listing Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-60 object-cover mt-3 rounded-xl border"
              />
            )}
          </div>

          <Button type="submit" className="w-full" disabled={updating}>
            {updating ? "Updating..." : "Update Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateListing;
