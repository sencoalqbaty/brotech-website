import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

/**
 * Protects a page by checking the user's authentication state.
 * If the user is not logged in, they will be redirected to the login page.
 */
const protectPage = () => {
    onAuthStateChanged(auth, (user) => {
        // This check ensures we are on a page that needs protection.
        // It assumes that auth pages are in a subdirectory like '/pages/auth/'.
        const isAuthPage = window.location.pathname.includes('/auth/');

        if (!user && !isAuthPage) {
            // User is not logged in and is on a protected page.
            console.log("Auth Guard: No user signed in. Redirecting to login.");
            // Use window.location.replace to prevent the user from going "back"
            // to the protected page after logging in.
            // The path is relative from the root (e.g., dashboard.html).
            window.location.replace('pages/auth/login.html');
        }
    });
};

/**
 * Sets the 'active' class on the correct sidebar menu item based on the current page URL.
 * This function is intended for pages that include the main sidebar.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Run the page protection logic on every page that includes this script.
    protectPage();

    // Only run this script on pages with a sidebar
    if (!document.querySelector('.sidebar-nav')) {
        return;
    }

    // Get the current page filename (e.g., "dashboard.html")
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .menu-item a');
 
    // Remove 'active' from all menu items first to ensure only one is active
    sidebarLinks.forEach(link => {
        link.closest('.menu-item').classList.remove('active');
    });
 
    // Find the best match and add the 'active' class
    let bestMatch = null;
    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            bestMatch = link;
        }
    });
    if (bestMatch) {
        bestMatch.closest('.menu-item').classList.add('active');
    }
});