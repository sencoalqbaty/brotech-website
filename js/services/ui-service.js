// export const uiService = {
//   // عرض رسالة للمستخدم
//   showMessage(type, message, duration = 5000) {
//     const messageEl = document.getElementById('message');
//     if (!messageEl) return;

//     messageEl.textContent = message;
//     messageEl.className = `message ${type}`;
//     messageEl.style.display = 'block';
    
//     setTimeout(() => {
//       messageEl.style.display = 'none';
//     }, duration);
//   },

//   // توجيه المستخدم لصفحة أخرى
//   redirectTo(url, delay = 0) {
//     setTimeout(() => {
//       window.location.href = url;
//     }, delay);
//   },

//   // تحديث واجهة المستخدم حسب حالة المصادقة
//   updateAuthUI(user) {
//     const authElements = document.querySelectorAll('.auth-only');
//     const guestElements = document.querySelectorAll('.guest-only');
    
//     if (user) {
//       authElements.forEach(el => el.style.display = 'block');
//       guestElements.forEach(el => el.style.display = 'none');
      
//       // تحديث معلومات المستخدم
//       const userElements = {
//         '.user-name': user.displayName || user.email.split('@')[0],
//         '.user-email': user.email,
//         '.user-avatar': user.photoURL || '/images/default-avatar.png'
//       };
      
//       Object.entries(userElements).forEach(([selector, value]) => {
//         const element = document.querySelector(selector);
//         if (element) {
//           if (selector === '.user-avatar' && element.tagName === 'IMG') {
//             element.src = value;
//           } else {
//             element.textContent = value;
//           }
//         }
//       });
//     } else {
//       authElements.forEach(el => el.style.display = 'none');
//       guestElements.forEach(el => el.style.display = 'block');
//     }
//   },

//   // إظهار/إخفاء حالة التحميل
//   toggleLoading(show) {
//     const loadingEl = document.getElementById('loading');
//     if (loadingEl) {
//       loadingEl.style.display = show ? 'flex' : 'none';
//     }
//   }
// };