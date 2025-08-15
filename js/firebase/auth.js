import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// إعدادات مشروعك في Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDdi5h-fQO6Hm3KjilwkwdXP6sUPNWWxgs",
    authDomain: "brotech-189ea.firebaseapp.com",
    projectId: "brotech-189ea",
    storageBucket: "brotech-189ea.firebasestorage.app",
    messagingSenderId: "600356738998",
    appId: "1:600356738998:web:4822a95c8747b07a1dd317",
    measurementId: "G-FLFRFXVX2Z"
};

// تهيئة التطبيق والمصادقة
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// دالة تسجيل مستخدم جديد
export function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// دالة تسجيل الدخول
export function login(email, password) {
    return
}