'use client';

import { useState } from 'react';
import { useApp, DEMO_USERS } from '@/context/AppContext';
import { getPasswordStrength } from '@/lib/utils';

export default function AuthView({ initialTab = 'masuk' }: { initialTab?: 'masuk' | 'daftar' | 'demo' }) {
  const { switchRole, quickLoginAs, handleEmailLogin, handleEmailRegister } = useApp();
  const [activeTab, setActiveTab] = useState<'masuk' | 'daftar' | 'demo'>(initialTab);
  const [regRole, setRegRole] = useState<'upstream' | 'downstream' | 'biohub'>('upstream');
  const [showPw, setShowPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [pwValue, setPwValue] = useState('');
  const pwStrength = getPasswordStrength(pwValue);

  const tabConfig = {
    masuk:  { title: 'Masuk ke Akun Anda',         sub: 'Akses dashboard mitra Sirkula Anda' },
    daftar: { title: 'Daftar Akun Mitra',            sub: 'Mulai bergabung dalam ekosistem Sirkula secara gratis' },
    demo:   { title: 'Eksplorasi Demo Cepat',        sub: 'Masuk langsung tanpa registrasi sebagai akun percontohan' },
  };

  return (
    <div className="auth-page-layout">
      {/* LEFT PANEL */}
      <div className="auth-left-panel">
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <a href="#" className="auth-page-logo" onClick={(e) => { e.preventDefault(); switchRole('landing'); }}>
            <div className="auth-logo-icon">
              <i className="fa-solid fa-recycle" />
              <i className="fa-solid fa-mug-hot" />
            </div>
            <div className="auth-logo-text">
              <span>Sirkula<span className="dot-accent">.</span></span>
              <small>Sirkular Kopi &amp; Tanam</small>
            </div>
          </a>
          <div className="auth-left-tagline">
            <h1>Bergabunglah dalam<br /><span className="auth-tagline-highlight">Rantai Pasokan Hijau</span><br />Indonesia</h1>
            <p>Platform B2B yang menghubungkan kedai kopi, petani jamur, dan fasilitas pengolahan dalam satu ekosistem ekonomi sirkular terintegrasi.</p>
          </div>
          <div className="auth-left-stats">
            <div className="auth-stat-item"><span className="auth-stat-num">120+</span><span className="auth-stat-label">Kedai Kopi Bermitra</span></div>
            <div className="auth-stat-divider" />
            <div className="auth-stat-item"><span className="auth-stat-num">38</span><span className="auth-stat-label">Kumbung Jamur Aktif</span></div>
            <div className="auth-stat-divider" />
            <div className="auth-stat-item"><span className="auth-stat-num">14.8t</span><span className="auth-stat-label">Ampas Dikelola</span></div>
          </div>
          <div className="auth-testimonial">
            <div className="auth-testimonial-avatar">P</div>
            <div className="auth-testimonial-text">
              <p>&ldquo;Biaya baglog turun 17% dan miselium tumbuh lebih cepat. Sirkula benar-benar game changer untuk kumbung saya.&rdquo;</p>
              <strong>Pak Budi — Berkah Jamur Farm, Lembang</strong>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right-panel">
        <div className="auth-right-inner">
          <a href="#" className="auth-back-link" onClick={(e) => { e.preventDefault(); switchRole('landing'); }}>
            <i className="fa-solid fa-arrow-left" /> Kembali ke Beranda
          </a>

          <div className="auth-form-header">
            <h2>{tabConfig[activeTab].title}</h2>
            <p>{tabConfig[activeTab].sub}</p>
          </div>

          {activeTab !== 'demo' && (
            <div className="auth-demo-banner">
              <i className="fa-solid fa-bolt" />
              <span>Demo cepat tanpa registrasi?</span>
              <button onClick={() => setActiveTab('demo')} className="auth-demo-banner-btn">Coba Sekarang</button>
            </div>
          )}

          <div className="auth-page-tabs">
            {(['masuk', 'daftar', 'demo'] as const).map(tab => (
              <button
                key={tab}
                className={`auth-page-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <i className={`fa-solid ${tab === 'masuk' ? 'fa-right-to-bracket' : tab === 'daftar' ? 'fa-user-plus' : 'fa-bolt'}`} />
                {' '}{tab === 'masuk' ? 'Masuk' : tab === 'daftar' ? 'Daftar' : 'Demo Cepat'}
              </button>
            ))}
          </div>

          {/* MASUK PANE */}
          <div className={`auth-page-pane${activeTab === 'masuk' ? ' active' : ''}`}>
            <form className="auth-page-form" onSubmit={(e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              handleEmailLogin(email);
            }}>
              <div className="form-group">
                <label className="form-label">Email Bisnis</label>
                <div className="auth-input-wrap">
                  <i className="fa-regular fa-envelope auth-input-icon" />
                  <input name="email" type="email" className="form-control auth-input-padded" placeholder="kedai@bisnis.anda" required defaultValue="demo@sirkula.id" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Kata Sandi</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-lock auth-input-icon" />
                  <input name="password" type={showPw ? 'text' : 'password'} className="form-control auth-input-padded" placeholder="Minimal 8 karakter" required defaultValue="sirkula123" />
                  <button type="button" className="toggle-pw" onClick={() => setShowPw(p => !p)}>
                    <i className={`fa-regular ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>
              <div className="auth-form-options">
                <label className="auth-checkbox-label"><input type="checkbox" defaultChecked /> Ingat saya</label>
                <a href="#" className="auth-forgot-link">Lupa kata sandi?</a>
              </div>
              <button type="submit" className="btn-primary btn-auth-page-submit">
                <i className="fa-solid fa-right-to-bracket" /> Masuk ke Platform
              </button>
              <p className="auth-divider-text"><span>atau masuk sebagai</span></p>
              <div className="auth-quick-role-btns">
                {(['upstream', 'downstream', 'biohub'] as const).map(role => (
                  <button key={role} type="button"
                    className={`auth-role-quick-btn ${role}-quick`}
                    onClick={() => quickLoginAs(role)}
                  >
                    <i className={`fa-solid ${role === 'upstream' ? 'fa-mug-saucer' : role === 'downstream' ? 'fa-seedling' : 'fa-flask'}`} />
                    {' '}{role === 'upstream' ? 'Kedai Kopi' : role === 'downstream' ? 'Petani Jamur' : 'Operator'}
                  </button>
                ))}
              </div>
              <p className="auth-switch-text">Belum punya akun? <button type="button" className="auth-switch-btn" onClick={() => setActiveTab('daftar')}>Daftar gratis</button></p>
            </form>
          </div>

          {/* DAFTAR PANE */}
          <div className={`auth-page-pane${activeTab === 'daftar' ? ' active' : ''}`}>
            <form className="auth-page-form" onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleEmailRegister(
                fd.get('nama') as string,
                regRole,
                fd.get('email') as string,
                fd.get('city') as string
              );
            }}>
              <div className="form-group">
                <label className="form-label">Tipe Akun Mitra</label>
                <div className="auth-role-selector">
                  {(['upstream', 'downstream', 'biohub'] as const).map(role => (
                    <button
                      key={role} type="button"
                      className={`auth-role-sel-btn${regRole === role ? ' active' : ''}`}
                      onClick={() => setRegRole(role)}
                    >
                      <i className={`fa-solid ${role === 'upstream' ? 'fa-mug-saucer' : role === 'downstream' ? 'fa-seedling' : 'fa-flask'}`} />
                      <span>{role === 'upstream' ? 'Kedai Kopi' : role === 'downstream' ? 'Petani Jamur' : 'Operator'}</span>
                      <small>{role === 'upstream' ? 'Upstream' : role === 'downstream' ? 'Downstream' : 'Bio-Hub'}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Nama Bisnis / Kedai</label>
                  <div className="auth-input-wrap">
                    <i className="fa-solid fa-store auth-input-icon" />
                    <input name="nama" type="text" className="form-control auth-input-padded" placeholder="Nama resmi mitra Anda" required />
                  </div>
                </div>
                <div className="form-group col-6">
                  <label className="form-label">No. WhatsApp</label>
                  <div className="auth-input-wrap">
                    <i className="fa-brands fa-whatsapp auth-input-icon" />
                    <input name="phone" type="tel" className="form-control auth-input-padded" placeholder="08xx-xxxx-xxxx" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Bisnis</label>
                <div className="auth-input-wrap">
                  <i className="fa-regular fa-envelope auth-input-icon" />
                  <input name="email" type="email" className="form-control auth-input-padded" placeholder="email@bisnis.anda" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Kota / Kabupaten</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-location-dot auth-input-icon" />
                  <input name="city" type="text" className="form-control auth-input-padded" placeholder="Jakarta, Bandung, Bogor..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Buat Kata Sandi</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-lock auth-input-icon" />
                  <input
                    name="password" type={showRegPw ? 'text' : 'password'}
                    className="form-control auth-input-padded" placeholder="Minimal 8 karakter" required
                    value={pwValue} onChange={e => setPwValue(e.target.value)}
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowRegPw(p => !p)}>
                    <i className={`fa-regular ${showRegPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
                <div className="password-strength-bar">
                  <div className="pw-strength-fill" style={{ width: pwStrength.percent, background: pwStrength.color }} />
                </div>
                <span className="pw-strength-label" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
              </div>
              <label className="auth-tos-label">
                <input type="checkbox" required />
                <span>Saya menyetujui <a href="#" className="auth-link">Syarat &amp; Ketentuan</a> dan <a href="#" className="auth-link">Kebijakan Privasi</a> Sirkula</span>
              </label>
              <button type="submit" className="btn-primary btn-auth-page-submit">
                <i className="fa-solid fa-user-plus" /> Daftar &amp; Mulai Gratis
              </button>
              <p className="auth-switch-text">Sudah punya akun? <button type="button" className="auth-switch-btn" onClick={() => setActiveTab('masuk')}>Masuk di sini</button></p>
            </form>
          </div>

          {/* DEMO PANE */}
          <div className={`auth-page-pane${activeTab === 'demo' ? ' active' : ''}`}>
            <p className="auth-demo-page-subtitle">Klik kartu di bawah untuk masuk langsung sebagai akun demo — tidak perlu email atau password.</p>
            <div className="auth-page-demo-cards">
              {([
                { role: 'upstream',   bg: 'linear-gradient(135deg, #8B5E3C, #6F4E37)', icon: 'fa-mug-saucer',  tag: 'upstream-tag',   title: 'Mitra Kedai Kopi',  name: 'Kopi Titik Koma',   loc: 'Cabang Sudirman, Jakarta',       feats: ['Jadwal Penjemputan', 'Pelacak Real-Time', 'Eco-Badge & Reward'] },
                { role: 'downstream', bg: 'linear-gradient(135deg, #1B4D3E, #40916C)', icon: 'fa-seedling',    tag: 'downstream-tag', title: 'Mitra Petani Jamur', name: 'Berkah Jamur Farm', loc: 'Lembang, Kab. Bandung Barat', feats: ['Toko Grosir Baglog', 'Kalkulator Panen', 'Garansi & Tiket SOP'] },
                { role: 'biohub',     bg: 'linear-gradient(135deg, #3730A3, #6366F1)', icon: 'fa-flask',       tag: 'biohub-tag',     title: 'Operator Bio-Hub',  name: 'Bio-Hub Lembang',   loc: 'Pusat Produksi Baglog SCG',     feats: ['Dasbor Produksi', 'Antrian Penjemputan', 'Monitor Sterilisasi'] },
              ] as const).map(({ role, bg, icon, tag, title, name, loc, feats }) => (
                <button key={role} className="auth-page-demo-card" onClick={() => quickLoginAs(role)}>
                  <div className="apdemo-icon" style={{ background: bg }}>
                    <i className={`fa-solid ${icon}`} />
                  </div>
                  <div className="apdemo-body">
                    <span className={`demo-card-role-tag ${tag}`}>{role === 'upstream' ? 'Upstream' : role === 'downstream' ? 'Downstream' : 'Operator'}</span>
                    <h4>{title}</h4>
                    <p><strong>{name}</strong></p>
                    <small><i className="fa-solid fa-location-dot" /> {loc}</small>
                  </div>
                  <div className="apdemo-features">
                    {feats.map(f => <span key={f}><i className="fa-solid fa-check" /> {f}</span>)}
                  </div>
                  <div className="apdemo-cta">
                    <span>Masuk Sekarang</span>
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </button>
              ))}
            </div>
            <p className="auth-switch-text" style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              Ingin akun permanen? <button type="button" className="auth-switch-btn" onClick={() => setActiveTab('daftar')}>Daftar gratis</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
