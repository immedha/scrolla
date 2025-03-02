export interface allSlicesState {
  global: GlobalSliceState;
  user: UserSliceState;
}

export interface GlobalSliceState {
  pageState: "loading" | "error" | "idle" | "success";
  stateMessage: string | null;
  newlyGeneratedVideos: Video[];
}

export interface UserSliceState extends UserDbData {
  userId: string | null;
  profilePic: string | null;
}

export interface Video {
  videoUrl: string;
  liked: boolean;
  title: string;
  category: string;
}

export interface UserDbData {
  userName: string | null;
  userEmail: string | null;
  isProSubscription: boolean;
  videos: Video[];
}

export const FREE_SUBSCRIPTION_FILES = 5;
export const PRO_SUBSCRIPTION_FILES = 50;