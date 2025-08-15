import { db, storage } from './firebase-config.js';
import { ref, set, get, update, push, query, orderByChild, equalTo, serverTimestamp, limitToLast } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

/**
 * يضيف بيانات المستخدم عند التسجيل لأول مرة في Realtime Database.
 * @param {string} userId - معرف المستخدم (uid).
 * @param {object} userData - البيانات المراد حفظها (مثل الاسم، البريد الإلكتروني).
 * @returns {Promise<void>}
 */
export const addUserProfile = async (userId, userData) => {
    try {
        // نستخدم `set` لإنشاء مسار جديد للمستخدم في قاعدة البيانات
        await set(ref(db, 'users/' + userId), {
            ...userData,
            // استخدام الطابع الزمني الرقمي لتسهيل الفرز
            createdAt: userData.createdAt || Date.now() 
        });
        console.log("User profile created in Realtime Database for user:", userId);
    } catch (error) {
        console.error("Error adding user profile to Realtime Database: ", error);
        throw error; // إعادة رمي الخطأ للتعامل معه في المكان الذي تم استدعاء الدالة فيه
    }
};

/**
 * يجلب بيانات ملف المستخدم من Firestore.
 * @param {string} userId - معرف المستخدم (uid).
 * @returns {Promise<object|null>} بيانات المستخدم أو null إذا لم يتم العثور عليها.
 */
export const getUserProfile = async (userId) => {
    try {
        const userRef = ref(db, 'users/' + userId);
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error getting user profile from Realtime Database: ", error);
        return null;
    }
};

/**
 * يحدّث بيانات ملف المستخدم في Firestore.
 * @param {string} userId - معرف المستخدم (uid).
 * @param {object} dataToUpdate - الكائن الذي يحتوي على الحقول المراد تحديثها.
 * @returns {Promise<void>}
 */
export const updateUserProfileData = async (userId, dataToUpdate) => {
    try {
        const userRef = ref(db, 'users/' + userId);
        await update(userRef, dataToUpdate);
        console.log("User profile updated in Realtime Database.");
    } catch (error) {
        console.error("Error updating user profile in Realtime Database: ", error);
        throw error;
    }
};

/**
 * يجلب إحصائيات لوحة التحكم.
 * @param {string} userId - معرف المستخدم لجلب المشاريع الخاصة به.
 * @returns {Promise<object>} كائن يحتوي على الإحصائيات.
 */
export const getDashboardStats = async (userId) => {
    try {
        const projectsRef = ref(db, 'projects');
        const usersRef = ref(db, 'users');

        // جلب عدد المشاريع الخاصة بالمستخدم
        const projectsQuery = query(projectsRef, orderByChild('ownerId'), equalTo(userId));
        const projectSnapshot = await get(projectsQuery);
        const totalProjects = projectSnapshot.exists() ? projectSnapshot.size : 0;

        // جلب العدد الإجمالي للمستخدمين
        const userSnapshot = await get(usersRef);
        const activeClients = userSnapshot.exists() ? userSnapshot.size : 0;

        // بيانات وهمية مؤقتًا
        const completedTasks = 25; 
        const revenue = '$5,400';

        return { totalProjects, activeClients, completedTasks, revenue };
    } catch (error) {
        console.error("Error fetching dashboard stats: ", error);
        return { totalProjects: 0, activeClients: 0, completedTasks: 0, revenue: '$0' };
    }
};

/**
 * يجلب أحدث المستخدمين المسجلين.
 * @param {number} limit - عدد المستخدمين المراد جلبه.
 * @returns {Promise<Array<object>>} مصفوفة من كائنات المستخدمين.
 */
export const getRecentUsers = async (limit = 3) => {
    try {
        const usersRef = ref(db, 'users');
        const q = query(usersRef, orderByChild('createdAt'), limitToLast(limit));
        const snapshot = await get(q);
        const users = [];
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => users.push({ id: childSnapshot.key, ...childSnapshot.val() }));
        }
        return users.reverse(); // عكس الترتيب لعرض الأحدث أولاً
    } catch (error) {
        console.error("Error fetching recent users: ", error);
        return [];
    }
};

/**
 * ينشئ مشروعًا جديدًا في Realtime Database.
 * @param {object} projectData - بيانات المشروع (مثل العنوان والوصف).
 * @param {string} userId - معرف المستخدم المالك للمشروع.
 * @returns {Promise<string>} معرف المشروع الجديد.
 */
export const createProject = async (projectData, userId) => {
    try {
        const projectsRef = ref(db, 'projects');
        const newProjectRef = push(projectsRef); // إنشاء معرف فريد للمشروع
        const newProjectData = {
            ...projectData,
            ownerId: userId,
            createdAt: serverTimestamp(), // استخدم وقت الخادم لضمان التناسق
            status: 'in-progress' // قيمة افتراضية
        };
        await set(newProjectRef, newProjectData);
        console.log("Project created with ID: ", newProjectRef.key);
        return newProjectRef.key;
    } catch (error) {
        console.error("Error creating project: ", error);
        throw error;
    }
};

/**
 * يجلب قائمة المشاريع التي يملكها مستخدم معين من Realtime Database.
 * @param {string} userId - معرف المستخدم.
 * @returns {Promise<Array<object>>} مصفوفة من كائنات المشاريع.
 */
export const getProjectsForUser = async (userId) => {
    try {
        const projectsRef = ref(db, 'projects');
        const q = query(projectsRef, orderByChild('ownerId'), equalTo(userId));
        const snapshot = await get(q);
        const projects = [];
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                projects.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
        }
        return projects;
    } catch (error) {
        console.error("Error fetching projects: ", error);
        return []; // إرجاع مصفوفة فارغة في حالة الخطأ
    }
};

/**
 * يرفع صورة ملف شخصي للمستخدم إلى Cloud Storage.
 * @param {string} userId - معرف المستخدم (uid).
 * @param {File} file - ملف الصورة المراد رفعه.
 * @returns {Promise<string>} رابط التحميل للصورة المرفوعة.
 */
export const uploadProfileImage = async (userId, file) => {
    try {
        const filePath = `profileImages/${userId}/${file.name}`
        const imageRef = storageRef(storage, filePath);
        await uploadBytes(imageRef, file);
        return await getDownloadURL(imageRef);
    } catch (error) {
        console.error("Error uploading profile image: ", error);
        throw error;
    }
};

/**
 * يحفظ رسالة اتصل بنا في Realtime Database.
 * @param {object} messageData - بيانات الرسالة (name, email, message).
 * @returns {Promise<void>}
 */
export const saveContactMessage = async (messageData) => {
    try {
        const messagesRef = ref(db, 'contactMessages');
        const newMessageRef = push(messagesRef); // إنشاء معرف فريد للرسالة
        await set(newMessageRef, {
            ...messageData,
            createdAt: serverTimestamp() // إضافة وقت الإرسال من الخادم
        });
    } catch (error) {
        console.error("Error saving contact message: ", error);
        throw error;
    }
};