import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Fill these in from your Firebase project settings (Project settings > General > Your apps > SDK setup).
// They live in .env (copy .env.example to .env) as Vite reads only import.meta.env.VITE_* at build time.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const db = getFirestore(app);
