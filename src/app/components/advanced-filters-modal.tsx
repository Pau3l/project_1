import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, HelpCircle, ChevronDown, Play } from 'lucide-react';

interface AdvancedFiltersModalProps {
  onApply: (filters: any) => void;
}

export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({ onApply }) => {
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
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
  });

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
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-[#2a2a2a] border border-[#333] rounded-sm text-gray-100 font-bold hover:bg-[#333] transition-colors text-xs">
          <div className="w-4 h-4 bg-[#3b82f6] flex items-center justify-center rounded-[1px]">
            <Play className="w-2.5 h-2.5 text-white fill-white rotate-90" />
          </div>
          <span>Advanced Filters</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-[#1a1a1a] border border-[#333] rounded-sm shadow-2xl z-50 overflow-hidden focus:outline-none flex flex-col max-h-[95vh]">
          <Dialog.Title className="sr-only">Advanced Filters</Dialog.Title>
          <Dialog.Description className="sr-only">Filter payments by date range, amount range, worker, or payment method.</Dialog.Description>

          {/* Windows-style Title Bar */}
          <div className="flex items-center justify-between bg-white px-2 py-1 text-[11px] text-gray-700 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border border-gray-400 flex items-center justify-center">
                <div className="w-2 h-2 border-t border-l border-gray-500"></div>
              </div>
              <span>Advanced Filters</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-200 transition-colors"><HelpCircle className="w-3 h-3 text-gray-500" /></button>
              <Dialog.Close asChild>
                <button className="p-1 px-2 hover:bg-[#e81123] hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            <h2 className="text-[#ff4d00] text-sm font-bold uppercase tracking-wide mb-1">
              Advanced Filters
            </h2>

            <div className="space-y-4 py-2">
              {/* Date Range Section */}
              <div className="border border-[#333] p-4 rounded-sm relative mt-2 pt-6">
                <span className="absolute -top-2 left-4 bg-[#1a1a1a] px-2 text-[10px] text-gray-200 uppercase font-bold tracking-tight">Date Range</span>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <label className="text-gray-400 text-xs">From:</label>
                    <div className="relative group">
                      <input
                        type="text"
                        className="w-full bg-[#121212] border border-[#333] px-3 py-1 text-xs text-gray-200 focus:outline-none focus:border-[#444]"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <label className="text-gray-400 text-xs">To:</label>
                    <div className="relative group">
                      <input
                        type="text"
                        className="w-full bg-[#121212] border border-[#333] px-3 py-1 text-xs text-gray-200 focus:outline-none focus:border-[#444]"
                        value={filters.toDate}
                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      className="w-3 h-3 appearance-none border border-[#444] rounded-[1px] bg-white checked:bg-white checked:border-[#ff4d00] relative checked:after:content-[''] checked:after:absolute checked:after:left-[3px] checked:after:top-[0px] checked:after:w-[4px] checked:after:h-[7px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-[#ff4d00] checked:after:rotate-45"
                      checked={filters.dateEnabled}
                      onChange={(e) => setFilters({ ...filters, dateEnabled: e.target.checked })}
                    />
                    <span className="text-gray-400 text-[11px]">Enable date filter</span>
                  </label>
                </div>
              </div>

              {/* Amount Range Section */}
              <div className="border border-[#333] p-4 rounded-sm relative pt-6">
                <span className="absolute -top-2 left-4 bg-[#1a1a1a] px-2 text-[10px] text-gray-200 uppercase font-bold tracking-tight">Amount Range</span>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <label className="text-gray-400 text-xs">Min Amount:</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-[#121212] border border-[#333] px-3 py-1 text-xs text-gray-200 focus:outline-none focus:border-[#444]"
                        value={filters.minAmount}
                        onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col -space-y-1">
                        <ChevronDown className="w-2.5 h-2.5 text-gray-500 rotate-180" />
                        <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <label className="text-gray-400 text-xs">Max Amount:</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-[#121212] border border-[#333] px-3 py-1 text-xs text-gray-200 focus:outline-none focus:border-[#444]"
                        value={filters.maxAmount}
                        onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col -space-y-1">
                        <ChevronDown className="w-2.5 h-2.5 text-gray-500 rotate-180" />
                        <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      className="w-3 h-3 appearance-none border border-[#444] rounded-[1px] bg-white checked:bg-white checked:border-[#ff4d00] relative checked:after:content-[''] checked:after:absolute checked:after:left-[3px] checked:after:top-[0px] checked:after:w-[4px] checked:after:h-[7px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-[#ff4d00] checked:after:rotate-45"
                      checked={filters.amountEnabled}
                      onChange={(e) => setFilters({ ...filters, amountEnabled: e.target.checked })}
                    />
                    <span className="text-gray-400 text-[11px]">Enable amount filter</span>
                  </label>
                </div>
              </div>

              {/* Worker Section */}
              <div className="border border-[#333] p-4 rounded-sm relative pt-6">
                <span className="absolute -top-2 left-4 bg-[#1a1a1a] px-2 text-[10px] text-gray-200 uppercase font-bold tracking-tight">Worker</span>
                <div className="space-y-2.5">
                  <div className="relative">
                    <select
                      className="w-full bg-[#121212] border border-[#333] px-3 py-1.5 text-xs text-gray-200 focus:outline-none appearance-none"
                      value={filters.worker}
                      onChange={(e) => setFilters({ ...filters, worker: e.target.value })}
                    >
                      <option>All Workers</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-3 h-3 appearance-none border border-[#444] rounded-[1px] bg-white checked:bg-white checked:border-[#ff4d00] relative checked:after:content-[''] checked:after:absolute checked:after:left-[3px] checked:after:top-[0px] checked:after:w-[4px] checked:after:h-[7px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-[#ff4d00] checked:after:rotate-45"
                      checked={filters.workerEnabled}
                      onChange={(e) => setFilters({ ...filters, workerEnabled: e.target.checked })}
                    />
                    <span className="text-gray-400 text-[11px]">Enable worker filter</span>
                  </label>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="border border-[#333] p-4 rounded-sm relative pt-6">
                <span className="absolute -top-2 left-4 bg-[#1a1a1a] px-2 text-[10px] text-gray-200 uppercase font-bold tracking-tight">Payment Method</span>
                <div className="space-y-2.5">
                  <div className="relative">
                    <select
                      className="w-full bg-[#121212] border border-[#333] px-3 py-1.5 text-xs text-gray-200 focus:outline-none appearance-none"
                      value={filters.method}
                      onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                    >
                      <option>All Methods</option>
                      <option>Cash</option>
                      <option>Check</option>
                      <option>Bank Transfer</option>
                      <option>Mobile Money</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-3 h-3 appearance-none border border-[#444] rounded-[1px] bg-white checked:bg-white checked:border-[#ff4d00] relative checked:after:content-[''] checked:after:absolute checked:after:left-[3px] checked:after:top-[0px] checked:after:w-[4px] checked:after:h-[7px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-[#ff4d00] checked:after:rotate-45"
                      checked={filters.methodEnabled}
                      onChange={(e) => setFilters({ ...filters, methodEnabled: e.target.checked })}
                    />
                    <span className="text-gray-400 text-[11px]">Enable payment method filter</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3 sticky bottom-0 bg-[#1a1a1a] pb-2">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 bg-[#333] hover:bg-[#3d3d3d] text-white font-bold py-2 rounded-sm text-[11px] transition-colors"
              >
                Clear All
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 bg-[#333] hover:bg-[#3d3d3d] text-white font-bold py-2 rounded-sm text-[11px] transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleApply}
                className="flex-[1.5] bg-[#ff4d00] hover:bg-[#ff5d14] text-white font-bold py-2 rounded-sm text-[11px] transition-colors shadow-lg shadow-[#ff4d00]/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
