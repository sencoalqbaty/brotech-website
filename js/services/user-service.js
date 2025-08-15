import { db } from "../firebase/firestore.js";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const userService = {
  // إضافة مستخدم جديد
  async addUser(uid, userData) {
    try {
      await setDoc(doc(db, "users", uid), userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على بيانات المستخدم
  async getUser(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, message: 'المستخدم غير موجود' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // تحديث بيانات المستخدم
  async updateUser(uid, data) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, data);
      return { success: true, message: 'تم تحديث الملف الشخصي بنجاح' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};