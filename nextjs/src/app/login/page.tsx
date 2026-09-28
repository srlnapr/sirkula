'use client';

import AuthView from '@/components/views/AuthView';
import ToastContainer from '@/components/ui/ToastContainer';

export default function LoginPage() {
  return (
    <>
      <main className="main-content" style={{ minHeight: '100vh', background: '#F8FAF8' }}>
        <AuthView />
      </main>
      <ToastContainer />
    </>
  );
}
