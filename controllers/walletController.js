```javascript
/**
 * Repository: Salsabilah-Empire-OS
 * File Path: controllers/walletController.js
 * Purpose: bKash & Nagad POS Checkout Controller with Automated SMS Receipts
 * Organization: Salsabilah Amin Limited | Retail: S.R. Electronics Park
 */

const walletService = require('../services/walletService');
const { sendSMS } = require('../services/smsService');

/**
 * 1. bKash: Create Payment Session
 */
async function initiateBkashCheckout(req, res) {
    try {
        const { invoiceId, totalAmount, customerPhone } = req.body;

        if (!invoiceId || !totalAmount) {
            return res.status(400).json({ success: false, message: 'Invoice ID and total amount are required.' });
        }

        const data = await walletService.createBkashOrder({
            invoiceId,
            totalAmount,
            customerPhone
        });

        return res.status(200).json({
            success: true,
            paymentID: data.paymentID,
            bkashURL: data.bkashURL,
            amount: data.amount
        });
    } catch (error) {
        console.error('bKash Checkout Error:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 2. bKash: Execute Authorized Payment & Trigger Confirmation SMS
 */
async function executeBkashCheckout(req, res) {
    try {
        const { paymentID, customerPhone, customerName } = req.body;

        if (!paymentID) {
            return res.status(400).json({ success: false, message: 'Payment ID is required.' });
        }

        const result = await walletService.executeBkashOrder(paymentID);

        if (result.statusCode === '0000') {
            const invoiceNo = result.merchantInvoiceNumber;
            const amount = result.amount;
            const trxID = result.trxID;

            // Trigger SMS notification matching salesController pattern
            if (customerPhone) {
                const smsMessage = `Dear ${customerName || 'Customer'}, your payment of BDT ${amount} via bKash has been received for Invoice #${invoiceNo}. TrxID: ${trxID}. Thank you for shopping at Salsabilah Amin Limited.`;
                sendSMS(customerPhone, smsMessage).catch(err => console.error('bKash SMS Error:', err));
            }

            return res.status(200).json({
                success: true,
                message: 'Payment completed successfully via bKash.',
                data: {
                    trxID,
                    invoiceNo,
                    amount,
                    customerMsisdn: result.customerMsisdn,
                    status: 'PAID'
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.statusMessage || 'bKash payment authorization failed.'
            });
        }
    } catch (error) {
        console.error('bKash Execution Error:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 3. Nagad: Initialize Checkout Session
 */
async function initiateNagadCheckout(req, res) {
    try {
        const { invoiceId, totalAmount } = req.body;

        if (!invoiceId || !totalAmount) {
            return res.status(400).json({ success: false, message: 'Invoice ID and total amount are required.' });
        }

        const result = await walletService.initNagadOrder({ invoiceId, totalAmount });

        return res.status(200).json({
            success: true,
            paymentRefId: result.paymentReferenceId,
            redirectUrl: result.callBackUrl,
            orderId: result.orderId
        });
    } catch (error) {
        console.error('Nagad Init Error:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 4. Nagad: Verify Callback & Trigger Confirmation SMS
 */
async function verifyNagadCallback(req, res) {
    try {
        const { payment_ref_id, customerPhone, customerName } = req.query;

        if (!payment_ref_id) {
            return res.status(400).json({ success: false, message: 'Payment reference ID missing from callback.' });
        }

        const result = await walletService.verifyNagadOrder(payment_ref_id);

        if (result.status === 'Success') {
            const invoiceNo = result.orderId;
            const amount = result.amount;
            const trxID = result.issuerPaymentRefNo || payment_ref_id;
            const phone = customerPhone || result.clientMobileNo;

            if (phone) {
                const smsMessage = `Dear ${customerName || 'Customer'}, your payment of BDT ${amount} via Nagad has been received for Invoice #${invoiceNo}. TrxID: ${trxID}. Thank you for shopping at Salsabilah Amin Limited.`;
                sendSMS(phone, smsMessage).catch(err => console.error('Nagad SMS Error:', err));
            }

            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully via Nagad.',
                data: {
                    trxID,
                    invoiceNo,
                    amount,
                    status: 'PAID'
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Nagad payment verification status: ${result.status}`
            });
        }
    } catch (error) {
        console.error('Nagad Callback Error:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    initiateBkashCheckout,
    executeBkashCheckout,
    initiateNagadCheckout,
    verifyNagadCallback
};
```
