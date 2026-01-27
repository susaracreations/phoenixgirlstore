// js/loader.js
document.addEventListener('DOMContentLoaded', () => {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const mainContent = document.getElementById('main-content');
    
    // If the loader doesn't exist, don't run the script
    if (!loaderWrapper || !mainContent) return;

    // Simple timeout to simulate loading or wait for resources
    setTimeout(() => {
        // Fade out loader and show content
        loaderWrapper.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('fade-in');
    }, 1000); // 1 second delay
});