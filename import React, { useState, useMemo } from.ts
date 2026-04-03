import React, { useState, useMemo } from 'react';
import { Header } from './components/header';
import { PaymentTable, PaymentRecord } from './components/payment-table';
import { AnalyticsDashboard } from './components/analytics-dashboard';
import { PaymentModal } from './components/add-payment-modal';
import { AdvancedFiltersModal } from './components/advanced-filters-modal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
  Receipt, 
  BarChart3, 
  Share2, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Download,
  Plus
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

const INITIAL_DATA: PaymentRecord[] = [
  {
    id: '1',
    workerName: 'Alex Johnson',
    amount: 1250.00,
    date: '2026-02-05',
    method: 'Bank Transfer',
    notes: 'Monthly project bonus',
    status: 'Completed',
    recordedAt: '2026-02-05 10:30 AM'
  },
  {
    id: '2',
    workerName: 'Sarah Williams',
    amount: 3400.00,
    date: '2026-02-03',
    method: 'Mobile Money',
    notes: 'Website redesign - Phase 1',
    status: 'Processing',
    recordedAt: '2026-02-03 04:15 PM'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'payment' | 'analytic'>('payment');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_DATA);
  const [isDark, setIsDark] = useState(true);
  
  // State for editing
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => 
      p.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.method.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [payments, searchQuery]);

  const handleAddPayment = (newPayment: Omit<PaymentRecord, 'id' | 'recordedAt'>) => {
    const record: PaymentRecord = {
      ...newPayment,
      id: Math.random().toString(36).substr(2, 9),
      recordedAt: new Date().toLocaleString([], { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
      })
    };
    setPayments([record, ...payments]);
    toast.success('Payment record added successfully!');
  };

  const handleUpdatePayment = (updatedData: Omit<PaymentRecord, 'id' | 'recordedAt'>) => {
    if (!editingPayment) return;
    
    setPayments(payments.map(p => 
      p.id === editingPayment.id 
        ? { ...p, ...updatedData } 
        : p
    ));
    setEditingPayment(null);
    setIsEditModalOpen(false);
    toast.success('Payment record updated successfully!');
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
    toast.error('Payment record deleted');
  };

  const handleEditClick = (payment: PaymentRecord) => {
    setEditingPayment(payment);
    setIsEditModalOpen(true);
  };

  const handleExport = (format: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Preparing ${format} export...`,
        success: `Data exported to ${format} successfully!`,
        error: 'Export failed. Please try again.',
      }
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#121212] text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <Toaster position="bottom-right" theme={isDark ? 'dark' : 'light'} />
      
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)} 
      />

      <main className="px-6 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-8 py-2 rounded-sm font-bold transition-all text-sm ${
              activeTab === 'payment' 
                ? 'bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20' 
                : isDark ? 'bg-[#2a2a2a] text-gray-300' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Receipt className="w-4 h-4 fill-current" />
            <span>Payment</span>
          </button>
          <button
            onClick={() => setActiveTab('analytic')}
            className={`flex items-center gap-2 px-8 py-2 rounded-sm font-bold transition-all text-sm ${
              activeTab === 'analytic' 
                ? 'bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20' 
                : isDark ? 'bg-[#2a2a2a] text-gray-300' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytic</span>
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <AdvancedFiltersModal onApply={(f) => toast.info('Filters applied')} />

          <div className="flex items-center gap-3">
            <PaymentModal 
              onSave={handleAddPayment} 
              trigger={
                <button className="flex items-center gap-2 px-6 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-md font-bold transition-all shadow-lg shadow-[#ff4d00]/10 text-sm cursor-pointer">
                  <Plus className="w-4 h-4" />
                  <span>Add Payment</span>
                </button>
              }
            />
            
            {/* Export Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 px-6 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-md font-bold transition-all shadow-lg shadow-[#ff4d00]/10 text-sm">
                  <Share2 className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className={`z-50 min-w-[160px] p-1 rounded-md shadow-xl border ${
                    isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'
                  } animate-in fade-in zoom-in-95 duration-200`}
                  sideOffset={5}
                >
                  <DropdownMenu.Label className={`px-2 py-2 text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Choose Format
                  </DropdownMenu.Label>
                  
                  <DropdownMenu.Item 
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors ${
                      isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleExport('CSV')}
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Export as CSV</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item 
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors ${
                      isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleExport('Excel')}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-400" />
                    <span>Export as Excel</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item 
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors ${
                      isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleExport('JSON')}
                  >
                    <FileJson className="w-4 h-4 text-yellow-400" />
                    <span>Export as JSON</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className={`h-px my-1 ${isDark ? 'bg-[#333]' : 'bg-gray-100'}`} />

                  <DropdownMenu.Item 
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors font-bold ${
                      isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleExport('PDF')}
                  >
                    <Download className="w-4 h-4 text-[#ff4d00]" />
                    <span>Print Report (PDF)</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'payment' ? (
          <PaymentTable 
            payments={filteredPayments} 
            onDelete={handleDeletePayment} 
            onEdit={handleEditClick} 
            isDark={isDark}
          />
        ) : (
          <AnalyticsDashboard isDark={isDark} />
        )}
      </main>

      {/* Edit Payment Modal */}
      <PaymentModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={editingPayment || undefined}
        onSave={handleUpdatePayment}
      />
    </div>
  );
}
