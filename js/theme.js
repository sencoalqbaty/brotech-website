document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
 
    /**
     * Applies the theme (dark/light) to the body.
     * It checks localStorage first, then system preference.
     * Also sets the toggle switch to the correct state if it exists.
     */
    const applyTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark);

        // تطبيق الكلاس على الـ body
        body.classList.toggle('dark-theme', isDarkMode);
        
        // تعيين حالة المفتاح فقط إذا كان موجودًا
        if (themeToggle) {
            themeToggle.checked = isDarkMode;
        }
    };

    /**
     * Toggles the theme between dark and light and saves the preference.
     * Triggered by the 'change' event on the checkbox.
     */
    const toggleTheme = () => {
        if (!themeToggle) return; // Safety check
        const isDarkMode = themeToggle.checked;
        body.classList.toggle('dark-theme', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    };

    // Attach event listener to the theme toggle switch only if it exists.
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }

    // Apply the correct theme on initial page load, always.
    applyTheme();
});