// js/product.js
document.addEventListener('DOMContentLoaded', () => {
    const productDetailPage = document.getElementById('product-detail-page');

    // Get product ID from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        productDetailPage.innerHTML = '<p class="error-message">Product not found. Please return to the homepage.</p>';
        return;
    }

    // Fetch the specific product from Firestore
    const docRef = db.collection('products').doc(productId);

    // Fetch only product data (removed unnecessary settings fetch to improve stability)
    docRef.get().then((doc) => {
        if (doc.exists) {
            const product = doc.data();
            // We don't need settings for display, passing empty object just in case
            displayProduct(product, {});
            document.title = `${product.name} - Phoenix Girl`; // Update page title
        } else {
            productDetailPage.innerHTML = '<p class="error-message">Sorry, this product could not be found.</p>';
        }
    }).catch(error => {
        console.error("Error fetching page data:", error);
        productDetailPage.innerHTML = '<p class="error-message">There was an error loading this product. Please try again later.</p>';
    });

    function displayProduct(product, settings) {
        const isFree = !product.price || product.price <= 0;
        const priceDisplay = isFree ? 'Free' : `LKR ${product.price.toFixed(2)}`;

        let buttonHtml;
        if (isFree) {
            // Use a button with a data attribute for the download logic, not a direct link
            buttonHtml = `<button id="download-btn" class="cta-button" data-download-url="${product.downloadUrl}"><span class="material-icons-outlined">download</span> Download Now</button>`;
        } else {
            buttonHtml = `<a href="checkout.html?id=${productId}" class="cta-button"><span class="material-icons-outlined">shopping_cart</span> Buy Now</a>`;
        }

        const productHtml = `
            <div class="product-detail-layout">
                <div class="product-image-gallery">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-main-image">
                </div>
                <div class="product-info-panel">
                    <h1 class="product-title">${product.name}</h1>
                    <p class="product-price">${priceDisplay}</p>
                    <div class="product-description">
                        <h2>About this mod</h2>
                        <p>${(product.description || 'No description available.').replace(/\n/g, '<br>')}</p>
                    </div>
                    <div class="product-actions">
                        ${buttonHtml}
                    </div>
                </div>
            </div>
        `;
        productDetailPage.innerHTML = productHtml;

        // Add event listener for the download button if it exists
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                downloadBtn.textContent = 'Processing...';
                downloadBtn.disabled = true;

                // Atomically increment the downloadCount field
                docRef.update({
                    downloadCount: firebase.firestore.FieldValue.increment(1)
                }).then(() => {
                    console.log(`Download count for ${productId} incremented.`);
                }).catch(error => {
                    console.error("Error updating download count:", error);
                }).finally(() => {
                    // Proceed with download regardless of count success
                    window.open(downloadBtn.dataset.downloadUrl, '_blank');
                    // Re-enable button after a short delay
                    setTimeout(() => {
                        downloadBtn.innerHTML = `<span class="material-icons-outlined">download</span> Download Now`;
                        downloadBtn.disabled = false;
                    }, 2000);
                });
            });
        }
    }
});
