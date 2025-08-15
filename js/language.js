// // إعدادات اللغة
// let currentLanguage = 'ar';

// // تحميل ملف اللغة
// async function loadLanguage(lang) {
//     try {
//         const response = await fetch(`./lang/${lang}.json`);
//         return await response.json();
//     } catch (error) {
//         console.error('Error loading language file:', error);
//         return {};
//     }
// }

// // تطبيق الترجمة على العناصر
// function applyTranslations(translations) {
//     document.querySelectorAll('[data-translate]').forEach(element => {
//         const key = element.getAttribute('data-translate');
//         if (translations[key]) {
//             if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
//                 element.setAttribute('placeholder', translations[key]);
//             } else {
//                 element.textContent = translations[key];
//             }
//         }
//     });
    
//     // تغيير عنوان الصفحة
//     if (translations['title']) {
//         document.title = translations['title'];
//     }
// }

// // تغيير اللغة
// async function changeLanguage(lang) {
//     currentLanguage = lang;
//     const translations = await loadLanguage(lang);
//     applyTranslations(translations);
    
//     // تغيير اتجاه الصفحة
//     document.documentElement.lang = lang;
//     document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
//     // حفظ اللغة المفضلة
//     localStorage.setItem('language', lang);
    
//     // تحديث حالة الأزرار النشطة
//     document.querySelectorAll('.language-switcher button').forEach(button => {
//         button.classList.remove('active');
//         // تحقق من أن السمة onclick تحتوي على اللغة المحددة
//         if (button.getAttribute('onclick').includes(`'${lang}'`)) {
//             button.classList.add('active');
//         }
//     });
// }

// // تحميل اللغة عند بدء التشغيل
// document.addEventListener('DOMContentLoaded', async () => {
//     const savedLanguage = localStorage.getItem('language') || 'ar';
//     await changeLanguage(savedLanguage);
// });
let translations = {};

// اللغة الافتراضية
let currentLang = localStorage.getItem('lang') || 'ar';

// تحميل ملف JSON للغة المطلوبة
async function loadLanguage(lang) {
    try {
        const response = await fetch(`./lang/${lang}.json`);
        translations = await response.json();
        currentLang = lang;
        localStorage.setItem('lang', lang);
        updateTexts();
    } catch (error) {
        console.error('Failed to load language file:', error);
    }
}

// تحديث جميع العناصر في الصفحة بناءً على الترجمة
function updateTexts() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
}

// تبديل اللغة
function changeLanguage(lang) {
    if(lang !== currentLang) {
        loadLanguage(lang);
    }
}

// تحميل اللغة عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadLanguage(currentLang);
});
