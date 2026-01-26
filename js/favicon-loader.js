// js/favicon-loader.js

/**
 * Fetches the favicon URL from Firestore and dynamically adds it to the document head.
 */
function loadFavicon() {
    const settingsRef = db.collection('site_settings').doc('homepage');

    // Use onSnapshot instead of get() to use cache immediately
    settingsRef.onSnapshot(doc => {
        if (doc.exists && doc.data().faviconUrl) {
            const faviconUrl = doc.data().faviconUrl;
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = faviconUrl;
        }
    }, error => console.error("Error fetching favicon:", error));
}

loadFavicon();