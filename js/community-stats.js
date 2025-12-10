// js/community-stats.js

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.getElementById('community-stats');
    const availableModsCountElem = document.getElementById('available-mods-count');
    const totalDownloadsCountElem = document.getElementById('total-downloads-count');

    if (!statsSection || !availableModsCountElem || !totalDownloadsCountElem) {
        console.error("Community stats elements not found on this page.");
        return;
    }

    const animateCount = (element, target) => {
        // Parse the current number from the element, removing commas. Default to 0 if not a number.
        let current = parseInt(element.textContent.replace(/,/g, ''), 10) || 0;

        // If the target is the same as the current value, do nothing.
        if (current === target) return;

        const difference = target - current;
        // Calculate a dynamic step to ensure animation completes in a reasonable time
        const step = Math.max(1, Math.ceil(Math.abs(difference) / 50));

        const interval = setInterval(() => {
            // Move towards the target
            current = (difference > 0) ? current + step : current - step;

            // Check if we've reached or passed the target
            if ((difference > 0 && current >= target) || (difference < 0 && current <= target)) {
                element.textContent = target.toLocaleString();
                clearInterval(interval);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 15); // A slightly faster animation speed for a smoother feel
    };

    const startStatsObserver = (entries, observer) => {
        entries.forEach(entry => {
            // Check if the stats section is intersecting (visible)
            if (entry.isIntersecting) {
                const db = firebase.firestore();

                // Listen for real-time updates on the products collection
                db.collection('products').onSnapshot(snapshot => {
                    const availableMods = snapshot.size;
                    let totalDownloads = 0;

                    snapshot.forEach(doc => {
                        const product = doc.data();
                        if (product.downloadCount && typeof product.downloadCount === 'number') {
                            totalDownloads += product.downloadCount;
                        }
                    });

                    // Update the HTML with a counting animation
                    animateCount(availableModsCountElem, availableMods);
                    animateCount(totalDownloadsCountElem, totalDownloads);

                }, err => {
                    console.error("Error fetching community stats: ", err);
                    availableModsCountElem.textContent = 'Error';
                    totalDownloadsCountElem.textContent = 'Error';
                });

                // Stop observing the element so the animation doesn't re-trigger
                observer.unobserve(statsSection);
            }
        });
    };

    // Create and start the Intersection Observer
    const observer = new IntersectionObserver(startStatsObserver, {
        root: null, // observes intersections relative to the viewport
        threshold: 0.1 // trigger when 10% of the element is visible
    });

    observer.observe(statsSection);
});