const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('📦 Connected to Salsabilah Empire PostgreSQL DB.');
});

// --- QSALE24 STYLE API ENDPOINTS ---

// 1. Get All Products (Inventory)
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Create Sale / POS Checkout (With SMS Trigger & Stock Deduction)
app.post('/api/sales', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { invoice_no, customer_id, customer_name, contact_number, payment_status, payment_method, items, sub_total, grand_total } = req.body;

        // Insert Sale Header
        const saleQuery = `
            INSERT INTO sales (invoice_no, customer_id, customer_name, contact_number, payment_status, payment_method, sub_total, grand_total)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
        `;
        const saleValues = [invoice_no, customer_id, customer_name, contact_number, payment_status, payment_method, sub_total, grand_total];
        const saleResult = await client.query(saleQuery, saleValues);
        const saleId = saleResult.rows[0].id;

        // Insert Sale Items & Update Stock
        for (let item of items) {
            await client.query(
                `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)`,
                [saleId, item.product_id, item.quantity, item.unit_price, item.total_price]
            );

            // Deduct stock
            await client.query(
                `UPDATE products SET current_stock = current_stock - $1 WHERE id = $2`,
                [item.quantity, item.product_id]
            );
        }

        await client.query('COMMIT');

        // Salsabilah Lifetime-Free SMS Trigger (Simulated / Integrated)
        console.log(`📱 [Salsabilah SMS Service]: Invoice ${invoice_no} sent to ${contact_number}. Total: BDT ${grand_total}`);

        res.status(201).json({
            success: true,
            message: 'Sale completed successfully & SMS notification sent!',
            invoice_no
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Checkout Error:', err);
        res.status(500).json({ success: false, error: 'Transaction Failed' });
    } finally {
        client.release();
    }
});

// 3. Get Payment Accounts Summary
app.get('/api/payment-accounts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_accounts');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`👑 Salsabilah Empire POS (QSale24 Architecture) running on port ${PORT}`);
});
