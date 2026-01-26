// js/loader.js
document.addEventListener('DOMContentLoaded', () => {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const mainContent = document.getElementById('main-content');
    
    // If the loader doesn't exist, don't run the script
    if (!loaderWrapper || !mainContent) return;

    const bar = document.getElementById('bar');
    const percentText = document.getElementById('percent');

    let progress = 0;

    const interval = setInterval(() => {
        progress += 2; // Adjust speed for 1.5s (1500ms / 50 steps = 30ms)
        if (progress <= 100) {
            bar.style.width = progress + '%';
            percentText.innerText = progress + '%';
        } else {
            clearInterval(interval);
            
            // Fade out loader and show content
            loaderWrapper.classList.add('fade-out');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('fade-in');
        }
    }, 30); 
});