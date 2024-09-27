// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVLUS7yit_3L92JwInSFZdR8RamnKJJwQ",
  authDomain: "billing-manager-16292.firebaseapp.com",
  projectId: "billing-manager-16292",
  storageBucket: "billing-manager-16292.appspot.com",
  messagingSenderId: "8951853068",
  appId: "1:8951853068:web:f88cd76399129f35fcfe29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };