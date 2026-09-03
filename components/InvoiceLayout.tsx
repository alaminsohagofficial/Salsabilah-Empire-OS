// Example usage in a parent component (e.g., PosDashboard.tsx)
const sampleInvoiceData = {
    invoice_no: "SAL-10050",
    date: "25/08/2026",
    customer_name: "MD. OBIDAL HOSSEN",
    customer_phone: "01757099214",
    items: [
        { id: 1, product_name: "Samsung Refrigerator RT38", quantity: 1, unit_price: 55000, total_price: 55000 },
        { id: 2, product_name: "Singer Blender", quantity: 1, unit_price: 4500, total_price: 4500 },
    ],
    sub_total: 59500,
    discount: 500,
    grand_total: 59000,
    paid_amount: 59000,
    due_amount: 0,
};

// Inside your render method:
// <InvoiceLayout data={sampleInvoiceData} />
