import React from 'react';

// আপনি চাইলে এই ইন্টারফেসটি আলাদা ফাইলে রাখতে পারেন
interface InvoiceData {
    invoice_no: string;
    date: string;
    customer_name: string;
    customer_phone: string;
    items: {
        id: number;
        product_name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }[];
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
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10 print:shadow-none print:my-0 print:max-w-full">
            {/* Print Button */}
            <div className="mb-6 flex justify-end print:hidden">
                <button
                    onClick={handlePrint}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Print Invoice
                </button>
            </div>

            {/* Invoice Content */}
            <div id="invoice-content" className="p-8 border border-gray-200 rounded-lg">
                {/* Header Section: Company Info & Branding */}
                <div className="flex justify-between items-start pb-6 mb-6 border-b border-gray-300">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">SALSSABILA AMIN LIMITED</h1>
                        <p className="text-gray-600">SR Electronics Park, [ঠিকানা এখানে]</p>
                        <p className="text-gray-600">Phone: [ফোন নম্বর এখানে]</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold text-gray-800">INVOICE</h2>
                        <p className="text-gray-700">Invoice No: #{data.invoice_no}</p>
                        <p className="text-gray-700">Date: {data.date}</p>
                    </div>
                </div>

                {/* Customer Info Section */}
                <div className="mb-8 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md border border-gray-100">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Billed To</h3>
                        <p className="text-lg font-medium text-gray-900">{data.customer_name}</p>
                        <p className="text-gray-700">Phone: {data.customer_phone}</p>
                    </div>
                </div>

                {/* Items Table Section */}
                <div className="mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-3 px-4 text-gray-600 font-semibold">Description</th>
                                <th className="py-3 px-4 text-gray-600 font-semibold text-right">Quantity</th>
                                <th className="py-3 px-4 text-gray-600 font-semibold text-right">Unit Price</th>
                                <th className="py-3 px-4 text-gray-600 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-4 text-gray-800">{item.product_name}</td>
                                    <td className="py-4 px-4 text-gray-800 text-right">{item.quantity}</td>
                                    <td className="py-4 px-4 text-gray-800 text-right">৳{item.unit_price.toFixed(2)}</td>
                                    <td className="py-4 px-4 text-gray-800 text-right font-medium">৳{item.total_price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total & Payment Section */}
                <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2">
                        <div className="flex justify-between text-gray-700">
                            <p>Subtotal</p>
                            <p>৳{data.sub_total.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <p>Discount</p>
                            <p>- ৳{data.discount.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-gray-900 text-xl font-bold border-t border-gray-300 pt-2 mt-2">
                            <p>Grand Total</p>
                            <p>৳{data.grand_total.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-gray-700 pt-2 mt-2 border-t border-gray-100">
                            <p>Paid Amount</p>
                            <p>৳{data.paid_amount.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-red-700 font-semibold">
                            <p>Due Amount</p>
                            <p>৳{data.due_amount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Section: Co-operated Branding */}
                <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center">
                    <p className="text-gray-800 font-semibold">Thank you for your business with Salssabila Amin Limited!</p>
                    <p className="text-sm text-gray-500 mt-3">This system is proudly powered and co-operated by</p>
                    <p className="text-base font-bold text-blue-700 tracking-wider">Gemini AI</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceLayout;
