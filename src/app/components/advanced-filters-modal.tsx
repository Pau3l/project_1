import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  ChevronDown, 
  Filter, 
  Calendar, 
  CreditCard, 
  Users, 
  Wallet, 
  RotateCcw,
  Plus,
  SlidersHorizontal,
  Search,
  Minus,
  Square,
  Activity,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { Employee } from './employee-table';

interface AdvancedFiltersModalProps {
  onApply: (filters: any) => void;
  isDark?: boolean;
  employees?: Employee[];
  initialFilters?: any;
}

export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({ 
  onApply, 
  isDark = true,
  employees = [],
  initialFilters
}) => {
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState(initialFilters || {
    dateEnabled: false,
    fromDate: '2026-01-06',
    toDate: '2026-02-06',
    amountEnabled: false,
    minAmount: '0.00',
    maxAmount: '999999.00',
    workerEnabled: false,
    worker: 'All Workers',
    methodEnabled: false,
    method: 'All Methods',
    statusEnabled: false,
    status: 'All Statuses',
    signatureEnabled: false,
    signatureStatus: 'All',
    notesEnabled: false,
    notesQuery: '',
  });

  useEffect(() => {
    if (open && initialFilters) {
      setFilters(initialFilters);
    }
  }, [open, initialFilters]);

  const handleApply = () => {
    onApply(filters);
    setOpen(false);
  };

  const handleClearAll = () => {
    setFilters({
      dateEnabled: false,
      fromDate: '2026-01-06',
      toDate: '2026-02-06',
      amountEnabled: false,
      minAmount: '0.00',
      maxAmount: '999999.00',
      workerEnabled: false,
      worker: 'All Workers',
      methodEnabled: false,
      method: 'All Methods',
      statusEnabled: false,
      status: 'All Statuses',
      signatureEnabled: false,
      signatureStatus: 'All',
      notesEnabled: false,
      notesQuery: '',
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className={`group flex items-center gap-2.5 px-5 py-2.5 border rounded-xl font-bold transition-all duration-300 text-xs shadow-lg backdrop-blur-md ${
          isDark 
            ? "bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-[#ff4d00]/10 hover:border-[#ff4d00]/30 hover:text-white" 
            : "bg-black/[0.02] border-black/[0.08] text-gray-700 hover:bg-[#ff4d00]/10 hover:border-[#ff4d00]/30 hover:text-gray-900"
        }`}>
          <div className="w-5 h-5 bg-[#ff4d00]/10 flex items-center justify-center rounded-lg border border-[#ff4d00]/20 group-hover:scale-110 transition-transform duration-300">
            <SlidersHorizontal className="w-3 h-3 text-[#ff4d00]" />
          </div>
          <span>Advanced Filters</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 animate-in fade-in duration-300" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-50 overflow-hidden focus:outline-none flex flex-col max-h-[95vh] backdrop-blur-2xl animate-in zoom-in-95 fade-in duration-300"
          style={{
            background: isDark ? 'rgba(13,13,13,0.9)' : 'rgba(255,255,255,0.95)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
          }}
        >
          <Dialog.Title className="sr-only">Advanced Filters</Dialog.Title>
          <Dialog.Description className="sr-only">Filter payments by date range, amount range, worker, or payment method.</Dialog.Description>

          {/* Modern Integrated Title Bar - Synced with Add Payment Modal */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
            <div className={`flex items-center gap-3`}>
              <div className="w-8 h-8 bg-[#ff4d00]/10 flex items-center justify-center rounded-lg border border-[#ff4d00]/20 shadow-[0_0_15px_rgba(255,77,0,0.1)]">
                <div className="relative">
                  <Filter className="w-4 h-4 text-[#ff4d00]" />
                  <div className={`absolute -top-1 -right-1 w-2 h-2 bg-[#ff4d00] rounded-full animate-pulse border ${isDark ? "border-[#0d0d0d]" : "border-white"}`}></div>
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  Advanced Filters
                </h3>
                <p className={`text-[10px] font-medium uppercase tracking-widest leading-none mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Refine Search Parameters
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-lg transition-all duration-200 ${isDark ? "hover:bg-white/[0.05] text-gray-500 hover:text-gray-300" : "hover:bg-black/[0.05] text-gray-400 hover:text-gray-600"}`}>
                <Minus className="w-4 h-4" />
              </button>
              <button className={`p-2 rounded-lg transition-all duration-200 ${isDark ? "hover:bg-white/[0.05] text-gray-500 hover:text-gray-300" : "hover:bg-black/[0.05] text-gray-400 hover:text-gray-600"}`}>
                <Square className="w-3.5 h-3.5" />
              </button>
              <Dialog.Close asChild>
                <button className={`p-2 rounded-lg transition-all duration-200 ${isDark ? "hover:bg-red-500/10 hover:text-red-400 text-gray-500" : "hover:bg-red-50 hover:text-red-500 text-gray-400"}`}>
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-transparent to-white/[0.01]">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-[2px] w-8 bg-[#ff4d00]"></div>
              <h2 className="text-[#ff4d00] text-xs font-black uppercase tracking-[0.2em]">
                Filter Parameters
              </h2>
            </div>
            <div className="space-y-4">
              {/* Date Range Section */}
              <div className={`grid grid-cols-[140px_1fr] items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                isDark ? "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.01] hover:bg-black/[0.02]"
              }`}>
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-[#ff4d00]" />
                    Date Range:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="dateEnabled"
                      className={`w-4 h-4 rounded text-[#ff4d00] focus:ring-[#ff4d00] transition-all cursor-pointer ${
                        isDark ? "border-white/[0.1] bg-white/[0.05]" : "border-black/[0.1] bg-black/[0.05]"
                      }`}
                      checked={filters.dateEnabled}
                      onChange={(e) => setFilters({ ...filters, dateEnabled: e.target.checked })}
                    />
                  </div>
                </div>
                
                <div className={`grid grid-cols-2 gap-3 transition-all duration-300 ${filters.dateEnabled ? 'opacity-100 scale-100' : 'opacity-40 scale-[0.98] blur-[1px] pointer-events-none'}`}>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-1">From:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        className={`w-full px-3 py-2 text-xs rounded-xl transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                          isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                        }`}
                        value={filters.fromDate}
                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-1">To:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        className={`w-full px-3 py-2 text-xs rounded-xl transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                          isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                        }`}
                        value={filters.toDate}
                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Range Section */}
              <div className={`grid grid-cols-[140px_1fr] items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                isDark ? "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.01] hover:bg-black/[0.02]"
              }`}>
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-3 h-3 text-[#ff4d00]" />
                    Amount (₵):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="amountEnabled"
                      className={`w-4 h-4 rounded text-[#ff4d00] focus:ring-[#ff4d00] transition-all cursor-pointer ${
                        isDark ? "border-white/[0.1] bg-white/[0.05]" : "border-black/[0.1] bg-black/[0.05]"
                      }`}
                      checked={filters.amountEnabled}
                      onChange={(e) => setFilters({ ...filters, amountEnabled: e.target.checked })}
                    />
                  </div>
                </div>
                
                <div className={`grid grid-cols-2 gap-3 transition-all duration-300 ${filters.amountEnabled ? 'opacity-100 scale-100' : 'opacity-40 scale-[0.98] blur-[1px] pointer-events-none'}`}>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-1">Min Amount:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0.00"
                        className={`w-full px-3 py-2 text-xs rounded-xl transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                          isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                        }`}
                        value={filters.minAmount}
                        onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-1">Max Amount:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="999999.00"
                        className={`w-full px-3 py-2 text-xs rounded-xl transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                          isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                        }`}
                        value={filters.maxAmount}
                        onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorical Section */}
              <div className="grid grid-cols-2 gap-3">
                {/* Worker selection */}
                <div className={`p-4 rounded-xl border transition-all duration-200 ${isDark ? "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.01] hover:bg-black/[0.02]"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-3 h-3 text-[#ff4d00]" />
                      Worker Filter
                    </label>
                    <input
                      type="checkbox"
                      className={`w-4 h-4 rounded text-[#ff4d00] focus:ring-[#ff4d00] cursor-pointer ${isDark ? "border-white/[0.1] bg-white/[0.05]" : "border-black/[0.1] bg-black/[0.05]"}`}
                      checked={filters.workerEnabled}
                      onChange={(e) => setFilters({ ...filters, workerEnabled: e.target.checked })}
                    />
                  </div>
                  <div className={`relative transition-all duration-300 ${filters.workerEnabled ? 'opacity-100' : 'opacity-40 blur-[1px] pointer-events-none'}`}>
                    <select
                      className={`w-full px-4 py-2 text-xs rounded-xl appearance-none transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                        isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                      }`}
                      value={filters.worker}
                      onChange={(e) => setFilters({ ...filters, worker: e.target.value })}
                    >
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>All Workers</option>
                      {employees && employees.map(e => <option key={e.id} className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>{e.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Method selection */}
                <div className={`p-4 rounded-xl border transition-all duration-200 ${isDark ? "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.01] hover:bg-black/[0.02]"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                      <Wallet className="w-3 h-3 text-[#ff4d00]" />
                      Payment Method Filter
                    </label>
                    <input
                      type="checkbox"
                      className={`w-4 h-4 rounded text-[#ff4d00] focus:ring-[#ff4d00] cursor-pointer ${isDark ? "border-white/[0.1] bg-white/[0.05]" : "border-black/[0.1] bg-black/[0.05]"}`}
                      checked={filters.methodEnabled}
                      onChange={(e) => setFilters({ ...filters, methodEnabled: e.target.checked })}
                    />
                  </div>
                  <div className={`relative transition-all duration-300 ${filters.methodEnabled ? 'opacity-100' : 'opacity-40 blur-[1px] pointer-events-none'}`}>
                    <select
                      className={`w-full px-4 py-2 text-xs rounded-xl appearance-none transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                        isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                      }`}
                      value={filters.method}
                      onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                    >
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>All Methods</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Cash</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Cheque</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Bank Transfer</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Mobile Money</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Status selection */}
                <div className={`p-4 rounded-xl border transition-all duration-200 ${isDark ? "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.01] hover:bg-black/[0.02]"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-3 h-3 text-[#ff4d00]" />
                      Status
                    </label>
                    <input
                      type="checkbox"
                      className={`w-4 h-4 rounded text-[#ff4d00] focus:ring-[#ff4d00] cursor-pointer ${isDark ? "border-white/[0.1] bg-white/[0.05]" : "border-black/[0.1] bg-black/[0.05]"}`}
                      checked={filters.statusEnabled}
                      onChange={(e) => setFilters({ ...filters, statusEnabled: e.target.checked })}
                    />
                  </div>
                  <div className={`relative transition-all duration-300 ${filters.statusEnabled ? 'opacity-100' : 'opacity-40 blur-[1px] pointer-events-none'}`}>
                    <select
                      className={`w-full px-4 py-2 text-xs rounded-xl appearance-none transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                        isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                      }`}
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>All Statuses</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Pending</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Processing</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Completed</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Failed</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Refunded</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>On Hold</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Signature selection */}
                <div className={`p-4 rounded-xl border transition-all duration-200 ${isDark ? "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.01] hover:bg-black/[0.02]"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-3 h-3 text-[#ff4d00]" />
                      Signature
                    </label>
                    <input
                      type="checkbox"
                      className={`w-4 h-4 rounded text-[#ff4d00] focus:ring-[#ff4d00] cursor-pointer ${isDark ? "border-white/[0.1] bg-white/[0.05]" : "border-black/[0.1] bg-black/[0.05]"}`}
                      checked={filters.signatureEnabled}
                      onChange={(e) => setFilters({ ...filters, signatureEnabled: e.target.checked })}
                    />
                  </div>
                  <div className={`relative transition-all duration-300 ${filters.signatureEnabled ? 'opacity-100' : 'opacity-40 blur-[1px] pointer-events-none'}`}>
                    <select
                      className={`w-full px-4 py-2 text-xs rounded-xl appearance-none transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                        isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                      }`}
                      value={filters.signatureStatus}
                      onChange={(e) => setFilters({ ...filters, signatureStatus: e.target.value })}
                    >
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>All</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Signed</option>
                      <option className={isDark ? "bg-[#0d0d0d]" : "bg-white text-gray-900"}>Unsigned</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Notes query */}
                <div className={`col-span-2 p-4 rounded-xl border transition-all duration-200 ${isDark ? "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.01] hover:bg-black/[0.02]"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-[#ff4d00]" />
                      Notes / Description
                    </label>
                    <input
                      type="checkbox"
                      className={`w-4 h-4 rounded text-[#ff4d00] focus:ring-[#ff4d00] cursor-pointer ${isDark ? "border-white/[0.1] bg-white/[0.05]" : "border-black/[0.1] bg-black/[0.05]"}`}
                      checked={filters.notesEnabled}
                      onChange={(e) => setFilters({ ...filters, notesEnabled: e.target.checked })}
                    />
                  </div>
                  <div className={`relative transition-all duration-300 ${filters.notesEnabled ? 'opacity-100' : 'opacity-40 blur-[1px] pointer-events-none'}`}>
                    <input
                      type="text"
                      placeholder="Keyword in notes..."
                      className={`w-full px-4 py-2 text-xs rounded-xl transition-all focus:outline-none focus:border-[#ff4d00]/50 border ${
                        isDark ? "bg-white/[0.03] border-white/[0.08] text-gray-200" : "bg-black/[0.02] border-black/[0.08] text-gray-800"
                      }`}
                      value={filters.notesQuery}
                      onChange={(e) => setFilters({ ...filters, notesQuery: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`pt-8 flex gap-4 sticky bottom-0 pb-2 mt-4 border-t ${isDark ? "bg-[#0d0d0d] border-white/[0.06]" : "bg-white border-black/[0.06]"}`}>
              <div className="flex-1 flex gap-3">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-6 py-3.5 rounded-xl text-amber-500 hover:text-white hover:bg-amber-500/10 transition-all font-bold text-xs border border-amber-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className={`flex-1 px-8 py-3.5 rounded-xl font-bold text-xs transition-all duration-200 border whitespace-nowrap ${
                      isDark 
                        ? "text-gray-400 hover:text-white border-white/[0.05] hover:bg-white/[0.03]" 
                        : "text-gray-600 hover:text-gray-900 border-black/[0.05] hover:bg-black/[0.03]"
                    }`}
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
              <button
                type="button"
                onClick={handleApply}
                className="flex-[2] bg-[#ff4d00] hover:bg-[#ff5d14] text-white font-bold py-3.5 px-8 rounded-xl transition-all active:scale-[0.98] text-xs shadow-[0_10px_20px_-5px_rgba(255,77,0,0.4)] relative overflow-hidden group uppercase tracking-widest"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform duration-500"></div>
                <span className="relative z-10">Apply Filters</span>
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
