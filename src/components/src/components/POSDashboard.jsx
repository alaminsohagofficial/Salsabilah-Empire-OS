import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function POSDashboard() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('S.R. Electronics Client');
    const [contact, setContact] = useState('+8801700000000');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data.data);
        } catch (err) {
            console.error('Failed to load inventory products', err);
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, product_id: product.id, quantity: 1, unit_price: product.price }];
        });
    };

    const grandTotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Cart is empty!');
        
        const payload = {
            invoice_no: `INV-${Date.now()}`,
            customer_id: 1,
            customer_name: customerName,
            contact_number: contact,
            payment_status: 'PAID',
            payment_method: 'BANK_TRANSFER',
            sub_total: grandTotal,
            grand_total: grandTotal,
            items: cart
        };

        try {
            const res = await axios.post('/api/sales', payload);
            alert(res.data.message);
            setCart([]);
            fetchProducts();
        } catch (err) {
            alert('Checkout failed: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px', padding: '20px', background: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ flex: 2, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h2>📦 Enterprise Inventory & Products</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    {products.map(p => (
                        <div key={p.id} onClick={() => addToCart(p)} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', cursor: 'pointer', background: '#fff' }}>
                            <h4>{p.name}</h4>
                            <p>Price: BDT {p.price}</p>
                            <p style={{ color: p.current_stock > 0 ? 'green' : 'red' }}>Stock: {p.current_stock}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h2>🛒 Active POS Cart</h2>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer Name" style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact Number" style={{ width: '100%', marginBottom: '15px', padding: '8px' }} />
                
                <hr style={{ border: '0.5px solid #eee', marginBottom: '15px' }} />
                
                {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{item.name} (x{item.quantity})</span>
                        <span>BDT {item.unit_price * item.quantity}</span>
                    </div>
                ))}

                <h3 style={{ borderTop: '2px solid #ddd', paddingTop: '10px', marginTop: '15px' }}>Total: BDT {grandTotal}</h3>
                <button onClick={handleCheckout} style={{ width: '100%', background: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                    Complete Checkout
                </button>
            </div>
        </div>
    );
}
