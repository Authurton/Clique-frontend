// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import getFirestore function

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKC1ORwHNRG6Zrwbh3itS6YGF2TATYjXM",
  authDomain: "clique-of-10.firebaseapp.com",
  projectId: "clique-of-10",
  storageBucket: "clique-of-10.appspot.com",
  messagingSenderId: "560251288549",
  appId: "1:560251288549:web:24cd79a267c64b39240d0c",
  measurementId: "G-KRDG65VH0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and export db
const db = getFirestore(app); // Initialize Firestore
export {db};
