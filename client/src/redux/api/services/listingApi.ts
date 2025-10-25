import type { IListing } from "../../../types/types";
import { baseApi } from "./baseApi";

export const listingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<
      { data: IListing[]; success: boolean; message: string },
      void
    >({
      query: () => "/listings",
      keepUnusedDataFor: 60,
      providesTags: ["Listings"],
    }),
    // 🧩 Fetch a single listing by ID
    getListingById: builder.query<
      { data: IListing; success: boolean; message: string },
      string
    >({
      query: (id) => `/listings/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Listing", id }],
    }),
    createListing: builder.mutation<
      { data: IListing; success: boolean; message: string },
      FormData
    >({
      query: (formData) => ({
        url: "/listings",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Listings"], // refresh listings list after create
    }),
    updateListingById: builder.mutation<
      { data: IListing; success: boolean; message: string },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/listings/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Listing", id },
        "Listings",
      ],
    }),
    // 🧩 Delete a single listing by ID
    deleteListingById: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/listings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Listing", id },
        "Listings",
      ],
    }),
  }),
  overrideExisting: false, // true if you want to override an existing endpoint with the same name
});

export const {
  useGetListingsQuery,
  useGetListingByIdQuery,
  useDeleteListingByIdMutation,
  useUpdateListingByIdMutation,
  useCreateListingMutation,
} = listingApi;
