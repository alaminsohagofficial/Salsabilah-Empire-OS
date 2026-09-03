import React, { useState, useEffect } from 'react';
import axios from 'axios';

const POSBilling = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [paidAmount, setPaidAmount] = useState(0);

    // Fetch products on load
    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(res => setProducts(res.data.data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    // Add item to cart
    const addToCart = (product) => {
        const existing = cart.find(item => item.product_id === product.id);
        if (existing) {
            setCart(cart.map(item => 
                item.product_id === product.id 
                ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.unit_price }
                : item
            ));
        } else {
            setCart([...cart, {
                product_id: product.id,
                name: product.name,
                unit_price: product.selling_price,
                quantity: 1,
                total_price: product.selling_price
            }]);
        }
    };

    // Calculate Totals
    const subTotal = cart.reduce((acc, item) => acc + item.total_price, 0);
    const grandTotal = subTotal; // Add discount logic here if needed
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    // Checkout / Complete Sale
    const handleCheckout = async () => {
        if (cart.length === 0 || !customer.phone) {
            alert('Please add products and customer phone number.');
            return;
        }

        try {
            const saleData = {
                customer_name: customer.name || 'Walk-in Customer',
                customer_phone: customer.phone,
                items: cart,
                sub_total: subTotal,
                discount: 0,
                grand_total: grandTotal,
                paid_amount: Number(paidAmount),
                due_amount: dueAmount,
                payment_account_id: 1 // Default cash/bKash account ID
            };

            const res = await axios.post('http://localhost:5000/api/sales', saleData);
            if (res.data.success) {
                alert('Invoice Created Successfully & SMS Sent!');
                setCart([]);
                setCustomer({ name: '', phone: '' });
                setPaidAmount(0);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Failed to complete sale.');
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 p-4 gap-4">
            {/* Left: Product List */}
            <div className="w-2/3 bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-y-auto">
                <h2 className="text-xl font-bold text-amber-500 mb-4">SR Electronics Park - Inventory</h2>
                <div className="grid grid-cols-3 gap-3">
                    {products.map(prod => (
                        <div 
                            key={prod.id} 
                            onClick={() => addToCart(prod)}
                            className="bg-slate-800 p-3 rounded-lg border border-slate-700 cursor-pointer hover:border-amber-500 transition"
                        >
                            <h3 className="font-semibold">{prod.name}</h3>
                            <p className="text-sm text-sky-400">BDT {prod.selling_price}</p>
                            <p className="text-xs text-slate-400">Stock: {prod.stock_qty}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Billing Cart */}
            <div className="w-1/3 bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-amber-500 mb-3">Current Invoice</h2>
                    <input 
                        type="text" 
                        placeholder="Customer Name" 
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 p-2 rounded mb-2 text-sm"
                    />
                    <input 
                        type="text" 
                        placeholder="Customer Phone *" 
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 p-2 rounded mb-3 text-sm"
                    />

                    <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm bg-slate-800 p-2 rounded">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>BDT {item.total_price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                    <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-amber-400">BDT {grandTotal}</span>
                    </div>
                    <input 
                        type="number" 
                        placeholder="Paid Amount" 
                        value={paidAmount}
                        onChange={e => setPaidAmount(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm"
                    />
                    <div className="flex justify-between text-sm text-rose-400">
                        <span>Due:</span>
                        <span>BDT {dueAmount}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2 rounded transition"
                    >
                        Complete Sale & Send SMS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POSBilling;
