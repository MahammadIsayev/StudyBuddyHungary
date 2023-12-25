import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2vB83NAjrcgOhtndNQ8BiFAVjieCXuEY",
  authDomain: "study-buddy-hungary-9cfff.firebaseapp.com",
  projectId: "study-buddy-hungary-9cfff",
  storageBucket: "study-buddy-hungary-9cfff.appspot.com",
  messagingSenderId: "756536935090",
  appId: "1:756536935090:web:e13722ec6ef5c705fa3fab",
  measurementId: "G-N27RB090DM"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { app, db, auth, storage, ref }