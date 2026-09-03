const sampleData = {
    invoice_no: "INV-2026-001",
    date: "04/09/2026",
    customer_name: "MD. AL AMIN SOHAG",
    customer_phone: "01700000000",
    items: [
        { id: 1, product_name: "Toyota LC300 Accessory / Electronics", quantity: 1, unit_price: 25000, total_price: 25000 }
    ],
    sub_total: 25000,
    discount: 1000,
    grand_total: 24000,
    paid_amount: 24000,
    due_amount: 0
};

// কম্পোনেন্ট কল করার পদ্ধতি:
// <InvoiceLayout data={sampleData} />
