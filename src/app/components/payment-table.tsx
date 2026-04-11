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
  statusConfig?: any;
}

const PaymentRow = React.memo(({ 
  payment, 
  onDelete, 
  onEdit, 
  setViewingSignature, 
  isDark,
  config
}: { 
  payment: PaymentRecord, 
  onDelete: (id: string) => void, 
  onEdit: (payment: PaymentRecord) => void,
  setViewingSignature: (p: PaymentRecord) => void,
  isDark: boolean,
  config?: any
}) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`transition-colors group ${
      isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-gray-50'
    }`}
  >
    <td className="px-6 py-5">
      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{payment.workerName}</span>
    </td>
    <td className="px-6 py-5">
      <span className="text-[#ff4d00] font-bold">
        GH₵{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
          {config ? (
            <div className="flex items-center gap-1.5">
              <div className={config.color}>{React.cloneElement(config.icon as React.ReactElement, { className: 'w-3 h-3' })}</div>
              <span className={`text-[11px] font-bold ${config.color}`}>
                {config.label}
              </span>
            </div>
          ) : (
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
          )}
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
));

PaymentRow.displayName = 'PaymentRow';

export const PaymentTable: React.FC<PaymentTableProps> = ({ payments, onDelete, onEdit, isDark = true, statusConfig }) => {
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
              <PaymentRow
                key={payment.id}
                payment={payment}
                onDelete={onDelete}
                onEdit={onEdit}
                setViewingSignature={setViewingSignature}
                isDark={isDark}
                config={statusConfig?.[payment.status]}
              />
            ))
          )}
        </tbody>
      </table>

      {/* Signature Viewer Modal */}
      <Dialog.Root open={!!viewingSignature} onOpenChange={(open) => !open && setViewingSignature(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] rounded-[24px] z-50 overflow-hidden focus:outline-none flex flex-col animate-in zoom-in-95 duration-300"
            style={{
              background: isDark ? 'radial-gradient(120% 120% at 50% 0%, rgba(255,77,0,0.15) 0%, transparent 100%), rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(24px)',
              boxShadow: isDark ? 'inset 0 1px 1px 0 rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.1)'
            }}
          >
            <Dialog.Title className="sr-only">Worker Signature</Dialog.Title>
            <Dialog.Description className="sr-only">Visual confirmation of worker signature for this payment.</Dialog.Description>
            
            <div className="px-6 py-5 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ff4d00]/10 flex items-center justify-center rounded-xl border border-[#ff4d00]/20 shadow-[0_0_15px_rgba(255,77,0,0.1)]">
                  <User className="w-5 h-5 text-[#ff4d00]" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Worker Signature
                  </h3>
                  <p className={`text-[10px] font-medium uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {viewingSignature?.workerName}
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-red-500/10 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}>
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className={`rounded-xl p-4 w-full flex items-center justify-center min-h-[220px] border relative overflow-hidden ${
                isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-gray-50 border-gray-200'
              }`}>
                {viewingSignature?.signature ? (
                  <img 
                    src={viewingSignature.signature} 
                    alt="Worker Signature" 
                    className="max-w-full h-auto max-h-[180px] object-contain relative z-10"
                  />
                ) : (
                  <div className="text-gray-400 italic text-sm flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 opacity-40" />
                    </div>
                    <span>No signature recorded for this transaction.</span>
                  </div>
                )}
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                  <User className="w-32 h-32" />
                </div>
              </div>

              <div className="mt-8 flex justify-end w-full">
                <Dialog.Close asChild>
                  <button className="bg-gradient-to-r from-[#ff4d00] to-[#ff6a33] text-white font-bold py-2.5 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm shadow-[0_0_15px_rgba(255,77,0,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] border border-transparent">
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
