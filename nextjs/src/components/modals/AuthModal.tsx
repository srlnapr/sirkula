'use client';

import { useState } from 'react';
import { useApp, DEMO_USERS } from '@/context/AppContext';
import { getPasswordStrength } from '@/lib/utils';

type AuthModalTab = 'demo' | 'login' | 'register';

export default function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    quickLoginAs,
    handleEmailLogin,
    handleEmailRegister,
    switchRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthModalTab>('demo');
  const [regRole, setRegRole] = useState<'upstream' | 'downstream' | 'biohub'>('upstream');
  const [showPw, setShowPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [regPwValue, setRegPwValue] = useState('');
  const pwStrength = getPasswordStrength(regPwValue);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    handleEmailLogin(email);
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    handleEmailRegister(
      fd.get('nama') as string,
      regRole,
      fd.get('email') as string,
      fd.get('city') as string,
      fd.get('phone') as string
    );
  };

  return (
    <div
      className="modal-backdrop open"
      id="authModalBackdrop"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'authModalBackdrop') closeAuthModal();
      }}
    >
      <div className="modal-dialog auth-modal-dialog" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal-header auth-modal-header-custom">
          <div className="auth-modal-brand">
            <div className="logo-icon-wrap" style={{ width: 36, height: 36 }}>
              <i className="fa-solid fa-recycle eco-loop" style={{ fontSize: '1.1rem' }} />
              <i className="fa-solid fa-mug-hot coffee-icon" style={{ fontSize: '0.6rem', top: 11 }} />
            </div>
            <div className="auth-header-text">
              <span className="auth-brand-name">
                Sirkula<span className="dot-accent">.</span> B2B
              </span>
              <p className="auth-brand-sub">Platform Penyeimbang Ampas Kopi &amp; Tanam Jamur</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={closeAuthModal} aria-label="Tutup modal">
            &times;
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="auth-modal-tabs">
          <button
            type="button"
            className={`auth-modal-tab${activeTab === 'demo' ? ' active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            <i className="fa-solid fa-bolt" /> Demo Cepat
          </button>
          <button
            type="button"
            className={`auth-modal-tab${activeTab === 'login' ? ' active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            <i className="fa-solid fa-right-to-bracket" /> Masuk Akun
          </button>
          <button
            type="button"
            className={`auth-modal-tab${activeTab === 'register' ? ' active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            <i className="fa-solid fa-user-plus" /> Daftar Mitra
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body auth-modal-body">
          {/* TAB 1: DEMO CEPAT */}
          {activeTab === 'demo' && (
            <div className="auth-demo-section">
              <p className="auth-tab-intro">
                Pilih peran di bawah ini untuk <strong>eksplorasi langsung</strong> dengan data simulasi operasional lengkap tanpa perlu mendaftar:
              </p>

              <div className="auth-demo-cards-list">
                {(['upstream', 'downstream', 'biohub'] as const).map((role) => {
                  const user = DEMO_USERS[role];
                  const isUpstream = role === 'upstream';
                  const isDownstream = role === 'downstream';

                  return (
                    <div
                      key={role}
                      className={`auth-demo-card-item ${role}-border`}
                      onClick={() => quickLoginAs(role)}
                    >
                      <div className="adci-icon" style={{ background: user.avatarBg }}>
                        <i
                          className={`fa-solid ${
                            isUpstream
                              ? 'fa-mug-saucer'
                              : isDownstream
                              ? 'fa-seedling'
                              : 'fa-flask'
                          }`}
                        />
                      </div>
                      <div className="adci-body">
                        <div className="adci-top-row">
                          <span className={`role-pill-badge tag-${role}`}>{user.roleLabel}</span>
                          <span className="adci-instant-badge">1-Klik Akses</span>
                        </div>
                        <h4 className="adci-title">{user.name}</h4>
                        <p className="adci-sub">
                          <i className="fa-solid fa-location-dot" /> {user.subtitle}
                        </p>
                        <div className="adci-features">
                          {isUpstream && (
                            <>
                              <span><i className="fa-solid fa-truck" /> Jemput Ampas EV</span>
                              <span><i className="fa-solid fa-award" /> Sertifikat ESG</span>
                            </>
                          )}
                          {isDownstream && (
                            <>
                              <span><i className="fa-solid fa-box" /> Grosir Baglog SCG</span>
                              <span><i className="fa-solid fa-temperature-half" /> Telemetri IoT</span>
                            </>
                          )}
                          {role === 'biohub' && (
                            <>
                              <span><i className="fa-solid fa-fire" /> Reaktor Kiln</span>
                              <span><i className="fa-solid fa-map-location-dot" /> Radar Armada</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="adci-cta">
                        <i className="fa-solid fa-arrow-right" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MASUK (LOGIN) */}
          {activeTab === 'login' && (
            <form className="auth-form-layout" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Email Terdaftar</label>
                <div className="auth-input-wrap">
                  <i className="fa-regular fa-envelope auth-input-icon" />
                  <input
                    name="email"
                    type="email"
                    className="form-control auth-input-padded"
                    placeholder="nama@kedaiatau-farm.id"
                    required
                    defaultValue="titikkoma@sirkula.id"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kata Sandi</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-lock auth-input-icon" />
                  <input
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    className="form-control auth-input-padded"
                    placeholder="Minimal 8 karakter"
                    required
                    defaultValue="sirkula123"
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPw((p) => !p)}
                    tabIndex={-1}
                  >
                    <i className={`fa-regular ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>

              <div className="auth-form-extras">
                <label className="auth-checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Ingat sesi saya di perangkat ini</span>
                </label>
                <span className="auth-demo-hint-chip">
                  Kata sandi demo: <strong>sirkula123</strong>
                </span>
              </div>

              <button type="submit" className="btn-primary btn-block btn-auth-action">
                <i className="fa-solid fa-right-to-bracket" /> Masuk ke Dashboard
              </button>

              <div className="auth-switch-prompt">
                Belum bermitra dengan Sirkula?{' '}
                <button
                  type="button"
                  className="auth-link-inline"
                  onClick={() => setActiveTab('register')}
                >
                  Daftar sebagai mitra baru
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: DAFTAR (REGISTER) */}
          {activeTab === 'register' && (
            <form className="auth-form-layout" onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Pilih Kategori Mitra</label>
                <div className="role-selector-pills">
                  <button
                    type="button"
                    className={`role-sel-pill${regRole === 'upstream' ? ' active' : ''}`}
                    onClick={() => setRegRole('upstream')}
                  >
                    <i className="fa-solid fa-mug-saucer" />
                    <span>Kedai Kopi</span>
                    <small>Penghasil SCG</small>
                  </button>
                  <button
                    type="button"
                    className={`role-sel-pill${regRole === 'downstream' ? ' active' : ''}`}
                    onClick={() => setRegRole('downstream')}
                  >
                    <i className="fa-solid fa-seedling" />
                    <span>Petani Jamur</span>
                    <small>Pengguna Baglog</small>
                  </button>
                  <button
                    type="button"
                    className={`role-sel-pill${regRole === 'biohub' ? ' active' : ''}`}
                    onClick={() => setRegRole('biohub')}
                  >
                    <i className="fa-solid fa-flask" />
                    <span>Operator Hub</span>
                    <small>Pabrik Sterilisasi</small>
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Nama Bisnis / Brand</label>
                  <div className="auth-input-wrap">
                    <i className="fa-solid fa-store auth-input-icon" />
                    <input
                      name="nama"
                      type="text"
                      className="form-control auth-input-padded"
                      placeholder="Contoh: Kopi Titik Koma"
                      required
                    />
                  </div>
                </div>
                <div className="form-group col-6">
                  <label className="form-label">No. WhatsApp PIC</label>
                  <div className="auth-input-wrap">
                    <i className="fa-brands fa-whatsapp auth-input-icon" />
                    <input
                      name="phone"
                      type="tel"
                      className="form-control auth-input-padded"
                      placeholder="0812-xxxx-xxxx"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Email Bisnis</label>
                  <div className="auth-input-wrap">
                    <i className="fa-regular fa-envelope auth-input-icon" />
                    <input
                      name="email"
                      type="email"
                      className="form-control auth-input-padded"
                      placeholder="mitra@usaha.id"
                      required
                    />
                  </div>
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Kota Operasional</label>
                  <div className="auth-input-wrap">
                    <i className="fa-solid fa-location-dot auth-input-icon" />
                    <input
                      name="city"
                      type="text"
                      className="form-control auth-input-padded"
                      placeholder="Jakarta / Bandung..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Buat Kata Sandi</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-lock auth-input-icon" />
                  <input
                    name="password"
                    type={showRegPw ? 'text' : 'password'}
                    className="form-control auth-input-padded"
                    placeholder="Minimal 8 karakter"
                    required
                    value={regPwValue}
                    onChange={(e) => setRegPwValue(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowRegPw((p) => !p)}
                    tabIndex={-1}
                  >
                    <i className={`fa-regular ${showRegPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
                {regPwValue && (
                  <div className="password-strength-bar">
                    <div
                      className="pw-strength-fill"
                      style={{ width: pwStrength.percent, background: pwStrength.color }}
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary btn-block btn-auth-action">
                <i className="fa-solid fa-user-plus" /> Daftar &amp; Buka Akun Mitra
              </button>

              <div className="auth-switch-prompt">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  className="auth-link-inline"
                  onClick={() => setActiveTab('login')}
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer link to full view */}
        <div className="auth-modal-footer">
          <button
            type="button"
            className="btn-text-fullpage"
            onClick={() => {
              closeAuthModal();
              switchRole('auth');
            }}
          >
            <i className="fa-solid fa-up-right-from-square" /> Buka Tampilan Halaman Penuh
          </button>
        </div>
      </div>
    </div>
  );
}
