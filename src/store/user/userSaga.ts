import { getAdditionalUserInfo, signInWithPopup, signOut, UserCredential } from "firebase/auth";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { fetchInitialDataAction, fetchInitialDataActionFormat, generateVideosAction, generateVideosActionFormat, saveGeneratedVideosAction, saveGeneratedVideosActionFormat, setLikedVideoAction, setLikedVideoActionFormat, signInAction, signOutAction } from "./userActions";
import { auth, provider } from "../../firebase";
import { addVideos, setLikeStatusOfVideo, setUserData, setUserId } from "./userSlice";
import { setPageStateInfoAction } from "../global/globalActions";
import { addNewUserToDb, addVideosToDb, fetchUserData, setLikedVideoInDb } from "../../dbQueries";
import { UserDbData, Video } from "../storeStates";
import { setNewlyGeneratedVideos } from "../global/globalSlice";

// API base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:5003/api';

// Using a more generic type for the Generator functions
type SagaGenerator = Generator<unknown, void, unknown>;

function* signIn(): SagaGenerator {
  try {
    const result = (yield call(signInWithPopup, auth, provider)) as UserCredential;
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
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setPageStateInfoAction({type: 'error', message: errorMessage}));
  }
}

function* logOut(): SagaGenerator {
  try {
    yield signOut(auth);
    yield put(setUserId(null));
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setPageStateInfoAction({type: 'error', message: errorMessage}));
  }
}

function* fetchInitialData(action: fetchInitialDataActionFormat): SagaGenerator {
  try {
    const { userId } = action.payload;
    // call a fetch function to get user data from db and load it into the redux store
    const allUserData = (yield call(fetchUserData, userId)) as UserDbData;
    yield put(setUserData({
      username: allUserData.userName, 
      userEmail: allUserData.userEmail, 
      isProSubscriptino: allUserData.isProSubscription,
      videos: allUserData.videos
    }));
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setPageStateInfoAction({type: 'error', message: errorMessage}));
  }
}

// Helper function to upload files to the backend
function uploadFilesToBackend(userId: string, files: string[]) {
  return async () => {
    try {
      // For each Firebase URL, we need to fetch the file and then upload it to our backend
      const formData = new FormData();
      formData.append('userId', userId);
      
      // Fetch each file from Firebase and add to form data
      for (const fileUrl of files) {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        
        // Get filename from URL
        const urlParts = fileUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        formData.append('files', blob, filename);
      }
      
      // Upload files to backend
      const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload files');
      }
      
      const uploadData = await uploadResponse.json();
      return uploadData.files;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };
}

// Helper function to generate videos using the backend
function generateVideosFromBackend(userId: string, filePaths: string[]) {
  return async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          files: filePaths,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate videos');
      }
      
      const data = await response.json();
      return data.videos;
    } catch (error) {
      console.error('Error generating videos:', error);
      throw error;
    }
  };
}

function* setLikedVideo(action: setLikedVideoActionFormat): SagaGenerator {
  try {
    const { userId, videoIdx, liked } = action.payload; // TODO: use this to set liked status of a video
    yield call(setLikedVideoInDb, userId, videoIdx, liked);
    yield put(setLikeStatusOfVideo({ videoIdx, liked }));
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setPageStateInfoAction({type: 'error', message: errorMessage}));
  }
}

function* generateVideos(action: generateVideosActionFormat): SagaGenerator {
  try {
    const { userId, files } = action.payload;
    
    // Show loading message
    yield put(setPageStateInfoAction({type: 'loading', message: 'Uploading files to the backend...'}));
    
    // 1. Upload files to our backend
    const uploadedFilePaths = (yield call(uploadFilesToBackend(userId, files))) as string[];
    
    // Update loading message
    yield put(setPageStateInfoAction({type: 'loading', message: 'Generating videos...'}));
    
    // 2. Generate videos using our backend
    const videos = (yield call(generateVideosFromBackend(userId, uploadedFilePaths))) as Video[];
    
    // 3. Update the store with the generated videos
    yield put(setNewlyGeneratedVideos(videos));
    
    // 4. Show success message
    yield put(setPageStateInfoAction({type: 'success', message: 'Videos generated successfully!'}));
    
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate videos';
    yield put(setPageStateInfoAction({type: 'error', message: errorMessage}));
  }
}

function* saveGeneratedVideos(action: saveGeneratedVideosActionFormat): SagaGenerator {
  try {
    const { userId, videos } = action.payload;
    yield call(addVideosToDb, userId, videos);
    yield put(addVideos(videos));
    yield put(setNewlyGeneratedVideos([]));
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setPageStateInfoAction({type: 'error', message: errorMessage}));
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