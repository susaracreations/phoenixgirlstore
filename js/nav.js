// js/nav.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Footer Links Logic ---
    const discordLink = document.getElementById('footer-discord-link');
    const youtubeLink = document.getElementById('footer-youtube-link');

    // Only fetch if the elements exist
    if (discordLink || youtubeLink) {
        // Use onSnapshot to load from cache instantly if available
        db.collection('site_settings').doc('homepage').onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (discordLink && data.discordUrl) discordLink.href = data.discordUrl;
                if (youtubeLink && data.youtubeUrl) youtubeLink.href = data.youtubeUrl;
            }
        }, error => {
            console.error("Error fetching footer links:", error);
        });
    }
});