'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateYield, formatDate, getTodayString, formatRupiah } from '@/lib/utils';

interface HarvestItem {
  id: string;
  date: string;
  session: string;
  weightKg: number;
  grade: 'A' | 'B';
  kumbung: string;
  revenueEst: number;
  status: 'absorbed' | 'pending';
}

const CHECKLIST = [
  {
    label: 'Pengkabutan Kelembaban (RH 80-90%)',
    desc: 'Semprot kabut air lantai & udara kumbung 2-3x sehari (hindari semprot langsung ke lubang baglog).',
  },
  {
    label: 'Suhu Kumbung Terkendali (22°C - 26°C)',
    desc: 'Pastikan sirkulasi ventilasi atas dan bawah terbuka agar suhu tidak melonjak di siang hari.',
  },
  {
    label: 'Pencahayaan Baur Alami (10-15%)',
    desc: 'Jamur tiram butuh cahaya baur untuk induksi pembentukan primordia / badan buah.',
  },
  {
    label: 'Sanitasi & Penjarangan Pinhead',
    desc: 'Cabut sisa akar panen sebelumnya agar tidak membusuk dan memicu lalat jamur (Phorid fly).',
  },
];

const INIT_HARVESTS: HarvestItem[] = [
  {
    id: '#HVT-902',
    date: '27 Sep 2026',
    session: 'Pagi (06:30 WIB)',
    weightKg: 48.5,
    grade: 'A',
    kumbung: 'Kumbung 1 (Lembang)',
    revenueEst: 727500,
    status: 'absorbed',
  },
  {
    id: '#HVT-898',
    date: '25 Sep 2026',
    session: 'Pagi (07:00 WIB)',
    weightKg: 52.0,
    grade: 'A',
    kumbung: 'Kumbung 2 (Cibodas)',
    revenueEst: 780000,
    status: 'absorbed',
  },
  {
    id: '#HVT-891',
    date: '22 Sep 2026',
    session: 'Sore (16:00 WIB)',
    weightKg: 35.0,
    grade: 'B',
    kumbung: 'Kumbung 1 (Lembang)',
    revenueEst: 507500,
    status: 'absorbed',
  },
];

