import React, { useState } from 'react';

export default function POSDashboard() {
    const [cart, setCart] = useState([]);
    const [barcode, setBarcode] = useState('');

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!barcode) return;
        // Mocking product addition
        const newItem = { id: Date.now(), name: `Product ${barcode}`, price: 500, quantity: 1 };
        setCart([...cart, newItem]);
        setBarcode('');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Salsabilah-Empire-OS POS Terminal</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-4 rounded shadow">
                    <form onSubmit={handleAddToCart} className="mb-4">
                        <input
                            type="text"
                            placeholder="Scan Barcode or Enter Product Name..."
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            className="w-full p-2 border rounded border-gray-300"
                        />
                    </form>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Item</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Qty</th>
                                <th className="p-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2">BDT {item.price}</td>
                                    <td className="p-2">{item.quantity}</td>
                                    <td className="p-2">BDT {item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Summary</h2>
                        <div className="flex justify-between mb-2 font-bold text-xl">
                            <span>Total:</span>
                            <span>BDT {calculateTotal()}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => alert('Checkout Successful!')}
                        className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
                    >
                        Complete Sale & Print
                    </button>
                </div>
            </div>
        </div>
    );
}
