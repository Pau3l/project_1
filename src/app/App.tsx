import React, { useState, useMemo } from 'react';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';
import { PaymentTable, PaymentRecord } from './components/payment-table';
import { AnalyticsDashboard } from './components/analytics-dashboard';
import { PaymentModal } from './components/add-payment-modal';
import { AdvancedFiltersModal } from './components/advanced-filters-modal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Receipt,
  BarChart3,
  Share2,
  FileText,
  FileSpreadsheet,
  FileJson,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Activity
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Enhanced status type with workflow support
type PaymentStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Refunded' | 'On Hold';

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  description: string;
  allowedTransitions: PaymentStatus[];
}

const STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  'Pending': {
    label: 'Pending',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    icon: <Clock className="w-4 h-4" />,
    description: 'Payment initiated, awaiting processing',
    allowedTransitions: ['Processing', 'Completed', 'Failed', 'On Hold']
  },
  'Processing': {
    label: 'Processing',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    icon: <RefreshCw className="w-4 h-4 animate-spin" />,
    description: 'Payment is being processed',
    allowedTransitions: ['Completed', 'Failed', 'On Hold']
  },
  'Completed': {
    label: 'Completed',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: 'Payment successfully completed',
    allowedTransitions: ['Refunded']
  },
  'Failed': {
    label: 'Failed',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    icon: <XCircle className="w-4 h-4" />,
    description: 'Payment failed or was declined',
    allowedTransitions: ['Pending', 'Processing']
  },
  'Refunded': {
    label: 'Refunded',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    icon: <Activity className="w-4 h-4" />,
    description: 'Payment has been refunded',
    allowedTransitions: []
  },
  'On Hold': {
    label: 'On Hold',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    icon: <AlertCircle className="w-4 h-4" />,
    description: 'Payment temporarily suspended',
    allowedTransitions: ['Processing', 'Failed', 'Pending']
  }
};

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
  },
  {
    id: '3',
    workerName: 'Mike Chen',
    amount: 890.00,
    date: '2026-02-10',
    method: 'PayPal',
    notes: 'Consulting hours',
    status: 'Pending',
    recordedAt: '2026-02-10 09:00 AM'
  }
];

