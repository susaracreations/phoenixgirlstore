// js/user-auth.js

/**
 * Updates the header UI based on the user's authentication state.
 * This function should be called on every page that has the user-auth-section.
 */
function updateUserNav() {
    const userAuthSection = document.getElementById('user-auth-section');
    if (!userAuthSection) return;

    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            userAuthSection.innerHTML = `
                <span>Welcome, ${user.email.split('@')[0]}</span>
                <a href="#" id="logout-link">Logout</a>
            `;
            const logoutLink = document.getElementById('logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut().then(() => {
                        // Redirect to home page after logout to refresh state
                        window.location.href = '/';
                    }).catch(error => {
                        console.error("Logout Error:", error);
                    });
                });
            }
        } else {
            // User is signed out
            userAuthSection.innerHTML = '<a href="/login.html">Login / Sign Up</a>';
        }
    });
}

/**
 * Initializes the logic for the login/signup page.
 */
function initializeAuthPage() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authError = document.getElementById('auth-error');
    const toggleLink = document.getElementById('toggle-link');
    const toggleText = document.getElementById('toggle-text');
    const authTitle = document.getElementById('auth-title');

    // Toggle between Login and Sign Up views
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.toggle('hidden');
        signupForm.classList.toggle('hidden');

        if (signupForm.classList.contains('hidden')) {
            authTitle.textContent = 'Login';
            toggleText.textContent = "Don't have an account?";
            toggleLink.textContent = 'Sign Up';
        } else {
            authTitle.textContent = 'Sign Up';
            toggleText.textContent = 'Already have an account?';
            toggleLink.textContent = 'Login';
        }
    });

    // Handle Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = '/'; // Redirect to homepage on successful login
            })
            .catch(error => {
                authError.textContent = error.message;
            });
    });

    // Handle Sign Up
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = '/'; // Redirect to homepage on successful signup
            })
            .catch(error => {
                authError.textContent = error.message;
            });
    });
}

// Check which page we are on and run the appropriate function
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('auth-page')) {
        initializeAuthPage();
    } else {
        updateUserNav();
    }
});