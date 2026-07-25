import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// ===============================
// Save New User
// ===============================
export const saveUser = async (uid, userData) => {
  try {
    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: new Date().toISOString(),
      role: "student",
      photoURL: "",
    });
  } catch (error) {
    throw error;
  }
};

// ===============================
// Get User
// ===============================
export const getUser = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return null;
  } catch (error) {
    throw error;
  }
};

// ===============================
// Update User
// ===============================
export const updateUser = async (uid, data) => {
  try {
    await updateDoc(doc(db, "users", uid), data);
  } catch (error) {
    throw error;
  }
};