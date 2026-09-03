const express = require('express');
const router = express.Router();
const { sendCustomSms } = require('../controllers/smsController');

// POST /api/sms/send
router.post('/send', sendCustomSms);

module.exports = router;
