// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

// // تهيئة التطبيق وقاعدة البيانات
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// // مثال: إضافة مستند جديد
// export async function addUser(data) {
//     return await addDoc(collection(db, "users"), data);
// }

// // مثال: جلب جميع المستخدمين
// export async function getUsers() {
//     const querySnapshot = await getDocs(collection(db, "users"));
//     return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// }

// // مثال: جلب مستخدم واحد
// export async function getUser(id) {
//     const userDoc = await getDoc(doc(db, "users", id));
//     return userDoc.exists() ? userDoc.data() : null;
// }

// // مثال: تحديث مستخدم
// export async function updateUser(id, data) {
//     return await updateDoc(doc(db, "users", id), data);
// }

// // مثال: حذف مستخدم
// export async function deleteUser(id) {
//     return await deleteDoc(doc(db, "users", id));
// }