const pool = require('../db');

// Get all customers with their group details
const getCustomers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, cg.group_name, cg.discount_percentage 
            FROM customers c 
            LEFT JOIN customer_groups cg ON c.group_id = cg.id
            ORDER BY c.id DESC
        `);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching customers:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Add a new customer
const addCustomer = async (req, res) => {
    try {
        const { name, phone, group_id, address } = req.body;
        const newCustomer = await pool.query(
            `INSERT INTO customers (name, phone, group_id, address) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, phone, group_id, address]
        );
        res.status(201).json({ success: true, data: newCustomer.rows[0] });
    } catch (err) {
        console.error('Error adding customer:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getCustomers,
    addCustomer
};
