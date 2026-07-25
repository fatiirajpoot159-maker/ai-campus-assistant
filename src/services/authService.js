import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { saveUser } from "./userService";

// =======================================
// Register New User
// =======================================
export const registerUser = async (fullName, email, password) => {
  try {
    // Create account in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Logged-in user
    const user = userCredential.user;

    // Save user profile in Firestore
    await saveUser(user.uid, {
      fullName,
      email,
    });

    return userCredential;
  } catch (error) {
    throw error;
  }
};

// =======================================
// Login Existing User
// =======================================
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential;
  } catch (error) {
    throw error;
  }
};

// =======================================
// Logout User
// =======================================
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};