import { createSlice } from "@reduxjs/toolkit";
import { allSlicesState, UserSliceState } from "../storeStates";

const initialState: UserSliceState = {
  userId: null,
  userName: null,
  userEmail: null,
  isProSubscription: false,
  videos: [],
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setProSubscription: (state, action) => {
      state.isProSubscription = action.payload;
    },
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    addVideos: (state, action) => {
      state.videos.push(...action.payload);
    },
    setUserData: (state, action) => {
      state.userName = action.payload.username;
      state.userEmail = action.payload.userEmail;
      state.isProSubscription = action.payload.isProSubscription;
      state.videos = action.payload.videos;
    },
    setLikeStatusOfVideo: (state, action) => {
      const { videoIdx, liked } = action.payload;
      state.videos[videoIdx].liked = liked;
    },
  }
});

export const { setLikeStatusOfVideo, setUserData, setUserId, setUserName, setUserEmail, setProSubscription, setVideos, addVideos } = userSlice.actions;
export const selectUserId = (state: allSlicesState) => state.user.userId;
export const selectUserName = (state: allSlicesState) => state.user.userName;
export const selectUserEmail = (state: allSlicesState) => state.user.userEmail;
export const selectVideos = (state: allSlicesState) => state.user.videos;
export const selectProSubscription = (state: allSlicesState) => state.user.isProSubscription;


export default userSlice.reducer;