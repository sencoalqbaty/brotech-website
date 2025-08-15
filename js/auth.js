// import { auth, app, appSettings } from './firebase-config.js'; // استيراد app و appSettings
// import { addUserProfile } from './data-service.js'; // استيراد دالة إضافة ملف المستخدم
// import { 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword,
//     updateProfile,
//     sendPasswordResetEmail,
//     GoogleAuthProvider,
//     signInWithPopup 
// } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js";

// // --- صفحة إنشاء حساب (Register) ---
// const registerForm = document.getElementById('registerForm');
// if (registerForm) {
//     registerForm.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const name = document.getElementById('register-name').value;
//         const email = document.getElementById('register-email').value;
//         const password = document.getElementById('register-password').value;
//         const phone = document.getElementById('register-phone').value; // 1. الحصول على قيمة حقل الهاتف
//         const confirmPassword = document.getElementById('register-confirm-password').value;

//         if (password !== confirmPassword) {
//             alert("كلمتا المرور غير متطابقتين!");
//             return;
//         }

//         // إظهار مؤشر التحميل
//         const loading = document.getElementById('loading');
//         if(loading) loading.style.display = 'flex';

//         createUserWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 // تم إنشاء الحساب
//                 const user = userCredential.user;
                
//                 // 1. تحديث ملف المستخدم بالاسم (في خدمة Auth)
//                 const profilePromise = updateProfile(user, {
//                     displayName: name
//                 });

//                 // 2. إنشاء ملف للمستخدم في Firestore لتخزين بيانات إضافية
//                 const firestorePromise = addUserProfile(user.uid, {
//                     name: name, // أو displayName
//                     email: user.email,
//                     phone: phone, // 2. إضافة رقم الهاتف إلى بيانات المستخدم
//                     createdAt: new Date()
//                 });

//                 // انتظار اكتمال العمليتين معًا
//                 return Promise.all([profilePromise, firestorePromise]);
//             })
//             .then(() => {
//                 alert("تم إنشاء الحساب بنجاح! سيتم توجيهك إلى لوحة التحكم.");
//                 // استخدام المسار المحدد في الإعدادات للانتقال إلى لوحة التحكم
//                 window.location.href = appSettings.authRedirect.register;
//             })
//             .catch((error) => {
//                 const errorMessage = error.message;
//                 console.error(error.code, errorMessage);
//                 alert(`حدث خطأ: ${errorMessage}`);
//             })
//             .finally(() => {
//                 // إخفاء مؤشر التحميل
//                 if(loading) loading.style.display = 'none';
//             });
//     });
// }

// // --- نسيت كلمة المرور (Forgot Password) ---
// const forgotPasswordLink = document.querySelector('.forgot-password');
// if (forgotPasswordLink) {
//     forgotPasswordLink.addEventListener('click', (e) => {
//         e.preventDefault();
//         const email = prompt("الرجاء إدخال بريدك الإلكتروني لإعادة تعيين كلمة المرور:");
        
//         if (email) {
//             sendPasswordResetEmail(auth, email)
//                 .then(() => {
//                     alert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد (والرسائل المزعجة).");
//                 })
//                 .catch((error) => {
//                     console.error("Error sending password reset email:", error);
//                     alert("فشل إرسال البريد الإلكتروني. تأكد من أن البريد الإلكتروني صحيح ومسجل لدينا.");
//                 });
//         }
//     });
// }

// // --- تسجيل الدخول عبر Google ---
// const googleLoginButtons = document.querySelectorAll('.social-btn.google');
// if (googleLoginButtons.length > 0) {
//     googleLoginButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const provider = new GoogleAuthProvider();

//             signInWithPopup(auth, provider)
//                 .then(async (result) => {
//                     const user = result.user;

//                     // تحقق مما إذا كان المستخدم جديدًا
//                     const userProfile = await getUserProfile(user.uid);

//                     if (!userProfile) {
//                         // إذا كان المستخدم جديدًا، قم بإنشاء ملف له في قاعدة البيانات
//                         console.log("New user detected from Google Sign-In. Creating profile...");
//                         await addUserProfile(user.uid, {
//                             name: user.displayName,
//                             email: user.email,
//                             photoURL: user.photoURL, // حفظ رابط صورة جوجل
//                             createdAt: new Date()
//                         });
//                     }

//                     // توجيه المستخدم إلى لوحة التحكم
//                     window.location.href = '../../dashboard.html';

//                 }).catch((error) => {
//                     // التعامل مع الأخطاء هنا
//                     console.error("Google Sign-In Error:", error);
//                     // يمكنك عرض رسالة خطأ للمستخدم
//                     alert(`حدث خطأ أثناء تسجيل الدخول باستخدام Google: ${error.message}`);
//                 });
//         });
//     });
// }


// // --- صفحة تسجيل الدخول (Login) ---
// const loginForm = document.getElementById('loginForm');
// if (loginForm) {
//     loginForm.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const email = document.getElementById('login-email').value;
//         const password = document.getElementById('login-password').value;

//         // إظهار مؤشر التحميل
//         const loading = document.getElementById('loading');
//         if(loading) loading.style.display = 'flex';

//         signInWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 // تم تسجيل الدخول بنجاح
//                 const user = userCredential.user;

//                 // استدعاء دالة السحابة لإرسال بريد إلكتروني لإشعار تسجيل الدخول
//                 try {
//                     // تأكد من أن المنطقة 'me-central1' تطابق المنطقة التي نشرت فيها الدالة
//                     const functions = getFunctions(app, 'me-central1'); 
//                     const sendLoginEmail = httpsCallable(functions, 'sendLoginEmail');
                    
//                     // لا ننتظر إرسال البريد الإلكتروني للمتابعة، فقط نطلبه ونكمل
//                     sendLoginEmail({ email: user.email, name: user.displayName || user.email.split('@')[0] })
//                         .then((result) => {
//                             console.log('تم استدعاء دالة السحابة بنجاح:', result);
//                         })
//                         .catch((error) => {
//                             console.error('حدث خطأ أثناء استدعاء دالة السحابة:', error);
//                             // لا تمنع المستخدم من المتابعة إذا فشل إرسال البريد الإلكتروني، فقط قم بتسجيل الخطأ.
//                         });
//                 } catch (error) {
//                     console.error("خطأ في إعداد Firebase Functions:", error);
//                 }
//                 // توجيه المستخدم إلى لوحة التحكم فورًا
//                 window.location.href = '../../dashboard.html'; // الانتقال من pages/auth/ إلى الـ root
//             })
//             .catch((error) => {
//                 console.error(error.code, error.message);
//                 alert(`فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.`);
//             })
//             .finally(() => {
//                 // إخفاء مؤشر التحميل
//                 if(loading) loading.style.display = 'none';
//             });
//     });
// }