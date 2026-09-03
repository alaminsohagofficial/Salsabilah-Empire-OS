const pool = require('../db');
const { sendInvoiceSmsNotification } = require('./smsController');

// Create a new Sale / Invoice
const createSale = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start Transaction for Data Integrity

        const {
            customer_id,
            customer_name,
            customer_phone,
            items, // Array of { product_id, quantity, unit_price, total_price }
            sub_total,
            discount,
            grand_total,
            paid_amount,
            due_amount,
            payment_account_id // Which account received the payment (e.g., bKash, Bank)
        } = req.body;

        // 1. Generate unique Invoice Number
        const invoice_no = `SAL-${Date.now().toString().slice(-6)}`;
        const date = new Date().toISOString().split('T')[0];

        // 2. Insert into sales/invoices table
        const saleQuery = `
            INSERT INTO sales (invoice_no, customer_id, customer_name, customer_phone, sub_total, discount, grand_total, paid_amount, due_amount, date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const saleValues = [invoice_no, customer_id, customer_name, customer_phone, sub_total, discount, grand_total, paid_amount, due_amount, date];
        const saleResult = await client.query(saleQuery, saleValues);
        const newSale = saleResult.rows[0];

        // 3. Insert sale items into sale_items table
        for (let item of items) {
            const itemQuery = `
                INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
                VALUES ($1, $2, $3, $4, $5);
            `;
            await client.query(itemQuery, [newSale.id, item.product_id, item.quantity, item.unit_price, item.total_price]);
        }

        // 4. Update Payment Account Balance if paid amount > 0
        if (paid_amount > 0 && payment_account_id) {
            await client.query(
                `UPDATE payment_accounts SET balance = balance + $1 WHERE id = $2`,
                [paid_amount, payment_account_id]
            );
        }

        await client.query('COMMIT'); // Commit Transaction

        // 5. Automatically Trigger Salsabilah SMS Notification (Non-blocking)
        const invoiceData = {
            invoice_no,
            customer_name,
            customer_phone,
            grand_total,
            due_amount
        };

        // Trigger SMS asynchronously so it doesn't delay the HTTP response
        sendInvoiceSmsNotification(invoiceData).catch(err => {
            console.error('[Background SMS Error]:', err.message);
        });

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully and SMS triggered!',
            data: newSale
        });

    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error creating sale/invoice:', err.message);
        res.status(500).json({ success: false, error: 'Server Error during sale creation' });
    } finally {
        client.release();
    }
};

// Get all sales / invoices history
const getSales = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sales ORDER BY id DESC');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching sales:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    createSale,
    getSales
};
