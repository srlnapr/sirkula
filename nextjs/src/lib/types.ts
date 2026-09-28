// ============================================================
// SIRKULA B2B - TypeScript Type Definitions
// ============================================================

export type RoleKey = 'landing' | 'upstream' | 'downstream' | 'biohub' | 'auth';
export type FarmerTab = 'store' | 'calc';
export type AuthModalTab = 'demo' | 'form';
export type AuthPageTab = 'masuk' | 'daftar' | 'demo';
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface DemoUser {
  name: string;
  subtitle: string;
  role: RoleKey;
  roleLabel: string;
  email: string;
  avatar: string;
  avatarBg: string;
  phone?: string;
  address?: string;
  capacity?: string;
  notifWa?: boolean;
  notifEmail?: boolean;
}

export interface AppMetrics {
  coffeeKgTotal: number;
  baglogsDistributed: number;
  ch4PreventedKg: number;
  cafeSavedKg: number;
  cafeCo2Kg: number;
  cafePoints: number;
  baglogsOrdered: number;
}

export interface PickupPipeline {
  orderId: string;
  currentStep: number;
  driverName: string;
}

export interface AppState {
  activeRole: RoleKey;
  activeFarmerTab: FarmerTab;
  authUser: DemoUser | null;
  metrics: AppMetrics;
  pickupPipeline: PickupPipeline;
  formulaRatio: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface PickupHistoryItem {
  id: string;
  date: string;
  weight: number;
  co2: number;
  status: 'done' | 'scheduled';
}

export interface FormulaData {
  incubationSpeed: string;
  costSaving: string;
  density: string;
  cnRatio: string;
  sawdust: number;
  bran: number;
  calcium: number;
}
