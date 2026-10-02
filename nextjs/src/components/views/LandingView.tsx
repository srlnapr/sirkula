'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getFormulaData } from '@/lib/utils';

export default function LandingView() {
  const { switchRole, state } = useApp();
  const { metrics } = state;
  const [coffeeRatio, setCoffeeRatio] = useState(20);
  const formula = getFormulaData(coffeeRatio);

  return (
    <>
      {/* ==================== HERO BANNER ==================== */}
      <div className="hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-leaf" />
            <span>Model Ekonomi Sirkular Terintegrasi • Upstream ke Downstream</span>
          </div>
          <h1 className="hero-title">
            Ubah Residu Ampas Kopi Menjadi <br />
            <span className="text-gradient-emerald">Ketahanan Pangan &amp; Efisiensi Media Tanam Baglog</span>
          </h1>
          <p className="hero-description">
            Sirkula menjembatani <strong>kedai kopi perkotaan</strong> dengan <strong>petani jamur tiram lokal</strong>.{' '}
            Melalui formulasi substrat bio-teknologi berbasis spent coffee grounds (SCG), kami memotong biaya media tanam
            hingga <strong>17-20%</strong> sekaligus mencegah pembusukan ampas kopi menjadi gas metana di TPA.
          </p>
          <div className="hero-cta-group">
            <button className="btn-primary" onClick={() => switchRole('upstream')}>
              <i className="fa-solid fa-truck-ramp-box" />
              <span>Mulai Jemput Ampas (Kedai Kopi)</span>
            </button>
            <button className="btn-secondary" onClick={() => switchRole('downstream')}>
              <i className="fa-solid fa-store" />
              <span>Beli Baglog Terformulasi (Petani Jamur)</span>
            </button>
          </div>
          <div className="hero-stats-cards">
            <div className="stat-pill"><strong>120+</strong> Kedai Kopi Bermitra</div>
            <div className="stat-pill"><strong>Rp500/baglog</strong> Penghematan Biaya Petani</div>
            <div className="stat-pill"><strong>3-5 Hari</strong> Inkubasi Miselium Lebih Cepat</div>
            <div className="stat-pill"><strong>Garansi Mutu</strong> Substrat Teruji Sirkula</div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-card">
            <img src="/assets/images/sirkula_hero.jpg" alt="Ekosistem Sirkula Kopi dan Jamur" className="img-responsive hero-main-img" />
            <div className="img-floating-caption">
              <div className="caption-icon"><i className="fa-solid fa-microchip" /></div>
              <div className="caption-body">
                <span className="caption-title">Sirkula Bio-Nutrisi Formula</span>
                <span className="caption-sub">Ampas Kopi 20% + Serbuk Sengon + Dedak Padi Halus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== IMPACT STATS RIBBON ==================== */}
      <div className="stats-ribbon landing-stats-ribbon" id="statsRibbon">
        <div className="ribbon-inner">
          <div className="ribbon-item">
            <div className="ribbon-icon coffee-stat"><i className="fa-solid fa-weight-hanging" /></div>
            <div className="ribbon-meta">
              <span className="ribbon-label">Ampas Kopi Dikelola</span>
              <div className="ribbon-val-group">
                <span className="ribbon-value">{metrics.coffeeKgTotal.toLocaleString('id-ID')}</span>
                <span className="ribbon-unit">kg</span>
                <span className="ribbon-trend"><i className="fa-solid fa-arrow-trend-up" /> +12% bln ini</span>
              </div>
            </div>
          </div>
          <div className="ribbon-divider" />
          <div className="ribbon-item">
            <div className="ribbon-icon baglog-stat"><i className="fa-solid fa-box-archive" /></div>
            <div className="ribbon-meta">
              <span className="ribbon-label">Baglog Jamur Terdistribusi</span>
              <div className="ribbon-val-group">
                <span className="ribbon-value">{metrics.baglogsDistributed.toLocaleString('id-ID')}</span>
                <span className="ribbon-unit">unit</span>
                <span className="ribbon-subtag">Ke 38 Kumbung</span>
              </div>
            </div>
          </div>
          <div className="ribbon-divider" />
          <div className="ribbon-item">
            <div className="ribbon-icon ch4-stat"><i className="fa-solid fa-cloud-arrow-down" /></div>
            <div className="ribbon-meta">
              <span className="ribbon-label">Emisi Metana (CH₄) Dicegah</span>
              <div className="ribbon-val-group">
                <span className="ribbon-value">{metrics.ch4PreventedKg.toLocaleString('id-ID')}</span>
                <span className="ribbon-unit">kg CO₂e</span>
                <span className="ribbon-subtag badge-green">Target Pengurangan Residu TPA</span>
              </div>
            </div>
          </div>
          <div className="ribbon-divider" />
          <div className="ribbon-item ribbon-live-status">
            <span className="live-pulse" />
            <span className="live-text">Bio-Hub Lembang: <strong>Aktif Sterilisasi Batch #88</strong></span>
          </div>
        </div>
      </div>

      {/* ==================== CIRCULAR LOOP SECTION ==================== */}
      <div className="circular-loop-section" id="circular-flow">
        <div className="section-header text-center">
          <span className="section-tag">Rantai Pasok Tertutup</span>
          <h2 className="section-title">Alur Tertutup (Closed-Loop) Sirkula</h2>
          <p className="section-subtitle">Dari tegukan espresso di kedai kopi hingga panen jamur tiram segar berkualitas tinggi</p>
        </div>
        <div className="loop-grid">
          {/* Step 1 */}
          <div className="loop-card" data-step="1">
            <div className="loop-step-num">01</div>
            <div className="loop-card-media">
              <img src="/assets/images/sirkula_cafe.jpg" alt="Penjemputan Ampas Kopi Kedai" className="loop-img" />
              <span className="badge-role-tag upstream-bg">Upstream Kedai Kopi</span>
            </div>
            <div className="loop-card-body">
              <h3>Pengumpulan &amp; Pemilahan Ampas</h3>
              <p>Kedai kopi memisahkan ampas kopi murni ke dalam ember kedap udara Sirkula berbarcode. Armada logistik Sirkula, dengan transisi bertahap menuju kendaraan listrik, menjemput ampas kopi secara terjadwal untuk menekan emisi dan mengoptimalkan rute sirkular.</p>
              <ul className="loop-perks">
                <li><i className="fa-solid fa-check" /> Sertifikat Pengurangan Emisi &amp; Eco-Badge</li>
                <li><i className="fa-solid fa-check" /> Pengambilan terjadwal tanpa ribet</li>
              </ul>
            </div>
          </div>
          <div className="loop-arrow"><i className="fa-solid fa-arrow-right-long" /></div>
          {/* Step 2 */}
          <div className="loop-card featured" data-step="2">
            <div className="loop-step-num">02</div>
            <div className="loop-card-media">
              <img src="/assets/images/sirkula_biohub.jpg" alt="Bio-Processing Facility Sirkula" className="loop-img" />
              <span className="badge-role-tag sirkula-bg">Bio-Processing Sirkula Hub</span>
            </div>
            <div className="loop-card-body">
              <h3>Formulasi Substrat &amp; Sterilisasi</h3>
              <p>Ampas kopi kaya nitrogen difermentasi ringan, dicampur serbuk gergaji &amp; dedak, diatur pH 6.5, lalu disterilisasi suhu 121°C bertekanan tinggi.</p>
              <ul className="loop-perks">
                <li><i className="fa-solid fa-check" /> Rasio C:N optimal (28:1) untuk jamur</li>
                <li><i className="fa-solid fa-check" /> Efisiensi biaya bahan baku hingga 20%</li>
              </ul>
            </div>
          </div>
          <div className="loop-arrow"><i className="fa-solid fa-arrow-right-long" /></div>
          {/* Step 3 */}
          <div className="loop-card" data-step="3">
            <div className="loop-step-num">03</div>
            <div className="loop-card-media">
              <img src="/assets/images/sirkula_mushroom.jpg" alt="Panen Jamur Tiram Petani" className="loop-img" />
              <span className="badge-role-tag downstream-bg">Downstream Petani Jamur</span>
            </div>
            <div className="loop-card-body">
              <h3>Distribusi Baglog &amp; Panen Maksimal</h3>
              <p>Petani mendapatkan baglog terformulasi SCG siap tumbuh dengan harga bersubsidi Rp2.500 (hemat 17%) yang dilengkapi panduan monitoring mikroklimat berbasis IoT untuk membantu pengambilan keputusan budidaya secara terukur.</p>
              <ul className="loop-perks">
                <li><i className="fa-solid fa-check" /> Panen hingga 4-5 flush produktif</li>
                <li><i className="fa-solid fa-check" /> Bekas media (spent baglog) jadi kompos premium</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3-YEAR STRATEGIC CIRCULAR ROADMAP */}
        <div style={{ marginTop: '3.5rem' }}>
          <div className="section-header text-center" style={{ marginBottom: '2rem' }}>
            <span className="section-tag" style={{ background: '#CCFBF1', color: '#0F766E' }}>Roadmap Sirkular Berkelanjutan</span>
            <h3 className="section-title" style={{ fontSize: '1.75rem' }}>Tahapan Perkembangan Sirkular Sirkula</h3>
            <p className="section-subtitle" style={{ maxWidth: '680px', margin: '0.5rem auto 0' }}>
              Peta jalan pengembangan 3 tahun untuk memastikan kesiapan ekosistem, teknologi IoT, dan standarisasi rantai dingin sebelum aktivasi sistem buyback.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
            {/* Year 1 */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #86EFAC', padding: '1.75rem', boxShadow: '0 4px 16px rgba(16,185,129,0.08)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '0.25rem 0.65rem', borderRadius: '20px' }}>
                  YEAR 1 (Current)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>Fase Berjalan</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.75rem' }}>
                Pondasi Ekosistem &amp; IoT
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1rem' }}>
                Fokus pembangunan ekosistem kemitraan dasar, digitalisasi alur, dan monitoring data budidaya:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.6 }}>
                <li>Pembangunan ekosistem kedai kopi &amp; petani</li>
                <li>Digitalisasi pencatatan dan logistik terencana</li>
                <li>IoT monitoring mikroklimat kumbung</li>
                <li>Pembentukan mitra rintisan di Jawa Barat</li>
              </ul>
            </div>

            {/* Year 2 */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--slate-200)', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#F1F5F9', color: '#475569', padding: '0.25rem 0.65rem', borderRadius: '20px' }}>
                  YEAR 2
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Fase Konsolidasi</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.75rem' }}>
                Scale-Up &amp; Efisiensi Distribusi
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1rem' }}>
                Fokus pembesaran kapasitas produksi dan peningkatan efisiensi operasional armada:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.6 }}>
                <li>Scale-up kapasitas produksi baglog bersubsidi</li>
                <li>Optimalisasi operasional fasilitas Bio-Hub</li>
                <li>Perluasan jaringan kemitraan wilayah perkotaan</li>
                <li>Peningkatan efisiensi rute dan transisi armada EV</li>
              </ul>
            </div>

            {/* Year 3 */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #99F6E4', padding: '1.75rem', boxShadow: '0 4px 16px rgba(15,118,110,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#CCFBF1', color: '#0F766E', padding: '0.25rem 0.65rem', borderRadius: '20px' }}>
                  YEAR 3
                </span>
                <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 800 }}>Future Development</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.75rem' }}>
                Sistem Buyback &amp; Cold-Chain
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1rem' }}>
                Fokus penyerapan hasil panen terstandarisasi dengan rantai dingin pasca-panen:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.6 }}>
                <li>Sistem buyback hasil panen petani mitra</li>
                <li>Reverse logistics terkoordinasi</li>
                <li>Packaging khusus &amp; box suhu terkontrol (cold-chain)</li>
                <li>Penguatan circular economy closed-loop utuh</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MVP EXHIBITION ==================== */}
      <div className="mvp-exhibition-section" id="impact-simulator">
        <div className="section-header text-center">
          <span className="section-tag highlight">Eksibisi Prototipe Ganda</span>
          <h2 className="section-title">Validasi MVP Fisik &amp; MVP Digital Sirkula</h2>
          <p className="section-subtitle">Simulasi langsung formula bio-teknologi media tanam serta antarmuka operasional digital terintegrasi</p>
        </div>
        <div className="mvp-grid">
          {/* MVP FISIK */}
          <div className="mvp-card fisik-card">
            <div className="mvp-badge-header">
              <div className="mvp-pill"><i className="fa-solid fa-flask-vial" /> MVP FISIK (Formula Substrat)</div>
              <span className="lab-certified"><i className="fa-solid fa-award" /> Uji Lab Balitbang Pertanian</span>
            </div>
            <h3 className="mvp-card-title">Simulator Formulasi Substrat Ampas Kopi (SCG)</h3>
            <p className="mvp-desc">Geser persentase ampas kopi untuk melihat simulasi dampak langsung terhadap kecepatan tumbuh miselium, efisiensi biaya, dan rasio nutrisi.</p>
            <div className="interactive-slider-box">
              <div className="slider-header">
                <span className="slider-title">Kadar Campuran Ampas Kopi Sirkula:</span>
                <span className="slider-value-display">{coffeeRatio}% SCG Formula {coffeeRatio === 20 ? '(Formula Emas)' : ''}</span>
              </div>
              <input
                type="range" min={10} max={30} step={5} value={coffeeRatio}
                className="custom-range"
                onChange={e => setCoffeeRatio(Number(e.target.value))}
              />
              <div className="range-labels">
                <span>10% (Konservatif)</span>
                <span>20% (Formula Emas Sirkula)</span>
                <span>30% (Kadar Maksimal)</span>
              </div>
            </div>
            <div className="formula-results-grid">
              <div className="result-tile">
                <div className="result-icon"><i className="fa-solid fa-bolt text-emerald" /></div>
                <div className="result-data">
                  <span className="result-label">Laju Inkubasi Miselium</span>
                  <strong className="result-val text-emerald">{formula.incubationSpeed}</strong>
                </div>
              </div>
              <div className="result-tile">
                <div className="result-icon"><i className="fa-solid fa-piggy-bank text-brown" /></div>
                <div className="result-data">
                  <span className="result-label">Efisiensi Biaya Bahan Baku</span>
                  <strong className="result-val text-brown">{formula.costSaving}</strong>
                </div>
              </div>
              <div className="result-tile">
                <div className="result-icon"><i className="fa-solid fa-dna text-blue" /></div>
                <div className="result-data">
                  <span className="result-label">Kepadatan Miselium &amp; Pinhead</span>
                  <strong className="result-val text-blue">{formula.density}</strong>
                </div>
              </div>
              <div className="result-tile">
                <div className="result-icon"><i className="fa-solid fa-chart-pie text-purple" /></div>
                <div className="result-data">
                  <span className="result-label">Rasio C:N &amp; Nitrogen Tersedia</span>
                  <strong className="result-val text-purple">{formula.cnRatio}</strong>
                </div>
              </div>
            </div>
            <div className="composition-breakdown">
              <span className="comp-label">Komposisi Bahan Siap Inokulasi:</span>
              <div className="composition-bar">
                <div className="comp-slice comp-coffee" style={{ width: `${coffeeRatio}%` }} title={`Ampas Kopi: ${coffeeRatio}%`}>{coffeeRatio}% Kopi</div>
                <div className="comp-slice comp-sawdust" style={{ width: `${formula.sawdust}%` }} title={`Serbuk Kayu: ${formula.sawdust}%`}>{formula.sawdust}% Serbuk Kayu</div>
                <div className="comp-slice comp-bran" style={{ width: `${formula.bran}%` }} title={`Dedak: ${formula.bran}%`}>{formula.bran}% Dedak</div>
                <div className="comp-slice comp-calcium" style={{ width: `${formula.calcium}%` }} title={`CaCO3: ${formula.calcium}%`}>{formula.calcium}% CaCO3</div>
              </div>
            </div>
          </div>

          {/* MVP DIGITAL */}
          <div className="mvp-card digital-card">
            <div className="mvp-badge-header">
              <div className="mvp-pill digital-pill"><i className="fa-solid fa-laptop-code" /> MVP DIGITAL (Platform B2B)</div>
              <span className="live-system-tag"><i className="fa-solid fa-circle-dot blink" /> Sistem Siap Uji</span>
            </div>
            <h3 className="mvp-card-title">Akses Langsung 3 Fitur Unggulan Digital</h3>
            <p className="mvp-desc">Eksplorasi modul antarmuka yang dirancang khusus untuk masing-masing pemangku kepentingan dalam ekosistem Sirkula:</p>
            <div className="digital-features-list">
              <div className="feature-preview-box" onClick={() => switchRole('upstream')}>
                <div className="feature-preview-icon upstream-icon-box"><i className="fa-solid fa-truck-pickup" /></div>
                <div className="feature-preview-info">
                  <div className="feature-title-row">
                    <h4>Fitur 1: Jadwal Jemput &amp; Eco-Badge</h4>
                    <span className="badge-pill-xs">Upstream</span>
                  </div>
                  <p>Penjadwalan pick-up ampas kopi kedai, pipeline pelacakan armada real-time, dan unduh sertifikat Eco-Badge counter digital.</p>
                </div>
                <div className="feature-arrow"><i className="fa-solid fa-chevron-right" /></div>
              </div>
              <div className="feature-preview-box" onClick={() => switchRole('downstream', 'catalog')}>
                <div className="feature-preview-icon downstream-icon-box"><i className="fa-solid fa-boxes-stacked" /></div>
                <div className="feature-preview-info">
                  <div className="feature-title-row">
                    <h4>Fitur 2: Toko Grosir Baglog Terformulasi SCG</h4>
                    <span className="badge-pill-xs">Downstream</span>
                  </div>
                  <p>Katalog B2B Rp2.500/baglog (-17%), kalkulator penghematan modal grosir, serta checkout instan dengan termin bersubsidi.</p>
                </div>
                <div className="feature-arrow"><i className="fa-solid fa-chevron-right" /></div>
              </div>
              <div className="feature-preview-box" onClick={() => switchRole('downstream', 'calculator')}>
                <div className="feature-preview-icon yield-icon-box"><i className="fa-solid fa-calculator" /></div>
                <div className="feature-preview-info">
                  <div className="feature-title-row">
                    <h4>Fitur 3: Kalkulator Panen &amp; Garansi</h4>
                    <span className="badge-pill-xs">Downstream</span>
                  </div>
                  <p>Simulasi timeline flushes, proyeksi omset panen jamur, checklist SOP kumbung harian, dan tiket garansi ganti baglog baru.</p>
                </div>
                <div className="feature-arrow"><i className="fa-solid fa-chevron-right" /></div>
              </div>
            </div>
            <div className="digital-footer-banner">
              <i className="fa-solid fa-shield-halved" />
              <span>Keamanan Data B2B, Verifikasi Berat Digital Scale, &amp; Otomasi Faktur Pajak Lingkungan.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
