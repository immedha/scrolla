import { createAction } from "@reduxjs/toolkit";

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