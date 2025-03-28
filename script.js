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
});