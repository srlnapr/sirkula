'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp, DEMO_USERS } from '@/context/AppContext';

export default function TopNav() {
  const { state, switchRole, quickLoginAs, openAuthModal, openRoleSettings, handleLogout, showToast } = useApp();
  const { activeRole, authUser } = state;
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinksMap = {
    landing: (
      <div className="nav-center-menu">
        <a href="#circular-flow" className="navbar-nav-link">
          <i className="fa-solid fa-arrows-spin" /> Alur Sirkular
        </a>
        <a href="#impact-simulator" className="navbar-nav-link">
          <i className="fa-solid fa-calculator" /> Kalkulator ESG
        </a>
        <a href="#market-validation" className="navbar-nav-link">
          <i className="fa-solid fa-chart-line" /> Validasi Pasar
        </a>
        <a href="#biohub" className="navbar-nav-link">
          <i className="fa-solid fa-microchip" /> BioHub Central
        </a>
      </div>
    ),
    upstream: (
      <div className="nav-center-menu">
        <a href="#upstream-waste" className="navbar-nav-link">
          <i className="fa-solid fa-trash-can" /> Wadah Ampas
        </a>
        <a href="#pickup-schedule" className="navbar-nav-link">
          <i className="fa-solid fa-truck" /> Panggil Kurir EV
        </a>
        <a href="#rewards" className="navbar-nav-link">
          <i className="fa-solid fa-coins" /> Eco-Points
        </a>
        <a href="#esg" className="navbar-nav-link">
          <i className="fa-solid fa-award" /> Sertifikat ESG
        </a>
      </div>
    ),
    downstream: (
      <div className="nav-center-menu">
        <a href="#iot-telemetry" className="navbar-nav-link">
          <i className="fa-solid fa-temperature-half" /> IoT Kumbung
        </a>
        <a href="#marketplace" className="navbar-nav-link">
          <i className="fa-solid fa-box" /> Pesan Baglog
        </a>
        <a href="#harvest-log" className="navbar-nav-link">
          <i className="fa-solid fa-scale-balanced" /> Catat Panen
        </a>
        <a href="#buyback" className="navbar-nav-link">
          <i className="fa-solid fa-handshake" /> Buyback Jamur
        </a>
      </div>
    ),
    biohub: (
      <div className="nav-center-menu">
        <a href="#fleet-map" className="navbar-nav-link">
          <i className="fa-solid fa-map-location-dot" /> Radar Armada
        </a>
        <a href="#reactor" className="navbar-nav-link">
          <i className="fa-solid fa-fire" /> Reaktor Kiln
        </a>
        <a href="#qa-lab" className="navbar-nav-link">
          <i className="fa-solid fa-shield-halved" /> Lab QA
        </a>
        <a href="#esg-balance" className="navbar-nav-link">
          <i className="fa-solid fa-chart-pie" /> Neraca Emisi
        </a>
      </div>
    ),
  };

  return (
    <header className="main-navbar-header" id="topNav">
      <div className="navbar-container">
        {/* Left Side: Brand Logo ONLY (clean, no duplicate switchers) */}
        <div className="navbar-left">
          <a
            href="#landing"
            className="navbar-brand-link"
            onClick={(e) => {
              e.preventDefault();
              switchRole('landing');
            }}
            title="Sirkula — Beranda"
          >
            <div className="navbar-logo-badge">
              <i className="fa-solid fa-recycle eco-loop-icon" />
              <i className="fa-solid fa-mug-hot coffee-bean-icon" />
            </div>
            <div className="navbar-brand-copy">
              <span className="navbar-brand-name">
                Sirkula<span className="dot-accent">.</span>
              </span>
              <span className="navbar-brand-tagline">Sirkular Kopi &amp; Tanam</span>
            </div>
          </a>
        </div>

        {/* Center: Clean Contextual Navigation Links */}
        <nav className="navbar-center" aria-label="Navigasi Halaman">
          {navLinksMap[activeRole as keyof typeof navLinksMap] || navLinksMap.landing}
        </nav>

        {/* Right Side: Notification & The SINGLE Unified Account & Role Pill */}
        <div className="navbar-right">
          {/* Quick Settings Icon Button */}
          <button
            type="button"
            className="navbar-icon-circle-btn"
            title="Pengaturan Akun & Peran"
            onClick={openRoleSettings}
          >
            <i className="fa-solid fa-gear" />
          </button>

          {/* System Notification */}
          <button
            type="button"
            className="navbar-icon-circle-btn"
            title="Pusat Notifikasi Sistem"
            onClick={() => showToast('Semua sensor IoT & logistik armada EV beroperasi normal', 'info')}
          >
            <i className="fa-regular fa-bell" />
            <span className="notif-pulse-dot" />
          </button>

          {/* Auth State Button or The ONE AND ONLY User Profile Dropdown */}
          {!authUser ? (
            <button
              type="button"
              className="navbar-login-btn"
              onClick={openAuthModal}
              id="btnNavbarLogin"
            >
              <i className="fa-solid fa-right-to-bracket" />
              <span>Masuk / Demo</span>
            </button>
          ) : (
            <div className="user-profile-menu-wrap" ref={userMenuRef}>
              <button
                type="button"
                className={`navbar-user-pill${userDropdownOpen ? ' active' : ''}`}
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                aria-label="Menu Pengguna"
              >
                <div className="nup-avatar" style={{ background: authUser.avatarBg }}>
                  {authUser.avatar}
                </div>
                <div className="nup-meta">
                  <span className="nup-name">{authUser.name}</span>
                  <span className="nup-role-badge">{authUser.roleLabel}</span>
                </div>
                <i className={`fa-solid fa-chevron-${userDropdownOpen ? 'up' : 'down'} nup-chevron`} />
              </button>

              {userDropdownOpen && (
                <div className="user-menu-dropdown animate-pop" role="menu">
                  {/* Active Account Summary */}
                  <div className="umd-profile-card">
                    <div className="umd-avatar" style={{ background: authUser.avatarBg }}>
                      {authUser.avatar}
                    </div>
                    <div className="umd-info">
                      <strong className="umd-name">{authUser.name}</strong>
                      <span className="umd-email">{authUser.email}</span>
                      <small className="umd-subtitle">
                        <i className="fa-solid fa-location-dot" /> {authUser.subtitle}
                      </small>
                    </div>
                  </div>

                  <div className="umd-divider" />

                  {/* Primary Settings Action */}
                  <button
                    type="button"
                    className="umd-item umd-item-highlight"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      openRoleSettings();
                    }}
                  >
                    <i className="fa-solid fa-sliders" />
                    <span>Pengaturan Profil &amp; Peran</span>
                  </button>

                  <div className="umd-divider" />
                  <div className="umd-label">Ganti Akun / Peran</div>

                  {/* The unified role switch options */}
                  {(['upstream', 'downstream', 'biohub'] as const).map((role) => {
                    const isCur = activeRole === role;
                    const demoUser = DEMO_USERS[role];
                    return (
                      <button
                        key={role}
                        type="button"
                        className={`umd-item${isCur ? ' active' : ''}`}
                        onClick={() => {
                          setUserDropdownOpen(false);
                          quickLoginAs(role);
                        }}
                      >
                        <i
                          className={`fa-solid ${
                            role === 'upstream'
                              ? 'fa-mug-saucer'
                              : role === 'downstream'
                              ? 'fa-seedling'
                              : 'fa-flask'
                          }`}
                        />
                        <div className="umd-item-text">
                          <span className="umd-item-name">{demoUser.name}</span>
                          <span className="umd-item-role">{demoUser.roleLabel}</span>
                        </div>
                        {isCur && <span className="umd-active-dot" />}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className={`umd-item${activeRole === 'landing' ? ' active' : ''}`}
                    onClick={() => {
                      setUserDropdownOpen(false);
                      switchRole('landing');
                    }}
                  >
                    <i className="fa-solid fa-globe" />
                    <div className="umd-item-text">
                      <span className="umd-item-name">Overview Publik</span>
                      <span className="umd-item-role">Ekosistem Terbuka</span>
                    </div>
                    {activeRole === 'landing' && <span className="umd-active-dot" />}
                  </button>

                  <div className="umd-divider" />

                  {/* Logout Action */}
                  <button
                    type="button"
                    className="umd-item umd-logout"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <i className="fa-solid fa-right-from-bracket" />
                    <span>Keluar dari Sesi</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
