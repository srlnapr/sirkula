'use client';

import { useApp } from '@/context/AppContext';
import TopNav from '@/components/layout/TopNav';
import AuthView from '@/components/views/AuthView';
import LandingView from '@/components/views/LandingView';
import UpstreamView from '@/components/views/UpstreamView';
import DownstreamView from '@/components/views/DownstreamView';
import BiohubView from '@/components/views/BiohubView';
import EcoBadgeModal from '@/components/modals/EcoBadgeModal';
import CheckoutModal from '@/components/modals/CheckoutModal';
import AuthModal from '@/components/modals/AuthModal';
import RoleSettingsModal from '@/components/modals/RoleSettingsModal';
import ToastContainer from '@/components/ui/ToastContainer';

export default function Home() {
  const { state } = useApp();
  const { activeRole } = state;

  const isAuth = activeRole === 'auth';

  return (
    <>
      {/* Top Navigation — hidden on auth view */}
      {!isAuth && <TopNav />}

      {/* Main Content */}
      <main className="main-content" id="mainContent">
        <section
          id="viewAuth"
          className={`view-section auth-fullpage-view${activeRole === 'auth' ? ' active' : ''}`}
        >
          <AuthView />
        </section>

        <section
          id="viewLanding"
          className={`view-section${activeRole === 'landing' ? ' active' : ''}`}
        >
          <LandingView />
        </section>

        <section
          id="viewUpstream"
          className={`view-section${activeRole === 'upstream' ? ' active' : ''}`}
        >
          <UpstreamView />
        </section>

        <section
          id="viewDownstream"
          className={`view-section${activeRole === 'downstream' ? ' active' : ''}`}
        >
          <DownstreamView />
        </section>

        <section
          id="viewBiohub"
          className={`view-section${activeRole === 'biohub' ? ' active' : ''}`}
        >
          <BiohubView />
        </section>
      </main>

      {/* Modals */}
      <EcoBadgeModal />
      <CheckoutModal />
      <AuthModal />
      <RoleSettingsModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
}
