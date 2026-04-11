import React from 'react';
import { Plus, Share2, FileText, FileSpreadsheet, FileJson, Download } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { PaymentRecord, PaymentStatus } from '../types';
import { PaymentTable } from '../payment-table';
import { AdvancedFiltersModal } from '../advanced-filters-modal';
import { PaymentModal } from '../add-payment-modal';
import { Employee } from '../components/employee-table';

interface PaymentTabProps {
  payments: PaymentRecord[];
  filteredPayments: PaymentRecord[];
  employees: Employee[];
  isDark: boolean;
  activeStatusFilter: PaymentStatus | null;
  setActiveStatusFilter: (status: PaymentStatus | null) => void;
  handleAddPayment: (data: any) => void;
  handleEditClick: (payment: PaymentRecord) => void;
  handleDeletePayment: (id: string) => void;
  handleStatusClick: (payment: PaymentRecord) => void;
  handleExport: (format: string) => void;
  StatusAnalytics: React.FC<any>;
  STATUS_CONFIG: any;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({
  payments,
  filteredPayments,
  employees,
  isDark,
  activeStatusFilter,
  setActiveStatusFilter,
  handleAddPayment,
  handleEditClick,
  handleDeletePayment,
  handleStatusClick,
  handleExport,
  StatusAnalytics,
  STATUS_CONFIG
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <AdvancedFiltersModal 
          onApply={() => {}} 
          isDark={isDark} 
          employees={employees}
        />

        <div className="flex items-center gap-3">
          <PaymentModal
            onSave={handleAddPayment}
            isDark={isDark}
            employees={employees}
            trigger={
              <button className="flex items-center gap-2 px-6 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-md font-bold transition-all shadow-lg shadow-[#ff4d00]/10 text-sm cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Add Payment</span>
              </button>
            }
          />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-md font-bold transition-all shadow-lg shadow-[#ff4d00]/10 text-sm">
                <Share2 className="w-4 h-4" />
                <span>Export</span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={`z-50 min-w-[160px] p-1 rounded-md shadow-xl border ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'} animate-in fade-in zoom-in-95 duration-200`}
                sideOffset={5}
              >
                <DropdownMenu.Label className={`px-2 py-2 text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Choose Format</DropdownMenu.Label>
                <DropdownMenu.Item className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer ${isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => handleExport('CSV')}>
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Export as CSV</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer ${isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => handleExport('Excel')}>
                  <FileSpreadsheet className="w-4 h-4 text-green-400" />
                  <span>Export as Excel</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer ${isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => handleExport('JSON')}>
                  <FileJson className="w-4 h-4 text-yellow-400" />
                  <span>Export as JSON</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={`h-px my-1 ${isDark ? 'bg-[#333]' : 'bg-gray-100'}`} />
                <DropdownMenu.Item className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer font-bold ${isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => handleExport('PDF')}>
                  <Download className="w-4 h-4 text-[#ff4d00]" />
                  <span>Print Report</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Payment Status Overview
          </h3>
          {activeStatusFilter && (
            <button onClick={() => setActiveStatusFilter(null)} className="text-[10px] text-[#ff4d00] hover:underline font-bold uppercase tracking-wider">
              Clear Filter
            </button>
          )}
        </div>
        <StatusAnalytics 
          payments={payments} 
          isDark={isDark} 
          activeStatusFilter={activeStatusFilter} 
          onStatusClick={(v: any) => setActiveStatusFilter(activeStatusFilter === v ? null : v)} 
        />
      </div>

      <PaymentTable
        payments={filteredPayments}
        onDelete={handleDeletePayment}
        onEdit={handleEditClick}
        onStatusClick={handleStatusClick}
        isDark={isDark}
        statusConfig={STATUS_CONFIG}
      />
    </div>
  );
};
