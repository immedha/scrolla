import { createAction } from "@reduxjs/toolkit";
import { Video } from "../storeStates";

export const signInAction = createAction('user/signInAction');
export const signOutAction = createAction('user/signOutAction');

export interface fetchInitialDataActionPayload {
  userId: string;
}

export interface fetchInitialDataActionFormat {
  type: string;
  payload: fetchInitialDataActionPayload
}

export const fetchInitialDataAction = createAction<fetchInitialDataActionPayload>('user/fetchInitialDataAction');


export interface generateVideosActionPayload {
  userId: string;
  files: string[];
}

export interface generateVideosActionFormat {
  type: string;
  payload: generateVideosActionPayload
}

export const generateVideosAction = createAction<generateVideosActionPayload>('user/generateVideosAction');


export interface saveGeneratedVideosActionPayload {
  userId: string;
  videos: Video[];
}

export interface saveGeneratedVideosActionFormat {
  type: string;
  payload: saveGeneratedVideosActionPayload
}

export const saveGeneratedVideosAction = createAction<saveGeneratedVideosActionPayload>('user/saveGeneratedVideosAction');

export interface setLikedVideoActionPayload {
  userId: string;
  videoIdx: number;
  liked: boolean;
}

export interface setLikedVideoActionFormat {
  type: string;
  payload: setLikedVideoActionPayload
}

export const setLikedVideoAction = createAction<setLikedVideoActionPayload>('user/setLikedVideoAction');

export const updateProfilePicAction = createAction<{
  file: File;
}>('user/updateProfilePic');

export const setProfilePicAction = createAction<string>('user/setProfilePic');
