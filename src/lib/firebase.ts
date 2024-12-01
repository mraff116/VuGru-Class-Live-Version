import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyClAyLYAF1zBSy2OLez0i0VOU9K7c2YAqo",
  authDomain: "class-vugru.firebaseapp.com",
  projectId: "class-vugru",
  storageBucket: "class-vugru.firebasestorage.app",
  messagingSenderId: "358133605540",
  appId: "1:358133605540:web:1535c7e285174995fd3231",
  measurementId: "G-FCGJYB8MR0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);