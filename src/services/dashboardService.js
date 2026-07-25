import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase/firebase";


export const getDashboardStats = async (uid) => {

  const getCount = async (collectionName) => {

    const q = query(
      collection(db, collectionName),
      where("userId", "==", uid)
    );

    const snapshot = await getDocs(q);

    return snapshot.size;
  };


  const chats = await getCount("chatHistory");

  const assignments = await getCount("planner");

  const notes = await getCount("notes");

  const automations = await getCount("automations");


  return {
    chats,
    assignments,
    notes,
    automations
  };

};