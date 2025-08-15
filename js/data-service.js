// // هذا الملف مخصص لخدمات البيانات التي تتفاعل مع Firebase Realtime Database و Cloud Storage.
// // يرجى التأكد من استيراد الوحدات النمطية الصحيحة من Firebase SDK.

// // Import Firebase and data service
// import { db, storage } from './firebase-config.js';
// import { ref, set, get, update, push, query, orderByChild, equalTo, serverTimestamp, limitToLast } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
// import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
//     import { saveContactMessage } from './data-service.js';

// /**
//  * يضيف بيانات المستخدم عند التسجيل لأول مرة في Realtime Database.
//  * @param {string} userId - معرف المستخدم (uid).
//  * @param {object} userData - البيانات المراد حفظها (مثل الاسم، البريد الإلكتروني).
//  * @returns {Promise<void>}
//  */
// export const addUserProfile = async (userId, userData) => {
//     try {
//         // نستخدم `set` لإنشاء مسار جديد للمستخدم في قاعدة البيانات
//         await set(ref(db, 'users/' + userId), {
//             ...userData,
//             // استخدام الطابع الزمني الرقمي لتسهيل الفرز
//             createdAt: userData.createdAt || Date.now() 
//         });
//         console.log("User profile created in Realtime Database for user:", userId);
//     } catch (error) {
//         console.error("Error adding user profile to Realtime Database: ", error);
//         throw error; // إعادة رمي الخطأ للتعامل معه في المكان الذي تم استدعاء الدالة فيه
//     }
// };

// /**
//  * يجلب بيانات ملف المستخدم من Firestore.
//  * @param {string} userId - معرف المستخدم (uid).
//  * @returns {Promise<object|null>} بيانات المستخدم أو null إذا لم يتم العثور عليها.
//  */
// export const getUserProfile = async (userId) => {
//     try {
//         const userRef = ref(db, 'users/' + userId);
//         const snapshot = await get(userRef);
//         return snapshot.exists() ? snapshot.val() : null;
//     } catch (error) {
// document.addEventListener('DOMContentLoaded', function () {

//     // --- Logic for enlarging images (Modal) ---
//     const modal = document.getElementById('imageModal');
//     if (modal) {
//         const modalImg = document.getElementById('modalImage');
//         const captionText = document.getElementById('modalCaption');
//         const images = document.querySelectorAll('.enlargeable-image');
//         const span = document.getElementsByClassName('image-modal-close')[0];

//         images.forEach(image => {
//             image.onclick = function(){
//                 modal.style.display = "block";
//                 modalImg.src = this.dataset.src || this.src;
//                 captionText.innerHTML = this.alt;
//             }
//         });

//         span.onclick = function() { 
//             modal.style.display = "none";
//         }

//         // Close modal when clicking outside the image
//         window.onclick = function(event) {
//             if (event.target == modal) {
//                 modal.style.display = "none";
//             }
//         }
//     }

//     // --- Contact Form Logic ---
//     const contactForm = document.getElementById('contactForm');
//     if (contactForm) {
//         contactForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const submitButton = contactForm.querySelector('button[type="submit"]');
//             submitButton.disabled = true;
//             submitButton.textContent = 'جاري الإرسال...';

//             try {
//                 await saveContactMessage({
//                     name: document.getElementById('name').value,
//                     email: document.getElementById('email').value,
//                     message: document.getElementById('message').value,
//                 });
//                 alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
//                 contactForm.reset();
//             } catch (error) {
//                 console.error('Failed to send message:', error);
//                 alert('عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
//             } finally {
//                 submitButton.disabled = false;
//                 submitButton.textContent = 'إرسال الرسالة';
//             }
//         });
//     }
// });}}