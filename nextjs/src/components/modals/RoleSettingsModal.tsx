'use client';

import { useState, useEffect } from 'react';
import { useApp, DEMO_USERS } from '@/context/AppContext';
import { RoleKey } from '@/lib/types';

export default function RoleSettingsModal() {
  const {
    roleSettingsOpen,
    closeRoleSettings,
    state,
    switchRole,
    quickLoginAs,
    updateUserProfile,
    handleLogout,
    showToast
  } = useApp();

  const { activeRole, authUser } = state;
  const [activeTab, setActiveTab] = useState<'roles' | 'profile' | 'notifications'>('roles');

  // Form states for profile editing
  const [businessName, setBusinessName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [notifWa, setNotifWa] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);

  // Sync form states with authUser when modal opens or user changes
  useEffect(() => {
    if (authUser) {
      setBusinessName(authUser.name || '');
      setSubtitle(authUser.subtitle || '');
      setPhone(authUser.phone || '0812-3456-7890');
      setAddress(authUser.address || 'Kawasan Operasional Mitra Sirkula');
      setCapacity(authUser.capacity || 'Kapasitas Standar');
      setNotifWa(authUser.notifWa ?? true);
      setNotifEmail(authUser.notifEmail ?? true);
    } else {
      // Default to upstream info if not logged in
      const defaultUser = DEMO_USERS.upstream;
      setBusinessName(defaultUser.name);
      setSubtitle(defaultUser.subtitle);
      setPhone(defaultUser.phone || '');
      setAddress(defaultUser.address || '');
      setCapacity(defaultUser.capacity || '');
    }
  }, [authUser, roleSettingsOpen]);

  if (!roleSettingsOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: businessName,
      subtitle,
      phone,
      address,
      capacity,
      notifWa,
      notifEmail
    });
    closeRoleSettings();
  };

  const handleRoleSelect = (roleKey: RoleKey) => {
    if (roleKey === 'landing') {
      switchRole('landing');
      showToast('Beralih ke Overview Publik Ekosistem Sirkula', 'info');
    } else {
      quickLoginAs(roleKey as keyof typeof DEMO_USERS);
    }
    closeRoleSettings();
  };

  const rolesConfig: {
    key: RoleKey;
    title: string;
    tag: string;
    icon: string;
    color: string;
    desc: string;
    highlights: string[];
  }[] = [
    {
      key: 'upstream',
      title: 'Mitra Kedai Kopi',
      tag: 'Upstream Provider',
      icon: 'fa-mug-saucer',
      color: '#6F4E37',
      desc: 'Penghasil limbah ampas kopi (SCG). Mengelola wadah smart bin, panggil kurir EV, dan sertifikasi ESG.',
      highlights: ['Jadwal Penjemputan EV', 'Pelacak Karbon & CH₄', 'Eco-Badge Meja Kasir']
    },
    {
      key: 'downstream',
      title: 'Mitra Petani Jamur',
      tag: 'Downstream User',
      icon: 'fa-seedling',
      color: '#1B4D3E',
      desc: 'Pengguna media tanam baglog terformulasi ampas kopi. Akses toko grosir, monitoring IoT kumbung, dan roadmap buyback hasil panen (Tahun 3).',
      highlights: ['Pesan Baglog Terformulasi', 'Telemetri Sensor Kumbung', 'Roadmap Buyback Tahun 3']
    },
    {
      key: 'biohub',
      title: 'Operator Bio-Hub',
      tag: 'Hub Central Operator',
      icon: 'fa-flask',
      color: '#3D52A0',
      desc: 'Pusat sterilisasi kiln, peracikan nutrisi SCG, pemantauan armada logistik EV, dan verifikasi kualitas baglog.',
      highlights: ['Radar Logistik Armada', 'Suhu Reaktor Kiln', 'Lab Uji Kualitas SCG']
    },
    {
      key: 'landing',
      title: 'Overview Publik',
      tag: 'Ekosistem Terintegrasi',
      icon: 'fa-globe',
      color: '#40916C',
      desc: 'Tampilan informasi komprehensif alur ekonomi sirkular, simulasi kalkulator dampak, dan validasi pasar.',
      highlights: ['Alur Sirkular Interaktif', 'Kalkulator ESG B2B', 'Data Neraca Nasional']
    }
  ];

  return (
    <div
      className="modal-backdrop open"
      id="roleSettingsModalBackdrop"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'roleSettingsModalBackdrop') closeRoleSettings();
      }}
    >
      <div className="modal-dialog role-settings-dialog" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-sup">
              <i className="fa-solid fa-sliders" /> Konfigurasi Akun &amp; Peran
            </span>
            <h2 className="modal-title">Pengaturan Peran &amp; Profil Mitra</h2>
          </div>
          <button className="btn-modal-close" onClick={closeRoleSettings} aria-label="Tutup modal">
            &times;
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="settings-tabs-bar">
          <button
            className={`settings-tab-btn${activeTab === 'roles' ? ' active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <i className="fa-solid fa-id-card" />
            <span>Alih Peran ({activeRole.toUpperCase()})</span>
          </button>
          <button
            className={`settings-tab-btn${activeTab === 'profile' ? ' active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-solid fa-store" />
            <span>Profil Bisnis</span>
          </button>
          <button
            className={`settings-tab-btn${activeTab === 'notifications' ? ' active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fa-solid fa-bell" />
            <span>Preferensi Sirkular</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body settings-modal-body">
          {/* TAB 1: ROLES SELECTION */}
          {activeTab === 'roles' && (
            <div className="settings-section">
              <div className="section-intro">
                <p>
                  Pilih peran operasional untuk mengakses fitur dan dashboard yang relevan. Perubahan peran langsung diterapkan ke sistem navigasi dan data analitik.
                </p>
              </div>

              <div className="roles-selector-cards">
                {rolesConfig.map((r) => {
                  const isCurrent = activeRole === r.key;
                  return (
                    <div
                      key={r.key}
                      className={`role-choice-card${isCurrent ? ' selected' : ''}`}
                      onClick={() => handleRoleSelect(r.key)}
                    >
                      <div className="rcc-icon-wrap" style={{ background: r.color }}>
                        <i className={`fa-solid ${r.icon}`} />
                      </div>
                      <div className="rcc-content">
                        <div className="rcc-header-row">
                          <span className="rcc-title">{r.title}</span>
                          <span className="rcc-tag" style={{ borderColor: r.color, color: r.color }}>
                            {r.tag}
                          </span>
                          {isCurrent && <span className="rcc-active-badge">Aktif Sekarang</span>}
                        </div>
                        <p className="rcc-desc">{r.desc}</p>
                        <div className="rcc-highlights">
                          {r.highlights.map((h) => (
                            <span key={h} className="rcc-chip">
                              <i className="fa-solid fa-circle-check" /> {h}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rcc-action">
                        <button
                          type="button"
                          className={`btn-select-role${isCurrent ? ' active-btn' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleSelect(r.key);
                          }}
                        >
                          {isCurrent ? 'Peran Aktif' : 'Beralih ke Peran Ini'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE DATA FORM */}
          {activeTab === 'profile' && (
            <form className="settings-profile-form" onSubmit={handleSaveProfile}>
              <div className="section-intro">
                <p>
                  Kelola identitas usaha resmi dan kapasitas operasional yang terhubung dengan rantai pasok Sirkula.
                </p>
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Nama Bisnis / Mitra Usaha</label>
                  <div className="auth-input-wrap">
                    <i className="fa-solid fa-store auth-input-icon" />
                    <input
                      type="text"
                      className="form-control auth-input-padded"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Contoh: Kopi Titik Koma"
                      required
                    />
                  </div>
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Cabang / Wilayah Kumbung</label>
                  <div className="auth-input-wrap">
                    <i className="fa-solid fa-map-pin auth-input-icon" />
                    <input
                      type="text"
                      className="form-control auth-input-padded"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Contoh: Cabang Sudirman, Jakarta"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">No. WhatsApp PIC Operasional</label>
                  <div className="auth-input-wrap">
                    <i className="fa-brands fa-whatsapp auth-input-icon" />
                    <input
                      type="text"
                      className="form-control auth-input-padded"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                    />
                  </div>
                </div>
                <div className="form-group col-6">
                  <label className="form-label">
                    {activeRole === 'upstream'
                      ? 'Estimasi Ampas Kopi Harian'
                      : activeRole === 'downstream'
                      ? 'Kapasitas Kumbung Jamur'
                      : 'Kapasitas Olah Pabrik'}
                  </label>
                  <div className="auth-input-wrap">
                    <i className="fa-solid fa-scale-balanced auth-input-icon" />
                    <input
                      type="text"
                      className="form-control auth-input-padded"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder={
                        activeRole === 'upstream'
                          ? 'Misal: 45 kg / hari'
                          : activeRole === 'downstream'
                          ? 'Misal: 3.500 Baglog'
                          : 'Misal: 5.000 kg / minggu'
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Lengkap Fasilitas / Lokasi Penjemputan</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-location-dot auth-input-icon" />
                  <input
                    type="text"
                    className="form-control auth-input-padded"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Alamat lengkap untuk rute armada EV Sirkula"
                  />
                </div>
              </div>

              <div className="settings-footer-actions">
                <button type="button" className="btn-secondary" onClick={closeRoleSettings}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fa-solid fa-floppy-disk" /> Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: NOTIFICATIONS & INTEGRATIONS */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-intro">
                <p>
                  Atur saluran komunikasi otomatis untuk pelacakan armada penjemputan EV, laporan ESG berkala, dan sensor telemetri kumbung.
                </p>
              </div>

              <div className="notif-toggle-list">
                <label className="notif-toggle-item">
                  <div className="nti-info">
                    <strong>Pemberitahuan Penjemputan via WhatsApp</strong>
                    <p>Menerima notifikasi otomatis saat armada kurir EV bergerak menuju lokasi kedai/kumbung.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={notifWa}
                    onChange={(e) => setNotifWa(e.target.checked)}
                  />
                </label>

                <label className="notif-toggle-item">
                  <div className="nti-info">
                    <strong>Peringatan Suhu &amp; Kelembaban Kumbung (IoT Telemetri)</strong>
                    <p>Alert darurat jika suhu kumbung melampaui batas aman (28°C) atau kelembaban turun di bawah 80% RH.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={true}
                    disabled
                  />
                </label>

                <label className="notif-toggle-item">
                  <div className="nti-info">
                    <strong>Laporan Dampak Bulanan &amp; Sertifikat ESG (Email)</strong>
                    <p>Kirim rekap pencegahan emisi CH₄ dan penghematan biaya secara otomatis tiap awal bulan.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                  />
                </label>
              </div>

              <div className="settings-footer-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    updateUserProfile({ notifWa, notifEmail });
                    closeRoleSettings();
                  }}
                >
                  <i className="fa-solid fa-check" /> Simpan Preferensi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="settings-modal-footer">
          <div className="current-user-status">
            <span className="cus-avatar" style={{ background: authUser?.avatarBg || '#1B4D3E' }}>
              {authUser?.avatar || 'S'}
            </span>
            <div className="cus-text">
              <span className="cus-name">{authUser ? authUser.name : 'Tamu (Overview Publik)'}</span>
              <span className="cus-sub">{authUser ? authUser.subtitle : 'Belum masuk ke akun'}</span>
            </div>
          </div>
          {authUser && (
            <button
              type="button"
              className="btn-logout-settings"
              onClick={() => {
                handleLogout();
                closeRoleSettings();
              }}
            >
              <i className="fa-solid fa-right-from-bracket" /> Keluar Sesi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
