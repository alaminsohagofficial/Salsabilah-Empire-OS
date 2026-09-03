const pool = require('../db');

// Get all suppliers
const getSuppliers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM suppliers ORDER BY id DESC');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching suppliers:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Add a new supplier
const addSupplier = async (req, res) => {
    try {
        const { name, phone, company_name, address } = req.body;
        const newSupplier = await pool.query(
            `INSERT INTO suppliers (name, phone, company_name, address) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, phone, company_name, address]
        );
        res.status(201).json({ success: true, data: newSupplier.rows[0] });
    } catch (err) {
        console.error('Error adding supplier:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getSuppliers,
    addSupplier
};
