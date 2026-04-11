import { PaymentRecord } from '../types';
import * as XLSX from 'xlsx';

/**
 * Generates an XLSX workbook from payment records with multiple sheets
 */
export const generateXLSX = (payments: PaymentRecord[], includeNotes: boolean): Blob => {
  const wb = XLSX.utils.book_new();

  // --- Sheet 1: Transaction Audit ---
  const auditData = payments.map(p => ({
    'Worker Name': p.workerName,
    'Amount (₵)': p.amount,
    'Date': p.date,
    'Payment Method': p.method,
    'Status': p.status,
    ...(includeNotes ? { 'Notes/Description': p.notes } : {}),
    'Recorded At': p.recordedAt
  }));

  const ws_audit = XLSX.utils.json_to_sheet(auditData);

  // Apply some basic formatting - setting column widths
  const audit_cols = [
    { wch: 20 }, // Worker Name
    { wch: 12 }, // Amount
    { wch: 12 }, // Date
    { wch: 15 }, // Method
    { wch: 12 }, // Status
    ...(includeNotes ? [{ wch: 30 }] : []), // Notes
    { wch: 20 }  // Recorded At
  ];
  ws_audit['!cols'] = audit_cols;

  XLSX.utils.book_append_sheet(wb, ws_audit, "Transaction Audit");

  // --- Sheet 2: Executive Summary ---
  const summary = getPaymentSummary(payments);
  const summaryData = summary.map(s => ({
    'Worker Name': s.workerName,
    'Transaction Count': s.paymentCount,
    'Total Amount (₵)': s.totalAmount,
    'Methods Used': s.methods
  }));

  const ws_summary = XLSX.utils.json_to_sheet(summaryData);
  ws_summary['!cols'] = [
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 }
  ];

  XLSX.utils.book_append_sheet(wb, ws_summary, "Executive Summary");

  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

/**
 * Groups payments by worker for summary reports
 */
export const getPaymentSummary = (payments: PaymentRecord[]) => {
  const summary: Record<string, { count: number; total: number; methods: Set<string> }> = {};

  payments.forEach(p => {
    if (!summary[p.workerName]) {
      summary[p.workerName] = { count: 0, total: 0, methods: new Set() };
    }
    summary[p.workerName].count += 1;
    summary[p.workerName].total += p.amount;
    summary[p.workerName].methods.add(p.method);
  });

  return Object.entries(summary).map(([name, data]) => ({
    workerName: name,
    paymentCount: data.count,
    totalAmount: data.total,
    methods: Array.from(data.methods).join(', ')
  }));
};

/**
 * Triggers a file download in the browser
 */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

// Keep legacy CSV support for simple exports if needed
export const generateCSV = (payments: PaymentRecord[], columns: string[]): string => {
  const sanitizeCSV = (str: string | number | undefined): string => {
    if (str === undefined || str === null) return '';
    const s = String(str);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headers = columns.join(',');
  const rows = payments.map(p => {
    return columns.map(col => {
      if (col === 'Amount') return p.amount.toFixed(2);
      const key = col.toLowerCase().replace(/ /g, '') as keyof PaymentRecord;
      const value = (p as any)[key] || (p as any)[col.charAt(0).toLowerCase() + col.slice(1)];
      return sanitizeCSV(value);
    }).join(',');
  });

  return [headers, ...rows].join('\n');
};
