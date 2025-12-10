// js/product.js
document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');

    // Get product ID from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        productDetailContainer.innerHTML = '<h2>Product not found.</h2><p>Please go back to the store and select a product.</p>';
        return;
    }

    // Fetch the specific product from Firestore
    const docRef = db.collection('products').doc(productId);

    // Fetch both product and site settings
    Promise.all([
        docRef.get(),
        db.collection('site_settings').doc('homepage').get()
    ]).then(([doc, settingsDoc]) => {
        if (doc.exists) {
            const product = doc.data();
            const settings = settingsDoc.exists ? settingsDoc.data() : {};
            const isFree = product.price <= 0;
            const priceDisplay = isFree ? 'Free' : `LKR ${product.price.toFixed(2)}`;
            let buttonText = isFree ? 'Download' : 'Buy on WhatsApp';
            let buttonClass = 'btn';
            let buttonAction = `window.open('${product.downloadUrl}', '_blank')`;
            const image = product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" class="product-detail-image">` : '';

            if (!isFree) {
                if (settings.whatsappNumber) {
                    const message = encodeURIComponent(`Hello, I would like to purchase the "${product.name}" mod.`);
                    buttonAction = `window.open('https://wa.me/${settings.whatsappNumber}?text=${message}', '_blank')`;
                    buttonClass += ' whatsapp-btn';
                } else {
                    buttonText = 'Contact to Purchase';
                    buttonAction = `alert('Please contact the store owner to purchase this item.')`;
                }
            }

            productDetailContainer.innerHTML = `
                ${image}
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="product-price">${priceDisplay}</div>
                <button onclick="${buttonAction}" class="${buttonClass}">${buttonText}</button>
            `;
        } else {
            console.error("No such document!");
            productDetailContainer.innerHTML = '<h2>Product not found.</h2>';
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
        productDetailContainer.innerHTML = '<h2>Error loading product.</h2>';
    });
});
