document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const summaryContainer = document.getElementById('checkout-product-summary');
    const checkoutForm = document.getElementById('checkout-form');

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    let currentProduct = null;
    let adminWhatsappNumber = '';

    // Fetch product and settings
    const productPromise = db.collection('products').doc(productId).get();
    const settingsPromise = db.collection('site_settings').doc('homepage').get();

    Promise.all([productPromise, settingsPromise]).then(([productDoc, settingsDoc]) => {
        if (!productDoc.exists) {
            summaryContainer.innerHTML = '<p class="error-message">Product not found.</p>';
            return;
        }

        currentProduct = productDoc.data();
        
        if (settingsDoc.exists) {
            // Number eken symbol ain karala clean karagannawa
            const rawNumber = settingsDoc.data().whatsappNumber || '';
            adminWhatsappNumber = rawNumber.replace(/[^0-9]/g, ''); 
        }

        // Price eka number ekak nemei nam convert karagannawa
        const displayPrice = Number(currentProduct.price) || 0;

        // Render Summary
        summaryContainer.innerHTML = `
            <div class="summary-card">
                <img src="${currentProduct.imageUrl}" alt="${currentProduct.name}" class="summary-image">
                <div class="summary-details">
                    <h3>${currentProduct.name}</h3>
                    <p class="summary-price">LKR ${displayPrice.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
            </div>
        `;
    }).catch(err => {
        console.error("Firebase Error:", err);
        summaryContainer.innerHTML = '<p class="error-message">Error loading product details.</p>';
    });

    // Handle Form Submit
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!currentProduct) {
            alert('Product details not loaded.');
            return;
        }
        if (!adminWhatsappNumber) {
            alert('Store WhatsApp number is not configured correctly.');
            return;
        }

        const name = document.getElementById('customer-name').value.trim();
        const email = document.getElementById('customer-email').value.trim();
        const whatsapp = document.getElementById('customer-whatsapp').value.trim();
        
        const displayPrice = Number(currentProduct.price) || 0;

        const message = `*New Order Request*\n` +
                        `------------------\n` +
                        `*Product:* ${currentProduct.name}\n` +
                        `*Price:* LKR ${displayPrice.toFixed(2)}\n\n` +
                        `*Customer Details:*\n` +
                        `Name: ${name}\n` +
                        `Email: ${email}\n` +
                        `WhatsApp: ${whatsapp}\n\n` +
                        `I would like to proceed with the payment.`;

        // Mobile browsers wala block wenne nathi wenna meka use karanna
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${adminWhatsappNumber}&text=${encodeURIComponent(message)}`;
        
        // Window open block wenna puluwan nisa mobile nisa mehema karamu
        window.location.href = whatsappUrl;
    });
});