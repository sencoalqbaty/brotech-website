// import { auth } from './firebase-config.js';
// import { 
//     getUserProfile, 
//     uploadProfileImage, 
//     updateUserProfileData,
//     getProjectsForUser,
//     getDashboardStats,
//     getRecentUsers
// } from './data-service.js';
// import { onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// // --- Dropdown Menu Logic ---
// const dropdown = document.querySelector('.user-profile-dropdown');
// if (dropdown) {
//     const dropdownBtn = dropdown.querySelector('.user-profile-btn');
    
//     dropdownBtn.addEventListener('click', (e) => {
//         e.stopPropagation(); // Prevent click from bubbling up to the window
//         dropdown.classList.toggle('active');
//     });

//     // Close dropdown when clicking outside
//     window.addEventListener('click', () => {
//         if (dropdown.classList.contains('active')) {
//             dropdown.classList.remove('active');
//         }
//     });
// }

// // حماية الصفحة والتحقق من حالة تسجيل الدخول
// onAuthStateChanged(auth, async (user) => { // استخدام async للسماح بـ await
//     if (user) {
//         // المستخدم مسجل دخوله، يمكنه البقاء في الصفحة
//         console.log("User is logged in:", user);

//         // عرض حالة التحميل
//         showLoadingState(true);

//     } else {
//         // المستخدم غير مسجل دخوله، قم بتوجيهه إلى صفحة تسجيل الدخول
//         console.log("User is not logged in. Redirecting to login page.");
//         // التوجيه من dashboard.html (في الـ root) إلى صفحة تسجيل الدخول
//         window.location.href = 'pages/auth/login.html'; 
//     }
// });

// // التعامل مع تسجيل الخروج
// const logoutButtons = document.querySelectorAll('#logout-btn');
// logoutButtons.forEach(button => {
//     button.addEventListener('click', (e) => {
//         e.preventDefault();
//         signOut(auth).then(() => {
//             console.log("User signed out successfully.");
//             window.location.href = 'index.html'; // العودة للصفحة الرئيسية من الـ root
//         }).catch((error) => {
//             console.error("Sign out error:", error);
//             alert('حدث خطأ أثناء تسجيل الخروج.');
//         });
//     });
// });

// // --- التعامل مع رفع صورة الملف الشخصي ---
// // افترض وجود هذه العناصر في ملف dashboard.html
// // <input type="file" id="profileImageInput" accept="image/*" style="display: none;">
// // <button id="changeAvatarBtn">تغيير الصورة</button>

// const changeAvatarBtn = document.getElementById('changeAvatarBtn');
// const profileImageInput = document.getElementById('profileImageInput');

// if (changeAvatarBtn && profileImageInput) {
//     // عند الضغط على زر "تغيير الصورة"، يتم فتح نافذة اختيار الملف
//     changeAvatarBtn.addEventListener('click', () => {
//         profileImageInput.click();
//     });

//     // عند اختيار ملف جديد
//     profileImageInput.addEventListener('change', async (e) => {
//         const file = e.target.files[0];
//         const user = auth.currentUser;

//         if (file && user) {
//             try {
//                 alert("جاري رفع الصورة...");
//                 // 1. رفع الصورة إلى Cloud Storage والحصول على الرابط
//                 const downloadURL = await uploadProfileImage(user.uid, file);

//                 // 2. تحديث رابط الصورة في ملف المستخدم في خدمة Auth
//                 await updateProfile(user, { photoURL: downloadURL });

//                 // 3. تحديث رابط الصورة في مستند المستخدم في Firestore
//                 await updateUserProfileData(user.uid, { photoURL: downloadURL });

//                 alert("تم تحديث الصورة بنجاح!");
//                 window.location.reload(); // إعادة تحميل الصفحة لإظهار الصورة الجديدة
//             } catch (error) {
//                 console.error("Failed to update profile picture:", error);
//                 alert("فشل تحديث الصورة. يرجى المحاولة مرة أخرى.");
//             }
//         }
//     });
// }

// /**
//  * يعرض قائمة المشاريع في واجهة المستخدم.
//  * @param {Array<object>} projects - مصفوفة المشاريع.
//  */
// function renderProjects(projects) {
//     const projectsListContainer = document.querySelector('.projects-list');
//     if (!projectsListContainer) return;

//     // إفراغ القائمة الحالية قبل إضافة المشاريع الجديدة
//     projectsListContainer.innerHTML = '';

//     if (projects.length === 0) {
//         projectsListContainer.innerHTML = '<p>لا توجد مشاريع لعرضها. قم بإنشاء مشروع جديد!</p>';
//         return;
//     }

//     projects.forEach(project => {
//         // تحويل تاريخ الإنشاء إذا كان موجودًا
//         // Realtime Database تخزن الوقت كرقم (timestamp)، لذا نحوله إلى تاريخ
//         const creationDate = project.createdAt ? 
//             new Date(project.createdAt).toLocaleDateString('ar-EG') : 'غير محدد';

