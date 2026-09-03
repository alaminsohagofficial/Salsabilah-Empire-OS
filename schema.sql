-- 1. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    note TEXT
);

-- 2. Products Table (Inventory)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    brand_id INT REFERENCES brands(id),
    category VARCHAR(50),
    unit_purchase_price NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    current_stock INT DEFAULT 0
);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    total_sales_due NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    total_purchase_due NUMERIC(12, 2) DEFAULT 0.00
);

-- 5. Payment Accounts Table (Cash, bKash, Bank)
CREATE TABLE IF NOT EXISTS payment_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    account_number VARCHAR(50),
    balance NUMERIC(12, 2) DEFAULT 0.00
);

-- 6. Sales Table (Invoices)
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT REFERENCES customers(id),
    customer_name VARCHAR(100),
    contact_number VARCHAR(20),
    payment_status VARCHAR(20), -- Paid, Due, Partial
    payment_method VARCHAR(30), -- Cash, bKash
    sub_total NUMERIC(12, 2) NOT NULL,
    grand_total NUMERIC(12, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Sale Items Table
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);
