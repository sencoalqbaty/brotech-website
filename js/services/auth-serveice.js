import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase/auth.js";
import { addUser } from "./user-service.js";
import { showMessage, redirectTo } from "./ui-service.js";
import { translateAuthError } from "../utils/helpers.js";

export const authService = {
  // تسجيل مستخدم جديد
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // إضافة بيانات المستخدم الإضافية
      await addUser(userCredential.user.uid, {
        ...userData,
        email: email,
        createdAt: new Date().toISOString(),
        emailVerified: false
      });
      
      // إرسال بريد التحقق
      await sendEmailVerification(userCredential.user);
      
      return {
        success: true,
        message: 'تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني'
      };
    } catch (error) {
      return {
        success: false,
        message: translateAuthError(error.code)
      };
    }
  },

  // تسجيل الدخول
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await this.logout();
        return {
          success: false,
          message: 'الرجاء تفعيل حسابك عن طريق الرابط الذي تم إرساله إلى بريدك الإلكتروني'
        };
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return {
        success: false,
        message: translateAuthError(error.code)
      };
    }
  },

  // تسجيل الخروج
  async logout() {
    try {
      await signOut(auth);
      return { success: true, message: 'تم تسجيل الخروج بنجاح' };
    } catch (error) {
      return {
        success: false,
        message: 'حدث خطأ أثناء تسجيل الخروج: ' + error.message
      };
    }
  },

  // إعادة تعيين كلمة المرور
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
      };
    } catch (error) {
      return {
        success: false,
        message: translateAuthError(error.code)
      };
    }
  },

  // مراقبة حالة المصادقة
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
};