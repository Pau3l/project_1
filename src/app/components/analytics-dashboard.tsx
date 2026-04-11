import React, { useState, useMemo } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  CreditCard, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { PaymentRecord } from '../types';
import { transformPaymentsToAnalytics, METHOD_COLORS } from '../utils/analytics-utils';

// ============================================
// CONSTANTS
// ============================================
const COLORS = ['#ff4d00', '#ff7b42', '#ffa985', '#ffd7c7', '#ff5500'];

// ============================================
// STAT CARD COMPONENT (Internal)
// ============================================

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  isDark: boolean;
}

function StatCard({ label, value, icon, trend, isDark }: StatCardProps) {
  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 ${
      isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]' : 'bg-black/[0.01] border-black/[0.08] hover:bg-black/[0.02]'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
        <div className="p-1.5 bg-[#ff4d00]/10 rounded-lg border border-[#ff4d00]/20">
          <span className="text-[#ff4d00]">{icon}</span>
        </div>
      </div>
      <div className="flex items-end justify-between mt-3">
        <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</span>
        <div className="flex items-center gap-1 text-[#ff4d00]">
           <span className="text-[10px] font-bold uppercase tracking-tighter">{trend}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAYMENT MANAGER COMPONENT
// ============================================

interface PaymentManagerProps {
  payments: PaymentRecord[];
  onPaymentsChange: (payments: PaymentRecord[]) => void;
  isDark?: boolean;
}

function PaymentManager({ payments, onPaymentsChange, isDark = true }: PaymentManagerProps) {
  const [newPayment, setNewPayment] = useState<Partial<PaymentRecord>>({
    amount: 0,
    method: 'Bank Transfer' as any,
    date: new Date().toISOString().split('T')[0],
    status: 'Completed' as any
  });

  const handleAddPayment = () => {
    if (!newPayment.amount || newPayment.amount <= 0) return;

    const payment: PaymentRecord = {
      id: Date.now().toString(),
      amount: Number(newPayment.amount),
      workerName: 'New User',
      method: (newPayment.method as any) || 'Bank Transfer',
      date: newPayment.date || new Date().toISOString().split('T')[0],
      status: 'Completed' as any,
      recordedAt: new Date().toLocaleString(),
      notes: newPayment.notes || ''
    };

    onPaymentsChange([...payments, payment]);

    setNewPayment({
      amount: 0,
      method: 'Bank Transfer' as any,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed' as any
    });
  };

  const handleDeletePayment = (id: string) => {
    onPaymentsChange(payments.filter(p => p.id !== id));
  };

  return (
    <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Payment Manager
      </h2>

      <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-[#252525]' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Amount (GH₵)
            </label>
            <input
              type="number"
              value={newPayment.amount || ''}
              onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
              className={`w-full p-2 rounded border text-sm ${isDark
                ? 'bg-[#1a1a1a] border-[#444] text-white'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Method
            </label>
            <select
              value={newPayment.method}
              onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value as Payment['method'] })}
              className={`w-full p-2 rounded border text-sm ${isDark
                ? 'bg-[#1a1a1a] border-[#444] text-white'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Check">Check</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Date
            </label>
            <input
              type="date"
              value={newPayment.date}
              onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
              className={`w-full p-2 rounded border text-sm ${isDark
                ? 'bg-[#1a1a1a] border-[#444] text-white'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddPayment}
              className="w-full p-2 bg-[#ff4d00] hover:bg-[#ff6633] text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {payments.length === 0 ? (
          <p className={`text-center py-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No payments yet. Add one above to see analytics update!
          </p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${isDark
                ? 'bg-[#252525] border-[#333] hover:border-[#444]'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                } transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: METHOD_COLORS[payment.method] }}
                />
                <div>
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    GH₵{payment.amount.toLocaleString()}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {payment.method} • {new Date(payment.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeletePayment(payment.id)}
                className={`p-2 rounded-lg transition-colors ${isDark
                  ? 'hover:bg-red-900/30 text-red-400'
                  : 'hover:bg-red-50 text-red-500'
                  }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface AnalyticsDashboardProps {
  payments: PaymentRecord[];
  isDark?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export function AnalyticsDashboard({ payments, isDark = true, isLoading = false, error = null }: AnalyticsDashboardProps) {
  const { trendData, methodData, stats } = useMemo(() => {
    return transformPaymentsToAnalytics(payments);
  }, [payments]);

  const theme = useMemo(() => ({
    chartBg: 'transparent',
    gridColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    textColor: isDark ? '#555' : '#aaa',
    primaryColor: COLORS[0],
  }), [isDark]);

  const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div 
          className="p-3 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
          style={{
            background: isDark ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
          }}
        >
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
          <p className="text-sm font-black text-[#ff4d00]">GH₵{payload[0].value.toLocaleString()}</p>
          <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>{payload[0].payload.count} payments</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const data = payload[0];
      const percentage = stats.total > 0 ? ((data.value / stats.total) * 100).toFixed(1) : '0';
      return (
        <div className={`p-3 rounded-lg border shadow-lg ${isDark ? 'bg-[#262626] border-[#404040]' : 'bg-white border-gray-200'}`}>
          <p className="text-sm font-bold" style={{ color: data.payload.color }}>{data.name}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            GH₵{data.value.toLocaleString()} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-[#ff4d00]' : 'text-[#ff4d00]'}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#1a1a1a] border-red-900' : 'bg-white border-red-200'}`}>
        <div className="flex items-center gap-3 text-red-500">
          <AlertCircle className="w-6 h-6" />
          <p>Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Volume"
          value={`GH₵${stats.total.toLocaleString()}`}
          icon={<DollarSign className="w-4 h-4" />}
          trend={`${payments.length} payments`}
          isDark={isDark}
        />
        <StatCard
          label="Average"
          value={`GH₵${Math.round(stats.average).toLocaleString()}`}
          icon={<Activity className="w-4 h-4" />}
          trend="per transaction"
          isDark={isDark}
        />
        <StatCard
          label="Peak Month"
          value={trendData.length ? `GH₵${Math.max(...trendData.map(d => d.amount)).toLocaleString()}` : 'GH₵0'}
          icon={<TrendingUp className="w-4 h-4" />}
          trend="highest volume"
          isDark={isDark}
        />
        <StatCard
          label="Methods"
          value={Object.keys(stats.byMethod).length.toString()}
          icon={<CreditCard className="w-4 h-4" />}
          trend="payment types"
          isDark={isDark}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-black/[0.01] border-black/[0.08]'}`}>
          <h3 className={`text-[11px] font-black mb-6 uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Payment Volume Trend
          </h3>
          <div className="h-[300px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.primaryColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={theme.primaryColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={theme.textColor} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke={theme.textColor} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `GH₵${(val / 1000).toFixed(0)}k`} dx={-10} />
                  <Tooltip content={<TrendTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke={theme.primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  <ReferenceLine y={stats.average} stroke={isDark ? '#444' : '#ddd'} strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className={`flex items-center justify-center h-full text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Add payments to see trends
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-black/[0.01] border-black/[0.08]'}`}>
          <h3 className={`text-[11px] font-black mb-6 uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Payment Methods
          </h3>
          <div className="h-[300px] flex items-center">
            {methodData.length > 0 ? (
              <>
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart>
                    <Pie
                      data={methodData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {methodData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} stroke={isDark ? 'rgba(26,26,26,0.8)' : '#ffffff'} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {methodData.map((entry) => {
                    const percentage = stats.total > 0 ? ((entry.value / stats.total) * 100).toFixed(1) : '0';
                    return (
                      <div key={entry.name} className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{entry.name}</span>
                        </div>
                        <div className="text-right">
                          <span className={`block text-xs font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className={`flex-1 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No payment method data
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className={`p-6 rounded-2xl border md:col-span-2 transition-all duration-300 ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-black/[0.01] border-black/[0.08]'}`}>
          <h3 className={`text-[11px] font-black mb-6 uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Monthly Comparison
          </h3>
          <div className="h-[300px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={theme.textColor} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke={theme.textColor} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `GH₵${(val / 1000).toFixed(0)}k`} dx={-10} />
                  <Tooltip content={<TrendTooltip />} cursor={{ fill: isDark ? '#252525' : '#f3f4f6' }} />
                  <Bar dataKey="amount" fill={theme.primaryColor} radius={[6, 6, 0, 0]} barSize={45}>
                    {trendData.map((entry, index) => (
                      <Cell key={`bar-${entry.name}-${index}`} fill={index === trendData.length - 1 ? '#ff6633' : theme.primaryColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={`flex items-center justify-center h-full text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Add payments to see monthly comparison
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN EXPORT COMPONENT (Default Export Only)
// ============================================

interface PaymentAnalyticsPageProps {
  isDark?: boolean;
}

export default function PaymentAnalyticsPage({ isDark = true }: PaymentAnalyticsPageProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([
    { id: '1', amount: 4000, method: 'Bank Transfer', date: '2024-01-15', status: 'Completed', workerName: 'Admin', recordedAt: '2024-01-15', notes: '' },
    { id: '2', amount: 3000, method: 'Cash', date: '2024-02-20', status: 'Completed', workerName: 'Admin', recordedAt: '2024-02-20', notes: '' },
    { id: '3', amount: 2000, method: 'Mobile Money', date: '2024-03-10', status: 'Completed', workerName: 'Admin', recordedAt: '2024-03-10', notes: '' },
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Payment Analytics
        </h1>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage payments and watch analytics update in real-time
        </p>
      </div>

      <PaymentManager
        payments={payments}
        onPaymentsChange={setPayments}
        isDark={isDark}
      />

      <AnalyticsDashboard
        payments={payments}
        isDark={isDark}
      />
    </div>
  );
}

// Export types for use in other files
export type { PaymentAnalyticsPageProps };