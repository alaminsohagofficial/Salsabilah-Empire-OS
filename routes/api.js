const express = require('express');
const router = express.Router();

// Import Controllers
const { getCustomers, addCustomer } = require('../controllers/customerController');
const { getSuppliers, addSupplier } = require('../controllers/supplierController');
const { getPaymentAccounts, updateAccountBalance } = require('../controllers/accountController');
const { sendCustomSms } = require('../controllers/smsController');
const { createSale, getSales } = require('../controllers/saleController');
const { getProducts, addProduct } = require('../controllers/productController');

// Optional: Middleware placeholders (যেমন: অথেন্টিকেশন বা লগিং এর জন্য)
// const { verifyAuth } = require('../middleware/authMiddleware');

/**
 * 👑 Salsabilah Empire OS - Core API Router
 * Industrial Resilience & Automated Business Operations
 */

// 1. Customer Management Routes
router.route('/customers')
    .get(getCustomers)
    .post(addCustomer);

// 2. Supplier Management Routes
router.route('/suppliers')
    .get(getSuppliers)
    .post(addSupplier);

// 3. Payment Account Routes (bKash, Bank, Cash, etc.)
router.route('/payment-accounts')
    .get(getPaymentAccounts);

router.route('/payment-accounts/:id')
    .put(updateAccountBalance);

// 4. Salsabilah SMS Notification Routes
router.post('/sms/send', sendCustomSms);

// 5. Sales & Invoice Management Routes (Triggers automated POS & SMS)
router.route('/sales')
    .get(getSales)
    .post(createSale);

// 6. Product & Inventory Management Routes
router.route('/products')
    .get(getProducts)
    .post(addProduct);

module.exports = router;
