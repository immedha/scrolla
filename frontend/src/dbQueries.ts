import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from "./firebase";
import { UserDbData } from "./store/storeStates";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export const addNewUserToDb = async (userId: string, newUser: UserDbData) => {
  try {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, newUser);
  } catch (error: any) {
    throw new Error(error.toString());
  }
}

export const fetchUserData = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data() as UserDbData;
    } else {
      throw new Error("User data not found");
    }
  } catch (error: any) {
    throw new Error(error.toString());
  }
}

export const addVideosToDb = async (userId: string, videos: UserDbData['videos']) => {
  try {
    const docRef = doc(db, "users", userId);
    const userDoc = await getDoc(docRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserDbData;
      const updatedVideos = [...userData.videos, ...videos];
      await setDoc(docRef, { ...userData, videos: updatedVideos });
    } else {
      throw new Error("User data not found");
    }
    
  } catch (error: any) {
    throw new Error(error.toString());
  }
}

export const saveFilesToStorage = async (files: FileList) => {
  const storage = getStorage(app);
  let fileUrls: string[] = [];
  const uploads = Array.from(files).map(async (file) => {
    const storageRef = ref(storage, `pdfs/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    fileUrls.push(downloadURL);
  });

  await Promise.all(uploads);
  return fileUrls;
};

export const setLikedVideoInDb = async (userId: string, videoIdx: number, liked: boolean) => {
  try {
    const docRef = doc(db, "users", userId);
    const userDoc = await getDoc(docRef);
    if (userDoc.exists()) {
      let userData = userDoc.data() as UserDbData;
      if (userData.videos && userData.videos[videoIdx]) {
        userData.videos[videoIdx].liked = liked;
        await setDoc(docRef, userData);
      } else {
        throw new Error("Video not found");
      }
    } else {
      throw new Error("User data not found");
    }
  } catch (error: any) {
    throw new Error(error.toString());
  }
}