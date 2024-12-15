import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./slices/alertSlice";

export const store = configureStore({
  reducer: {
    alert: alertSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
