import React, { useState } from 'react';

export default function AILeadAuditWidget() {
    const [auditStatus, setAuditStatus] = useState('Idle');
    const [auditReport, setAuditReport] = useState(null);

    const runAiAudit = () => {
        setAuditStatus('Analyzing...');
        setTimeout(() => {
            setAuditStatus('Completed');
            setAuditReport({
                totalLeads: 434,
                activeBuyers: 380,
                riskScore: 'Low (Optimized)',
                recommendation: 'Send automated SMS reminders to top 15 overdue accounts via Salsabilah Gateway.'
            });
        }, 1200);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
                <div>
                    <h2 className="font-bold text-sm text-slate-900">AI Lead Audit & Intelligence Widget</h2>
                    <p className="text-xs text-slate-500">Salsabilah-Empire-OS Core Analyzer</p>
                </div>
                <button
                    onClick={runAiAudit}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow"
                >
                    {auditStatus === 'Analyzing...' ? 'Analyzing...' : 'Run AI Audit'}
                </button>
            </div>

            {auditReport && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Total Analyzed Leads:</span>
                        <span className="font-bold text-slate-800">{auditReport.totalLeads}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Active Buyers:</span>
                        <span className="font-bold text-emerald-700">{auditReport.activeBuyers}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">System Risk Status:</span>
                        <span className="font-bold text-blue-600">{auditReport.riskScore}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="font-semibold text-slate-700">AI Recommendation:</p>
                        <p className="text-slate-600 mt-0.5">{auditReport.recommendation}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
