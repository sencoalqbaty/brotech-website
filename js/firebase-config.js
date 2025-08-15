// تكوين Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyDdi5h-fQO6Hm3KjilwkwdXP6sUPNWWxgs",
  authDomain: "brotech-189ea.firebaseapp.com",
  projectId: "brotech-189ea",
  storageBucket: "brotech-189ea.firebasestorage.app",
  messagingSenderId: "600356738998",
  appId: "1:600356738998:web:4822a95c8747b07a1dd317",
  measurementId: "G-FLFRFXVX2Z"
};

// إعدادات التطبيق
export const appSettings = {
  appName: "BroTech",
  defaultLanguage: "ar",
  supportedLanguages: ["ar", "en"],
  authRedirect: {
    login: "/dashboard.html",
    logout: "/index.html",
    register: "/dashboard.html"
  }
};