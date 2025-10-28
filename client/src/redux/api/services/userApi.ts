import type {
  IGetAllUsersResponse,
  IGetMyProfileResponse,
  IUpdateProfileResponse,
} from "@/types/user.types";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all users (Admin only)
    getAllUsers: builder.query<IGetAllUsersResponse, void>({
      query: () => "/users",
    }),

    // ✅ Get current user profile
    getMyProfile: builder.query<IGetMyProfileResponse, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),

    // ✅ Update current user profile
    updateMyProfile: builder.mutation<IUpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: "/users/me",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllUsersQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} = userApi;
