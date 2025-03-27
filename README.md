# Bill Generator

A simple yet powerful web application for generating, previewing, printing, and managing customer bills and invoices. Built with pure HTML, CSS, and JavaScript.

## Features

- **Create Bills**: Generate bills with buyer details, product information, and transaction data
- **Preview Bills**: Real-time preview of the bill as you enter information
- **Export Options**: Download bills as PDF or CSV for record-keeping
- **Print Option**: Print bills directly from the browser
- **Save & Manage**: Store generated bills locally for future reference
- **Search Functionality**: Find specific bills using transaction ID or buyer name
- **Dark Mode Support**: Toggle between light and dark themes for better readability
- **Email Integration**: Simulated email sending feature

## Usage

1. **Entering Company Information**:
   - Customize your company details at the top of the form
   - All changes reflect in real-time in the preview panel

2. **Entering Buyer Information**:
   - Fill in the buyer's name, address, contact number, and email
   - Only the name field is required

3. **Adding Products**:
   - Enter product name, quantity, and unit price
   - Click "Add Product" to include multiple products
   - Click the trash icon to remove a product

4. **Transaction Details**:
   - The system automatically generates a transaction ID
   - Select the purchase date and payment method

5. **Bill Actions**:
   - Save Bill: Store the bill for future reference
   - Reset Form: Clear all entered data (except company info)
   - View Saved Bills: See a list of all saved bills
   - Print: Send the bill directly to your printer
   - Download PDF: Export as PDF
   - Download CSV: Export as CSV for data processing
   - Email Bill: Send the bill via email (simulated)

6. **Managing Saved Bills**:
   - View: Load a saved bill back into the form
   - Delete: Remove a bill from storage
   - Search: Find bills by transaction ID or buyer name

## Technical Details

### Files Structure

- `index.html`: Main HTML file with structure and form elements
- `styles.css`: CSS styling with light and dark theme support
- `script.js`: JavaScript for all functionality

### Libraries Used

- **jsPDF**: For PDF generation
- **jsPDF-AutoTable**: For creating tables in PDF
- **FontAwesome**: For icons

### Data Storage

Bills are stored in the browser's localStorage, allowing users to access their saved bills even after closing the browser.

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Getting Started

1. Download or clone the project
2. Open `index.html` in your browser
3. No server or installation required! 