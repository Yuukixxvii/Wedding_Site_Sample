import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbC1_I-VO3zO3rn_1fFlNYE6QGFEq8rBE",
  authDomain: "wedding-site-sample.firebaseapp.com",
  projectId: "wedding-site-sample",
  storageBucket: "wedding-site-sample.firebasestorage.app",
  messagingSenderId: "902065002653",
  appId: "1:902065002653:web:b44b387969e64c9abedc74",
  measurementId: "G-ZK16YBZ84B",
};

const app = initializeApp(firebaseConfig);

// THIS LINE IS IMPORTANT
export const db = getFirestore(app);

export const auth = getAuth(app);
