// js/nav.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.querySelector('.main-nav');
    const headerRight = document.querySelector('.header-right');

    if (menuToggle && headerRight) {
        menuToggle.addEventListener('click', () => {
            // Toggle a class on the header-right container to show/hide it
            headerRight.classList.toggle('mobile-active');
            // Add a class to body to prevent scrolling when menu is open
            document.body.classList.toggle('no-scroll');
        });
    }
});