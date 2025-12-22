// js/products-all.js
document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');

    // --- Fetch all products from Firestore ---
    db.collection('products').orderBy('createdAt', 'desc').get().then((querySnapshot) => {
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
                        ${tag}
                        ${image}
                    </div>
                    <div class="product-card-content">
                        <h3 class="product-card-title">${product.name}</h3>
                        <div class="product-card-footer">
                            <span class="product-card-price">${priceDisplay}</span>
                        </div>
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