// Status Badge Component
const StatusBadge: React.FC<{ status: PaymentStatus; isDark: boolean }> = ({ status, isDark }) => {
  const config = STATUS_CONFIG[status];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border border-current border-opacity-20`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

// Status Workflow Modal
interface StatusWorkflowModalProps {
  payment: PaymentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (paymentId: string, newStatus: PaymentStatus) => void;
  isDark: boolean;
}

const StatusWorkflowModal: React.FC<StatusWorkflowModalProps> = ({
  payment, open, onOpenChange, onStatusChange, isDark
}) => {
  if (!payment) return null;

  const currentConfig = STATUS_CONFIG[payment.status as PaymentStatus];
  const availableTransitions = currentConfig.allowedTransitions;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 rounded-xl shadow-2xl z-50 animate-in zoom-in-95 duration-200 ${isDark ? 'bg-[#1a1a1a] border border-[#333]' : 'bg-white border border-gray-200'
          }`}>
          <Dialog.Title className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Update Payment Status
          </Dialog.Title>
          <Dialog.Description className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage the payment lifecycle and determine the current state of this transaction.
          </Dialog.Description>

          {/* Current Status Display */}
          <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-[#252525]' : 'bg-gray-50'}`}>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Current Status</div>
            <div className="flex items-center gap-3">
              <StatusBadge status={payment.status as PaymentStatus} isDark={isDark} />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentConfig.description}
              </span>
            </div>
          </div>

          {/* Available Transitions */}
          <div className="space-y-3">
            <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-3`}>
              Available Transitions
            </div>

            {availableTransitions.length === 0 ? (
              <div className={`text-sm italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No further transitions available for this status.
              </div>
            ) : (
              availableTransitions.map((nextStatus) => {
                const config = STATUS_CONFIG[nextStatus];
                return (
                  <button
                    key={nextStatus}
                    onClick={() => {
                      onStatusChange(payment.id, nextStatus);
                      onOpenChange(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all group ${isDark
                        ? 'border-[#333] hover:border-[#ff4d00] hover:bg-[#252525]'
                        : 'border-gray-200 hover:border-[#ff4d00] hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        {React.cloneElement(config.icon as React.ReactElement, { className: `w-5 h-5 ${config.color}` })}
                      </div>
                      <div className="text-left">
                        <div className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                          {config.label}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {config.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-colors ${isDark ? 'text-gray-600 group-hover:text-[#ff4d00]' : 'text-gray-400 group-hover:text-[#ff4d00]'
                      }`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Workflow Visualization */}
          <div className={`mt-6 pt-6 border-t ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
            <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-4`}>
              Status Workflow
            </div>
            <div className="flex flex-wrap gap-2">
              {(['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'On Hold'] as PaymentStatus[]).map((status, idx) => (
                <React.Fragment key={status}>
                  <div className={`px-2 py-1 rounded text-xs ${status === payment.status
                      ? 'bg-[#ff4d00] text-white font-bold'
                      : isDark ? 'bg-[#252525] text-gray-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {status}
                  </div>
                  {idx < 5 && (
                    <div className={`flex items-center ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                      →
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <Dialog.Close asChild>
            <button className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}>
              <XCircle className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// Status Analytics Component
const StatusAnalytics: React.FC<{ payments: PaymentRecord[]; isDark: boolean }> = ({ payments, isDark }) => {
  const statusCounts = useMemo(() => {
    const counts: Record<PaymentStatus, number> = {
      'Pending': 0, 'Processing': 0, 'Completed': 0,
      'Failed': 0, 'Refunded': 0, 'On Hold': 0
    };
    payments.forEach(p => {
      if (counts[p.status as PaymentStatus] !== undefined) {
        counts[p.status as PaymentStatus]++;
      }
    });
    return counts;
  }, [payments]);

  const total = payments.length;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6`}>
      {(Object.keys(STATUS_CONFIG) as PaymentStatus[]).map((status) => {
        const config = STATUS_CONFIG[status];
        const count = statusCounts[status];
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={status} className={`p-4 rounded-lg border transition-all hover:scale-105 ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={config.color}>{config.icon}</div>
              <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {config.label}
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {count}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              {percentage}% of total
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'payment' | 'analytic'>('payment');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_DATA);
  const [isDark, setIsDark] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // State for editing
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for status workflow
  const [statusModalPayment, setStatusModalPayment] = useState<PaymentRecord | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const filteredPayments = useMemo(() => {
    return payments.filter(p =>
      p.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.status.toLowerCase().includes(searchQuery.toLowerCase())
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

  // New: Handle status determination/change
  const handleStatusClick = (payment: PaymentRecord) => {
    setStatusModalPayment(payment);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = (paymentId: string, newStatus: PaymentStatus) => {
    const oldStatus = payments.find(p => p.id === paymentId)?.status;

    setPayments(payments.map(p =>
      p.id === paymentId
        ? { ...p, status: newStatus }
        : p
    ));

    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Status Updated</span>
        <span className="text-xs opacity-90">
          Changed from <span className="font-medium">{oldStatus}</span> to <span className="font-medium">{newStatus}</span>
        </span>
      </div>
    );
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#121212] text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}>
      <Toaster position="bottom-right" theme={isDark ? 'dark' : 'light'} />

      <div className="flex min-h-screen">
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} 
          isDark={isDark} 
        />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDark={isDark}
            toggleTheme={() => setIsDark(!isDark)}
            onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          />

          <main className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-8 py-2 rounded-sm font-bold transition-all text-sm ${activeTab === 'payment'
                ? 'bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20'
                : isDark ? 'bg-[#2a2a2a] text-gray-300' : 'bg-white border border-gray-200 text-gray-600'
              }`}
          >
            <Receipt className="w-4 h-4 fill-current" />
            <span>Payment</span>
          </button>
          <button
            onClick={() => setActiveTab('analytic')}
            className={`flex items-center gap-2 px-8 py-2 rounded-sm font-bold transition-all text-sm ${activeTab === 'analytic'
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
                  className={`z-50 min-w-[160px] p-1 rounded-md shadow-xl border ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'
                    } animate-in fade-in zoom-in-95 duration-200`}
                  sideOffset={5}
                >
                  <DropdownMenu.Label className={`px-2 py-2 text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Choose Format
                  </DropdownMenu.Label>

                  <DropdownMenu.Item
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors ${isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => handleExport('CSV')}
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Export as CSV</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors ${isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => handleExport('Excel')}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-400" />
                    <span>Export as Excel</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors ${isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => handleExport('JSON')}
                  >
                    <FileJson className="w-4 h-4 text-yellow-400" />
                    <span>Export as JSON</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className={`h-px my-1 ${isDark ? 'bg-[#333]' : 'bg-gray-100'}`} />

                  <DropdownMenu.Item
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer outline-none transition-colors font-bold ${isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-gray-700 hover:bg-gray-100'
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

        {/* Status Analytics Dashboard */}
        {activeTab === 'payment' && (
          <div className="mb-6">
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Payment Status Overview
            </h3>
            <StatusAnalytics payments={payments} isDark={isDark} />
          </div>
        )}

        {/* Content Area */}
        {activeTab === 'payment' ? (
          <PaymentTable
            payments={filteredPayments}
            onDelete={handleDeletePayment}
            onEdit={handleEditClick}
            onStatusClick={handleStatusClick}  // New prop for status management
            isDark={isDark}
            statusConfig={STATUS_CONFIG}  // Pass status config for rendering
          />
        ) : (
          <AnalyticsDashboard payments={payments} isDark={isDark} />
        )}
      </main>

      {/* Edit Payment Modal */}
      <PaymentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={editingPayment || undefined}
        onSave={handleUpdatePayment}
      />

      {/* Status Workflow Modal */}
      <StatusWorkflowModal
        payment={statusModalPayment}
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        onStatusChange={handleStatusChange}
        isDark={isDark}
      />
        </div>
      </div>
    </div>
  );
}