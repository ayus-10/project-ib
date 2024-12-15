import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthenticatedUser {
  email: string | null | undefined;
  fullName: string | null | undefined;
  role: string | null | undefined;
}

const defaultState: AuthenticatedUser = {
  email: undefined,
  fullName: undefined,
  role: undefined,
};

export const authenticatedUserSlice = createSlice({
  name: "authenticatedUserSlice",
  initialState: defaultState,
  reducers: {
    setAuthenticatedUser: (
      _state,
      action: PayloadAction<AuthenticatedUser>
    ) => {
      return action.payload;
    },
    removeAuthenticatedUser: (state) => {
      state.email = null;
      state.fullName = null;
      state.role = null;
    },
  },
});

export const { removeAuthenticatedUser, setAuthenticatedUser } =
  authenticatedUserSlice.actions;
