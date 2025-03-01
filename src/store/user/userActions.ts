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
