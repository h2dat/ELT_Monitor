import { initializeApp } from "firebase/app";
import { initializeAuth,  getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDFP7s38_9AievBcO6WY_PW66Yze03bGaM",
  authDomain: "elt-monitor.firebaseapp.com",
  projectId: "elt-monitor",
  storageBucket: "elt-monitor.appspot.com",
  messagingSenderId: "98756861335",
  appId: "1:98756861335:web:aed23e48526bbdba21f8d2",
  measurementId: "G-4N9XLY1T3K"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
export const FIREBASE_STORE = getFirestore(FIREBASE_APP)
export const FIREBASE_DATABASE = getDatabase(FIREBASE_APP)
