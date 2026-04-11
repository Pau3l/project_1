export type PaymentStatus = 
  | 'Pending' 
  | 'Processing' 
  | 'Completed' 
  | 'Failed' 
  | 'Refunded' 
  | 'On Hold' 
  | 'Cancelled';

export interface PaymentRecord {
  id: string;
  workerName: string;
  amount: number;
  date: string;
  method: string;
  notes: string;
  status: PaymentStatus;
  recordedAt: string;
  signature?: string;
}

export interface ChartDataPoint {
  name: string;
  amount: number;
  count: number;
}

export interface PieDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface PendingDeletion {
  ids: string[];
  label: string;
  isBulk: boolean;
}

export interface ShortcutConfig {
  id: string;
  label: string;
  key: string;
  isCustom?: boolean;
}
