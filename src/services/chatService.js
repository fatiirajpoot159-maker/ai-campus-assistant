import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

import { db } from "../firebase/firebase";


// Save Chat Message

export const saveChat = async (chatData) => {

  await addDoc(
    collection(db, "chatHistory"),
    chatData
  );

};



// Get User Chat History

export const getChatHistory = async (uid) => {

  const q = query(
    collection(db, "chatHistory"),
    where("userId", "==", uid),
    orderBy("createdAt", "asc")
  );


  const snapshot = await getDocs(q);


  return snapshot.docs.map((doc)=>({

    id: doc.id,

    ...doc.data()

  }));

};