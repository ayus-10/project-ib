import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertMessage {
  message: string | null;
  status: "SUCCESS" | "ERROR" | null;
}

const defaultState: AlertMessage = { message: null, status: null };

export const alertSlice = createSlice({
  name: "alertSlice",
  initialState: defaultState,
  reducers: {
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.status = "SUCCESS";
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.status = "ERROR";
    },
    removeAlertMessage: (state) => {
      state.message = null;
      state.status = null;
    },
  },
});

export const { removeAlertMessage, setErrorMessage, setSuccessMessage } =
  alertSlice.actions;
