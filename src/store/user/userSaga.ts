import { getAdditionalUserInfo, signInWithPopup, signOut, UserCredential } from "firebase/auth";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { fetchInitialDataAction, fetchInitialDataActionFormat, signInAction, signOutAction } from "./userActions";
import { auth, provider } from "../../firebase";
import { setUserData, setUserId } from "./userSlice";
import { setPageStateInfoAction } from "../global/globalActions";
import { addNewUserToDb, fetchUserData } from "../../dbQueries";
import { UserDbData } from "../storeStates";


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

export default function* userSaga() {
  yield all([
    takeEvery(signInAction.type, signIn),
    takeEvery(signOutAction.type, logOut),
    takeEvery(fetchInitialDataAction.type, fetchInitialData)
  ]);
}