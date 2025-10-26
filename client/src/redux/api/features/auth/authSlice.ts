import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// type PayloadAction

export interface AuthState {
  user: {
    id: string;
    name: string;
    username?: string;
    email: string;
  } | null;
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
        user: {
          id: string;
          name: string;
          username?: string;
          email: string;
        };
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
