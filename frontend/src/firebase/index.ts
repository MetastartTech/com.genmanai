import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3un8W85pjJNW9moJ7pAFIW6Jxltkk6oI",
  authDomain: "com-genmanai.firebaseapp.com",
  projectId: "com-genmanai",
  storageBucket: "com-genmanai.firebasestorage.app",
  messagingSenderId: "1015231100312",
  appId: "1:1015231100312:web:9f727e08e13c9e426e27ed",
  measurementId: "G-5XQD8XW246",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
