import React, { useState } from 'react';
import axios from 'axios';

export default function AILeadAuditWidget() {
    const [accountId, setAccountId] = useState('DEAL002905');
    const [amount, setAmount] = useState('');
    const [auditResult, setAuditResult] = useState(null);

    const runAudit = async () => {
        try {
            const res = await axios.post('/api/transaction', {
                account_id: accountId,
                amount: parseFloat(amount),
                type: 'CREDIT',
                description: 'Manual Enterprise Audit Request'
            });
            setAuditResult(res.data.ai_audit);
        } catch (err) {
            alert('Audit failed: ' + err.message);
        }
    };

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '400px', margin: '20px auto' }}>
            <h3>👑 Gemini AI Ledger Audit</h3>
            <input type="text" value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="Account ID" style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Transaction Amount (BDT)" style={{ width: '100%', marginBottom: '15px', padding: '8px' }} />
            <button onClick={runAudit} style={{ width: '100%', background: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Run AI Audit & Verification
            </button>
            {auditResult && (
                <div style={{ marginTop: '15px', background: '#e9ecef', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
                    <strong>Audit Report:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{auditResult}</pre>
                </div>
            )}
        </div>
    );
}
