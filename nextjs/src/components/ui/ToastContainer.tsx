'use client';

import { useApp } from '@/context/AppContext';
import { ToastMessage, ToastType } from '@/lib/types';

function getToastIcon(type: ToastType): string {
  if (type === 'success') return 'fa-circle-check';
  if (type === 'warning') return 'fa-triangle-exclamation';
  return 'fa-circle-info';
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((toast: ToastMessage) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => dismissToast(toast.id)}
        >
          <i className={`fa-solid ${getToastIcon(toast.type)}`} />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
