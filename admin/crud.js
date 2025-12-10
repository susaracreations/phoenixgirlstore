// admin/crud.js
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated before running CRUD logic
    auth.onAuthStateChanged(user => {
        if (user) {
            initializeCrud();
        }
    });
});

function initializeCrud() {
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const uploadProgress = document.getElementById('upload-progress');
    const productIdField = document.getElementById('product-id');
    const imagePreview = document.getElementById('image-preview');
    const cancelEditBtn = document.getElementById('cancel-edit');

    const productsRef = db.collection('products');

    // --- SITE SETTINGS ---
    const settingsForm = document.getElementById('settings-form');
    const heroImageUrlInput = document.getElementById('hero-image-url');
    const whatsappNumberInput = document.getElementById('whatsapp-number');
    const settingsRef = db.collection('site_settings').doc('homepage');

    // Load existing settings
    settingsRef.get().then(doc => {
        if (doc.exists) {
            const settings = doc.data();
            heroImageUrlInput.value = settings.heroImageUrl || '';
            whatsappNumberInput.value = settings.whatsappNumber || '';
        }
    }).catch(error => console.error("Error fetching site settings:", error));

    // Save settings
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settingsData = { heroImageUrl: heroImageUrlInput.value, whatsappNumber: whatsappNumberInput.value };
        settingsRef.set(settingsData, { merge: true })
            .then(() => alert('Site settings saved successfully!'))
            .catch(error => alert('Error saving settings: ' + error.message));
    });


    // --- PRODUCT CREATE and UPDATE ---
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const description = document.getElementById('product-description').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const imageUrl = document.getElementById('product-image-url').value;
        const downloadUrl = document.getElementById('product-download-link').value; // Get the URL from the correct input
        const id = productIdField.value;

        if (!downloadUrl) {
            alert('Please provide a download URL for the product.');
            return;
        }

        if (!imageUrl) {
            alert('Please provide a preview image URL.');
            return;
        }

        const productData = {
            name,
            description,
            price,
            downloadUrl,
            imageUrl,
        };

        try {
            if (id) {
                // Update existing product
                productData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                await productsRef.doc(id).update(productData);
            } else {
                // Create new product
                productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await productsRef.add(productData);
            }
            alert('Product saved successfully!');
        } catch (error) {
            console.error("Error saving product:", error);
            alert('Failed to save product: ' + error.message);
        } finally {
            productForm.reset();
            resetForm();
        }
    });

    // --- READ (Listen for real-time updates) ---
    productsRef.orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        let html = '';
        snapshot.forEach(doc => {
            const product = doc.data();
            const imageThumb = product.imageUrl 
                ? `<img src="${product.imageUrl}" alt="Thumbnail" class="product-item-thumb">`
                : `<div class="product-item-thumb-placeholder"></div>`;
            const fileLink = product.downloadUrl
                ? `<a href="${product.downloadUrl}" target="_blank" class="file-link">View File</a>`
                : '';

            html += `
                <div class="product-item">
                    ${imageThumb}
                    <div class="product-item-info">
                        <strong>${product.name}</strong> - LKR ${product.price.toFixed(2)} ${fileLink}
                    </div>
                    <div class="product-item-actions">
                        <button class="edit-btn" data-id="${doc.id}">Edit</button>
                        <button class="delete-btn" data-id="${doc.id}">Delete</button>
                    </div>
                </div>
            `;
        });
        productList.innerHTML = html;
    });

    // --- Handle EDIT and DELETE button clicks ---
    productList.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            // --- DELETE ---
            if (confirm('Are you sure you want to delete this product? This cannot be undone.')) {
                // Since images are hosted externally, we just delete the Firestore document.
                productsRef.doc(id).delete()
                    .then(() => console.log("Product deleted successfully!"))
                    .catch((error) => console.error("Error removing document: ", error));
            }
        } else if (target.classList.contains('edit-btn')) {
            // --- Populate form for EDIT ---
            productsRef.doc(id).get().then(doc => {
                const product = doc.data();
                document.getElementById('product-id').value = doc.id;
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-download-link').value = product.downloadUrl || ''; // Populate the URL field
                document.getElementById('product-image-url').value = product.imageUrl || '';
                if (product.imageUrl) {
                    imagePreview.src = product.imageUrl;
                    imagePreview.classList.remove('hidden');
                } else {
                    imagePreview.classList.add('hidden');
                }
                document.getElementById('form-title').textContent = 'Edit Mod';
                cancelEditBtn.classList.remove('hidden');
                window.scrollTo(0, 0); // Scroll to top to see the form
            });
        }
    });

    // --- Cancel Edit ---
    cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        document.getElementById('form-title').textContent = 'Add New Mod';
        productIdField.value = '';
        cancelEditBtn.classList.add('hidden');
        uploadProgress.classList.add('hidden');
        imagePreview.classList.add('hidden');
        productForm.reset();
    }
}
