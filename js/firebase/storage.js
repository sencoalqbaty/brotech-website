// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

// // إعدادات مشروعك في Firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyDdi5h-fQO6Hm3KjilwkwdXP6sUPNWWxgs",
//     authDomain: "brotech-189ea.firebaseapp.com",
//     projectId: "brotech-189ea",
//     storageBucket: "brotech-189ea.firebasestorage.app",
//     messagingSenderId: "600356738998",
//     appId: "1:600356738998:web:4822a95c8747b07a1dd317",
//     measurementId: "G-FLFRFXVX2Z"
// };

// // تهيئة التطبيق والتخزين
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);

// // رفع ملف إلى التخزين
// export async function uploadFile(path, file) {
//     const storageRef = ref(storage, path);
//     await uploadBytes(storageRef, file);
//     return await getDownloadURL(storageRef);
// }

// // جلب رابط تحميل ملف
// export async function getFileURL(path) {
//     const storageRef = ref(storage, path);
//     return await getDownloadURL(storageRef);
// }

// // حذف ملف من التخزين
// export async function deleteFile(path) {
//     const storageRef = ref(storage, path);
//     return await deleteObject(storageRef);
// }