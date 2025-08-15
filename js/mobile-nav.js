document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const body = document.body;

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // منع انتشار الحدث
            // تبديل الكلاس على الزر لتغيير الأيقونة (فتح/إغلاق)
            mobileNavToggle.classList.toggle('active');
            // تبديل الكلاس على body لإظهار/إخفاء القائمة ومنع التمرير في الخلفية
            body.classList.toggle('mobile-nav-active');
        });
    }
});