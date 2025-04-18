import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const TODO_LIMIT = 999;

interface OverflowMessageState {
  message: string | null;
}

const initialState: OverflowMessageState = {
  message: null,
};

const overflowMessageSlice = createSlice({
  name: "overflowMessage",
  initialState,
  reducers: {
    setOverflowMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearOverflowMessage: (state) => {
      state.message = null;
    },
  },
});

export const { setOverflowMessage, clearOverflowMessage } =
  overflowMessageSlice.actions;
export const overflowMessageReducer = overflowMessageSlice.reducer;
