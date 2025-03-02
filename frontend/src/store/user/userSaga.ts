import { getAdditionalUserInfo, signInWithPopup, signOut, UserCredential } from "firebase/auth";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { fetchInitialDataAction, fetchInitialDataActionFormat, generateVideosAction, generateVideosActionFormat, saveGeneratedVideosAction, saveGeneratedVideosActionFormat, setLikedVideoAction, setLikedVideoActionFormat, signInAction, signOutAction } from "./userActions";
import { auth, provider } from "../../firebase";
import { addVideos, setLikeStatusOfVideo, setUserData, setUserId } from "./userSlice";
import { setPageStateInfoAction } from "../global/globalActions";
import { addNewUserToDb, addVideosToDb, fetchUserData, setLikedVideoInDb } from "../../dbQueries";
import { UserDbData, Video } from "../storeStates";
import { setNewlyGeneratedVideos } from "../global/globalSlice";


function* signIn() {
  try {
    const result: UserCredential = yield call(signInWithPopup, auth, provider);
    const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
    if (isNewUser) {
      const newUser: UserDbData = {
        userEmail: result.user.email,
        userName: result.user.displayName,
        isProSubscription: false,
        videos: []
      };
      yield call(addNewUserToDb, result.user.uid, newUser); 
    }
    yield put(setUserId("" + result.user.uid));
  } catch (error: any) {
    console.error(error);
    yield put(setPageStateInfoAction({type: 'error', message: error.message}));
  }
}

function* logOut() {
  try {
    yield signOut(auth);
    yield put(setUserId(null));
  } catch (error: any) {
    console.error(error);
    yield put(setPageStateInfoAction({type: 'error', message: error.message}));
  }
}

function* fetchInitialData(action: fetchInitialDataActionFormat) {
  try {
    const { userId } = action.payload;
    // call a fetch function to get user data from db and load it into the redux store
    const allUserData: UserDbData = yield call(fetchUserData, userId);
    yield put(setUserData({
      username: allUserData.userName, 
      userEmail: allUserData.userEmail, 
      isProSubscriptino: allUserData.isProSubscription,
      videos: allUserData.videos
    }));
  } catch (error: any) {
    console.error(error);
    yield put(setPageStateInfoAction({type: 'error', message: error.message}));
  }
}

function* setLikedVideo(action: setLikedVideoActionFormat) {
  try {
    const { userId, videoIdx, liked } = action.payload; // TODO: use this to set liked status of a video
    yield call(setLikedVideoInDb, userId, videoIdx, liked);
    yield put(setLikeStatusOfVideo({ videoIdx, liked }));
  } catch (error: any) {
    console.error(error);
    yield put(setPageStateInfoAction({type: 'error', message: error.message}));
  }
}

function* generateVideos(_action: generateVideosActionFormat) {
  try {
    // const { userId, files } = action.payload; // TODO: use this to generate videos
    let videos: Video[] = [];
    videos[0] = {
      liked: false,
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/scrolla-e0803.firebasestorage.app/o/intro_coding.mp4?alt=media&token=a96c793c-8199-478c-9ab9-8af5e1964ee3',
      title: 'Intro to Coding',
      category: 'computer science'
    }
    videos[1] = {
      liked: false,
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/scrolla-e0803.firebasestorage.app/o/reels.mp4?alt=media&token=88fb27ea-0704-480b-9a1c-499e278e612a',
      title: 'Impact of Reels on Academic Performance',
      category: 'social media'
    }
    yield put(setNewlyGeneratedVideos(videos));
  } catch (error: any) {
    console.error(error);
    yield put(setPageStateInfoAction({type: 'error', message: error.message}));
  }
}

function* saveGeneratedVideos(action: saveGeneratedVideosActionFormat) {
  try {
    const { userId, videos } = action.payload;
    yield call(addVideosToDb, userId, videos);
    yield put(addVideos(videos));
    yield put(setNewlyGeneratedVideos([]));
  } catch (error: any) {
    console.error(error);
    yield put(setPageStateInfoAction({type: 'error', message: error.message}));
  }
}

export default function* userSaga() {
  yield all([
    takeEvery(signInAction.type, signIn),
    takeEvery(signOutAction.type, logOut),
    takeEvery(fetchInitialDataAction.type, fetchInitialData),
    takeEvery(generateVideosAction.type, generateVideos),
    takeEvery(saveGeneratedVideosAction.type, saveGeneratedVideos),
    takeEvery(setLikedVideoAction.type, setLikedVideo),
  ]);
}