import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2vB83NAjrcgOhtndNQ8BiFAVjieCXuEY",
  authDomain: "study-buddy-hungary-9cfff.firebaseapp.com",
  projectId: "study-buddy-hungary-9cfff",
  storageBucket: "study-buddy-hungary-9cfff.appspot.com",
  messagingSenderId: "756536935090",
  appId: "1:756536935090:web:e13722ec6ef5c705fa3fab",
  measurementId: "G-N27RB090DM"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth }