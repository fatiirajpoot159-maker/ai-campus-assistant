import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

// Add Task
export const addTask = async (task) => {
  return await addDoc(collection(db, "planner"), task);
};

// Get User Tasks
export const getTasks = async (uid) => {
  const q = query(
    collection(db, "planner"),
    where("userId", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Delete Task
export const deleteTask = async (id) => {
  await deleteDoc(doc(db, "planner", id));
};