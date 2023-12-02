// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.ENV.API_KEY,
  authDomain: "svelte-todos-7b309.firebaseapp.com",
  projectId: "svelte-todos-7b309",
  storageBucket: "svelte-todos-7b309.appspot.com",
  messagingSenderId: "432132663225",
  appId: "1:432132663225:web:b2e9ae6d6f5be1411c3868",
  measurementId: "G-SM3L7S0RRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);



export default db;