import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BrandCatalog = () => {
    const [products, setProducts] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('All');

    useEffect(() => {
        axios.get('http://localhost:5000/api/integrated-products')
            .then(res => setProducts(res.data.data))
            .catch(err => console.error('Error fetching catalog:', err));
    }, []);

    const filteredProducts = selectedBrand === 'All' 
        ? products 
        : products.filter(p => p.brand_name === selectedBrand);

    return (
        <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">👑 SR Electronics Park - Multi-Brand POS</h2>
            
            {/* Brand Filter Tabs */}
            <div className="flex gap-4 mb-6">
                {['All', 'Minister', 'MyOne', 'Butterfly'].map(brand => (
                    <button 
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                            selectedBrand === brand ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}
                    >
                        {brand}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-4 gap-4">
                {filteredProducts.map(prod => (
                    <div key={prod.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-bold">{prod.brand_name}</span>
                        <h3 className="font-bold mt-2 text-sm">{prod.product_name}</h3>
                        <p className="text-amber-400 font-semibold mt-1">BDT {prod.selling_price}</p>
                        <p className="text-xs text-slate-400 mt-1">Stock: {prod.current_stock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrandCatalog;
