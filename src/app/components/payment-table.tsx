import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Trash2, Edit2, CheckCircle2, Clock, Eye, X, User } from 'lucide-react';
import { motion } from 'motion/react';

export interface PaymentRecord {
  id: string;
  workerName: string;
  amount: number;
  date: string;
  method: string;
  notes: string;
  status: 'Completed' | 'Pending' | 'Processing';
  recordedAt: string;
  signature?: string;
}

interface PaymentTableProps {
  payments: PaymentRecord[];
  onDelete: (id: string) => void;
  onEdit: (payment: PaymentRecord) => void;
  isDark?: boolean;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ payments, onDelete, onEdit, isDark = true }) => {
  const [viewingSignature, setViewingSignature] = useState<PaymentRecord | null>(null);

  return (
    <div className={`w-full overflow-hidden rounded-sm border ${
      isDark ? 'border-[#1a1a1a]' : 'border-gray-200 bg-white'
    }`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm uppercase tracking-wider`}>
            <th className="px-6 py-4 font-bold border-b-2 border-[#ff4d00]">Worker Name</th>
            <th className="px-6 py-4 font-bold border-b-2 border-[#ff4d00]">Amount</th>
            <th className="px-6 py-4 font-bold border-b-2 border-[#ff4d00]">Date</th>
            <th className="px-6 py-4 font-bold border-b-2 border-[#ff4d00]">Method</th>
            <th className="px-6 py-4 font-bold border-b-2 border-[#ff4d00]">Notes/Status</th>
            <th className="px-6 py-4 font-bold border-b-2 border-[#ff4d00]">Recorded At</th>
            <th className="px-6 py-4 font-bold border-b-2 border-[#ff4d00] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-[#1a1a1a]' : 'divide-gray-100'}`}>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-20 text-center text-gray-500 italic">
                No payment records found. Add your first payment to get started.
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={payment.id}
                className={`transition-colors group ${
                  isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-5">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{payment.workerName}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[#ff4d00] font-bold">
                    ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-5 text-gray-400 text-sm">{payment.date}</td>
                <td className="px-6 py-5">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {payment.method}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm truncate max-w-[200px]`}>
                      {payment.notes || '—'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {payment.status === 'Completed' ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-500" />
                      )}
                      <span className={`text-[11px] ${
                        payment.status === 'Completed' ? 'text-green-500' : 'text-amber-500'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-500 text-xs">
                  {payment.recordedAt}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setViewingSignature(payment)}
                      title="View Signature"
                      className="p-1.5 hover:text-[#ff4d00] text-gray-500 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(payment)}
                      title="Edit Record"
                      className="p-1.5 hover:text-[#ff4d00] text-gray-500 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(payment.id)}
                      title="Delete Record"
                      className="p-1.5 hover:text-red-500 text-gray-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      title="Remove Column Entry"
                      className="p-1.5 hover:text-white text-gray-500 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>

      {/* Signature Viewer Modal */}
      <Dialog.Root open={!!viewingSignature} onOpenChange={(open) => !open && setViewingSignature(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-[#1a1a1a] border border-[#333] rounded-sm shadow-2xl z-50 overflow-hidden focus:outline-none flex flex-col">
            <Dialog.Title className="sr-only">Worker Signature</Dialog.Title>
            <Dialog.Description className="sr-only">Visual confirmation of worker signature for this payment.</Dialog.Description>
            
            {/* Windows-style Title Bar */}
            <div className="flex items-center justify-between bg-[#f0f0f0] px-2 py-1 text-xs text-gray-700 shrink-0">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span>Signature Viewer - {viewingSignature?.workerName}</span>
              </div>
              <Dialog.Close asChild>
                <button className="p-1 hover:bg-red-500 hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-6 flex flex-col items-center">
              <h2 className="text-[#ff4d00] text-sm font-bold uppercase mb-6 tracking-wide w-full">
                Verification Signature
              </h2>
              
              <div className="bg-white rounded-sm p-4 w-full flex items-center justify-center min-h-[200px] border border-gray-300 shadow-inner">
                {viewingSignature?.signature ? (
                  <img 
                    src={viewingSignature.signature} 
                    alt="Worker Signature" 
                    className="max-w-full h-auto max-h-[160px] object-contain"
                  />
                ) : (
                  <div className="text-gray-400 italic text-sm flex flex-col items-center gap-3">
                    <Clock className="w-8 h-8 opacity-20" />
                    <span>No signature recorded for this transaction.</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end w-full">
                <Dialog.Close asChild>
                  <button className="bg-[#ff4d00] hover:bg-[#ff5d14] text-white font-bold py-2 px-8 rounded-md transition-all text-sm shadow-lg shadow-[#ff4d00]/20">
                    Close Viewer
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
