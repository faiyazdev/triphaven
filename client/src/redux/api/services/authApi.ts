import type { UserType } from "@/types/types";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        accessToken: string;
        user: UserType;
        success: boolean;
        message: string;
      },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation<
      {
        accessToken: string;
        user: UserType;
        success: boolean;
        message: string;
      },
      { email: string; password: string; username: string; name: string }
    >({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation<
      {
        data: {
          success: boolean;
          message: string;
        };
      },
      void
    >({
      query: () => ({
        url: "/auth/signout",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation, useSignupMutation } =
  authApi;