export default function DownstreamView() {
  const { state, openCheckout, updateMetrics, showToast } = useApp();
  const { metrics } = state;

  // Active sub-nav anchor
  const [activeSubTab, setActiveSubTab] = useState<'iot' | 'store' | 'harvest' | 'buyback'>('iot');

  // Wholesale calculator state
  const [qty, setQty] = useState(2000);
  const PRICE_SIRKULA = 2500;
  const PRICE_MARKET = 3000;
  const totalSirkula = qty * PRICE_SIRKULA;
  const totalMarket = qty * PRICE_MARKET;
  const savings = totalMarket - totalSirkula;

  const handleQtyChange = (val: number) => {
    const clamped = Math.max(500, Math.min(50000, val));
    setQty(clamped);
    updateMetrics({ baglogsOrdered: clamped });
  };

  // Yield calculator state
  const [baglogCount, setBaglogCount] = useState(2000);
  const [inocDate, setInocDate] = useState(getTodayString());
  const [pricePerKg, setPricePerKg] = useState(15000);
  const yieldData = calculateYield(baglogCount, pricePerKg, new Date(inocDate));

  // Harvest logging
  const [harvestList, setHarvestList] = useState<HarvestItem[]>(INIT_HARVESTS);
  const [harvestWeight, setHarvestWeight] = useState(45);
  const [harvestGrade, setHarvestGrade] = useState<'A' | 'B'>('A');
  const [harvestKumbung, setHarvestKumbung] = useState('Kumbung 1 (Lembang)');

  // Care score
  const [checks, setChecks] = useState([true, true, true, true]);
  const careScore = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  // Modals state
  const [showSopModal, setShowSopModal] = useState(false);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [photoName, setPhotoName] = useState('');
  const [showPickupSuccess, setShowPickupSuccess] = useState(false);

  const handleCheckout = () => {
    updateMetrics({ baglogsOrdered: qty });
    openCheckout();
  };

  const handleLogHarvest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rate = harvestGrade === 'A' ? 15000 : 14500;
    const rev = harvestWeight * rate;

    const newHvt: HarvestItem = {
      id: `#HVT-${Math.floor(910 + Math.random() * 80)}`,
      date: 'Hari ini',
      session: 'Sesi Pagi (07:00 WIB)',
      weightKg: harvestWeight,
      grade: harvestGrade,
      kumbung: harvestKumbung,
      revenueEst: rev,
      status: 'absorbed',
    };

    setHarvestList((prev) => [newHvt, ...prev]);

    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 70,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#059669', '#10B981', '#F59E0B'],
      });
    }

    showToast(
      `Panen ${harvestWeight} kg Jamur Tiram Grade ${harvestGrade} berhasil dicatat! Terjadwal offtake otomatis.`,
      'success'
    );
  };

  const handleSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = Math.floor(1000 + Math.random() * 9000);
    showToast(
      `Tiket garansi tercatat: #${ticketId}. Tim teknis Bio-Hub Lembang akan mengirimkan baglog pengganti gratis setelah verifikasi.`,
      'success'
    );
    setPhotoName('');
    setShowWarrantyModal(false);
  };

  const handleRequestBuybackPickup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPickupSuccess(true);
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#059669', '#1B4D3E', '#FBBF24'],
      });
    }
    showToast(
      'Permintaan penjemputan offtake panen berhasil! Armada EV Kang Asep akan tiba pukul 08:30 WIB besok pagi.',
      'success'
    );
  };

  return (
    <>
      {/* ========================================================
          SUB-NAV QUICK JUMP BAR FOR FARMER
          Synchronized with TopNav links (#iot-telemetry, #marketplace, #harvest-log, #buyback)
          ======================================================== */}
      <nav className="farmer-subnav-bar" aria-label="Sub navigasi portal kelompok tani">
        <div className="farmer-subnav-container">
          <div className="farmer-subnav-pills">
            <a
              href="#iot-telemetry"
              className={`farmer-subnav-link${activeSubTab === 'iot' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('iot')}
            >
              <i className="fa-solid fa-temperature-half" />
              <span>IoT Kumbung</span>
            </a>
            <a
              href="#marketplace"
              className={`farmer-subnav-link${activeSubTab === 'store' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('store')}
            >
              <i className="fa-solid fa-box" />
              <span>Pesan Baglog Bersubsidi</span>
            </a>
            <a
              href="#harvest-log"
              className={`farmer-subnav-link${activeSubTab === 'harvest' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('harvest')}
            >
              <i className="fa-solid fa-scale-balanced" />
              <span>Catat Panen</span>
            </a>
            <a
              href="#buyback"
              className={`farmer-subnav-link${activeSubTab === 'buyback' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('buyback')}
            >
              <i className="fa-solid fa-handshake" />
              <span>Buyback Jamur</span>
            </a>
          </div>

          <div className="coffee-subnav-quick-actions">
            <button
              type="button"
              className="btn-subnav-action"
              onClick={() => setShowWarrantyModal(true)}
            >
              <i className="fa-solid fa-shield-virus" />
              <span>Klaim Garansi 100%</span>
            </button>
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              style={{ background: '#059669', borderColor: '#059669' }}
              onClick={handleCheckout}
            >
              <i className="fa-solid fa-cart-shopping" />
              <span>Pesan Baglog Grosir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================
          PORTAL HEADER
          ======================================================== */}
      <div className="portal-header farm-header">
        <div className="portal-profile">
          <div className="profile-avatar farm-avatar">
            <i className="fa-solid fa-seedling" />
          </div>
          <div className="profile-details">
            <div className="profile-badges">
              <span className="role-pill downstream-pill">
                <i className="fa-solid fa-wheat-awn" /> Mitra Downstream Kelompok Tani
              </span>
              <span className="partner-tier-badge emerald-tier">
                <i className="fa-solid fa-certificate" /> Kelompok Tani Binaan Sirkula • Garansi 100% Tumbuh
              </span>
            </div>
            <h2 className="profile-name">Kumbung Berkah Jamur — Lembang</h2>
            <p className="profile-address">
              <i className="fa-solid fa-location-dot" /> Ds. Cibodas, Lembang, Kab. Bandung Barat •
              Kapasitas: <strong>8.000 Baglog</strong> (3 Kumbung Aktif) • ID Mitra: <strong>SRK-DW-0412</strong>
            </p>
          </div>
        </div>
        <div className="header-action-cards">
          <button className="btn-primary" onClick={handleCheckout}>
            <i className="fa-solid fa-cart-shopping" />
            <span>Pesan Baglog Bersubsidi</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          METRICS KPI 4-COLUMN GRID
          ======================================================== */}
      <div className="metrics-grid">
        {[
          {
            title: 'Populasi Baglog Kumbung',
            icon: 'fa-cubes-stacked',
            color: 'green-soft',
            value: '5.500',
            unit: 'unit aktif',
            footer: (
              <span className="text-positive">
                <i className="fa-solid fa-arrow-trend-up" /> Formula SCG-20 Miselium Cepat
              </span>
            ),
          },
          {
            title: 'Suhu Kumbung Rata-rata',
            icon: 'fa-temperature-half',
            color: 'teal-soft',
            value: '23.6°C',
            unit: 'Optimal (22-26°C)',
            footer: 'Kelembapan udara 86.4% RH terkontrol',
          },
          {
            title: 'Subsidi Modal Terhemat',
            icon: 'fa-hand-holding-dollar',
            color: 'gold-soft',
            value: 'Rp 2,75 Jt',
            unit: 'Rp500/baglog',
            footer: <span>Hemat 17% dibanding harga pasaran umum</span>,
          },
          {
            title: 'Panen Terserap Offtaker',
            icon: 'fa-handshake',
            color: 'brown-soft',
            value: '1.240',
            unit: 'kg jamur',
            footer: (
              <span className="text-positive">
                <i className="fa-solid fa-circle-check" /> 100% Terserap Hotel &amp; Resto Mitra
              </span>
            ),
          },
        ].map(({ title, icon, color, value, unit, footer }) => (
          <div key={title} className="metric-card">
            <div className="metric-top">
              <span className="metric-title">{title}</span>
              <div className={`metric-icon-circle ${color}`}>
                <i className={`fa-solid ${icon}`} />
              </div>
            </div>
            <div className="metric-main">
              <h3 className="metric-number">{value}</h3>
              <span className="metric-unit">{unit}</span>
            </div>
            <div className="metric-footer">{footer}</div>
          </div>
        ))}
      </div>

      {/* ========================================================
          SECTION 1: IOT TELEMETRI KUMBUNG JAMUR
          ID: iot-telemetry (Exact navbar match)
          ======================================================== */}
      <section
        id="iot-telemetry"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="IoT Telemetri Kumbung Jamur"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon" style={{ background: '#D1FAE5', color: '#059669' }}>
              <i className="fa-solid fa-temperature-half" />
            </div>
            <div>
              <span className="csh-tag" style={{ color: '#059669' }}>
                Smart Agri-Sensor Telemetry
              </span>
              <h3 className="csh-title">IoT Telemetri Kumbung Jamur Real-Time</h3>
              <p className="csh-subtitle">
                Pantau mikroklimat kumbung (suhu, kelembapan RH, kadar CO₂, dan cahaya) untuk menjaga
                tumbuh kembang miselium dan kualitas tudung jamur tiram putih.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <button
              type="button"
              className="btn-subnav-action"
              onClick={() => setShowSopModal(true)}
            >
              <i className="fa-solid fa-clipboard-check" />
              <span>Checklist SOP Kumbung</span>
            </button>
          </div>
        </div>

        {/* 4 Sensor Cards */}
        <div className="iot-kumbung-grid">
          {[
            {
              title: 'Suhu Kumbung',
              icon: 'fa-temperature-arrow-down',
              val: '23.6',
              unit: '°C',
              color: '#059669',
              bg: '#D1FAE5',
              target: 'Target: 22°C - 26°C (Optimal)',
            },
            {
              title: 'Kelembapan Udara (RH)',
              icon: 'fa-droplet',
              val: '86.4',
              unit: '% RH',
              color: '#0284C7',
              bg: '#E0F2FE',
              target: 'Target: 80% - 90% (Sangat Baik)',
            },
            {
              title: 'Konsentrasi Gas CO₂',
              icon: 'fa-cloud',
              val: '680',
              unit: 'ppm',
              color: '#65A30D',
              bg: '#ECFCCB',
              target: 'Batas: < 1.000 ppm (Aerasi Baik)',
            },
            {
              title: 'Intensitas Cahaya Baur',
              icon: 'fa-sun',
              val: '12.5',
              unit: '%',
              color: '#D97706',
              bg: '#FEF3C7',
              target: 'Target: 10% - 15% (Induksi Pinhead)',
            },
          ].map((s) => (
            <div key={s.title} className="iot-kumbung-card">
              <div className="ikc-top">
                <span className="ikc-sensor-title">{s.title}</span>
                <div className="ikc-icon-badge" style={{ background: s.bg, color: s.color }}>
                  <i className={`fa-solid ${s.icon}`} />
                </div>
              </div>
              <div className="ikc-value-wrap">
                <span className="ikc-val">{s.val}</span>
                <span className="ikc-unit">{s.unit}</span>
              </div>
              <span className="ikc-target-txt">{s.target}</span>
            </div>
          ))}
        </div>

        {/* Smart Kumbung Automation Panel */}
        <div className="kumbung-automation-panel">
          <div className="kap-left">
            <div className="kap-icon">
              <i className="fa-solid fa-microchip" />
            </div>
            <div className="kap-text">
              <h4>Otomasi Smart Misting &amp; Kipas Ventilasi Kumbung</h4>
              <p>
                Nozzle kabut air otomatis aktif setiap 4 jam selama 3 menit atau saat kelembapan drop di
                bawah 80% RH. Ventilasi silent blower menjaga sirkulasi oksigen segar.
              </p>
            </div>
          </div>
          <div className="kap-actions">
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              style={{ background: '#059669', borderColor: '#059669' }}
              onClick={() => {
                showToast(
                  'Nozzle Pengkabutan Air Aktif! Menyemprotkan kabut mikro selama 3 menit di Kumbung 1 & 2...',
                  'success'
                );
              }}
            >
              <i className="fa-solid fa-shower" />
              <span>Semprot Kabut Air Manual</span>
            </button>
            <button
              type="button"
              className="btn-subnav-action"
              onClick={() => {
                showToast(
                  'Kipas Exhaust Kumbung diaktifkan ke Mode Boost untuk pembuangan akumulasi CO₂.',
                  'info'
                );
              }}
            >
              <i className="fa-solid fa-fan" />
              <span>Blower Udara</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: TOKO GROSIR BAGLOG BERSUBSIDI SCG-20
          ID: marketplace (Exact navbar match)
          ======================================================== */}
      <section
        id="marketplace"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Pesan Baglog Bersubsidi"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon" style={{ background: '#EDE0D4', color: '#6F4E37' }}>
              <i className="fa-solid fa-box" />
            </div>
            <div>
              <span className="csh-tag" style={{ color: '#6F4E37' }}>
                B2B Subsidized Baglog Marketplace
              </span>
              <h3 className="csh-title">Toko Grosir Baglog Bersubsidi Sirkula</h3>
              <p className="csh-subtitle">
                Media tanam jamur tiram berkualitas tinggi dengan formula ampas kopi 20%. Lebih hemat 17%
                dibanding harga pasaran umum dengan garansi tumbuh 100%.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <span className="partner-tier-badge emerald-tier">
              <i className="fa-solid fa-badge-percent" /> Subsidi Khusus Petani Binaan
            </span>
          </div>
        </div>

        <div className="store-grid" id="baglogStoreSection">
          {/* Product Showcase Card */}
          <div className="product-showcase-card">
            <div className="product-media-container">
              <img
                src="/assets/images/sirkula_hero.jpg"
                alt="Baglog Sirkula Ampas Kopi"
                className="product-img"
              />
              <div className="product-overlay-pill">
                <i className="fa-solid fa-star" /> Paling Diminati Petani
              </div>
            </div>
            <div className="product-info-body">
              <div className="product-title-row">
                <div>
                  <h3 className="product-title">Baglog Jamur Tiram Sirkula Nutrisi Tinggi</h3>
                  <span className="product-code">
                    Formula Khusus SCG-20 (Spent Coffee Grounds Enriched)
                  </span>
                </div>
              </div>
              <div className="price-comparison-banner">
                <div className="sirkula-price-box">
                  <span className="price-label">Harga B2B Sirkula</span>
                  <div className="price-main">
                    <span className="currency">Rp</span>
                    <strong className="price-amt">2.500</strong>
                    <span className="per-unit">/ baglog</span>
                  </div>
                </div>
                <div className="vs-divider">VS</div>
                <div className="market-price-box">
                  <span className="price-label">Harga Pasaran Umum</span>
                  <div className="market-amt-strike">Rp 3.000 / baglog</div>
                </div>
                <div className="savings-discount-badge">
                  <span className="disc-percent">-17% LEBIH HEMAT</span>
                  <span className="disc-sub">Hemat Rp500 per unit</span>
                </div>
              </div>
              <div className="specs-grid">
                {[
                  {
                    icon: 'fa-temperature-arrow-up',
                    title: 'Sterilisasi Uap 121°C',
                    sub: 'Bebas spora jamur liar & Trichoderma',
                  },
                  {
                    icon: 'fa-dna',
                    title: 'Bibit F2 Indukan Florida',
                    sub: 'Miselium tebal, adaptif dataran sedang-tinggi',
                  },
                  {
                    icon: 'fa-weight-scale',
                    title: 'Bobot Substrat: 1.2 kg',
                    sub: 'Kadar air pas 60-65%, nutrisi dedak murni',
                  },
                  {
                    icon: 'fa-shield-virus',
                    title: 'Garansi 100% Ganti Baru',
                    sub: 'Klaim langsung jika rusak dalam 14 hari',
                  },
                ].map(({ icon, title, sub }) => (
                  <div key={title} className="spec-item">
                    <i className={`fa-solid ${icon}`} />
                    <div>
                      <strong>{title}</strong>
                      <span>{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calculator Card */}
          <div className="order-calculator-card">
            <div className="calc-header">
              <div className="calc-header-icon">
                <i className="fa-solid fa-calculator" />
              </div>
              <div>
                <h3 className="calc-title">Kalkulator Pembelian Grosir B2B</h3>
                <p className="calc-sub">
                  Hitung langsung penghematan modal &amp; estimasi logistik kumbung
                </p>
              </div>
            </div>
            <div className="calc-body">
              <div className="order-quantity-control">
                <div className="qty-label-row">
                  <label className="qty-label">Jumlah Pemesanan Baglog:</label>
                  <div className="qty-display-box">
                    <input
                      type="number"
                      min={500}
                      max={20000}
                      step={100}
                      value={qty}
                      className="qty-direct-input"
                      onChange={(e) => handleQtyChange(Number(e.target.value))}
                    />
                    <span className="qty-unit-tag">unit</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={250}
                  value={Math.min(qty, 10000)}
                  className="custom-range"
                  onChange={(e) => handleQtyChange(Number(e.target.value))}
                />
                <div className="range-quantities">
                  {[500, 1000, 2000, 5000, 10000].map((q) => (
                    <span
                      key={q}
                      onClick={() => handleQtyChange(q)}
                      style={{ cursor: 'pointer' }}
                    >
                      {q === 500 ? '500 (Min)' : q.toLocaleString('id-ID')}
                    </span>
                  ))}
                </div>
              </div>
              <div className="cost-summary-box">
                <div className="summary-line">
                  <span>Subtotal Sirkula (@ Rp2.500)</span>
                  <strong>{formatRupiah(totalSirkula)}</strong>
                </div>
                <div className="summary-line strike-line">
                  <span>Jika Beli di Pasaran Umum (@ Rp3.000)</span>
                  <span>{formatRupiah(totalMarket)}</span>
                </div>
                <div className="savings-highlight-ribbon">
                  <div className="ribbon-text-group">
                    <i className="fa-solid fa-hand-holding-dollar" />
                    <span>Total Penghematan Modal Anda:</span>
                  </div>
                  <strong className="savings-amount">{formatRupiah(savings)}</strong>
                </div>
                <div className="logistics-estimation">
                  <div className="logistic-row">
                    <span>
                      <i className="fa-solid fa-truck" /> Estimasi Pengiriman:
                    </span>
                    <strong>2 - 3 Hari Kerja (Armada Sirkula Hub)</strong>
                  </div>
                  <div className="logistic-row">
                    <span>
                      <i className="fa-solid fa-coins" /> Subsidi Biaya Kirim:
                    </span>
                    <strong className="text-emerald">Gratis Ongkir (Order &gt; 1.500 pcs)</strong>
                  </div>
                </div>
              </div>
              <div className="calc-action-row">
                <button className="btn-checkout-b2b" onClick={handleCheckout}>
                  <i className="fa-solid fa-bag-shopping" />
                  <span>Lanjut Pemesanan Grosir ({qty.toLocaleString('id-ID')} Unit)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: PENCATATAN PANEN & ESTIMASI YIELD KALENDER
          ID: harvest-log (Exact navbar match)
          ======================================================== */}
      <section
        id="harvest-log"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Pencatatan Panen dan Estimasi Hasil"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <i className="fa-solid fa-scale-balanced" />
            </div>
            <div>
              <span className="csh-tag" style={{ color: '#D97706' }}>
                Yield &amp; Production Accounting
              </span>
              <h3 className="csh-title">Catat Panen Harian &amp; Proyeksi Omset</h3>
              <p className="csh-subtitle">
                Catat berat segar panen per kumbung dan pantau kalender 3 flush bertahap untuk menjaga
                efisiensi biologis (Biological Efficiency 85 - 95%).
              </p>
            </div>
          </div>
          <div className="csh-right">
            <a href="#buyback" className="btn-subnav-action btn-subnav-primary" style={{ background: '#059669', borderColor: '#059669' }}>
              <i className="fa-solid fa-handshake" />
              <span>Jual Hasil Panen (Buyback)</span>
            </a>
          </div>
        </div>

        <div className="harvest-dashboard-grid">
          {/* Harvest Input Form */}
          <div className="harvest-form-card">
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="fa-solid fa-pen-to-square" style={{ color: '#059669' }} /> Form Catat
              Panen Segar
            </h4>
            <form onSubmit={handleLogHarvest} className="interactive-form">
              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">
                    Bobot Panen Segar (kg) <span className="req">*</span>
                  </label>
                  <div className="input-with-icon">
                    <i className="fa-solid fa-weight-scale input-icon" />
                    <input
                      type="number"
                      required
                      min={1}
                      max={1000}
                      step={0.5}
                      value={harvestWeight}
                      onChange={(e) => setHarvestWeight(parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Grade Jamur</label>
                  <select
                    className="form-control"
                    value={harvestGrade}
                    onChange={(e) => setHarvestGrade(e.target.value as 'A' | 'B')}
                  >
                    <option value="A">Grade A (Tudung Lebar 5-8 cm, Rp15.000/kg)</option>
                    <option value="B">Grade B (Ukuran Sedang, Rp14.500/kg)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Kumbung Sumber</label>
                  <select
                    className="form-control"
                    value={harvestKumbung}
                    onChange={(e) => setHarvestKumbung(e.target.value)}
                  >
                    <option value="Kumbung 1 (Lembang)">Kumbung 1 (Lembang - 3.000 baglog)</option>
                    <option value="Kumbung 2 (Cibodas)">Kumbung 2 (Cibodas - 2.500 baglog)</option>
                    <option value="Kumbung 3 (Cadangan)">Kumbung 3 (Cadangan - 2.500 baglog)</option>
                  </select>
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Estimasi Nilai Panen</label>
                  <div
                    style={{
                      padding: '0.65rem 0.85rem',
                      background: '#FAF7F2',
                      border: '1px solid #EDE0D4',
                      borderRadius: '10px',
                      fontWeight: 800,
                      color: '#059669',
                      fontSize: '0.95rem',
                    }}
                  >
                    {formatRupiah(harvestWeight * (harvestGrade === 'A' ? 15000 : 14500))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-subnav-action btn-subnav-primary"
                style={{ width: '100%', padding: '0.75rem', background: '#059669', borderColor: '#059669' }}
              >
                <i className="fa-solid fa-plus" />
                <span>Simpan Log Panen &amp; Jadwalkan Penyerapan</span>
              </button>
            </form>
          </div>

          {/* Recent Harvest Records Table */}
          <div className="harvest-records-card">
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="fa-solid fa-clock-rotate-left" style={{ color: '#6F4E37' }} /> Riwayat
              Panen Terakhir
            </h4>
            <table className="harvest-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Bobot</th>
                  <th>Grade</th>
                  <th>Estimasi Omset</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {harvestList.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <code>{h.id}</code>
                    </td>
                    <td>{h.date}</td>
                    <td>
                      <strong>{h.weightKg} kg</strong>
                    </td>
                    <td>
                      <span className={`harvest-grade-pill grade-${h.grade.toLowerCase()}`}>
                        Grade {h.grade}
                      </span>
                    </td>
                    <td>{formatRupiah(h.revenueEst)}</td>
                    <td>
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                        <i className="fa-solid fa-circle-check" /> Terserap
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-Flush Harvest Projections */}
        <div className="yield-calculator-section" style={{ marginTop: '1.5rem' }}>
          <div className="yield-grid">
            <div className="yield-inputs-card">
              <h4 className="card-subtitle-bold">
                <i className="fa-solid fa-sliders" /> Parameter Simulasi Proyeksi Kumbung
              </h4>
              <div className="form-group">
                <label className="form-label">Jumlah Baglog Dimiliki (unit):</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-boxes-stacked input-icon" />
                  <input
                    type="number"
                    value={baglogCount}
                    min={100}
                    max={50000}
                    step={100}
                    className="form-control"
                    onChange={(e) => setBaglogCount(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Mulai Inokulasi / Masuk Kumbung:</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-calendar-check input-icon" />
                  <input
                    type="date"
                    value={inocDate}
                    className="form-control"
                    onChange={(e) => setInocDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="benefit-box">
                <i className="fa-solid fa-bolt text-emerald" />
                <span>
                  Formula SCG-20: Masa kolonisasi miselium <strong>20 - 22 hari</strong> (3 - 5 hari
                  lebih cepat dibanding serbuk gergaji murni).
                </span>
              </div>
            </div>

            <div className="yield-results-card">
              <h4 className="card-subtitle-bold">
                <i className="fa-solid fa-calendar-days" /> Proyeksi Kalender Panen 3 Flush
              </h4>
              <div className="harvest-timeline">
                {[
                  {
                    icon: 'fa-check',
                    color: 'tp-green',
                    label: 'Kolonisasi Miselium Penuh (Hari ke-22)',
                    date: yieldData.dateCol,
                    note: 'Buka penutup cincin plastik & mulai pengkabutan air',
                  },
                  {
                    icon: 'fa-fan',
                    color: 'tp-emerald',
                    label: 'Panen Perdana (Flush 1) - Terbesar (Hari ke-28)',
                    date: yieldData.dateF1,
                    note: `Estimasi: ${yieldData.yieldF1.toLocaleString('id-ID')} kg jamur tiram segar`,
                  },
                  {
                    icon: 'fa-repeat',
                    color: 'tp-blue',
                    label: 'Panen Flush 2 (Hari ke-42)',
                    date: yieldData.dateF2,
                    note: `Estimasi: ${yieldData.yieldF2.toLocaleString('id-ID')} kg jamur tiram segar`,
                  },
                  {
                    icon: 'fa-basket-shopping',
                    color: 'tp-purple',
                    label: 'Panen Flush 3 & Akhir Siklus (Hari ke-56)',
                    date: yieldData.dateF3,
                    note: `Estimasi: ${yieldData.yieldF3.toLocaleString('id-ID')} kg jamur tiram segar`,
                  },
                ].map(({ icon, color, label, date, note }) => (
                  <div key={label} className="timeline-point">
                    <div className={`tp-icon ${color}`}>
                      <i className={`fa-solid ${icon}`} />
                    </div>
                    <div className="tp-content">
                      <span className="tp-label">{label}</span>
                      <strong className="tp-date">{formatDate(date)}</strong>
                      <span className="tp-note">{note}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="yield-summary-tiles">
                <div className="tile-stat">
                  <span className="tstat-label">Estimasi Total Panen (3 Flushes)</span>
                  <div className="tstat-num">
                    <span>{yieldData.totalYield.toLocaleString('id-ID')}</span>{' '}
                    <small>kg Jamur</small>
                  </div>
                  <span className="tstat-sub">Biological Efficiency ~40%</span>
                </div>
                <div className="tile-stat highlight-emerald">
                  <span className="tstat-label">Estimasi Potensi Omset Penjualan</span>
                  <div className="tstat-num">
                    <span>{formatRupiah(yieldData.totalRevenue)}</span>
                  </div>
                  <span className="tstat-sub">
                    Estimasi Laba Kotor: {formatRupiah(yieldData.estimatedNetProfit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: BUYBACK JAMUR & OFFTAKER GUARANTEE
          ID: buyback (Exact navbar match)
          ======================================================== */}
      <section
        id="buyback"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Buyback Jamur dan Jaminan Penyerapan"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon" style={{ background: '#CCFBF1', color: '#0F766E' }}>
              <i className="fa-solid fa-handshake" />
            </div>
            <div>
              <span className="csh-tag" style={{ color: '#0F766E' }}>
                Guaranteed Offtaker Contract
              </span>
              <h3 className="csh-title">Kontrak Penyerapan Hasil Panen (Buyback Jamur)</h3>
              <p className="csh-subtitle">
                Sirkula menjamin 100% penyerapan panen jamur tiram putih petani dengan harga beli stabil
                di atas harga tengkulak untuk disalurkan ke jaringan Horeka &amp; Supermarket.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <span
              className="partner-tier-badge"
              style={{ background: '#CCFBF1', color: '#0F766E', border: '1px solid #99F6E4' }}
            >
              <i className="fa-solid fa-shield-halved" /> Kontrak Terikat: Kuota 3.500 kg / Bulan
            </span>
          </div>
        </div>

        <div className="buyback-layout">
          {/* Contract Showcase Card */}
          <div className="buyback-contract-card">
            <div className="bcc-header">
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: '#A7F3D0',
                    fontWeight: 800,
                  }}
                >
                  Kontrak Kemitraan Sirkular Terpadu
                </span>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-display)',
                    color: 'white',
                    marginTop: '0.2rem',
                  }}
                >
                  Jaminan Harga Beli Tingkat Petani
                </h3>
              </div>
              <span className="bcc-seal-badge">KONTRAK RESMI AKTIF</span>
            </div>

            <div className="bcc-price-showcase">
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                HARGA PEMBELIAN SIRKULA DI KUMBUNG:
              </span>
              <div className="bcc-price-row">
                <span className="bcc-price-num">Rp 15.000</span>
                <span style={{ fontSize: '1rem', color: '#D1FAE5' }}>/ kg (Grade A Bersih)</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#FBBF24' }}>
                ✓ Bebas potongan tengkulak pasar liar (yang sering menekan harga hingga Rp 11.000/kg)
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5 }}>
              Armada EV Sirkula menjemput hasil panen langsung ke kumbung Anda. Pembayaran dicairkan
              maksimal 1x24 jam langsung ke rekening kelompok tani atau dapat digunakan memotong tagihan
              tempo baglog.
            </p>

            <div style={{ marginTop: '1.25rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.65)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 700,
                }}
              >
                Jaringan Klien Buyer Penyerap Hasil Panen Anda:
              </span>
              <div className="bcc-buyers-list">
                <span className="bcc-buyer-chip">
                  <i className="fa-solid fa-hotel" /> All Sedayu Hotel Group
                </span>
                <span className="bcc-buyer-chip">
                  <i className="fa-solid fa-utensils" /> Dapur Sunda Lembang
                </span>
                <span className="bcc-buyer-chip">
                  <i className="fa-solid fa-cart-shopping" /> Super Indo Segar Bandung
                </span>
                <span className="bcc-buyer-chip">
                  <i className="fa-solid fa-bowl-food" /> Pabrik Keripik Jamur Crispy
                </span>
              </div>
            </div>
          </div>

          {/* Request Offtake Pickup Form */}
          <div className="buyback-pickup-form-card">
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="fa-solid fa-truck" style={{ color: '#059669' }} /> Ajukan Penjemputan
              Panen Segar
            </h4>
            <form onSubmit={handleRequestBuybackPickup} className="interactive-form">
              <div className="form-group">
                <label className="form-label">Tanggal Siap Jemput</label>
                <input
                  type="date"
                  required
                  defaultValue={getTodayString()}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimasi Berat Panen (kg)</label>
                <input
                  type="number"
                  min={10}
                  max={2000}
                  defaultValue={50}
                  required
                  className="form-control"
                />
                <small className="form-help">Minimal penjemputan armada adalah 25 kg jamur tiram.</small>
              </div>

              <div className="form-group">
                <label className="form-label">Pilihan Kemasan di Kumbung</label>
                <select className="form-control" defaultValue="krat">
                  <option value="krat">Krat Plastik Sirkula 10 kg (Disediakan Kurir)</option>
                  <option value="plastik">Kantung Plastik Bening Tebal 5 kg</option>
                  <option value="curah">Kotak Kayu Curah Petani</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Tambahan untuk Driver EV</label>
                <textarea
                  rows={2}
                  defaultValue="Panen dipetik subuh pukul 05:30 WIB, siap di timbang di depan kumbung 1."
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="btn-subnav-action btn-subnav-primary"
                style={{ width: '100%', padding: '0.75rem', background: '#059669', borderColor: '#059669' }}
              >
                <i className="fa-solid fa-paper-plane" />
                <span>Kirim Permintaan Penjemputan Panen</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================
          MODAL 1: CHECKLIST SOP & PERAWATAN KUMBUNG
          ======================================================== */}
      {showSopModal && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setShowSopModal(false);
            }
          }}
        >
          <div className="coffee-modal-dialog">
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-list-check" style={{ color: '#059669' }} /> SOP &amp;
                Checklist Harian Kumbung
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowSopModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="care-score-wrap" style={{ marginBottom: '1.25rem' }}>
              <div className="score-top">
                <span>Skor Kepatuhan Kumbung:</span>
                <strong
                  className={
                    careScore === 100
                      ? 'text-emerald'
                      : careScore >= 75
                      ? 'text-blue'
                      : 'text-brown'
                  }
                >
                  {careScore}%{' '}
                  {careScore === 100
                    ? '(Sangat Optimal)'
                    : careScore >= 75
                    ? '(Cukup Baik)'
                    : '(Perlu Perhatian)'}
                </strong>
              </div>
              <div className="score-progress-bar">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${careScore}%`,
                    background:
                      careScore === 100
                        ? '#10B981'
                        : careScore >= 75
                        ? '#3B82F6'
                        : '#D97706',
                  }}
                />
              </div>
            </div>
            <div className="checklist-items">
              {CHECKLIST.map((item, i) => (
                <label key={i} className="check-item">
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() =>
                      setChecks((prev) => {
                        const n = [...prev];
                        n[i] = !n[i];
                        return n;
                      })
                    }
                  />
                  <div className="check-text">
                    <strong>{item.label}</strong>
                    <span>{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem', background: '#059669', borderColor: '#059669' }}
              onClick={() => setShowSopModal(false)}
            >
              Simpan &amp; Tutup
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: KLAIM GARANSI 100% GANTI BARU
          ======================================================== */}
      {showWarrantyModal && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setShowWarrantyModal(false);
            }
          }}
        >
          <div className="coffee-modal-dialog">
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-shield-virus" style={{ color: '#DC2626' }} /> Klaim
                Garansi 100% Ganti Baru
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowWarrantyModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSupportTicket} className="interactive-form">
              <div className="form-group">
                <label className="form-label">Nomor Batch Baglog Sirkula:</label>
                <select className="form-control" required>
                  <option value="Batch #SRK-B88">Batch #SRK-B88 (Tgl Kirim: 22 Sep 2026)</option>
                  <option value="Batch #SRK-B82">Batch #SRK-B82 (Tgl Kirim: 10 Sep 2026)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Jenis Masalah Substrat:</label>
                <select className="form-control" required>
                  <option>Miselium Lambat / Berhenti Merambat</option>
                  <option>Tercemar Jamur Hijau (Trichoderma)</option>
                  <option>Substrat Kering / Rusak saat Pengiriman</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Jumlah Baglog Terindikasi (unit):</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  defaultValue={5}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unggah Foto Bukti Substrat:</label>
                <div
                  className="file-upload-dropzone"
                  onClick={() => document.getElementById('ticketPhotoInput')?.click()}
                >
                  <i className="fa-solid fa-cloud-arrow-up drop-icon" />
                  <span>
                    {photoName
                      ? `Foto terpilih: ${photoName} (Siap diunggah)`
                      : 'Klik untuk pilih foto kumbung / baglog bermasalah'}
                  </span>
                  <input
                    type="file"
                    id="ticketPhotoInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoName(file.name);
                        showToast('Foto bukti substrat berhasil dilampirkan.', 'info');
                      }
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-subnav-action btn-subnav-primary"
                  style={{ flex: 1, padding: '0.75rem', background: '#DC2626', borderColor: '#DC2626' }}
                >
                  Kirim Klaim Penggantian
                </button>
                <button
                  type="button"
                  className="btn-subnav-action"
                  onClick={() => setShowWarrantyModal(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
