// admin/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const loginError = document.getElementById('login-error');

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    // After login, check if the user is an admin
                    const adminDocRef = db.collection('admins').doc(user.uid);
                    const adminDoc = await adminDocRef.get();

                    if (adminDoc.exists) {
                        // User is an admin, proceed to dashboard
                        window.location.href = 'dashboard.html';
                    } else {
                        // Not an admin, sign them out and show an error
                        await auth.signOut();
                        loginError.textContent = 'You do not have permission to access this page.';
                    }
                })
                .catch((error) => {
                    loginError.textContent = error.message;
                    console.error('Login Error:', error.code, error.message);
                });
        });
    }

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut().then(() => {
                window.location.href = 'admin-login.html';
            }).catch((error) => {
                console.error('Logout Error:', error);
            });
        });
    }

    // Protect Dashboard Page
    // If we are not on the login page, check for authentication
    if (window.location.pathname.includes('dashboard.html')) {
        auth.onAuthStateChanged(async (user) => {
            if (!user) {
                // If no user is logged in, redirect to the login page
                window.location.href = 'admin-login.html';
            } else {
                // If a user is logged in, verify they are an admin
                const adminDocRef = db.collection('admins').doc(user.uid);
                const adminDoc = await adminDocRef.get();

                if (!adminDoc.exists) {
                    // This user is not an admin, kick them out
                    await auth.signOut();
                    window.location.href = 'admin-login.html';
                }
            }
        });
    }
});
