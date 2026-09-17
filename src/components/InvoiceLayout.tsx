import React from 'react';

interface InvoiceProps {
    invoiceNo: string;
    date: string;
    customerName: string;
    customerPhone: string;
    items: Array<{ name: string; price: number; qty: number }>;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
}

export const InvoiceLayout: React.FC<InvoiceProps> = ({
    invoiceNo,
    date,
    customerName,
    customerPhone,
    items,
    totalAmount,
    paidAmount,
    dueAmount
}) => {
    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-slate-200 font-sans">
            <div className="text-center border-b pb-4 mb-4">
                <h2 className="text-xl font-black text-slate-900 tracking-wide">Salsabilah Amin Empires</h2>
                <p className="text-xs text-slate-600 font-semibold">SR Electronics Park, Chuadanga</p>
                <p className="text-[10px] text-slate-400 mt-1">Hotline: 017XXXXXXXX | Cloud POS System</p>
            </div>

            <div className="flex justify-between text-xs text-slate-700 mb-3">
                <div>
                    <p><span className="font-bold">Invoice ID:</span> #{invoiceNo}</p>
                    <p><span className="font-bold">Date:</span> {date}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Customer:</span> {customerName}</p>
                    <p><span className="font-bold">Phone:</span> {customerPhone}</p>
                </div>
            </div>

            <table className="w-full text-left text-xs mb-4 border-collapse">
                <thead>
                    <tr className="border-b border-slate-300 text-slate-600">
                        <th className="py-2">Item</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Price</th>
                        <th className="py-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                            <td className="py-2 font-medium text-slate-800">{item.name}</td>
                            <td className="py-2 text-center">{item.qty}</td>
                            <td className="py-2 text-right">৳{item.price}</td>
                            <td className="py-2 text-right font-bold">৳{item.price * item.qty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="space-y-1.5 text-xs border-t pt-3 border-slate-200">
                <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>৳{totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                    <span>Paid / Installment:</span>
                    <span>৳{paidAmount}</span>
                </div>
                <div className="flex justify-between text-amber-600 font-bold text-sm bg-amber-50 p-2 rounded">
                    <span>Due Balance:</span>
                    <span>৳{dueAmount}</span>
                </div>
            </div>

            <div className="mt-6 text-center text-[10px] text-slate-500 border-t pt-3">
                <p>Thank you for shopping with Salsabilah-Empire-OS.</p>
                <p className="mt-1 font-semibold text-slate-700">Architect: MD. AL AMIN SOHAG</p>
            </div>
        </div>
    );
};
