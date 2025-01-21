import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbTMoIZfgZnb4LOinKtnFSGdOOE8AM-SY",
  authDomain: "genmanai.firebaseapp.com",
  projectId: "genmanai",
  storageBucket: "genmanai.appspot.com",
  messagingSenderId: "154323435242",
  appId: "1:154323435242:web:7d989fab9d5e0290e62193",
  measurementId: "G-RT5WY1YBT6",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
