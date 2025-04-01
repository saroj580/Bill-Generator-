document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    let savedBills = [];
    const { jsPDF } = window.jspdf;

    // DOM Elements
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const companyNameInput = document.getElementById('company-name');
    const companyAddressInput = document.getElementById('company-address');
    const companyCityInput = document.getElementById('company-city');
    const companyPhoneInput = document.getElementById('company-phone');
    const companyEmailInput = document.getElementById('company-email');
    const buyerNameInput = document.getElementById('buyer-name');
    const buyerAddressInput = document.getElementById('buyer-address');
    const buyerContactInput = document.getElementById('buyer-contact');
    const buyerEmailInput = document.getElementById('buyer-email');
    const productsContainer = document.getElementById('products-container');
    const addProductBtn = document.getElementById('add-product-btn');
    const transactionIdInput = document.getElementById('transaction-id');
    const transactionDateInput = document.getElementById('transaction-date');
    const paymentMethodSelect = document.getElementById('payment-method');
    const saveBillBtn = document.getElementById('save-bill-btn');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const viewSavedBillsBtn = document.getElementById('view-saved-bills-btn');
    const printBtn = document.getElementById('print-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const downloadCsvBtn = document.getElementById('download-csv-btn');
    const emailBillBtn = document.getElementById('email-bill-btn');
    const savedBillsSection = document.getElementById('saved-bills-section');
    const billsList = document.getElementById('bills-list');
    const closeSavedBillsBtn = document.getElementById('close-saved-bills');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const emailModal = document.getElementById('email-modal');
    const emailToInput = document.getElementById('email-to');
    const sendEmailBtn = document.getElementById('send-email-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    const printTemplate = document.getElementById('print-template');

    // Preview Elements
    const previewCompanyName = document.getElementById('preview-company-name');
    const previewCompanyAddress = document.getElementById('preview-company-address');
    const previewCompanyCity = document.getElementById('preview-company-city');
    const previewCompanyContact = document.getElementById('preview-company-contact');
    const previewTransactionId = document.getElementById('preview-transaction-id');
    const previewTransactionDate = document.getElementById('preview-transaction-date');
    const previewPaymentMethod = document.getElementById('preview-payment-method');
    const previewBuyerName = document.getElementById('preview-buyer-name');
    const previewBuyerAddress = document.getElementById('preview-buyer-address');
    const previewBuyerContact = document.getElementById('preview-buyer-contact');
    const previewBuyerEmail = document.getElementById('preview-buyer-email');
    const previewProducts = document.getElementById('preview-products');
    const previewTotal = document.getElementById('preview-total');

    // Initialize the app
    initializeApp();

    // App Initialization
    function initializeApp() {
        // Set current date as default
        const today = new Date().toISOString().split('T')[0];
        transactionDateInput.value = today;
        
        // Generate a transaction ID
        transactionIdInput.value = generateTransactionId();
        
        // Load saved bills from localStorage
        loadSavedBills();
        loadThemePreference();
        
        setupLivePreview();
        setupEventListeners();
    }

    // Generate Transaction ID
    function generateTransactionId() {
        const prefix = 'INV';
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}-${timestamp}-${random}`;
    }

    // Load Saved Bills from localStorage
    function loadSavedBills() {
        const savedBillsData = localStorage.getItem('savedBills');
        if (savedBillsData) {
            savedBills = JSON.parse(savedBillsData);
            updateSavedBillsList();
        }
    }
    // Load Theme Preference
    function loadThemePreference() {
        const darkMode = localStorage.getItem('darkMode') === 'enabled';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Theme Toggle
        themeToggleBtn.addEventListener('click', toggleTheme);
        
        // Add Product Button
        addProductBtn.addEventListener('click', addProductRow);
        
        // Setup initial remove product buttons
        setupRemoveProductButtons();
        
        // Form Buttons
        saveBillBtn.addEventListener('click', saveBill);
        resetFormBtn.addEventListener('click', resetForm);
        viewSavedBillsBtn.addEventListener('click', toggleSavedBillsView);
        closeSavedBillsBtn.addEventListener('click', toggleSavedBillsView);
        
        // Bill Actions
        printBtn.addEventListener('click', printBill);
        downloadPdfBtn.addEventListener('click', downloadPdf);
        downloadCsvBtn.addEventListener('click', downloadCsv);
        emailBillBtn.addEventListener('click', openEmailModal);
        
        // Search
        searchBtn.addEventListener('click', searchBills);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchBills();
            }
        });
        
        // Modal Close
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModals);
        });
        
        // Email Send
        sendEmailBtn.addEventListener('click', sendEmail);
        
        // Company Info Changes
        companyNameInput.addEventListener('input', updatePreview);
        companyAddressInput.addEventListener('input', updatePreview);
        companyCityInput.addEventListener('input', updatePreview);
        companyPhoneInput.addEventListener('input', updatePreview);
        companyEmailInput.addEventListener('input', updatePreview);
        
        // Buyer Info Changes
        buyerNameInput.addEventListener('input', updatePreview);
        buyerAddressInput.addEventListener('input', updatePreview);
        buyerContactInput.addEventListener('input', updatePreview);
        buyerEmailInput.addEventListener('input', updatePreview);
        
        // Transaction Details Changes
        transactionDateInput.addEventListener('input', updatePreview);
        paymentMethodSelect.addEventListener('change', updatePreview);
        
        // Window click to close modals
        window.addEventListener('click', (e) => {
            if (e.target === emailModal) {
                closeModals();
            }
        });
    }

    // Setup Remove Product Buttons
    function setupRemoveProductButtons() {
        const removeButtons = document.querySelectorAll('.remove-product-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productRow = e.target.closest('.product-row');
                if (productsContainer.children.length > 1) {
                    productRow.remove();
                    updatePreview();
                } else {
                    alert('You need at least one product!');
                }
            });
        });
    }

    // Toggle Theme
    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        if (isDarkMode) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            localStorage.setItem('darkMode', null);
        }
    }

    // Add Product Row
    function addProductRow() {
        const newRow = document.createElement('div');
        newRow.className = 'product-row';
        newRow.innerHTML = `
            <input type="text" placeholder="Product Name" class="product-name form-control" required>
            <input type="number" placeholder="Qty" value="1" min="1" class="product-quantity form-control" required>
            <input type="number" placeholder="Price" value="0" min="0" step="0.01" class="product-price form-control" required>
            <button class="remove-product-btn"><i class="fas fa-trash"></i></button>
        `;
        
        productsContainer.appendChild(newRow);
        
        // Add event listeners to the new inputs
        const nameInput = newRow.querySelector('.product-name');
        const quantityInput = newRow.querySelector('.product-quantity');
        const priceInput = newRow.querySelector('.product-price');
        
        nameInput.addEventListener('input', updatePreview);
        quantityInput.addEventListener('input', updatePreview);
        priceInput.addEventListener('input', updatePreview);
        
        // Setup remove button
        setupRemoveProductButtons();
    }

    // Setup Live Preview
    function setupLivePreview() {
        // Initial update
        updatePreview();
        
        // Listen for changes in product rows
        const productInputs = productsContainer.querySelectorAll('input');
        productInputs.forEach(input => {
            input.addEventListener('input', updatePreview);
        });
    }

    // Update Preview
    function updatePreview() {
        // Company Info
        previewCompanyName.textContent = companyNameInput.value;
        previewCompanyAddress.textContent = companyAddressInput.value;
        previewCompanyCity.textContent = companyCityInput.value;
        previewCompanyContact.textContent = `${companyPhoneInput.value} | ${companyEmailInput.value}`;
        
        // Transaction Details
        previewTransactionId.textContent = transactionIdInput.value;
        previewTransactionDate.textContent = formatDate(transactionDateInput.value);
        previewPaymentMethod.textContent = paymentMethodSelect.value;
        
        // Buyer Info
        previewBuyerName.textContent = buyerNameInput.value;
        previewBuyerAddress.textContent = buyerAddressInput.value;
        previewBuyerContact.textContent = buyerContactInput.value ? `Phone: ${buyerContactInput.value}` : '';
        previewBuyerEmail.textContent = buyerEmailInput.value ? `Email: ${buyerEmailInput.value}` : '';
        
        // Products
        updateProductsPreview();
    }

    // Update Products Preview
    function updateProductsPreview() {
        previewProducts.innerHTML = '';
        
        const products = getProductsData();
        let total = 0;
        
        products.forEach(product => {
            const row = document.createElement('tr');
            const itemTotal = product.quantity * product.price;
            total += itemTotal;
            
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;
            
            previewProducts.appendChild(row);
        });
        
        previewTotal.innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
    }

    // Get Products Data
    function getProductsData() {
        const products = [];
        const productRows = productsContainer.querySelectorAll('.product-row');
        
        productRows.forEach(row => {
            const name = row.querySelector('.product-name').value;
            const quantity = parseInt(row.querySelector('.product-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.product-price').value) || 0;
            
            products.push({
                name,
                quantity,
                price
            });
        });
        
        return products;
    }

    // Calculate Total
    function calculateTotal() {
        const products = getProductsData();
        return products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    }

    // Save Bill
    function saveBill() {
        // Validation
        if (!validateForm()) {
            return;
        }
        
        const bill = {
            id: transactionIdInput.value,
            date: transactionDateInput.value,
            company: {
                name: companyNameInput.value,
                address: companyAddressInput.value,
                city: companyCityInput.value,
                phone: companyPhoneInput.value,
                email: companyEmailInput.value
            },
            buyer: {
                name: buyerNameInput.value,
                address: buyerAddressInput.value,
                contact: buyerContactInput.value,
                email: buyerEmailInput.value
            },
            products: getProductsData(),
            paymentMethod: paymentMethodSelect.value,
            total: calculateTotal()
        };
        
        // Add to saved bills
        savedBills.push(bill);
        
        // Save to localStorage
        localStorage.setItem('savedBills', JSON.stringify(savedBills));
        
        // Update the bills list
        updateSavedBillsList();
        
        // Show success message
        alert('Bill saved successfully!');
        
        // Reset form
        resetForm();
    }

    // Validate Form
    function validateForm() {
        // Check buyer name
        if (!buyerNameInput.value.trim()) {
            alert('Please enter the buyer\'s name');
            buyerNameInput.focus();
            return false;
        }
        
        // Check products
        const products = getProductsData();
        let valid = true;
        
        products.forEach((product, index) => {
            if (!product.name.trim()) {
                alert(`Please enter a name for product ${index + 1}`);
                valid = false;
            }
            
            if (product.quantity <= 0) {
                alert(`Please enter a valid quantity for product ${index + 1}`);
                valid = false;
            }
            
            if (product.price <= 0) {
                alert(`Please enter a valid price for product ${index + 1}`);
                valid = false;
            }
        });
        
        return valid;
    }

    // Reset Form
    function resetForm() {
        // Don't reset company info
        
        // Reset buyer info
        buyerNameInput.value = '';
        buyerAddressInput.value = '';
        buyerContactInput.value = '';
        buyerEmailInput.value = '';
        
        // Reset products (keep one empty row)
        productsContainer.innerHTML = `
            <div class="product-row">
                <input type="text" placeholder="Product Name" class="product-name form-control" required>
                <input type="number" placeholder="Qty" value="1" min="1" class="product-quantity form-control" required>
                <input type="number" placeholder="Price" value="0" min="0" step="0.01" class="product-price form-control" required>
                <button class="remove-product-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Reset transaction details
        transactionIdInput.value = generateTransactionId();
        transactionDateInput.value = new Date().toISOString().split('T')[0];
        paymentMethodSelect.value = 'Cash';
        
        // Setup event listeners for the new product row
        setupRemoveProductButtons();
        setupLivePreview();
    }

    // Update Saved Bills List
    function updateSavedBillsList() {
        billsList.innerHTML = '';
        
        if (savedBills.length === 0) {
            billsList.innerHTML = '<p>No saved bills found.</p>';
            return;
        }
        
        savedBills.forEach(bill => {
            const billItem = document.createElement('div');
            billItem.className = 'bill-item';
            billItem.innerHTML = `
                <div>
                    <strong>${bill.id}</strong> | ${bill.buyer.name} | $${bill.total.toFixed(2)} | ${formatDate(bill.date)}
                </div>
                <div class="actions">
                    <button class="btn" data-id="${bill.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="btn secondary" data-id="${bill.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            
            billsList.appendChild(billItem);
            
            // Add event listeners to the buttons
            const viewBtn = billItem.querySelector('.btn:not(.secondary)');
            const deleteBtn = billItem.querySelector('.btn.secondary');
            
            viewBtn.addEventListener('click', () => loadBill(bill.id));
            deleteBtn.addEventListener('click', () => deleteBill(bill.id));
        });
    }

     // Load Bill
    function loadBill(billId) {
        const bill = savedBills.find(b => b.id === billId);
        if (!bill) return;
        
        // Fill the form with the bill data
        
        // Company info
        companyNameInput.value = bill.company.name;
        companyAddressInput.value = bill.company.address;
        companyCityInput.value = bill.company.city;
        companyPhoneInput.value = bill.company.phone;
        companyEmailInput.value = bill.company.email;
        
        // Buyer info
        buyerNameInput.value = bill.buyer.name;
        buyerAddressInput.value = bill.buyer.address;
        buyerContactInput.value = bill.buyer.contact;
        buyerEmailInput.value = bill.buyer.email;
        
        // Transaction details
        transactionIdInput.value = bill.id;
        transactionDateInput.value = bill.date;
        paymentMethodSelect.value = bill.paymentMethod;
        
        // Products
        productsContainer.innerHTML = '';
        bill.products.forEach(product => {
            const newRow = document.createElement('div');
            newRow.className = 'product-row';
            newRow.innerHTML = `
                <input type="text" placeholder="Product Name" class="product-name form-control" value="${product.name}" required>
                <input type="number" placeholder="Qty" value="${product.quantity}" min="1" class="product-quantity form-control" required>
                <input type="number" placeholder="Price" value="${product.price}" min="0" step="0.01" class="product-price form-control" required>
                <button class="remove-product-btn"><i class="fas fa-trash"></i></button>
            `;
            
            productsContainer.appendChild(newRow);
        });
        
        // Setup remove buttons and update preview
        setupRemoveProductButtons();
        setupLivePreview();
        
        // Hide saved bills view
        savedBillsSection.classList.add('hidden');
        
        if (bill.buyer.email) {
            emailToInput.value = bill.buyer.email;
        }
    }

    // Delete Bill
    function deleteBill(billId) {
        if (confirm('Are you sure you want to delete this bill?')) {
            const index = savedBills.findIndex(b => b.id === billId);
            savedBills.splice(index, 1);
            localStorage.setItem('savedBills', JSON.stringify(savedBills));
            updateSavedBillsList();
        }
    }

    // Toggle Saved Bills View
    function toggleSavedBillsView() {
        savedBillsSection.classList.toggle('hidden');
        
        // Clear search input when showing
        if (!savedBillsSection.classList.contains('hidden')) {
            searchInput.value = '';
            updateSavedBillsList();
        }
    }

    // Search Bills
    function searchBills() {
        const query = searchInput.value.toLowerCase();
        
        if (!query) {
            updateSavedBillsList();
            return;
        }
        
        const filteredBills = savedBills.filter(bill => 
            bill.id.toLowerCase().includes(query) ||
            bill.buyer.name.toLowerCase().includes(query)
        );
        
        billsList.innerHTML = '';
        
        if (filteredBills.length === 0) {
            billsList.innerHTML = '<p>No matching bills found.</p>';
            return;
        }
        
        filteredBills.forEach(bill => {
            const billItem = document.createElement('div');
            billItem.className = 'bill-item';
            billItem.innerHTML = `
                <div>
                    <strong>${bill.id}</strong> | ${bill.buyer.name} | $${bill.total.toFixed(2)} | ${formatDate(bill.date)}
                </div>
                <div class="actions">
                    <button class="btn" data-id="${bill.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="btn secondary" data-id="${bill.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            
            billsList.appendChild(billItem);
            
            const viewBtn = billItem.querySelector('.btn:not(.secondary)');
            const deleteBtn = billItem.querySelector('.btn.secondary');
            
            viewBtn.addEventListener('click', () => loadBill(bill.id));
            deleteBtn.addEventListener('click', () => deleteBill(bill.id));
        });
    }

    // Print Bill
    function printBill() {
        // Create print template
        preparePrintTemplate();
        
        // Print
        window.print();
    }

    // Prepare Print Template
    function preparePrintTemplate() {
        // No need to create a separate template as we'll use the CSS print media queries
    }

    // Download PDF
    function downloadPdf() {
        // Validation
        if (!validateForm()) {
            return;
        }
        
        try {
            const doc = new jsPDF();
            
            // Company Info
            doc.setFontSize(20);
            doc.text(companyNameInput.value, 105, 20, { align: 'center' });
            doc.setFontSize(10);
            doc.text(companyAddressInput.value, 105, 25, { align: 'center' });
            doc.text(`${companyCityInput.value} | ${companyPhoneInput.value}`, 105, 30, { align: 'center' });
            doc.text(companyEmailInput.value, 105, 35, { align: 'center' });
            
            doc.setFontSize(16);
            doc.text('INVOICE', 105, 45, { align: 'center' });
            
            // Buyer Details
            doc.setFontSize(10);
            doc.text('Bill To:', 15, 55);
            doc.setFontSize(11);
            doc.text(buyerNameInput.value, 15, 60);
            doc.setFontSize(10);
            doc.text(buyerAddressInput.value, 15, 65);
            doc.text(`Phone: ${buyerContactInput.value}`, 15, 70);
            doc.text(`Email: ${buyerEmailInput.value}`, 15, 75);
            
            // Transaction Details
            doc.text(`Invoice #: ${transactionIdInput.value}`, 140, 60);
            doc.text(`Date: ${formatDate(transactionDateInput.value)}`, 140, 65);
            doc.text(`Payment Method: ${paymentMethodSelect.value}`, 140, 70);
            
            // Product Table
            const products = getProductsData();
            const tableColumn = ["Product", "Quantity", "Unit Price", "Total"];
            const tableRows = products.map(product => [
                product.name,
                product.quantity,
                `$${product.price.toFixed(2)}`,
                `$${(product.quantity * product.price).toFixed(2)}`
            ]);
            
            doc.autoTable({
                startY: 85,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillColor: [52, 152, 219], textColor: 255 },
                styles: { fontSize: 10 }
            });
            
            // Total
            const total = calculateTotal();
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.text(`Total Amount Due: $${total.toFixed(2)}`, 140, finalY);
            
            // Footer
            doc.setFontSize(10);
            doc.text('Thank you for your business!', 105, finalY + 20, { align: 'center' });
            
            doc.save(`Invoice_${transactionIdInput.value}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    }
});