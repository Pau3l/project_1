import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sidebar } from './components/sidebar';
import { PaymentTable } from './components/payment-table';
import { PaymentRecord, PaymentStatus, ShortcutConfig, PendingDeletion } from './types';
import { AnalyticsDashboard } from './components/analytics-dashboard';
import { PaymentModal } from './components/add-payment-modal';
import { AdvancedFiltersModal } from './components/advanced-filters-modal';
import { ShortcutModal } from './components/shortcut-modal';
import { SettingsModal } from './components/settings-modal';
import { DeleteConfirmationModal } from './components/delete-confirmation-modal';
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
  Upload,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Activity,
  Trash2,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Enhanced status type with workflow support

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
  },
  'Cancelled': {
    label: 'Cancelled',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    icon: <AlertCircle className="w-4 h-4" />,
    description: 'Payment was cancelled by user or system',
    allowedTransitions: []
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
              {(['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'On Hold', 'Cancelled'] as PaymentStatus[]).map((status, idx) => (
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
const StatusAnalytics: React.FC<{ 
  payments: PaymentRecord[]; 
  isDark: boolean;
  activeStatusFilter: PaymentStatus | null;
  onStatusClick: (status: PaymentStatus) => void;
}> = ({ payments, isDark, activeStatusFilter, onStatusClick }) => {
  const statusCounts = useMemo(() => {
    const counts: Record<PaymentStatus, number> = {
      'Pending': 0, 'Processing': 0, 'Completed': 0,
      'Failed': 0, 'Refunded': 0, 'On Hold': 0, 'Cancelled': 0
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
    <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6`}>
      {(Object.keys(STATUS_CONFIG) as PaymentStatus[]).map((status) => {
        const config = STATUS_CONFIG[status];
        const count = statusCounts[status];
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        const isActive = activeStatusFilter === status;
        
        return (
          <button 
            key={status} 
            onClick={() => onStatusClick(status)}
            className={`p-3 rounded-lg border transition-all text-left group
              ${isActive ? 'scale-[1.03] shadow-md ring-2 ring-[#ff4d00]/50' : 'hover:scale-[1.03]'} 
              ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'}
            `}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className={config.color}>{React.cloneElement(config.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}</div>
              <span className={`text-[10px] font-semibold uppercase tracking-tight ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {config.label}
              </span>
            </div>
            <div className={`text-xl font-black leading-none mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {count}
            </div>
            <div className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              {percentage}% of total
            </div>
          </button>
        );
      })}
    </div>
  );
};

const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
  { id: 'search', label: 'Focus Search', key: '/' },
  { id: 'add_payment', label: 'New Payment', key: 'Alt+N' },
  { id: 'toggle_sidebar', label: 'Toggle Sidebar', key: 'Ctrl+B' },
  { id: 'open_shortcuts', label: 'Keyboard Center', key: 'Ctrl+K' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'payment' | 'analytic'>('payment');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Shortcut State
  const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>(() => {
    try {
      const saved = localStorage.getItem('pt-shortcuts');
      return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
    } catch {
      return DEFAULT_SHORTCUTS;
    }
  });

  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // --- Settings State Management ---
  // We manage the toggle settings here globally so they persist across views.
  // We initialize the local state by reading from localStorage to maintain user preferences across page reloads.
  const [showWallet, setShowWallet] = useState(() => {
    try {
      const saved = localStorage.getItem('pt-show-wallet');
      return saved !== null ? JSON.parse(saved) : true; // Defaults to true initially
    } catch { return true; }
  });

  const [showKnowledgeBase, setShowKnowledgeBase] = useState(() => {
    try {
      const saved = localStorage.getItem('pt-show-kb');
      return saved !== null ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  // Whenever the toggle states change triggered from the SettingsModal, sync the boolean to localStorage
  useEffect(() => {
    localStorage.setItem('pt-show-wallet', JSON.stringify(showWallet));
  }, [showWallet]);

  useEffect(() => {
    localStorage.setItem('pt-show-kb', JSON.stringify(showKnowledgeBase));
  }, [showKnowledgeBase]);

  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pt-search-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('pt-design-payments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load payments from localStorage', e);
    }
    return INITIAL_DATA;
  });
  
  const [isDark, setIsDark] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist Shortcuts
  useEffect(() => {
    localStorage.setItem('pt-shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  // Persist Search History
  useEffect(() => {
    localStorage.setItem('pt-search-history', JSON.stringify(searchHistory.slice(0, 5)));
  }, [searchHistory]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (unless it's the shortcut modal or specific keys)
      if (
        (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) &&
        !['Escape'].includes(e.key)
      ) {
        return;
      }

      const pressedKey = [];
      if (e.ctrlKey) pressedKey.push('Ctrl');
      if (e.altKey) pressedKey.push('Alt');
      if (e.shiftKey) pressedKey.push('Shift');
      if (e.metaKey) pressedKey.push('Meta');
      
      const keyName = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
        pressedKey.push(keyName);
      }
      
      const fullKey = pressedKey.join('+');

      const matchedShortcut = shortcuts.find(s => s.key === fullKey || s.key === e.key);

      if (matchedShortcut) {
        e.preventDefault();
        switch (matchedShortcut.id) {
          case 'search':
            searchInputRef.current?.focus();
            break;
          case 'add_payment':
            setIsEditModalOpen(false); // Close edit if open
            setTimeout(() => {
              // Trigger add - we'll need a state for "Add" vs "Edit" modal
              // For now, just open the modal with no initial data
              setEditingPayment(null);
              setIsEditModalOpen(true);
            }, 50);
            break;
          case 'toggle_sidebar':
            setSidebarCollapsed(prev => !prev);
            break;
          case 'open_shortcuts':
            setIsShortcutModalOpen(true);
            break;
        }
      }

      if (e.key === 'Escape') {
        setSearchQuery('');
        setIsShortcutModalOpen(false);
        setIsEditModalOpen(false);
        setIsStatusModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, sidebarCollapsed]);

  // Handle Search Update with History
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchHistory(prev => {
        const filtered = prev.filter(h => h !== val);
        return [val, ...filtered].slice(0, 5);
      });
    }
  };

  const handleUpdateShortcut = (id: string, newKey: string) => {
    setShortcuts(prev => prev.map(s => s.id === id ? { ...s, key: newKey } : s));
    toast.success(`Shortcut for ${id} updated to ${newKey}`);
  };

  const handleResetShortcuts = () => {
    setShortcuts(DEFAULT_SHORTCUTS);
    toast.info('Shortcuts reset to defaults');
  };

  // State for editing
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for status workflow
  const [statusModalPayment, setStatusModalPayment] = useState<PaymentRecord | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  // Dashboard Status Filter
  const [activeStatusFilter, setActiveStatusFilter] = useState<PaymentStatus | null>(null);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = 
        p.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.status.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = activeStatusFilter ? p.status === activeStatusFilter : true;
      
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, activeStatusFilter]);

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

  const executeDeletion = React.useCallback(() => {
    if (!pendingDeletion) return;
    const { ids, isBulk } = pendingDeletion;
    const deletedPayments = payments.filter(p => ids.includes(p.id));
    setPayments(prev => prev.filter(p => !ids.includes(p.id)));

    toast.error(`${isBulk ? `${ids.length} records` : 'Payment record'} deleted`, {
      action: {
        label: 'Undo',
        onClick: () => {
          setPayments(prev => [...deletedPayments, ...prev]);
        }
      },
      duration: 5000,
    });

    setIsDeleteModalOpen(false);
    setPendingDeletion(null);
    setIsEditModalOpen(false);
  }, [pendingDeletion, payments]);

  const handleDeletePayment = React.useCallback((id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setPendingDeletion({
        ids: [id],
        label: payment.workerName,
        isBulk: false
      });
      setIsDeleteModalOpen(true);
    }
  }, [payments]);

  const handleBulkDelete = React.useCallback((ids: string[]) => {
    setPendingDeletion({
      ids,
      label: `${ids.length} selected records`,
      isBulk: true
    });
    setIsDeleteModalOpen(true);
  }, []);

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
    try {
      const dataToExport = filteredPayments.length > 0 ? filteredPayments : payments;
      let content = '';
      let mimeType = '';
      let extension = '';

      if (format === 'PDF') {
        window.print();
        return;
      } else if (format === 'JSON') {
        content = JSON.stringify(dataToExport, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else if (format === 'CSV' || format === 'Excel') {
        // Simple CSV generation
        const headers = ['ID', 'Date', 'Worker Name', 'Amount', 'Method', 'Status', 'Notes'];
        const rows = dataToExport.map(p => [
          p.id,
          p.date,
          `"${(p.workerName || '').replace(/"/g, '""')}"`,
          p.amount,
          `"${p.method}"`,
          `"${p.status}"`,
          `"${(p.notes || '').replace(/"/g, '""')}"`
        ]);
        content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        
        mimeType = format === 'Excel' ? 'application/vnd.ms-excel' : 'text/csv';
        extension = 'csv'; 
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-export.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Data exported to ${format} successfully!`);
    } catch (e) {
      toast.error('Export failed. Please try again.');
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        let importedData: any[] = [];

        if (file.name.endsWith('.json')) {
          importedData = JSON.parse(result);
        } else if (file.name.endsWith('.csv')) {
          const lines = result.split('\n');
          importedData = lines.slice(1).filter(l => l.trim()).map(line => {
            const values = line.split(',');
            return {
              id: values[0] || Math.random().toString(36).substr(2, 9),
              date: values[1] || new Date().toISOString().split('T')[0],
              workerName: (values[2] || '').replace(/(^"|"$)/g, ''),
              amount: Number(values[3]) || 0,
              method: (values[4] || 'Bank Transfer').replace(/(^"|"$)/g, ''),
              status: (values[5] || 'Completed').replace(/(^"|"$)/g, ''),
              notes: (values[6] || '').replace(/(^"|"$)/g, ''),
              recordedAt: new Date().toLocaleString()
            };
          });
        }

        if (Array.isArray(importedData)) {
          const validRecords: PaymentRecord[] = importedData.map(d => ({
            id: d.id || Math.random().toString(36).substr(2, 9),
            workerName: d.workerName || 'Unknown Worker',
            amount: Number(d.amount) || 0,
            date: d.date || new Date().toISOString().split('T')[0],
            method: d.method || 'Bank Transfer',
            notes: d.notes || '',
            status: d.status || 'Completed',
            recordedAt: d.recordedAt || new Date().toLocaleString()
          }));
          
          setPayments(prev => [...validRecords, ...prev]);
          toast.success(`Successfully imported ${validRecords.length} payment records!`);
        } else {
          toast.error('Invalid file format. Ensure the data is properly formatted.');
        }
      } catch (error) {
        toast.error('Failed to parse the import file.');
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#121212] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        pendingDeletion={pendingDeletion}
        onConfirm={executeDeletion}
        isDark={isDark}
      />

      <Toaster position="bottom-right" theme={isDark ? 'dark' : 'light'} richColors closeButton />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        onOpenShortcuts={() => setIsShortcutModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        showWallet={showWallet}
        showKnowledgeBase={showKnowledgeBase}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className={`flex items-center justify-between h-16 px-8 flex-shrink-0 border-b transition-colors duration-200 ${
          isDark ? 'bg-[#121212]/80 border-white/[0.06]' : 'bg-white/80 border-black/[0.06]'
        } backdrop-blur-lg sticky top-0 z-30`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {activeTab === 'payment' ? 'Payment Management' : 'Analytics Overview'}
            </h2>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {activeTab === 'payment' ? 'Track, manage, and process all payments' : 'Insights and reporting dashboard'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments or workers..."
                className={`w-72 pl-4 pr-10 py-2 border rounded-lg text-sm focus:outline-none transition-all duration-200 ${
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-gray-300 placeholder:text-gray-600 focus:border-[#ff4d00]/50 focus:bg-white/[0.06]'
                    : 'bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-[#ff4d00]/50'
                }`}
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              
              {/* Search History Dropdown (Simplified) */}
              {searchHistory.length > 0 && searchQuery === '' && (
                <div className={`absolute top-full left-0 w-full mt-1 p-2 rounded-lg border shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
                  isDark ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-gray-200'
                }`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2 py-1">Recent Searches</p>
                  {searchHistory.map((h, i) => (
                    <button 
                      key={i}
                      onClick={() => setSearchQuery(h)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-white/5 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-6 overflow-y-auto">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <AdvancedFiltersModal onApply={(f) => toast.info('Filters applied')} />

            <div className="flex items-center gap-3">
              <PaymentModal
                onSave={handleAddPayment}
                trigger={
                  <button className="flex items-center gap-2 px-5 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#ff4d00]/10 text-sm cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Add Payment</span>
                  </button>
                }
              />

              {/* Import Button & File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv,.json"
                onChange={handleFileImport}
              />
              <button 
                onClick={handleImportClick}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all text-sm border ${
                  isDark 
                    ? 'bg-white/[0.04] text-gray-300 border-white/[0.08] hover:bg-white/[0.08]' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>

              {/* Export Dropdown */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 px-5 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#ff4d00]/10 text-sm">
                    <Share2 className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className={`z-50 min-w-[180px] p-1.5 rounded-xl shadow-2xl border ${
                      isDark ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-gray-200'
                    } animate-in fade-in zoom-in-95 duration-200`}
                    sideOffset={5}
                  >
                    <DropdownMenu.Label className={`px-2 py-2 text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Choose Format
                    </DropdownMenu.Label>

                    <DropdownMenu.Item
                      className={`flex items-center gap-2 px-2 py-2 text-sm rounded-lg cursor-pointer outline-none transition-colors ${isDark ? 'text-gray-300 hover:bg-white/[0.06]' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleExport('CSV')}
                    >
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>Export as CSV</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className={`flex items-center gap-2 px-2 py-2 text-sm rounded-lg cursor-pointer outline-none transition-colors ${isDark ? 'text-gray-300 hover:bg-white/[0.06]' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleExport('Excel')}
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-400" />
                      <span>Export as Excel</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className={`flex items-center gap-2 px-2 py-2 text-sm rounded-lg cursor-pointer outline-none transition-colors ${isDark ? 'text-gray-300 hover:bg-white/[0.06]' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleExport('JSON')}
                    >
                      <FileJson className="w-4 h-4 text-yellow-400" />
                      <span>Export as JSON</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className={`h-px my-1 ${isDark ? 'bg-white/[0.06]' : 'bg-gray-100'}`} />

                    <DropdownMenu.Item
                      className={`flex items-center gap-2 px-2 py-2 text-sm rounded-lg cursor-pointer outline-none transition-colors font-bold ${isDark ? 'text-gray-300 hover:bg-white/[0.06]' : 'text-gray-700 hover:bg-gray-100'}`}
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
              <StatusAnalytics 
                payments={payments} 
                isDark={isDark} 
                activeStatusFilter={activeStatusFilter}
                onStatusClick={(status) => setActiveStatusFilter(prev => prev === status ? null : status)}
              />
            </div>
          )}

          {/* Content Area */}
          {activeTab === 'payment' ? (
            <PaymentTable 
              payments={filteredPayments} 
              onDelete={handleDeletePayment}
              onBulkDelete={handleBulkDelete}
              onEdit={handleEditClick}
              onStatusClick={handleStatusClick}
              isDark={isDark} 
              statusConfig={STATUS_CONFIG}
            />
          ) : (
            <AnalyticsDashboard 
              payments={payments} 
              isDark={isDark} 
              onFilter={(val) => {
                setSearchQuery(val);
                setActiveTab('payment');
              }}
            />
          )}
        </main>
      </div>

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

      {/* Shortcut Center Modal */}
      <ShortcutModal 
        open={isShortcutModalOpen}
        onOpenChange={setIsShortcutModalOpen}
        shortcuts={shortcuts}
        onUpdateShortcut={handleUpdateShortcut}
        onReset={handleResetShortcuts}
        isDark={isDark}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isDark={isDark}
        showWallet={showWallet}
        setShowWallet={setShowWallet}
        showKnowledgeBase={showKnowledgeBase}
        setShowKnowledgeBase={setShowKnowledgeBase}
      />
    </div>
  );
}