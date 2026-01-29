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
            // User is signed in, update UI and localStorage flag
            localStorage.setItem('isLoggedIn', 'true');
            userAuthSection.innerHTML = `<a href="#" id="logout-btn" class="login-btn-shared" style="background: #333;">Logout</a>`;
            
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut().then(() => {
                        // onAuthStateChanged will handle the UI update.
                        // We just need to redirect.
                        window.location.href = '/'; 
                    }).catch(error => {
                        console.error("Logout Error:", error);
                    });
                });
            }
        } else {
            // User is signed out, update UI and remove localStorage flag
            localStorage.removeItem('isLoggedIn');
            userAuthSection.innerHTML = '<a href="/login.html" class="login-btn-shared">Login</a>';
        }
    });
}

// Make this function globally available so header-component can call it
window.updateUserNav = updateUserNav;

/**
 * Initializes the logic for the login/signup page.
 */
function initializeAuthPage() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authError = document.getElementById('auth-error');
    const toggleLink = document.getElementById('toggle-link');
    const toggleText = document.getElementById('toggle-text');
    const googleSignInBtn = document.getElementById('google-signin-btn');
    const googleMobileMsg = document.getElementById('google-mobile-msg');
    const authTitle = document.getElementById('auth-title');

    // Listen for auth state changes to handle successful login/redirect
    auth.onAuthStateChanged(user => {
        if (user) {
            window.location.href = 'index.html';
        }
    });

    // Ensure default state: Login visible, Signup hidden
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');

    // Toggle between Login and Sign Up views
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Clear any previous error messages
        if (authError) authError.textContent = '';

        // Check if Login is currently visible
        const isLoginVisible = !loginForm.classList.contains('hidden');

        if (isLoginVisible) {
            // Switch to Sign Up
            loginForm.classList.add('hidden');
            loginForm.classList.remove('form-enter');
            loginForm.reset(); // Reset Login inputs

            signupForm.classList.remove('hidden');
            signupForm.classList.add('form-enter');
            signupForm.reset(); // Reset Signup inputs (clear previous attempts)

            authTitle.textContent = 'Sign Up';
            toggleText.textContent = 'Already have an account?';
            toggleLink.textContent = 'Login';
        } else {
            // Switch to Login
            signupForm.classList.add('hidden');
            signupForm.classList.remove('form-enter');
            signupForm.reset(); // Reset Signup inputs

            loginForm.classList.remove('hidden');
            loginForm.classList.add('form-enter');
            loginForm.reset(); // Reset Login inputs

            authTitle.textContent = 'Login';
            toggleText.textContent = "Don't have an account?";
            toggleLink.textContent = 'Sign Up';
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

    // Handle Google Sign-In
    if (googleSignInBtn) {
        // Hide Google Sign-In on mobile/tablet devices (width < 1024px)
        if (window.innerWidth < 1024) {
            googleSignInBtn.style.display = 'none';
            if (googleMobileMsg) googleMobileMsg.style.display = 'block';
        }

        googleSignInBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            // Set persistence to LOCAL to fix sessionStorage errors on mobile
            auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    return auth.signInWithPopup(provider);
                })
                .then((result) => {
                    window.location.href = 'home.html';
                })
                .catch((error) => {
                    authError.textContent = error.message;
                });
        });
    }
}

// Check which page we are on and run the appropriate function
document.addEventListener('DOMContentLoaded', () => {
    // Always update the nav to ensure header consistency across all pages
    updateUserNav();

    if (document.body.classList.contains('auth-page')) {
        initializeAuthPage();
    }
});