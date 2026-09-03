const pool = require('../db');

// Add or Sync Product from Minister, MyOne, or Butterfly catalogs
const syncBrandProduct = async (req, res) => {
    try {
        const { brand_name, product_name, model_code, category, unit_purchase_price, selling_price, current_stock } = req.body;

        // Get Brand ID
        const brandQuery = await pool.query('SELECT id FROM brands WHERE brand_name = $1', [brand_name]);
        if (brandQuery.rows.length === 0) {
            return res.status(400).json({ success: false, error: 'Brand not recognized in Salsabilah Empire.' });
        }
        const brandId = brandQuery.rows[0].id;

        // Insert or Update Product
        const query = `
            INSERT INTO integrated_products (brand_id, product_name, model_code, category, unit_purchase_price, selling_price, current_stock)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (model_code) 
            DO UPDATE SET 
                selling_price = EXCLUDED.selling_price,
                current_stock = integrated_products.current_stock + EXCLUDED.current_stock
            RETURNING *;
        `;
        const values = [brandId, product_name, model_code, category, unit_purchase_price, selling_price, current_stock || 0];
        const result = await pool.query(query, values);

        res.status(200).json({
            success: true,
            message: `${brand_name} product successfully synced with Salsabilah Empire POS!`,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Integration Error:', err.message);
        res.status(500).json({ success: false, error: 'Server Error during product sync.' });
    }
};

module.exports = { syncBrandProduct };
