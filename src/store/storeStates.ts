export interface allSlicesState {
  global: GlobalSliceState;
  user: UserSliceState;
}

export interface GlobalSliceState {
  pageState: "loading" | "error" | "idle" | "success";
  stateMessage: string | null;
}

export interface UserSliceState extends UserDbData {
  userId: string | null;
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
