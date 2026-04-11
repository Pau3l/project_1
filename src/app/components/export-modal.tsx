import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { 
  X, 
  FileText, 
  FileSpreadsheet, 
  Settings2,
  LayoutList,
  BarChart4,
  Download
} from 'lucide-react';
import { PaymentRecord } from '../types';
import { generateXLSX, downloadBlob } from '../utils/export-utils';
import { toast } from 'sonner';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: PaymentRecord[];
  isDark: boolean;
  onPreparePrint: (mode: 'detailed' | 'summary', includeSignatures: boolean) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onOpenChange,
  payments,
  isDark,
  onPreparePrint
}) => {
  const [mode, setMode] = useState<'detailed' | 'summary'>('detailed');
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);

  const handleExcelExport = () => {
    try {
      const blob = generateXLSX(payments, includeNotes);
      downloadBlob(blob, `wonderpay-audit-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Professional Excel Report downloaded');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to generate Excel report');
    }
  };

  const handlePrint = () => {
    onPreparePrint(mode, includeSignatures);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-[101] overflow-hidden focus:outline-none flex flex-col backdrop-blur-2xl animate-in zoom-in-95 fade-in duration-300"
          style={{
            background: isDark ? 'rgba(13,13,13,0.9)' : 'rgba(255,255,255,0.95)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
          }}
        >
          {/* Integrated Title Bar synced with Add Payment Modal */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#ff4d00]/10 flex items-center justify-center rounded-lg border border-[#ff4d00]/20 shadow-[0_0_15px_rgba(255,77,0,0.1)]">
                <Settings2 className="w-4 h-4 text-[#ff4d00]" />
              </div>
              <div>
                <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Report Configuration
                </h3>
                <p className={`text-[10px] font-medium uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  WonderPay Financial Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog.Close asChild>
                <button className={`p-2 rounded-lg transition-all duration-200 ${isDark ? "hover:bg-red-500/10 hover:text-red-400 text-gray-500" : "hover:bg-red-50 hover:text-red-500 text-gray-400"}`}>
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-white/[0.01]">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-[2px] w-8 bg-[#ff4d00]"></div>
              <h2 className="text-[#ff4d00] text-xs font-black uppercase tracking-[0.2em]">
                Export Preferences
              </h2>
            </div>

            <div className="space-y-6">
              {/* Report Mode Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setMode('detailed')}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 group ${
                    mode === 'detailed' 
                      ? 'bg-[#ff4d00]/10 border-[#ff4d00]/40 text-[#ff4d00]' 
                      : isDark ? 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/20' : 'bg-black/[0.02] border-black/[0.05] text-gray-500 hover:border-black/20'
                  }`}
                >
                   <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${mode === 'detailed' ? 'bg-[#ff4d00] text-white shadow-[0_0_15px_rgba(255,77,0,0.3)]' : isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'}`}>
                    <LayoutList className="w-4 h-4" />
                   </div>
                   <div className="text-left">
                     <p className="text-xs font-bold">Detailed Report</p>
                     <p className="text-[9px] opacity-70">Itemized audit trail</p>
                   </div>
                </button>
                <button 
                  onClick={() => setMode('summary')}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 group ${
                    mode === 'summary' 
                      ? 'bg-[#ff4d00]/10 border-[#ff4d00]/40 text-[#ff4d00]' 
                      : isDark ? 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/20' : 'bg-black/[0.02] border-black/[0.05] text-gray-500 hover:border-black/20'
                  }`}
                >
                   <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${mode === 'summary' ? 'bg-[#ff4d00] text-white shadow-[0_0_15px_rgba(255,77,0,0.3)]' : isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'}`}>
                    <BarChart4 className="w-4 h-4" />
                   </div>
                   <div className="text-left">
                     <p className="text-xs font-bold">Summary View</p>
                     <p className="text-[9px] opacity-70">Worker aggregations</p>
                   </div>
                </button>
              </div>

              {/* Toggles synced with AddPayment input aesthetics */}
              <div className={`p-5 rounded-xl space-y-4 border ${isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]'}`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className={`text-xs font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Include Worker Signatures</p>
                    <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Embed digital evidence in PDF output</p>
                  </div>
                  <Switch.Root 
                    checked={includeSignatures} 
                    onCheckedChange={setIncludeSignatures}
                    className={`w-10 h-5 rounded-full relative transition-colors ${includeSignatures ? 'bg-[#ff4d00]' : isDark ? 'bg-white/[0.1]' : 'bg-gray-300'}`}
                  >
                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[22px] shadow-sm" />
                  </Switch.Root>
                </div>

                <div className={`w-full h-px ${isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`} />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className={`text-xs font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Include Transaction Notes</p>
                    <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Add metadata and description columns</p>
                  </div>
                  <Switch.Root 
                    checked={includeNotes} 
                    onCheckedChange={setIncludeNotes}
                    className={`w-10 h-5 rounded-full relative transition-colors ${includeNotes ? 'bg-[#ff4d00]' : isDark ? 'bg-white/[0.1]' : 'bg-gray-300'}`}
                  >
                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[22px] shadow-sm" />
                  </Switch.Root>
                </div>
              </div>

              {/* Action Buttons synced with AddPayment submit aesthetics */}
              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handlePrint}
                  className="w-full bg-[#ff4d00] hover:bg-[#ff5d14] text-white font-bold py-3.5 px-8 rounded-xl transition-all active:scale-[0.98] text-sm shadow-[0_10px_20px_-5px_rgba(255,77,0,0.4)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform duration-500"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    <span>GENERATE FORMAL PDF REPORT</span>
                  </div>
                </button>
                
                  <button 
                    onClick={handleExcelExport}
                    className={`w-full py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      isDark ? 'bg-white/[0.05] border-white/[0.1] text-gray-300 hover:text-white hover:bg-white/[0.08]' : 'bg-black/[0.05] border-black/[0.08] text-gray-600 hover:text-gray-900 hover:bg-black/[0.08]'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <span>DOWNLOAD PROFESSIONAL EXCEL (.XLSX)</span>
                  </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
