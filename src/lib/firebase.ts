import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCYRuFy8IApMa0kg5VekvxBKm_go3ffch0",
  authDomain: "gen-lang-client-0773410206.firebaseapp.com",
  projectId: "gen-lang-client-0773410206",
  storageBucket: "gen-lang-client-0773410206.firebasestorage.app",
  messagingSenderId: "883749778170",
  appId: "1:883749778170:web:ab7ceca88cde5191f58f43"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID (vital for AI Studio provisions)
export const db = initializeFirestore(app, {}, "ai-studio-localaigrowth-547b1197-9b5d-470b-bbdc-6eb87cdb777f");

export { app };
