// This file is responsible for fetching and displaying dynamic data on the dashboard.

// Assuming firebase is initialized in firebase-config.js and app is exported
import { app, auth } from './firebase-config.js'; 
import { getDatabase, ref, query, orderByChild, limitToLast, get, getCountFromServer } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const db = getDatabase(app);

/**
 * Fetches the newest users from the Firebase database and populates the list.
 */
async function loadNewestUsers() {
    const usersListEl = document.getElementById('new-users-list');
    if (!usersListEl) {
        console.error("Dashboard element #new-users-list not found.");
        return;
    }

    try {
        const usersRef = ref(db, 'users');
        // Query to get the last 5 created users. Assumes a 'createdAt' timestamp field.
        const newestUsersQuery = query(usersRef, orderByChild('createdAt'), limitToLast(5));
        
        const snapshot = await get(newestUsersQuery);

        if (snapshot.exists()) {
            usersListEl.innerHTML = ''; // Clear any placeholder content
            const users = [];
            snapshot.forEach(childSnapshot => {
                // Add user to the beginning of the array to reverse the order (newest first)
                users.unshift({ id: childSnapshot.key, ...childSnapshot.val() });
            });

            users.forEach(user => {
                const userItem = document.createElement('li');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <div class="user-avatar">
                        <img src="${user.avatarUrl || './images/avatar.png'}" alt="${user.name || 'User Avatar'}">
                    </div>
                    <div class="user-info">
                        <span class="user-name">${user.name || 'New User'}</span>
                        <span class="user-role">${user.email || 'No email provided'}</span>
                    </div>
                `;
                usersListEl.appendChild(userItem);
            });
        } else {
            usersListEl.innerHTML = `<li><p data-translate="no_new_users">No new users found.</p></li>`;
        }
    } catch (error) {
        console.error("Error loading newest users:", error);
        usersListEl.innerHTML = `<li><p>Error loading users. See console for details.</p></li>`;
    }
}

/**
 * Loads recent projects for the dashboard
 * TODO: Implement actual data fetching.
 */
async function loadRecentProjects() {
    const projectsListEl = document.getElementById('recent-projects-list');
    if (!projectsListEl) {
        console.error("Dashboard element #recent-projects-list not found.");
        return;
    }

    try {
        const projectsRef = ref(db, 'projects');
        // Query to get the last 5 created projects. Assumes a 'createdAt' timestamp field.
        const recentProjectsQuery = query(projectsRef, orderByChild('createdAt'), limitToLast(5));

        const snapshot = await get(recentProjectsQuery);

        if (snapshot.exists()) {
            projectsListEl.innerHTML = ''; // Clear any placeholder content
            const projects = [];
            snapshot.forEach(childSnapshot => {
                // Add project to the beginning of the array to reverse the order (newest first)
                projects.unshift({ id: childSnapshot.key, ...childSnapshot.val() });
            });

            projects.forEach(project => {
                const projectItem = document.createElement('li');
                projectItem.className = 'project-item'; // Use a class for styling
                const creationDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString('ar-EG') : 'غير محدد';

                projectItem.innerHTML = `
                    <div class="project-header">
                        <h3 class="project-title">${project.name || 'مشروع بلا عنوان'}</h3>
                        <span class="project-status ${project.status || ''}">${project.status || 'غير معروف'}</span>
                    </div>
                    <p class="project-description">${project.description || 'لا يوجد وصف لهذا المشروع.'}</p>
                    <div class="project-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${creationDate}</span>
                    </div>
                `;
                projectsListEl.appendChild(projectItem);
            });
        } else {
            projectsListEl.innerHTML = `<li><p data-translate="no_new_projects">No new projects found.</p></li>`;
        }
    } catch (error) {
        console.error("Error loading recent projects:", error);
        projectsListEl.innerHTML = `<li><p>Error loading projects. See console for details.</p></li>`;
    }
}

/**
 * Fetches and displays statistics for the dashboard.
 */
async function loadDashboardStats() {
    try {
        const projectsRef = ref(db, 'projects');
        const usersRef = ref(db, 'users');

        const projectsSnapshot = await getCountFromServer(projectsRef);
        const usersSnapshot = await getCountFromServer(usersRef);

        document.getElementById('stats-total-projects').textContent = projectsSnapshot.val();
        document.getElementById('stats-active-clients').textContent = usersSnapshot.val();
        // Placeholder for other stats
        document.getElementById('stats-completed-tasks').textContent = '0'; // Needs logic
        document.getElementById('stats-revenue').textContent = '$0'; // Needs logic

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
    }
}

/**
 * Displays a welcome message to the user.
 * @param {object} user - The Firebase user object.
 */
function displayWelcomeMessage(user) {
    const welcomeEl = document.getElementById('welcome-message');
    if (welcomeEl) {
        const displayName = user.displayName || user.email.split('@')[0];
        welcomeEl.textContent = `مرحباً بعودتك، ${displayName}!`;
    }
}

/**
 * Manages the visibility of the loading spinner.
 * @param {boolean} isLoading - True to show the spinner, false to hide it.
 */
const manageLoadingState = (isLoading) => {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.style.display = isLoading ? 'flex' : 'none';
    }
};

/**
 * Initializes the dashboard by loading all necessary data.
 * @param {object} user - The authenticated Firebase user.
 */
function initDashboard(user) {
    manageLoadingState(true);
    displayWelcomeMessage(user);
    Promise.all([
        loadDashboardStats(),
        loadNewestUsers(),
        loadRecentProjects()
    ]).finally(() => {
        manageLoadingState(false);
    });
}

// --- Main Execution ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        initDashboard(user);
    }
    // The auth guard in main.js handles the 'else' case (redirecting).
});