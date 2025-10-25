import type { RootState } from "@/redux/store";
import {
  fetchBaseQuery,
  createApi,
  type BaseQueryFn,
  type FetchBaseQueryError,
  type FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { removeCredentials, setCredentials } from "../features/auth/authSlice";

// ✅ 1. Base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include", // important for cookie-based refresh
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// ✅ 2. Enhanced type for baseQueryWithReauth
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs, // args type
  unknown, // return type
  FetchBaseQueryError // error type
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // 401 → expired or invalid token
  if (result.error && result.error.status === 401) {
    console.warn("Access token expired. Attempting refresh...");
    console.log("refresh token endpoint ......");
    // Attempt token refresh
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-access-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as { accessToken: string };
      const user = (api.getState() as RootState).auth.user;

      // ✅ Update Redux store and localStorage
      api.dispatch(setCredentials({ user, accessToken }));

      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.error("Refresh token rotation failed. Logging out...");
      api.dispatch(removeCredentials());
    }
  }

  return result;
};

// ✅ 3. Shared base API (extendable by feature APIs)
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Listings", "Listing"],
});
