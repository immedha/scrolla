import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserDbData } from "./store/storeStates";

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