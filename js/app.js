// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');

    // --- Load Hero Image ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const mainHeroTitle = document.getElementById('main-hero-title-display');
        const mainHeroDescription = document.getElementById('main-hero-description-display');
        const secondaryHeroSection = document.querySelector('.secondary-hero');
        const secondaryHeroTitle = document.getElementById('secondary-hero-title-display');
        const secondaryHeroDescription = document.getElementById('secondary-hero-description-display');

        db.collection('site_settings').doc('homepage').get().then(settingsDoc => {
            if (settingsDoc.exists) {
                const settings = settingsDoc.data();
                // Main hero
                if (settings.heroImageUrl) {
                    heroSection.style.backgroundImage = `url('${settings.heroImageUrl}')`;
                }
                if (mainHeroTitle && settings.mainHeroTitle) {
                    mainHeroTitle.textContent = settings.mainHeroTitle;
                }
                if (mainHeroDescription && settings.mainHeroDescription) {
                    mainHeroDescription.textContent = settings.mainHeroDescription;
                }
                // Secondary hero
                if (secondaryHeroSection && settings.secondaryHeroImageUrl) {
                    secondaryHeroSection.style.backgroundImage = `url('${settings.secondaryHeroImageUrl}')`;
                }
                if (secondaryHeroTitle && settings.secondaryHeroTitle) {
                    secondaryHeroTitle.textContent = settings.secondaryHeroTitle;
                }
                if (secondaryHeroDescription && settings.secondaryHeroDescription) {
                    secondaryHeroDescription.textContent = settings.secondaryHeroDescription;
                }
            }
        }).catch(error => console.error("Error fetching hero image:", error));
    }


    // --- Fetch products from Firestore ---
    db.collection('products').orderBy('createdAt', 'desc').limit(4).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            productsGrid.innerHTML = '<p>No mods have been added yet. Check back soon!</p>';
            return;
        }

        let html = '';
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productId = doc.id;
            const isFree = product.price <= 0;
            const priceDisplay = isFree ? 'Free' : `LKR ${product.price.toFixed(2)}`;
            const tag = isFree ? '<div class="product-card-tag free-tag">Free</div>' : '<div class="product-card-tag paid-tag">Paid</div>';
            const image = product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" class="product-card-image">` : `<div class="product-card-image-placeholder"></div>`;

            html += `
                <a href="product.html?id=${productId}" class="product-card">
                    <div class="product-card-image-container">
                        ${image}
                        ${tag}
                        <div class="product-card-overlay">
                            <span class="overlay-text">View Details</span>
                        </div>
                    </div>
                    <div class="product-card-content">
                        <h3>${product.name}</h3>
                        <span class="product-card-price">${priceDisplay}</span>
                    </div>
                </a>
            `;
        });
        productsGrid.innerHTML = html;
    }).catch((error) => {
        console.error("Error fetching products: ", error);
        productsGrid.innerHTML = '<p>Could not load mods at this time. Please try again later.</p>';
    });
});
