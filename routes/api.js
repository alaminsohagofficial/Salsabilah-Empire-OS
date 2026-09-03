const express = require('express');
const router = express.Router();

// Import Controllers
const { getCustomers, addCustomer } = require('../controllers/customerController');
const { getSuppliers, addSupplier } = require('../controllers/supplierController');
const { getPaymentAccounts, updateAccountBalance } = require('../controllers/accountController');
const { sendCustomSms } = require('../controllers/smsController');
const { createSale, getSales } = require('../controllers/saleController');

// 1. Customer Management Routes
router.get('/customers', getCustomers);
router.post('/customers', addCustomer);

// 2. Supplier Management Routes
router.get('/suppliers', getSuppliers);
router.post('/suppliers', addSupplier);

// 3. Payment Account Routes (bKash, Bank, etc.)
router.get('/payment-accounts', getPaymentAccounts);
router.put('/payment-accounts/:id', updateAccountBalance);

// 4. Salsabilah SMS Notification Routes
router.post('/sms/send', sendCustomSms);

// 5. Sales & Invoice Management Routes (Triggers automated SMS)
router.get('/sales', getSales);
router.post('/sales', createSale);

module.exports = router;
