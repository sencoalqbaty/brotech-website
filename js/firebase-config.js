// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdi5h-fQO6Hm3KjilwkwdXP6sUPNWWxgs",
  authDomain: "brotech-189ea.firebaseapp.com",
  databaseURL: "https://brotech-189ea-default-rtdb.firebaseio.com",
  projectId: "brotech-189ea",
  storageBucket: "brotech-189ea.appspot.com",
  messagingSenderId: "600356738998",
  appId: "1:600356738998:web:4822a95c8747b07a1dd317",
  measurementId: "G-FLFRFXVX2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services for use in other parts of your app
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);