// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// API
const firebaseConfig = {
  apiKey: "AIzaSyDaZOiTdGyWfe6DeEcB8CB2-tNa6zAM7J0",
  authDomain: "smanpulbilingual.firebaseapp.com",
  projectId: "smanpulbilingual",
  storageBucket: "smanpulbilingual.appspot.com",
  messagingSenderId: "994746803872",
  appId: "1:994746803872:web:68b2d21d9fa5eab5a44bc5",
  measurementId: "G-QLVBM32GB6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, app, db, storage };