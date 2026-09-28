'use client';

import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import {
  AppMetrics, AppState, DemoUser, FarmerTab,
  PickupPipeline, RoleKey, ToastMessage, ToastType
} from '@/lib/types';
import { getRoleFromEmail } from '@/lib/utils';

// ============================================================
// DEMO USERS DATA
// ============================================================
export const DEMO_USERS: Record<string, DemoUser> = {
  upstream: {
    name: 'Kopi Titik Koma',
    subtitle: 'Cabang Sudirman, Jakarta',
    role: 'upstream',
    roleLabel: 'Mitra Upstream',
    email: 'titikkoma@sirkula.id',
    avatar: 'K',
    avatarBg: '#6F4E37',
    phone: '0812-3456-7890',
    address: 'Jl. Jend. Sudirman Kav. 21, Jakarta Selatan',
    capacity: '45 kg ampas / hari',
    notifWa: true,
    notifEmail: true,
  },
  downstream: {
    name: 'Berkah Jamur Farm',
    subtitle: 'Lembang, Kab. Bandung Barat',
    role: 'downstream',
    roleLabel: 'Mitra Downstream',
    email: 'berkah@sirkula.id',
    avatar: 'B',
    avatarBg: '#1B4D3E',
    phone: '0813-8899-7711',
    address: 'Desa Cikole KM 4.5, Lembang, Jawa Barat',
    capacity: '3.500 Baglog (3 Kumbung)',
    notifWa: true,
    notifEmail: true,
  },
  biohub: {
    name: 'Bio-Hub Lembang',
    subtitle: 'Pusat Produksi Baglog SCG',
    role: 'biohub',
    roleLabel: 'Operator Bio-Hub',
    email: 'operator@sirkula.id',
    avatar: 'O',
    avatarBg: '#3D52A0',
    phone: '0821-4455-6677',
    address: 'Kawasan Agrowisata Lembang Blok C-12, Bandung',
    capacity: '5.000 kg Ampas / Minggu',
    notifWa: true,
    notifEmail: true,
  }
};

// ============================================================
// INITIAL STATE
// ============================================================
const initialMetrics: AppMetrics = {
  coffeeKgTotal: 14850,
  baglogsDistributed: 42600,
  ch4PreventedKg: 28215,
  cafeSavedKg: 685,
  cafeCo2Kg: 1301,
  cafePoints: 3425,
  baglogsOrdered: 2000
};

const initialPipeline: PickupPipeline = {
  orderId: '#SRK-PK-904',
  currentStep: 2,
  driverName: 'Kang Rahmat (Armada EV B-1492-SRK)'
};

const initialState: AppState = {
  activeRole: 'landing',
  activeFarmerTab: 'store',
  authUser: null,
  metrics: initialMetrics,
  pickupPipeline: initialPipeline,
  formulaRatio: 20
};

// ============================================================
// ACTION TYPES & REDUCER
// ============================================================
type AppAction =
  | { type: 'SET_ROLE'; role: RoleKey }
  | { type: 'SET_FARMER_TAB'; tab: FarmerTab }
  | { type: 'SET_AUTH_USER'; user: DemoUser | null }
  | { type: 'UPDATE_USER_PROFILE'; updates: Partial<DemoUser> }
  | { type: 'UPDATE_METRICS'; metrics: Partial<AppMetrics> }
  | { type: 'SET_PIPELINE'; pipeline: Partial<PickupPipeline> }
  | { type: 'SET_FORMULA_RATIO'; ratio: number };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, activeRole: action.role };
    case 'SET_FARMER_TAB':
      return { ...state, activeFarmerTab: action.tab };
    case 'SET_AUTH_USER':
      return { ...state, authUser: action.user };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        authUser: state.authUser ? { ...state.authUser, ...action.updates } : null
      };
    case 'UPDATE_METRICS':
      return { ...state, metrics: { ...state.metrics, ...action.metrics } };
    case 'SET_PIPELINE':
      return { ...state, pickupPipeline: { ...state.pickupPipeline, ...action.pipeline } };
    case 'SET_FORMULA_RATIO':
      return { ...state, formulaRatio: action.ratio };
    default:
      return state;
  }
}

// ============================================================
// CONTEXT TYPE
// ============================================================
interface AppContextValue {
  state: AppState;
  toasts: ToastMessage[];
  // Navigation
  switchRole: (role: RoleKey, subTab?: string) => void;
  switchFarmerTab: (tab: FarmerTab) => void;
  // Auth & Profile
  quickLoginAs: (roleKey: keyof typeof DEMO_USERS) => void;
  handleEmailLogin: (email: string) => void;
  handleEmailRegister: (name: string, roleKey: string, email: string, city?: string, phone?: string) => void;
  handleLogout: () => void;
  updateUserProfile: (updates: Partial<DemoUser>) => void;
  // State mutations
  updateMetrics: (metrics: Partial<AppMetrics>) => void;
  setPipeline: (pipeline: Partial<PickupPipeline>) => void;
  setFormulaRatio: (ratio: number) => void;
  // Toasts
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  // Modals
  ecoBadgeOpen: boolean;
  checkoutOpen: boolean;
  authModalOpen: boolean;
  roleSettingsOpen: boolean;
  openEcoBadge: () => void;
  closeEcoBadge: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openRoleSettings: () => void;
  closeRoleSettings: () => void;
}

