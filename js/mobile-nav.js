document.addEventListener('DOMContentLoaded', function() {
    const mobileNavToggle = document.querySelector('[data-mobile-nav-toggle]');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (mobileNavToggle && sidebar && mainContent) {
        mobileNavToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('shifted');
        });
    }
});
