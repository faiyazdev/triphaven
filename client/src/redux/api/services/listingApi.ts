import type { IListing } from "../../../types/types";
import { baseApi } from "./baseApi";

export const listingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<
      { data: IListing[]; success: boolean; message: string },
      void
    >({
      query: () => "/listings",
      keepUnusedDataFor: 5,
      // providesTags: ["Listings"], // optional, for cache invalidation
    }),
  }),
  overrideExisting: false, // true if you want to override an existing endpoint with the same name
});

export const { useGetListingsQuery } = listingApi;
