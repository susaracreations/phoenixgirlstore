// js/favicon-loader.js

/**
 * Fetches the favicon URL from Firestore and dynamically adds it to the document head.
 */
function loadFavicon() {
    const settingsRef = db.collection('site_settings').doc('homepage');

    settingsRef.get().then(doc => {
        if (doc.exists && doc.data().faviconUrl) {
            const faviconUrl = doc.data().faviconUrl;
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = faviconUrl;
            document.head.appendChild(link);
        }
    }).catch(error => console.error("Error fetching favicon:", error));
}

loadFavicon();