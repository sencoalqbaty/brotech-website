// Import the functions you need from the Firebase SDK
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Import the initialized auth object from your config file
import { auth, db } from './firebase-config.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const authMessageEl = document.getElementById('auth-message');

    const showAuthMessage = (message, type = 'danger') => {
        if (!authMessageEl) return;
        authMessageEl.textContent = message;
        authMessageEl.className = `alert alert-${type}`; // Keep alert class
        authMessageEl.classList.remove('d-none');
    };

    const hideAuthMessage = () => {
        if (!authMessageEl) return;
        authMessageEl.classList.add('d-none');
        authMessageEl.textContent = '';
    };

    // --- Login Form Handler ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideAuthMessage();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                if (user.emailVerified) {
                    // Redirect to the dashboard on successful login
                    window.location.href = '../../dashboard.html';
                } else {
                    // User's email is not verified
                    showAuthMessage('Please verify your email before logging in. A new verification email has been sent.', 'warning');
                    await sendEmailVerification(user);
                    await auth.signOut(); // Sign out the user until they verify
                }
            } catch (error) {
                console.error('Login Error:', error);
                if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    showAuthMessage('Incorrect email or password. Please try again.');
                } else {
                    showAuthMessage(`Login failed: ${error.message}`);
                }
            }
        });
    }

    // --- Registration Form Handler ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideAuthMessage();

            const fullName = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                showAuthMessage("Passwords do not match!");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('User account created:', user);

                // Send verification email
                await sendEmailVerification(user);

                // Update user profile with full name
                await updateProfile(user, { displayName: fullName });

                // Save additional user data to Realtime Database
                await set(ref(db, 'users/' + user.uid), {
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    createdAt: new Date().toISOString(),
                    photoURL: user.photoURL || './images/avatar.png' // Default avatar
                });

                showAuthMessage('Registration successful! A verification email has been sent. Please check your inbox.', 'success');
                window.location.href = './login.html'; // Redirect to login page to wait for verification
            } catch (error) {
                console.error('Registration Error:', error);
                if (error.code === 'auth/email-already-in-use') {
                    showAuthMessage('This email address is already registered. Please use a different email or log in.');
                } else if (error.code === 'auth/weak-password') {
                    showAuthMessage('The password is too weak. Please choose a stronger password (at least 6 characters).');
                } else {
                    showAuthMessage(`Registration failed: ${error.message}`);
                }
            }
        });
    }

    // --- Google Sign-In Handler ---
    // This will work on both login.html and register.html
    const googleSignInButton = document.getElementById('google-signin-btn');
    if (googleSignInButton) {
        const originalGoogleButtonHtml = googleSignInButton.innerHTML;
        googleSignInButton.addEventListener('click', async () => {
            hideAuthMessage();
            const provider = new GoogleAuthProvider();

            googleSignInButton.disabled = true;
            googleSignInButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing in...';

            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                // Check if the user's profile already exists in our database
                const userRef = ref(db, 'users/' + user.uid);
                const snapshot = await get(userRef);

                if (!snapshot.exists()) {
                    console.log('Creating database entry for new or existing Google user:', user.uid);
                    // If no record exists, create one. This handles both brand new users
                    // and users who existed in Auth but not in our Realtime DB.
                    await set(userRef, {
                        fullName: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber || null, // Add for consistency
                        createdAt: new Date().toISOString(),
                        photoURL: user.photoURL || './images/avatar.png'
                    });
                }

                // Redirect to dashboard after successful sign-in/sign-up
                window.location.href = '../../dashboard.html';

            } catch (error) {
                console.error('Google Sign-In Error:', error);
                if (error.code === 'auth/popup-closed-by-user') {
                    // This is a common case, no need to show a scary error
                } else if (error.code === 'auth/account-exists-with-different-credential') {
                    showAuthMessage('An account already exists with this email address. Please sign in using the original method.');
                } else if (error.code === 'auth/unauthorized-domain') {
                  console.log('Attempted sign in from unauthorized domain')
                    showAuthMessage('This website domain is not authorized for sign-in. Please contact support.');

                } else {
                    showAuthMessage(`An error occurred during Google sign-in: ${error.message}`);
                }
            } finally {
                googleSignInButton.disabled = false;
                googleSignInButton.innerHTML = originalGoogleButtonHtml;
            }
        });
    }


    // --- Facebook Sign-In Handler (Placeholder) ---
    const facebookSignInButton = document.getElementById('facebook-signin-btn');
    if (facebookSignInButton) {
        facebookSignInButton.addEventListener('click', () => {
            alert('Facebook Sign-In is coming soon!');
            // When you are ready to implement, you can follow a similar pattern
            // to the Google Sign-In handler using `FacebookAuthProvider`.
        });
    }

    // --- Forgot Password Handler ---
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const resetPasswordModalEl = document.getElementById('resetPasswordModal');

    if (forgotPasswordLink && resetPasswordModalEl) {
        const resetPasswordModal = new bootstrap.Modal(resetPasswordModalEl);
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        const resetEmailInput = document.getElementById('reset-email');
        const resetMessageEl = document.getElementById('reset-message');
        const resetSubmitButton = document.getElementById('reset-submit-button');

        const showResetMessage = (message, type = 'danger') => {
            resetMessageEl.textContent = message;
            resetMessageEl.className = `alert alert-${type}`;
            resetMessageEl.style.display = 'block';
        };

        const hideResetMessage = () => {
            resetMessageEl.style.display = 'none';
            resetMessageEl.textContent = '';
        };

        // 1. Show the modal when the "Forgot Password" link is clicked
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideResetMessage();
            resetPasswordForm.reset();
            resetPasswordModal.show();
        });

        // 2. Handle the form submission inside the modal
        if (resetPasswordForm) {
            resetPasswordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = resetEmailInput.value;

                if (!email) {
                    showResetMessage('Please enter your email address.');
                    return;
                }

                hideResetMessage();
                resetSubmitButton.disabled = true;
                resetSubmitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

                try {
                    await sendPasswordResetEmail(auth, email);
                    showResetMessage('A password reset link has been sent to your email. Please check your inbox (and spam folder).', 'success');
                    resetPasswordForm.reset();
                } catch (error) {
                    console.error('Password Reset Error:', error);
                    if (error.code === 'auth/invalid-email') {
                        showResetMessage('The email address you entered is not valid.');
                    } else {
                        // For security, show a generic success message even if the email doesn't exist.
                        showResetMessage('If an account with that email exists, a password reset link has been sent.', 'success');
                    }
                } finally {
                    resetSubmitButton.disabled = false;
                    resetSubmitButton.innerHTML = 'إرسال رابط إعادة التعيين';
                }
            });
        }
    }
});