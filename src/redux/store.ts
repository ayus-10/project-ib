import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./slices/alertSlice";
import { authenticatedUserSlice } from "./slices/authenticatedUserSlice";

export const store = configureStore({
  reducer: {
    alert: alertSlice.reducer,
    authenticatedUser: authenticatedUserSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
