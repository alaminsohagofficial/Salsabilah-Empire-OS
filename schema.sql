CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    current_stock INT DEFAULT 0,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT,
    customer_name VARCHAR(255),
    contact_number VARCHAR(50),
    payment_status VARCHAR(50),
    payment_method VARCHAR(50),
    sub_total DECIMAL(12,2),
    grand_total DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(12,2)
);

CREATE TABLE IF NOT EXISTS payment_accounts (
    id SERIAL PRIMARY KEY,
    account_name VARCHAR(255),
    balance DECIMAL(15,2)
);
