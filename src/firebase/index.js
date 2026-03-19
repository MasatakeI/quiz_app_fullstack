import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCk1EnelOSCiuzGMcT1bdQ_ZidaDyc6TFY",
  authDomain: "quizapp-ddbb8.firebaseapp.com",
  projectId: "quizapp-ddbb8",
  storageBucket: "quizapp-ddbb8.firebasestorage.app",
  messagingSenderId: "157470964880",
  appId: "1:157470964880:web:ca599b58931b3e00ebac15",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
export const quizHistoryRef = collection(db, "histories");
