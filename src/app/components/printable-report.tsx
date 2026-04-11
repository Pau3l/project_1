import React from 'react';
import { PaymentRecord } from '../types';
import { getPaymentSummary } from '../utils/export-utils';

interface PrintableReportProps {
  payments: PaymentRecord[];
  mode: 'detailed' | 'summary';
  includeSignatures: boolean;
  isDark: boolean;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  payments,
  mode,
  includeSignatures,
  isDark
}) => {
  const summaryData = mode === 'summary' ? getPaymentSummary(payments) : [];
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div id="printable-report" className={`hidden print:block p-10 bg-white text-black min-h-screen font-sans`}>
      <style>{`
        @media print {
          @page { size: portrait; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; overflow: visible !important; }
          /* Hide everything by default during print */
          body > #root > div > *:not(#printable-report),
          body > #root > div > div > *:not(#printable-report),
          .no-print { 
            display: none !important; 
          }
          /* Ensure the report is visible and takes full width */
          #printable-report {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-[#ff4d00] pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#ff4d00] uppercase">WONDERPAY</h1>
          <p className="text-gray-500 font-bold tracking-widest text-xs mt-1">DISBURSEMENT REPORT</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Report Generated Automatically</p>
        </div>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Payout</p>
          <p className="text-2xl font-black text-[#ff4d00]">₵{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Records</p>
          <p className="text-2xl font-black">{payments.length}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Report Mode</p>
          <p className="text-2xl font-black uppercase tracking-tight">{mode}</p>
        </div>
      </div>

      {/* Report Content */}
      {mode === 'detailed' ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#ff4d00] text-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">Worker</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">Method</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map(p => (
              <React.Fragment key={p.id}>
                <tr>
                  <td className="px-4 py-4 text-sm font-bold">{p.workerName}</td>
                  <td className="px-4 py-4 text-xs text-gray-600">{p.date}</td>
                  <td className="px-4 py-4 text-xs text-gray-600">{p.method}</td>
                  <td className="px-4 py-4 text-right text-sm font-black">₵{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                {includeSignatures && p.signature && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 bg-gray-50/50">
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Worker Signature:</span>
                        <img src={p.signature} alt="Signature" className="h-10 object-contain mix-blend-multiply" />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#ff4d00] text-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">Worker Name</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase">Trans. Count</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">Methods Used</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {summaryData.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-4 text-sm font-bold">{item.workerName}</td>
                <td className="px-4 py-4 text-center text-sm font-medium">{item.paymentCount}</td>
                <td className="px-4 py-4 text-xs text-gray-600">{item.methods}</td>
                <td className="px-4 py-4 text-right text-sm font-black">₵{item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Footer */}
      <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">Authorized Signature</p>
          <div className="w-64 border-b-2 border-dashed border-gray-300 h-10" />
        </div>
        <div className="text-right italic text-gray-400 text-[10px]">
          Confidence in every transaction. WonderPay Secure Reporting Core.
        </div>
      </div>
    </div>
  );
};
