import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import { PendingDeletion } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingDeletion: PendingDeletion | null;
  onConfirm: () => void;
  isDark: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen, onOpenChange, pendingDeletion, onConfirm, isDark
}) => {
  if (!pendingDeletion) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] animate-in fade-in duration-200" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] rounded-[24px] z-[90] overflow-hidden focus:outline-none flex flex-col animate-in zoom-in-95 fade-in duration-300"
          style={{
            background: isDark ? 'radial-gradient(120% 120% at 50% 0%, rgba(239,68,68,0.1) 0%, transparent 100%), rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(24px)',
            boxShadow: isDark ? 'inset 0 1px 1px 0 rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.1)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
          }}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <Dialog.Title className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Confirm Deletion
                </Dialog.Title>
                <Dialog.Description className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Are you sure you want to delete {pendingDeletion.isBulk ? 'these records' : 'this record'}?
                  <span className={`block mt-2 font-semibold ${isDark ? 'text-red-400' : 'text-red-500'}`}>
                    Target: {pendingDeletion.label}
                  </span>
                </Dialog.Description>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  isDark ? 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}>
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={onConfirm}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all active:scale-[0.98] border border-transparent"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
