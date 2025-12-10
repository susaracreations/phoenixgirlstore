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
            const image = product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" class="product-detail-image">` : '';

            productDetailContainer.innerHTML = `
                ${image}
                <h2>${product.name}</h2>
                <p>${product.description || 'No description available.'}</p>
                <div class="product-price">${priceDisplay}</div>
                <div id="action-button-container"></div>
            `;

            const buttonContainer = document.getElementById('action-button-container');

            if (isFree) {
                // Create a download button for free items
                const downloadBtn = document.createElement('button');
                downloadBtn.id = 'download-btn';
                downloadBtn.className = 'btn';
                downloadBtn.textContent = 'Download';
                downloadBtn.dataset.downloadUrl = product.downloadUrl;
                buttonContainer.appendChild(downloadBtn);

                // Add event listener to handle download and count increment
                downloadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    downloadBtn.textContent = 'Processing...';
                    downloadBtn.disabled = true;

                    // Atomically increment the downloadCount field
                    docRef.update({
                        downloadCount: firebase.firestore.FieldValue.increment(1)
                    }).then(() => {
                        console.log(`Download count for ${productId} incremented.`);
                        // Proceed with download after successful update
                        window.open(downloadBtn.dataset.downloadUrl, '_blank');
                    }).catch(error => {
                        console.error("Error updating download count:", error);
                        // Still allow download even if count fails
                        window.open(downloadBtn.dataset.downloadUrl, '_blank');
                    }).finally(() => {
                        // Re-enable button after a short delay
                        setTimeout(() => {
                            downloadBtn.textContent = 'Download';
                            downloadBtn.disabled = false;
                        }, 1500);
                    });
                });
            } else {
                // Create a "Buy on WhatsApp" button for paid items
                const message = encodeURIComponent(`Hello, I would like to purchase the "${product.name}" mod.`);
                const whatsappUrl = settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}?text=${message}` : '#';
                const buttonClass = settings.whatsappNumber ? 'btn whatsapp-btn' : 'btn';
                const buttonText = settings.whatsappNumber ? 'Buy on WhatsApp' : 'Contact to Purchase';
                buttonContainer.innerHTML = `<a href="${whatsappUrl}" target="_blank" class="${buttonClass}">${buttonText}</a>`;
            }
        } else {
            console.error("No such document!");
            productDetailContainer.innerHTML = '<h2>Product not found.</h2>';
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
        productDetailContainer.innerHTML = '<h2>Error loading product.</h2>';
    });
});
