const salsabilahSmsService = require('../services/salsabilahSmsService');

// Send custom or transactional SMS
const sendCustomSms = async (req, res) => {
    try {
        const { phone, message } = req.body;
        
        if (!phone || !message) {
            return res.status(400).json({ success: false, error: 'Phone and message are required' });
        }

        const result = await salsabilahSmsService.sendSms(phone, message);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Automatic Invoice SMS trigger
const sendInvoiceSmsNotification = async (invoiceData) => {
    const { customer_phone, customer_name, invoice_no, grand_total, due_amount } = invoiceData;
    
    const message = `Dear ${customer_name}, Thanks for shopping at Salsabila Amin Limited! Inv: #${invoice_no}, Total: BDT ${grand_total}, Due: BDT ${due_amount}. Powered by Salsabilah Service & Gemini AI.`;
    
    return await salsabilahSmsService.sendSms(customer_phone, message);
};

module.exports = {
    sendCustomSms,
    sendInvoiceSmsNotification
};
