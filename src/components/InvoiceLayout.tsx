import React from 'react';

interface InvoiceItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface InvoiceData {
    invoice_no: string;
    date: string;
    customer_name: string;
    customer_phone: string;
    items: InvoiceItem[];
    sub_total: number;
    discount: number;
    grand_total: number;
    paid_amount: number;
    due_amount: number;
}

interface InvoiceLayoutProps {
    data: InvoiceData;
}

const InvoiceLayout: React.FC<InvoiceLayoutProps> = ({ data }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl my-8 print:shadow-none print:my-0 print:p-4 print:max-w-full">
            {/* Print Button (Hidden during printing) */}
            <div className="mb-6 flex justify-end print:hidden">
                <button
                    onClick={handlePrint}
                    className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                    Print Invoice
                </button>
            </div>

            {/* Invoice Printable Wrapper */}
            <div className="p-8 border border-gray-100 rounded-xl bg-white">
                
                {/* Header Section */}
                <div className="flex justify-between items-start pb-8 mb-8 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SALSABILA AMIN LIMITED</h1>
                        <p className="text-gray-600 font-medium mt-1">SR Electronics Park, Operations Hub</p>
                        <p className="text-gray-500 text-sm mt-0.5">Hotline: +880 1700-000000</p>
                    </div>
                    <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-full mb-2">
                            Official Invoice
                        </span>
                        <h2 className="text-xl font-bold text-gray-800">#{data.invoice_no}</h2>
                        <p className="text-gray-500 text-sm mt-1">Date: {data.date}</p>
                    </div>
                </div>

                {/* Customer Bill-To Section */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoiced To</h3>
                    <p className="text-lg font-bold text-gray-900">{data.customer_name}</p>
                    <p className="text-gray-600 text-sm">Phone: {data.customer_phone}</p>
                </div>

                {/* Items Table */}
                <div className="mb-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/50">
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Item Description</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Qty</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Unit Price</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.items.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50/50">
                                    <td className="py-3.5 px-4 text-gray-800 font-medium">{item.product_name}</td>
                                    <td className="py-3.5 px-4 text-gray-600 text-right">{item.quantity}</td>
                                    <td className="py-3.5 px-4 text-gray-600 text-right">৳{item.unit_price.toFixed(2)}</td>
                                    <td className="py-3.5 px-4 text-gray-900 font-semibold text-right">৳{item.total_price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Calculation Summary Section */}
                <div className="flex justify-end mb-10">
                    <div className="w-full max-w-xs space-y-2.5 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium">৳{data.sub_total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                            <span>Discount</span>
                            <span className="font-medium">- ৳{data.discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-900 text-base font-bold border-t border-gray-200 pt-2.5">
                            <span>Grand Total</span>
                            <span>৳{data.grand_total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 pt-1">
                            <span>Paid Amount</span>
                            <span className="font-medium">৳{data.paid_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600 font-semibold pt-1 border-t border-dashed border-gray-200">
                            <span>Due Balance</span>
                            <span>৳{data.due_amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer & Official Branding */}
                <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-800 font-medium text-sm">Thank you for your business with Salsabila Amin Limited!</p>
                    
                    <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">Co-operated & Powered by</span>
                        <span className="text-xs font-bold text-blue-600 tracking-wide">Gemini AI</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvoiceLayout;
