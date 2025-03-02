import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalSliceState, Video, allSlicesState } from "../storeStates";

const initialState: GlobalSliceState = {
  pageState: "idle",
  stateMessage: null,
  newlyGeneratedVideos: [],
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
    setNewlyGeneratedVideos(state, action: PayloadAction<Video[]>) {
      state.newlyGeneratedVideos = action.payload;
    },
  },
});

export const { setNewlyGeneratedVideos, setPageState, setStateMessage } = globalSlice.actions;

export const selectPageState = (state: allSlicesState) => state.global.pageState;
export const selectStateMessage = (state: allSlicesState) => state.global.stateMessage;
export const selectNewlyGeneratedVideos = (state: allSlicesState) => state.global.newlyGeneratedVideos;

export default globalSlice.reducer;