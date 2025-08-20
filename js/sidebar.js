document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const layout = document.querySelector('.dashboard-layout');
    const toggleButton = document.querySelector('.sidebar-toggle-btn');

    if (!sidebar || !layout) {
        return;
    }

    // --- Mobile Sidebar Toggle ---
    if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Close mobile sidebar when clicking outside of it
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== toggleButton && !toggleButton.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    });

    // --- Desktop Hover/Collapsed State ---
    const setupDesktopHover = () => {
        if (window.innerWidth > 992) {
            sidebar.addEventListener('mouseenter', () => {
                document.body.classList.remove('sidebar-collapsed');
            });

            sidebar.addEventListener('mouseleave', () => {
                document.body.classList.add('sidebar-collapsed');
            });
            
            document.body.classList.add('sidebar-collapsed');
        } else {
             document.body.classList.remove('sidebar-collapsed');
        }
    };
    
    setupDesktopHover();
    window.addEventListener('resize', setupDesktopHover);
});