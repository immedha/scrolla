import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalSliceState, allSlicesState } from "../storeStates";

const initialState: GlobalSliceState = {
  pageState: "idle",
  stateMessage: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setPageState(state, action: PayloadAction<"loading" | "error" | "idle" | "success">) {
      state.pageState = action.payload;
    },
    setStateMessage(state, action: PayloadAction<string | null>) {
      state.stateMessage = action.payload;
    },
  },
});

export const { setPageState, setStateMessage } = globalSlice.actions;

export const selectPageState = (state: allSlicesState) => state.global.pageState;
export const selectStateMessage = (state: allSlicesState) => state.global.stateMessage;

export default globalSlice.reducer;