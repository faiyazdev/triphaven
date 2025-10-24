import type { UserType } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// type PayloadAction

export interface AuthState {
  user: UserType | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserType;
        accessToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    removeCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;
