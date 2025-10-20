import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
type UserType = {
  name: string;
  email: string;
  username?: string;
  // sub: string;
  // provider?: string;
};

type CredentialType = {
  user: UserType;
  accessToken: string;
};

export interface AuthState {
  authData: UserType | null;
}

const storedAuthData = localStorage.getItem("authData");

const initialState: AuthState = {
  authData: storedAuthData ? JSON.parse(storedAuthData) : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialType>) => {
      state.authData = action.payload.user;
      localStorage.setItem("authData", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    removeCredentials: (state) => {
      state.authData = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;
