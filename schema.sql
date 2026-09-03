-- 1. Brands Master Table (Minister, MyOne, Butterfly Integration)
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    brand_name VARCHAR(100) UNIQUE NOT NULL,
    official_website VARCHAR(150),
    status VARCHAR(20) DEFAULT 'Active'
);

-- Insert Minister, MyOne, Butterfly
INSERT INTO brands (brand_name, official_website) VALUES 
('Minister', 'https://ministerbd.com'),
('MyOne', 'https://myonebd.com'),
('Butterfly', 'https://butterflygroup.com.bd')
ON CONFLICT (brand_name) DO NOTHING;

-- 2. Integrated Products Table for SR Electronics Park
CREATE TABLE IF NOT EXISTS integrated_products (
    id SERIAL PRIMARY KEY,
    brand_id INT REFERENCES brands(id),
    product_name VARCHAR(200) NOT NULL,
    model_code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- AC, Refrigerator, TV, Home Appliance
    unit_purchase_price NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    current_stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
