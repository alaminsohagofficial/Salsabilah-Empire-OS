const pool = require('../db');

// Get all payment accounts and balances
const getPaymentAccounts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_accounts ORDER BY id ASC');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching payment accounts:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Add / Update account balance or details
const updateAccountBalance = async (req, res) => {
    try {
        const { id } = req.params;
        const { balance } = req.body;
        const updatedAccount = await pool.query(
            'UPDATE payment_accounts SET balance = $1 WHERE id = $2 RETURNING *',
            [balance, id]
        );
        if (updatedAccount.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }
        res.status(200).json({ success: true, data: updatedAccount.rows[0] });
    } catch (err) {
        console.error('Error updating account balance:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getPaymentAccounts,
    updateAccountBalance
};
