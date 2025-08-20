// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
// import { getStorage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDdi5h-fQO6Hm3KjilwkwdXP6sUPNWWxgs", // مفتاح API الخاص بك
//   authDomain: "brotech-189ea.firebaseapp.com",
//   projectId: "brotech-189ea",
//   databaseURL: "https://brotech-189ea-default-rtdb.firebaseio.com", // رابط قاعدة بيانات Realtime
//   storageBucket: "brotech-189ea.firebasestorage.app",
//   messagingSenderId: "600356738998",
//   appId: "1:600356738998:web:4822a95c8747b07a1dd317",
//   measurementId: "G-FLFRFXVX2Z"
// };

// // إعدادات التطبيق (للإستخدام المستقبلي)
// export const appSettings = {
//   appName: "BroTech",
//   defaultLanguage: "ar",
//   supportedLanguages: ["ar", "en"],
//   authRedirect: {
//     login: "../../dashboard.html", // المسار من داخل مجلد /pages/auth
//     logout: "index.html", // المسار من لوحة التحكم (في الـ root)
//     register: "../../dashboard.html" // المسار من داخل مجلد /pages/auth
//   }
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize and export Firebase services
// export const auth = getAuth(app);
// export const db = getDatabase(app);
// export const storage = getStorage(app);
// export { app }; // Export app if needed for other services like Functions
// auth.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdi5h-fQO6Hm3KjilwkwdXP6sUPNWWxgs",
  authDomain: "brotech-189ea.firebaseapp.com",
  databaseURL: "https://brotech-189ea-default-rtdb.firebaseio.com",
  projectId: "brotech-189ea",
  storageBucket: "brotech-189ea.firebasestorage.app",
  messagingSenderId: "600356738998",
  appId: "1:600356738998:web:4822a95c8747b07a1dd317",
  measurementId: "G-FLFRFXVX2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { auth, db, appSettings } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

// ======= تسجيل مستخدم جديد =======
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const phone = document.getElementById("register-phone").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-confirm-password").value;

        if (password !== confirmPassword) {
            alert("كلمة المرور غير متطابقة!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // تحديث الاسم في ملف المستخدم
            await updateProfile(user, { displayName: name });

            // حفظ بيانات إضافية في Realtime Database
            await set(ref(db, 'users/' + user.uid), {
                name,
                email,
                phone,
                createdAt: new Date().toISOString()
            });

            alert("تم إنشاء الحساب بنجاح!");
            window.location.href = appSettings.authRedirect.register;

        } catch (error) {
            alert(error.message);
        }
    });
}

// ======= تسجيل دخول مستخدم =======
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = appSettings.authRedirect.login;

        } catch (error) {
            alert(error.message);
        }
    });
}

// ======= حماية Dashboard =======
onAuthStateChanged(auth, (user) => {
    if (window.location.pathname.includes("dashboard.html") && !user) {
        window.location.href = "./pages/auth/login.html";
    }
});
