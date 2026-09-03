const express = require('express');
const router = express.Router();

// Import Controllers
const { getCustomers, addCustomer } = require('../controllers/customerController');
const { getSuppliers, addSupplier } = require('../controllers/supplierController');
const { getPaymentAccounts, updateAccountBalance } = require('../controllers/accountController');
const { sendCustomSms } = require('../controllers/smsController');

// Customer Routes
router.get('/customers', getCustomers);
router.post('/customers', addCustomer);

// Supplier Routes
router.get('/suppliers', getSuppliers);
router.post('/suppliers', addSupplier);

// Payment Account Routes
router.get('/payment-accounts', getPaymentAccounts);
router.put('/payment-accounts/:id', updateAccountBalance);

// Salsabilah SMS Notification Routes
router.post('/sms/send', sendCustomSms);

module.exports = router;
