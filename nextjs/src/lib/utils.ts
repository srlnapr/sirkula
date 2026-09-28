// ============================================================
// SIRKULA B2B - Utility Helper Functions
// ============================================================

import { FormulaData } from './types';

/**
 * Add days to a Date object and return new Date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format a date in Bahasa Indonesia
 */
export function formatDate(dateObjOrString: Date | string): string {
  const date = new Date(dateObjOrString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

/**
 * Format a number as Indonesian locale string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('id-ID');
}

/**
 * Format a number as Indonesian Rupiah
 */
export function formatRupiah(num: number): string {
  return `Rp ${num.toLocaleString('id-ID')}`;
}

/**
 * Get today's date string in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get a date N days from now as YYYY-MM-DD string
 */
export function getFutureDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Generate formula simulation data based on SCG percentage
 */
export function getFormulaData(percent: number): FormulaData {
  const formulaMap: Record<number, FormulaData> = {
    10: {
      incubationSpeed: '24 Hari (-2 hari lebih cepat)',
      costSaving: 'Hemat 12.0% vs Pasaran',
      density: 'Grade A (Pertumbuhan Normal)',
      cnRatio: '26.1 : 1 (Standar Basal)',
      sawdust: 70, bran: 15, calcium: 5
    },
    15: {
      incubationSpeed: '23 Hari (-3 hari lebih cepat)',
      costSaving: 'Hemat 15.0% vs Pasaran',
      density: 'Grade A+ (Miselium Aktif)',
      cnRatio: '27.3 : 1 (Subur)',
      sawdust: 65, bran: 15, calcium: 5
    },
    20: {
      incubationSpeed: '22 Hari (-4 hari lebih cepat)',
      costSaving: 'Hemat 17.5% vs Pasaran',
      density: 'Grade A+ (Putih Tebal Merata)',
      cnRatio: '28.4 : 1 (Tingkat Optimal)',
      sawdust: 60, bran: 15, calcium: 5
    },
    25: {
      incubationSpeed: '21 Hari (-5 hari lebih cepat)',
      costSaving: 'Hemat 19.5% vs Pasaran',
      density: 'Grade A+ (Sangat Padat)',
      cnRatio: '29.6 : 1 (Kaya Nitrogen)',
      sawdust: 55, bran: 15, calcium: 5
    },
    30: {
      incubationSpeed: '20 Hari (-6 hari lebih cepat)',
      costSaving: 'Hemat 21.0% vs Pasaran',
      density: 'Grade A (Perlu Aerasi Tambahan)',
      cnRatio: '31.2 : 1 (Kepadatan Tinggi)',
      sawdust: 50, bran: 15, calcium: 5
    },
  };
  return formulaMap[percent] || formulaMap[20];
}

/**
 * Calculate password strength score (0-4)
 */
export function getPasswordStrength(pw: string): { score: number; label: string; color: string; percent: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { pct: '25%', color: '#ef4444', text: 'Lemah' },
    { pct: '50%', color: '#f97316', text: 'Cukup' },
    { pct: '75%', color: '#eab308', text: 'Baik' },
    { pct: '100%', color: '#22c55e', text: 'Sangat Kuat' }
  ];
  const lvl = levels[Math.max(0, score - 1)] || levels[0];
  return {
    score,
    label: pw.length > 0 ? lvl.text : '',
    color: lvl.color,
    percent: pw.length > 0 ? lvl.pct : '0%'
  };
}

/**
 * Calculate farmer yield projections
 */
export function calculateYield(baglogs: number, pricePerKg: number, inocDate: Date) {
  const colonizationDays = 22;
  const flush1Days = 28;
  const flush2Days = 42;
  const flush3Days = 56;

  const dateCol = addDays(inocDate, colonizationDays);
  const dateF1 = addDays(inocDate, flush1Days);
  const dateF2 = addDays(inocDate, flush2Days);
  const dateF3 = addDays(inocDate, flush3Days);

  const yieldF1 = Math.round(baglogs * 0.22);
  const yieldF2 = Math.round(baglogs * 0.16);
  const yieldF3 = Math.round(baglogs * 0.10);
  const totalYield = yieldF1 + yieldF2 + yieldF3;
  const totalRevenue = totalYield * pricePerKg;
  const baglogCost = baglogs * 2500;
  const estimatedNetProfit = totalRevenue - baglogCost;

  return { dateCol, dateF1, dateF2, dateF3, yieldF1, yieldF2, yieldF3, totalYield, totalRevenue, estimatedNetProfit };
}

/**
 * Determine roleKey from email for mock login
 */
export function getRoleFromEmail(email: string): 'upstream' | 'downstream' | 'biohub' {
  if (email.includes('berkah') || email.includes('jamur') || email.includes('tani')) return 'downstream';
  if (email.includes('operator') || email.includes('biohub') || email.includes('hub')) return 'biohub';
  return 'upstream';
}
