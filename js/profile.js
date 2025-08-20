


import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const avatarUploadInput = document.getElementById('avatar-upload');
    const profileAvatarImg = document.getElementById('profile-avatar-img');
    const headerAvatarImg = document.getElementById('header-avatar');
    const mainContent = document.querySelector('.dashboard-content'); // Main content area
    const loadingSpinner = document.getElementById('loading');

    let currentUser = null; // To store the current authenticated user

    // Hide the main content initially to prevent a flash of un-styled content
    if (mainContent) {
        mainContent.style.visibility = 'hidden';
    }

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadUserProfile(user.uid);
        } else {
            // User is signed out
            console.log("No user signed in. Redirecting to login.");
            window.location.replace('./pages/auth/login.html'); // Use replace to avoid back button issues
        }
    });

    // Function to show loading spinner
    const showLoading = () => {
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
    };

    // Function to hide loading spinner
    const hideLoading = () => {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    };

    // Load user profile data
    const loadUserProfile = async (uid) => {
        showLoading();
        try {
            const userRef = ref(db, 'users/' + uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userPhoto = userData.photoURL || './images/avatar.png'; // Default avatar

                // Populate header and profile card names
                document.getElementById('user-profile-name').textContent = userData.fullName || 'User Name';
                document.getElementById('profile-main-name').textContent = userData.fullName || 'User Name';
                document.getElementById('profile-role').textContent = userData.role || 'User Role';

                // Populate avatars
                if (profileAvatarImg) profileAvatarImg.src = userPhoto;
                if (headerAvatarImg) headerAvatarImg.src = userPhoto;

                // Populate form fields
                document.getElementById('profile-full-name').value = userData.fullName || '';
                document.getElementById('profile-email').value = userData.email || '';
                document.getElementById('profile-phone').value = userData.phone || '';
                document.getElementById('profile-address').value = userData.address || '';
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
        } finally {
            hideLoading();
            // Show the content now that it's populated
            if (mainContent) mainContent.style.visibility = 'visible';
          }
    };

    // --- Profile Form Submission Handler ---
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('You must be logged in to update your profile.');
                return;
            }

            showLoading();

            const fullName = document.getElementById('profile-full-name').value;
            const phone = document.getElementById('profile-phone').value;
            const address = document.getElementById('profile-address').value;

            try {
                // 1. Update Realtime Database with additional info
                const userDbRef = ref(db, 'users/' + currentUser.uid);
                await update(userDbRef, {
                    fullName: fullName,
                    phone: phone,
                    address: address
                });

                // 2. Update Firebase Auth display name if it has changed
                if (currentUser.displayName !== fullName) {
                    await updateProfile(currentUser, { displayName: fullName });
                }

                alert('Profile updated successfully!');
                loadUserProfile(currentUser.uid); // Reload profile to show updated info
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile. Please try again.');
            } finally {
                hideLoading();
            }
        });
    }
});