// ============================================================
// CONTEXT PROVIDER
// ============================================================
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [ecoBadgeOpen, setEcoBadgeOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [roleSettingsOpen, setRoleSettingsOpen] = useState(false);

  // Restore session from localStorage on initial mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('sirkula_auth');
      const savedRole = localStorage.getItem('sirkula_role') as RoleKey | null;

      if (savedAuth) {
        const user: DemoUser = JSON.parse(savedAuth);
        dispatch({ type: 'SET_AUTH_USER', user });
        if (savedRole && savedRole !== 'landing' && savedRole !== 'auth') {
          dispatch({ type: 'SET_ROLE', role: savedRole });
        } else if (user.role) {
          dispatch({ type: 'SET_ROLE', role: user.role });
        }
      } else if (savedRole && savedRole !== 'landing' && savedRole !== 'auth') {
        dispatch({ type: 'SET_ROLE', role: savedRole });
      }
    } catch {
      // localStorage may fail in some environments
    }
  }, []);

  // ---- Toast ----
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    const toast: ToastMessage = { id, message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ---- Navigation ----
  const switchRole = useCallback((role: RoleKey, subTab?: string) => {
    dispatch({ type: 'SET_ROLE', role });
    if (typeof window !== 'undefined') {
      localStorage.setItem('sirkula_role', role);
    }
    if (subTab && role === 'downstream') {
      dispatch({ type: 'SET_FARMER_TAB', tab: subTab === 'catalog' ? 'store' : 'calc' });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const switchFarmerTab = useCallback((tab: FarmerTab) => {
    dispatch({ type: 'SET_FARMER_TAB', tab });
  }, []);

  // ---- Auth ----
  const applyLogin = useCallback((user: DemoUser) => {
    dispatch({ type: 'SET_AUTH_USER', user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('sirkula_auth', JSON.stringify(user));
      localStorage.setItem('sirkula_role', user.role);
    }
  }, []);

  const quickLoginAs = useCallback((roleKey: keyof typeof DEMO_USERS) => {
    const user = DEMO_USERS[roleKey];
    if (!user) return;
    applyLogin(user);
    setAuthModalOpen(false);
    switchRole(roleKey as RoleKey);
    showToast(`Masuk sebagai ${user.name} (${user.roleLabel})`, 'success');
  }, [applyLogin, switchRole, showToast]);

  const handleEmailLogin = useCallback((email: string) => {
    const roleKey = getRoleFromEmail(email);
    const base = DEMO_USERS[roleKey] || DEMO_USERS.upstream;
    const mockUser: DemoUser = { ...base, email };
    applyLogin(mockUser);
    setAuthModalOpen(false);
    switchRole(roleKey as RoleKey);
    showToast(`Berhasil masuk sebagai ${mockUser.name}`, 'success');
  }, [applyLogin, switchRole, showToast]);

  const handleEmailRegister = useCallback((
    name: string,
    roleKey: string,
    email: string,
    city?: string,
    phone?: string
  ) => {
    const base = DEMO_USERS[roleKey] || DEMO_USERS.upstream;
    const newUser: DemoUser = {
      ...base,
      name: name || base.name,
      email,
      subtitle: city || base.subtitle,
      phone: phone || base.phone,
      avatar: (name || base.name)[0].toUpperCase(),
      role: (roleKey as RoleKey) || 'upstream',
      roleLabel: roleKey === 'downstream' ? 'Mitra Downstream' : roleKey === 'biohub' ? 'Operator Bio-Hub' : 'Mitra Upstream'
    };
    applyLogin(newUser);
    setAuthModalOpen(false);
    switchRole((roleKey as RoleKey) || 'upstream');
    showToast(`Akun berhasil dibuat! Selamat datang di Sirkula, ${newUser.name} 🎉`, 'success');
  }, [applyLogin, switchRole, showToast]);

  const handleLogout = useCallback(() => {
    dispatch({ type: 'SET_AUTH_USER', user: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sirkula_auth');
      localStorage.removeItem('sirkula_role');
    }
    switchRole('landing');
    showToast('Berhasil keluar dari sesi Sirkula', 'info');
  }, [switchRole, showToast]);

  const updateUserProfile = useCallback((updates: Partial<DemoUser>) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', updates });
    if (typeof window !== 'undefined') {
      try {
        const savedAuth = localStorage.getItem('sirkula_auth');
        if (savedAuth) {
          const current = JSON.parse(savedAuth);
          const updated = { ...current, ...updates };
          localStorage.setItem('sirkula_auth', JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
    }
    showToast('Pengaturan profil & role berhasil diperbarui!', 'success');
  }, [showToast]);

  // ---- State Mutations ----
  const updateMetrics = useCallback((metrics: Partial<AppMetrics>) => {
    dispatch({ type: 'UPDATE_METRICS', metrics });
  }, []);

  const setPipeline = useCallback((pipeline: Partial<PickupPipeline>) => {
    dispatch({ type: 'SET_PIPELINE', pipeline });
  }, []);

  const setFormulaRatio = useCallback((ratio: number) => {
    dispatch({ type: 'SET_FORMULA_RATIO', ratio });
  }, []);

  // ---- Modal Controls ----
  const openEcoBadge = useCallback(() => setEcoBadgeOpen(true), []);
  const closeEcoBadge = useCallback(() => setEcoBadgeOpen(false), []);
  const openCheckout = useCallback(() => setCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);
  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);
  const openRoleSettings = useCallback(() => setRoleSettingsOpen(true), []);
  const closeRoleSettings = useCallback(() => setRoleSettingsOpen(false), []);

  const value: AppContextValue = {
    state, toasts,
    switchRole, switchFarmerTab,
    quickLoginAs, handleEmailLogin, handleEmailRegister, handleLogout, updateUserProfile,
    updateMetrics, setPipeline, setFormulaRatio,
    showToast, dismissToast,
    ecoBadgeOpen, checkoutOpen, authModalOpen, roleSettingsOpen,
    openEcoBadge, closeEcoBadge,
    openCheckout, closeCheckout,
    openAuthModal, closeAuthModal,
    openRoleSettings, closeRoleSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
