async function sendWalletConfirmationSMS(customerPhone, customerName, invoiceNo, amount, method, trxID) {
    const message = `Dear ${customerName || 'Customer'}, your payment of BDT ${amount} via ${method} has been received for Invoice #${invoiceNo}. TrxID: ${trxID}. Thank you for shopping at Salsabilah Amin Limited.`;
    return await sendSMS(customerPhone, message);
}
