import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH5zfXdzYEYLSSlKkUk8DhchYKfePsybw",
  authDomain: "study-buddy-hungary.firebaseapp.com",
  projectId: "study-buddy-hungary",
  storageBucket: "study-buddy-hungary.appspot.com",
  messagingSenderId: "204464023423",
  appId: "1:204464023423:web:2be386d4fd50c710f11c4a",
  measurementId: "G-VQCS17VNSE"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth }