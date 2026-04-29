import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1EoRXo-fzPNDz1kdGp3eh9Wf1N5cky3M",
  authDomain: "booking-dashboard-a6b91.firebaseapp.com",
  projectId: "booking-dashboard-a6b91",
  storageBucket: "booking-dashboard-a6b91.firebasestorage.app",
  messagingSenderId: "167866484507",
  appId: "1:167866484507:web:404d2ccc697eb2e50675be"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);