//         const projectCardHTML = `
//             <article class="project-card">
//                 <div class="project-header">
//                     <h3 class="project-title">${project.title || 'مشروع بلا عنوان'}</h3>
//                     <span class="project-status in-progress">${project.status || 'قيد التنفيذ'}</span>
//                 </div>
//                 <p class="project-description">${project.description || 'لا يوجد وصف لهذا المشروع.'}</p>
//                 <div class="project-progress">
//                     <div class="progress-bar">
//                         <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
//                     </div>
//                     <span class="progress-percent">${project.progress || 0}%</span>
//                 </div>
//                 <div class="project-meta">
//                     <span class="project-deadline">
//                         <i class="fas fa-calendar-alt"></i> ${creationDate}
//                     </span>
//                 </div>
//             </article>`;
//         projectsListContainer.insertAdjacentHTML('beforeend', projectCardHTML);
//     });
// }
// Import Firebase and data service
import { auth } from './firebase-config.js';
import { 
    getUserProfile, 
    uploadProfileImage, 
    updateUserProfileData,
    getProjectsForUser,
    getDashboardStats,
    getRecentUsers
} from './data-service.js';
import { onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// --- Dropdown Menu Logic ---
const dropdown = document.querySelector('.user-profile-dropdown');
if (dropdown) {
    const dropdownBtn = dropdown.querySelector('.user-profile-btn');
    
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    window.addEventListener('click', () => {
        if (dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
        }
    });
}

// --- حماية الصفحة والتحقق من تسجيل الدخول ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is logged in:", user);
        showLoadingState(true);

        // تحميل بيانات المستخدم
        const profile = await getUserProfile(user.uid);
        if (profile) {
            const usernameEl = document.getElementById('username');
            if (usernameEl) usernameEl.textContent = profile.displayName || user.email;
        }

        // تحميل المشاريع
        const projects = await getProjectsForUser(user.uid);
        renderProjects(projects);

        // تحميل الإحصائيات
        const stats = await getDashboardStats();
        if (stats) {
            document.getElementById('stats-total-projects').textContent = stats.totalProjects || 0;
            document.getElementById('stats-active-clients').textContent = stats.totalUsers || 0;
            document.getElementById('stats-completed-tasks').textContent = stats.completedTasks || 0;
            document.getElementById('stats-revenue').textContent = stats.revenue || 0;
        }

        // تحميل أحدث المستخدمين
        const recentUsers = await getRecentUsers();
        const usersListEl = document.querySelector('.users-list');
        if (usersListEl) {
            usersListEl.innerHTML = '';
            recentUsers.forEach(u => {
                const li = document.createElement('li');
                li.textContent = u.displayName || u.email;
                usersListEl.appendChild(li);
            });
        }

        showLoadingState(false);

    } else {
        console.log("User is not logged in. Redirecting to login page.");
        window.location.href = 'pages/auth/login.html';
    }
});

// --- تسجيل الخروج ---
const logoutButtons = document.querySelectorAll('.logout-btn');
logoutButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            console.log("User signed out successfully.");
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Sign out error:", error);
            alert('حدث خطأ أثناء تسجيل الخروج.');
        }
    });
});

// --- رفع صورة الملف الشخصي ---
const changeAvatarBtn = document.getElementById('changeAvatarBtn');
const profileImageInput = document.getElementById('profileImageInput');

if (changeAvatarBtn && profileImageInput) {
    changeAvatarBtn.addEventListener('click', () => profileImageInput.click());

    profileImageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const user = auth.currentUser;

        if (file && user) {
            try {
                alert("جاري رفع الصورة...");
                const downloadURL = await uploadProfileImage(user.uid, file);
                await updateProfile(user, { photoURL: downloadURL });
                await updateUserProfileData(user.uid, { photoURL: downloadURL });

                // تحديث الصورة مباشرة دون إعادة تحميل الصفحة
                const avatarImg = document.querySelector('.user-avatar img');
                if (avatarImg) avatarImg.src = downloadURL;

                alert("تم تحديث الصورة بنجاح!");
            } catch (error) {
                console.error("Failed to update profile picture:", error);
                alert("فشل تحديث الصورة. يرجى المحاولة مرة أخرى.");
            }
        }
    });
}

// --- عرض المشاريع ---
function renderProjects(projects) {
    const projectsListContainer = document.querySelector('.projects-list');
    if (!projectsListContainer) return;

    projectsListContainer.innerHTML = '';

    if (!projects || projects.length === 0) {
        projectsListContainer.innerHTML = '<p>لا توجد مشاريع لعرضها. قم بإنشاء مشروع جديد!</p>';
        return;
    }

    projects.forEach(project => {
        const creationDate = project.createdAt ? 
            new Date(project.createdAt).toLocaleDateString('ar-EG') : 'غير محدد';

        const projectCardHTML = `
            <article class="project-card">
                <div class="project-header">
                    <h3 class="project-title">${project.title || 'مشروع بلا عنوان'}</h3>
                    <span class="project-status in-progress">${project.status || 'قيد التنفيذ'}</span>
                </div>
                <p class="project-description">${project.description || 'لا يوجد وصف لهذا المشروع.'}</p>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
                    </div>
                    <span class="progress-percent">${project.progress || 0}%</span>
                </div>
                <div class="project-meta">
                    <span class="project-deadline">
                        <i class="fas fa-calendar-alt"></i> ${creationDate}
                    </span>
                </div>
            </article>`;
        projectsListContainer.insertAdjacentHTML('beforeend', projectCardHTML);
    });
}

// --- دالة Loader (اختياري) ---
function showLoadingState(isLoading) {
    const loader = document.getElementById('loading');
    if (!loader) return;
    loader.style.display = isLoading ? 'flex' : 'none';
}
