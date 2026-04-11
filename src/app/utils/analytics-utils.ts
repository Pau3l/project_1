import { PaymentRecord, ChartDataPoint, PieDataPoint } from '../types';

// ============================================
// CONSTANTS
// ============================================
const COLORS = ['#ff4d00', '#ff7b42', '#ffa985', '#ffd7c7', '#ff5500'];

export const METHOD_COLORS: Record<string, string> = {
  'Bank Transfer': COLORS[0],
  'Cash': COLORS[1],
  'Mobile Money': COLORS[2],
  'Check': COLORS[3],
  'Card': COLORS[4],
};

export interface AnalyticsStats {
  total: number;
  totalAmount: number;
  completedAmount: number;
  totalTransactions: number;
  average: number;
  averageAmount: number;
  byMethod: Record<string, number>;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
  methodData: PieDataPoint[];
  trendData: ChartDataPoint[];
}

/**
 * Transforms raw payment records into structured analytics data for charts and stats.
 */
export function transformPaymentsToAnalytics(payments: PaymentRecord[]): AnalyticsData {
  // Calculate statistics
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  
  // Note: Local types might differ slightly, using 'Completed' from PaymentStatus
  const completedPayments = payments.filter(p => p.status === 'Completed' || p.status.toLowerCase() === 'completed');
  const completedAmount = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  
  // Group by method
  const methodData = payments.reduce((acc: PieDataPoint[], payment) => {
    const existing = acc.find(item => item.name === payment.method);
    if (existing) {
      existing.value += payment.amount;
    } else {
      acc.push({ 
        name: payment.method, 
        value: payment.amount,
        color: METHOD_COLORS[payment.method] || COLORS[0]
      });
    }
    return acc;
  }, []);

  // Group by date for trend
  const trendData = payments.reduce((acc: ChartDataPoint[], payment) => {
    const date = new Date(payment.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.name === date);
    if (existing) {
      existing.amount += payment.amount;
      existing.count += 1;
    } else {
      acc.push({ name: date, amount: payment.amount, count: 1 });
    }
    return acc;
  }, []);

  // Create byMethod stats
  const byMethod = payments.reduce((acc: Record<string, number>, payment) => {
    if (!acc[payment.method]) {
      acc[payment.method] = 0;
    }
    acc[payment.method] += payment.amount;
    return acc;
  }, {});

  return {
    stats: {
      total: totalAmount,
      totalAmount,
      completedAmount,
      totalTransactions: payments.length,
      average: payments.length > 0 ? totalAmount / payments.length : 0,
      averageAmount: payments.length > 0 ? totalAmount / payments.length : 0,
      byMethod
    },
    methodData,
    trendData
  };
}
