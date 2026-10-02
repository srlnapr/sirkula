'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate, getTodayString } from '@/lib/utils';

interface PickupHistoryItem {
  id: string;
  date: string;
  slot: string;
  weight: number;
  co2: number;
  status: 'done' | 'scheduled';
  driver: string;
  notes?: string;
}

interface SmartBin {
  id: string;
  code: string;
  name: string;
  location: string;
  currentKg: number;
  maxKg: number;
  temp: number;
  moisture: number;
  grade: string;
  lastSealed: string;
  status: 'urgent' | 'normal' | 'low';
}

interface RewardItem {
  id: string;
  category: 'merch' | 'beans' | 'ops' | 'esg';
  title: string;
  points: number;
  icon: string;
  badge: string;
  desc: string;
  stock: number;
  value: string;
}

interface RedeemedVoucher {
  id: string;
  code: string;
  title: string;
  points: number;
  date: string;
  status: 'active' | 'used';
}

const INIT_BINS: SmartBin[] = [
  {
    id: 'bin-1',
    code: 'SRK-BIN-01',
    name: 'Ember Smart Bar Utama',
    location: 'Area Mesin Espresso (Knockbox Station)',
    currentKg: 21.2,
    maxKg: 25.0,
    temp: 24.2,
    moisture: 61,
    grade: 'Grade A',
    lastSealed: '12 menit lalu',
    status: 'urgent',
  },
  {
    id: 'bin-2',
    code: 'SRK-BIN-02',
    name: 'Ember Smart Manual Brew',
    location: 'Slow Bar & Pour Over Station',
    currentKg: 11.5,
    maxKg: 25.0,
    temp: 23.5,
    moisture: 58,
    grade: 'Grade A',
    lastSealed: '45 menit lalu',
    status: 'normal',
  },
  {
    id: 'bin-3',
    code: 'SRK-BIN-03',
    name: 'Ember Smart Cold Brew Bar',
    location: 'Roastery & Immersion Prep Corner',
    currentKg: 4.8,
    maxKg: 25.0,
    temp: 22.8,
    moisture: 64,
    grade: 'Grade A',
    lastSealed: '2 jam lalu',
    status: 'low',
  },
];

const REWARD_CATALOG: RewardItem[] = [
  {
    id: 'rew-1',
    category: 'merch',
    title: 'Tote Bag Daur Ulang Kanvas Serat Kopi',
    points: 600,
    icon: 'fa-bag-shopping',
    badge: 'Eco-Merchandise',
    desc: 'Tote bag kanvas organik premium diproduksi dari perpaduan serat ampas kopi & katun daur ulang dengan logo Sirkula Eco-Partner.',
    stock: 24,
    value: 'Rp 85.000',
  },
  {
    id: 'rew-2',
    category: 'beans',
    title: 'Diskon 15% Biji Kopi Specialty Lembang (1 kg)',
    points: 1200,
    icon: 'fa-mug-hot',
    badge: 'Pasokan Biji',
    desc: 'Voucher potongan 15% untuk pembelian green atau roasted beans Arabika Lembang langsung dari kelompok tani mitra sirkular binaan Sirkula.',
    stock: 15,
    value: 'Rp 225.000',
  },
  {
    id: 'rew-3',
    category: 'ops',
    title: '100 Pcs Cup Biodegradable Bebas Mikroplastik',
    points: 1500,
    icon: 'fa-glass-water',
    badge: 'Kemasan Hijau',
    desc: 'Cup take-away 12oz ramah lingkungan berbahan komposit spent coffee grounds (SCG) yang dirancang untuk terurai secara hayati (biodegradable) dalam tanah.',
    stock: 8,
    value: 'Rp 310.000',
  },
  {
    id: 'rew-4',
    category: 'merch',
    title: 'Kit Mini Kumbung Jamur Display Kasir',
    points: 800,
    icon: 'fa-seedling',
    badge: 'Display Edukasi',
    desc: 'Mini baglog jamur tiram transparan siap panen untuk display meja kasir kedai kopi guna mengedukasi pelanggan tentang alur sirkular.',
    stock: 12,
    value: 'Rp 95.000',
  },
  {
    id: 'rew-5',
    category: 'ops',
    title: 'Voucher Kalibrasi & Servis Mesin Espresso Rp 250rb',
    points: 2500,
    icon: 'fa-wrench',
    badge: 'Perawatan Bar',
    desc: 'Voucher servis berkala, descaling boiler, penggantian gasket grouphead dari teknisi mesin kopi profesional rekanan Sirkula.',
    stock: 5,
    value: 'Rp 250.000',
  },
  {
    id: 'rew-6',
    category: 'esg',
    title: 'Plakat Kayu Jati Daur Ulang & Audit Bar Sirkula',
    points: 3200,
    icon: 'fa-award',
    badge: 'Sertifikasi Fisik',
    desc: 'Plakat kayu jati reclaimed resmi "Certified Zero Coffee Waste Partner" serta sesi konsultasi efisiensi operasional bar kedai.',
    stock: 3,
    value: 'Rp 500.000',
  },
];

const INIT_HISTORY: PickupHistoryItem[] = [
  {
    id: '#SRK-PK-892',
    date: '24 Sep 2026',
    slot: 'Sore (14:00 - 17:00)',
    weight: 28.5,
    co2: 54.1,
    status: 'done',
    driver: 'Kang Rahmat (EV B-1492-SRK)',
    notes: '2 Ember Sirkula ditimbang di bar belakang',
  },
  {
    id: '#SRK-PK-880',
    date: '21 Sep 2026',
    slot: 'Pagi (08:30 - 11:30)',
    weight: 32.0,
    co2: 60.8,
    status: 'done',
    driver: 'Kang Rahmat (EV B-1492-SRK)',
    notes: 'Kadar air tiris sempurna, aroma kopi segar',
  },
  {
    id: '#SRK-PK-865',
    date: '17 Sep 2026',
    slot: 'Sore (14:00 - 17:00)',
    weight: 26.0,
    co2: 49.4,
    status: 'done',
    driver: 'Pak Dimas (EV B-1830-SRK)',
    notes: 'Pengambilan rutin mingguan',
  },
];

const INIT_VOUCHERS: RedeemedVoucher[] = [
  {
    id: 'vch-1',
    code: 'SRK-REW-8492',
    title: 'Tote Bag Daur Ulang Serat Kopi',
    points: 600,
    date: '20 Sep 2026',
    status: 'active',
  },
];

export default function UpstreamView() {
  const { state, openEcoBadge, updateMetrics, setPipeline, showToast } = useApp();
  const { metrics, pickupPipeline } = state;

  const [history, setHistory] = useState<PickupHistoryItem[]>(INIT_HISTORY);
  const [smartBins, setSmartBins] = useState<SmartBin[]>(INIT_BINS);
  const [currentStep, setCurrentStep] = useState(pickupPipeline.currentStep);
  const [orderId, setOrderId] = useState(pickupPipeline.orderId);
  const [activeSubTab, setActiveSubTab] = useState<'waste' | 'pickup' | 'rewards' | 'esg'>('waste');
  const [activeRewardCat, setActiveRewardCat] = useState<'all' | 'merch' | 'beans' | 'ops' | 'esg'>('all');
  const [vouchers, setVouchers] = useState<RedeemedVoucher[]>(INIT_VOUCHERS);

  // Modals state
  const [selectedVoucher, setSelectedVoucher] = useState<RedeemedVoucher | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showOrderBinModal, setShowOrderBinModal] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState<PickupHistoryItem | null>(null);
  const [showSopModal, setShowSopModal] = useState(false);

  // Pre-fill weight from bin quick action
  const [pickupWeightInput, setPickupWeightInput] = useState<number>(25);

  const handleSchedulePickup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const dateVal = fd.get('date') as string;
    const slotVal = fd.get('slot') as string;
    const weightVal = parseFloat(fd.get('weight') as string) || pickupWeightInput || 25;
    const notesVal = (fd.get('notes') as string) || 'Penjemputan rutin ampas kopi tiris';

    const co2 = Math.round(weightVal * 1.9);
    updateMetrics({
      cafeSavedKg: metrics.cafeSavedKg + weightVal,
      cafeCo2Kg: metrics.cafeCo2Kg + co2,
      cafePoints: metrics.cafePoints + Math.round(weightVal * 5),
      coffeeKgTotal: metrics.coffeeKgTotal + weightVal,
      ch4PreventedKg: metrics.ch4PreventedKg + co2,
    });

    const newId = `#SRK-PK-${Math.floor(905 + Math.random() * 90)}`;
    setOrderId(newId);
    setPipeline({ orderId: newId, currentStep: 1 });
    setCurrentStep(1);

    const newHistoryItem: PickupHistoryItem = {
      id: newId,
      date: formatDate(dateVal),
      slot: slotVal,
      weight: weightVal,
      co2,
      status: 'scheduled',
      driver: 'Kang Rahmat (Armada EV B-1492-SRK)',
      notes: notesVal,
    };

    setHistory((prev) => [newHistoryItem, ...prev]);

    // Also simulate emptying the urgent bin if weight > 20
    if (weightVal >= 20) {
      setSmartBins((prev) =>
        prev.map((b) =>
          b.id === 'bin-1'
            ? { ...b, currentKg: 2.1, status: 'low', lastSealed: 'Baru dijadwalkan' }
            : b
        )
      );
    }

    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10B981', '#1B4D3E', '#DDB892', '#FBBF24'],
      });
    }

    showToast(
      `Berhasil! Penjemputan ${weightVal} kg ampas kopi terkonfirmasi untuk ${formatDate(dateVal)}.`,
      'success'
    );
  };

  const handleStep = (step: number) => {
    setCurrentStep(step);
    setPipeline({ currentStep: step });
    if (step === 4) {
      showToast(
        'Penjemputan selesai! Emisi resmi terkreditasi ke akun kedai kopi Anda.',
        'success'
      );
      if (typeof window !== 'undefined' && (window as any).confetti) {
        (window as any).confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#F59E0B'],
        });
      }
    }
  };

  const handleRedeemReward = (item: RewardItem) => {
    if (metrics.cafePoints < item.points) {
      showToast(
        `Saldo Eco-Points Anda tidak mencukupi (${metrics.cafePoints} / ${item.points} pts). Terus jemput ampas kopi untuk kumpulkan poin!`,
        'error'
      );
      return;
    }

    const newPoints = metrics.cafePoints - item.points;
    updateMetrics({ cafePoints: newPoints });

    const newCode = `SRK-REW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVoucher: RedeemedVoucher = {
      id: `vch-${Date.now()}`,
      code: newCode,
      title: item.title,
      points: item.points,
      date: 'Hari ini',
      status: 'active',
    };

    setVouchers((prev) => [newVoucher, ...prev]);
    setSelectedVoucher(newVoucher);

    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#6F4E37'],
      });
    }

    showToast(`Sukses menukar ${item.points} Eco-Points untuk "${item.title}"!`, 'success');
  };

  const handleOrderExtraBin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowOrderBinModal(false);
    showToast(
      'Permintaan 1 Ember Smart Bin Sirkula 25L berhasil dikirim! Kurir EV akan mengantarkannya pada jadwal penjemputan berikutnya.',
      'success'
    );
  };

  const steps = [
    {
      icon: 'fa-calendar-check',
      title: '1. Dijadwalkan',
      time: 'Hari ini, 09:15 WIB',
      desc: 'Penjemputan terdaftar di sistem Sirkula',
    },
    {
      icon: 'fa-truck-moving',
      title: '2. Driver Menuju Lokasi',
      time: 'Estimasi Tiba: 14:20 WIB',
      desc: 'Driver: Kang Rahmat (Armada EV B-1492-SRK)',
    },
    {
      icon: 'fa-scale-balanced',
      title: '3. Limbah Ditimbang & Diangkut',
      time: 'Menunggu penimbangan',
      desc: 'Timbangan digital Bluetooth terhubung real-time',
    },
    {
      icon: 'fa-circle-check',
      title: '4. Selesai (Emisi Terkreditasi)',
      time: 'Tahap akhir',
      desc: 'Sertifikat terbit otomatis & poin bertambah',
    },
  ];

  const filteredRewards =
    activeRewardCat === 'all'
      ? REWARD_CATALOG
      : REWARD_CATALOG.filter((r) => r.category === activeRewardCat);

  const totalBinKg = smartBins.reduce((acc, b) => acc + b.currentKg, 0);
  const totalBinCapacity = smartBins.reduce((acc, b) => acc + b.maxKg, 0);

  return (
    <>
      {/* ========================================================
          SUB-NAV QUICK JUMP BAR
          Synchronized with TopNav links (#upstream-waste, #pickup-schedule, #rewards, #esg)
          ======================================================== */}
      <nav className="coffee-subnav-bar" aria-label="Sub navigasi portal kedai kopi">
        <div className="coffee-subnav-container">
          <div className="coffee-subnav-pills">
            <a
              href="#upstream-waste"
              className={`coffee-subnav-link${activeSubTab === 'waste' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('waste')}
            >
              <i className="fa-solid fa-trash-can" />
              <span>Wadah Ampas Smart Bin</span>
            </a>
            <a
              href="#pickup-schedule"
              className={`coffee-subnav-link${activeSubTab === 'pickup' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('pickup')}
            >
              <i className="fa-solid fa-truck" />
              <span>Panggil Kurir EV</span>
            </a>
            <a
              href="#rewards"
              className={`coffee-subnav-link${activeSubTab === 'rewards' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('rewards')}
            >
              <i className="fa-solid fa-coins" />
              <span>Eco-Points &amp; Reward</span>
            </a>
            <a
              href="#esg"
              className={`coffee-subnav-link${activeSubTab === 'esg' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('esg')}
            >
              <i className="fa-solid fa-award" />
              <span>Sertifikat ESG &amp; Emisi</span>
            </a>
          </div>

          <div className="coffee-subnav-quick-actions">
            <button
              type="button"
              className="btn-subnav-action"
              onClick={() => setShowOrderBinModal(true)}
              title="Minta Ember Sirkula Baru"
            >
              <i className="fa-solid fa-plus" />
              <span>Minta Ember Baru</span>
            </button>
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              onClick={openEcoBadge}
              title="Buka QR Eco-Badge Kedai"
            >
              <i className="fa-solid fa-qrcode" />
              <span>QR Eco-Badge</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================
          PORTAL PROFILE HEADER
          ======================================================== */}
      <div className="portal-header cafe-header">
        <div className="portal-profile">
          <div className="profile-avatar cafe-avatar">
            <i className="fa-solid fa-mug-hot" />
          </div>
          <div className="profile-details">
            <div className="profile-badges">
              <span className="role-pill upstream-pill">
                <i className="fa-solid fa-coffee" /> Mitra Upstream Kedai Kopi
              </span>
              <span className="partner-tier-badge">
                <i className="fa-solid fa-award" /> Green Partner Tier 1 (Gold Acorn)
              </span>
            </div>
            <h2 className="profile-name">Kopi Titik Koma — Sudirman Hub</h2>
            <p className="profile-address">
              <i className="fa-solid fa-location-dot" /> Jl. Jend. Sudirman Kav. 52-53, Jakarta
              Selatan • ID Kemitraan: <strong>SRK-UP-0881</strong> • Terverifikasi ISO-14001
            </p>
          </div>
        </div>
        <div className="header-action-cards">
          <button className="btn-eco-badge-card" onClick={openEcoBadge}>
            <i className="fa-solid fa-qrcode" />
            <div className="text-left">
              <span className="btn-label-small">Promosi Hijau Pelanggan</span>
              <strong>Buka &amp; Unduh Eco-Badge Meja</strong>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================
          METRICS KPI 4-COLUMN GRID
          ======================================================== */}
      <div className="metrics-grid">
        {[
          {
            title: 'Total Ampas Diselamatkan',
            icon: 'fa-recycle',
            color: 'green-soft',
            value: metrics.cafeSavedKg.toLocaleString('id-ID'),
            unit: 'kg SCG',
            footer: (
              <span className="text-positive">
                <i className="fa-solid fa-arrow-trend-up" /> +45 kg minggu ini
              </span>
            ),
          },
          {
            title: 'Emisi Metana Dicegah',
            icon: 'fa-cloud-arrow-down',
            color: 'teal-soft',
            value: metrics.cafeCo2Kg.toLocaleString('id-ID'),
            unit: 'kg CO₂e',
            footer: (
              <span>
                Setara <strong>65 pohon</strong> menyerap emisi 1 tahun
              </span>
            ),
          },
          {
            title: 'Peringkat Kemitraan Hijau',
            icon: 'fa-medal',
            color: 'gold-soft',
            value: 'Tier 1',
            unit: 'Gold Acorn',
            footer: (
              <span>
                Kurang 575 pts lagi ke <strong>Champion Tier 2</strong>
              </span>
            ),
          },
          {
            title: 'Poin Sirkula Reward',
            icon: 'fa-coins',
            color: 'brown-soft',
            value: metrics.cafePoints.toLocaleString('id-ID'),
            unit: 'pts',
            footer: (
              <a href="#rewards" className="btn-text-link">
                Tukar Hadiah Bar &rarr;
              </a>
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
          SECTION 1: WADAH AMPAS (SMART COFFEE BIN TELEMETRY)
          ID: upstream-waste (Exact navbar match)
          ======================================================== */}
      <section
        id="upstream-waste"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Monitoring Wadah Ampas Kopi"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon waste-icon">
              <i className="fa-solid fa-trash-can" />
            </div>
            <div>
              <span className="csh-tag">IoT Smart Containers</span>
              <h3 className="csh-title">Monitoring Wadah Ampas Kopi Real-Time</h3>
              <p className="csh-subtitle">
                Pantau volume ampas kopi, sensor kelembapan tiris, dan suhu wadah agar tetap higienis
                sebelum dijemput.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <button
              type="button"
              className="btn-subnav-action"
              onClick={() => setShowSopModal(true)}
            >
              <i className="fa-solid fa-book-open" />
              <span>SOP Pemilahan Barista</span>
            </button>
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              onClick={() => setShowOrderBinModal(true)}
            >
              <i className="fa-solid fa-plus" />
              <span>Tambah Ember Baru</span>
            </button>
          </div>
        </div>

        {/* Overview Bar */}
        <div className="smart-bins-overview-bar">
          <div className="sbo-stat">
            <span className="sbo-label">Total Muatan di Kedai</span>
            <span className="sbo-val">
              {totalBinKg.toFixed(1)} / {totalBinCapacity} kg
            </span>
            <span className="sbo-sub">
              {Math.round((totalBinKg / totalBinCapacity) * 100)}% dari total kapasitas
            </span>
          </div>
          <div className="sbo-stat">
            <span className="sbo-label">Kebersihan Substrat</span>
            <span className="sbo-val">99.4%</span>
            <span className="sbo-sub">Grade A Murni (Bebas Susu/Plastik)</span>
          </div>
          <div className="sbo-stat">
            <span className="sbo-label">Rata-rata Waktu Simpan</span>
            <span className="sbo-val">1.2 Hari</span>
            <span className="sbo-sub">Aman dari fermentasi asam</span>
          </div>
          <div className="sbo-stat">
            <span className="sbo-label">Smart Bin Ber-RFID</span>
            <span className="sbo-val">{smartBins.length} Ember Aktif</span>
            <span className="sbo-sub">Tutup kedap udara silikon</span>
          </div>
        </div>

        {/* 3 Smart Bins Cards */}
        <div className="smart-bins-grid">
          {smartBins.map((bin) => {
            const pct = Math.round((bin.currentKg / bin.maxKg) * 100);
            const isHigh = pct >= 80;
            const isMed = pct >= 40 && pct < 80;
            return (
              <div
                key={bin.id}
                className={`smart-bin-card${bin.status === 'urgent' ? ' warning-fill' : ''}`}
              >
                <div className="smart-bin-top">
                  <span className={`sbt-badge ${bin.status}`}>
                    <i
                      className={`fa-solid ${
                        bin.status === 'urgent'
                          ? 'fa-triangle-exclamation'
                          : bin.status === 'normal'
                          ? 'fa-check'
                          : 'fa-circle-notch'
                      }`}
                    />
                    {bin.status === 'urgent'
                      ? 'Siap Dijemput'
                      : bin.status === 'normal'
                      ? 'Kapasitas Normal'
                      : 'Baru Dikosongkan'}
                  </span>
                  <span className="bin-id-tag">{bin.code}</span>
                </div>

                <h4 className="bin-name">{bin.name}</h4>
                <p className="bin-location">
                  <i className="fa-solid fa-location-crosshairs" /> {bin.location}
                </p>

                <div className="bin-capacity-box">
                  <div className="bcb-labels">
                    <span className="bcb-weight">
                      {bin.currentKg} <small style={{ fontSize: '0.75rem' }}>kg SCG</small>
                    </span>
                    <span
                      className="bcb-pct"
                      style={{
                        color: isHigh ? '#DC2626' : isMed ? '#059669' : '#64748B',
                      }}
                    >
                      {pct}% Penuh
                    </span>
                  </div>
                  <div className="bin-progress-track">
                    <div
                      className={`bin-progress-fill ${
                        isHigh ? 'fill-high' : isMed ? 'fill-med' : 'fill-low'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="bin-telemetry-grid">
                  <div className="bt-col">
                    <span className="bt-label">Kadar Air</span>
                    <strong className="bt-val">{bin.moisture}% (Tiris)</strong>
                  </div>
                  <div className="bt-col">
                    <span className="bt-label">Suhu</span>
                    <strong className="bt-val">{bin.temp}°C</strong>
                  </div>
                  <div className="bt-col">
                    <span className="bt-label">Kualitas</span>
                    <strong className="bt-val" style={{ color: '#059669' }}>
                      {bin.grade}
                    </strong>
                  </div>
                </div>

                <div className="bin-footer-row">
                  <span>
                    <i className="fa-solid fa-lock" /> Segel: {bin.lastSealed}
                  </span>
                  {bin.status === 'urgent' ? (
                    <a
                      href="#pickup-schedule"
                      className="btn-bin-action"
                      onClick={() => setPickupWeightInput(bin.currentKg)}
                    >
                      <i className="fa-solid fa-truck" /> Jemput Ini
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="btn-bin-action"
                      onClick={() =>
                        showToast(
                          `Label QR untuk ${bin.name} (${bin.code}) telah disiapkan.`,
                          'info'
                        )
                      }
                    >
                      <i className="fa-solid fa-qrcode" /> QR Wadah
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barista SOP Banner */}
        <div className="barista-sop-banner">
          <div className="sop-banner-content">
            <div className="sop-icon-circle">
              <i className="fa-solid fa-clipboard-check" />
            </div>
            <div className="sop-banner-text">
              <h4>Panduan Ringkas Barista: Kualitas Ampas Kopi Murni Sirkula</h4>
              <p>
                Pastikan ampas kopi espresso telah ditiriskan dari air knockbox, bebas sedotan
                plastik atau susu, lalu tutup rapat seal silikon wadah untuk menjaga pH 6.2 - 6.5.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-subnav-action"
            onClick={() => setShowSopModal(true)}
          >
            Lihat Checklist SOP
          </button>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: PANGGIL KURIR EV & PELACAK PENJEMPUTAN
          ID: pickup-schedule (Exact navbar match)
          ======================================================== */}
      <section
        id="pickup-schedule"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Panggil Kurir EV dan Pelacak Penjemputan"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon pickup-icon">
              <i className="fa-solid fa-truck-fast" />
            </div>
            <div>
              <span className="csh-tag">Distribusi Berkelanjutan Bertahap</span>
              <h3 className="csh-title">Panggil Kurir &amp; Jadwalkan Penjemputan</h3>
              <p className="csh-subtitle">
                Distribusi bertahap menggunakan kendaraan listrik sebagai bagian dari upaya menekan emisi dan meningkatkan efisiensi operasional.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <span className="pipeline-badge">Armada Aktif: EV-Fleet South Jakarta</span>
          </div>
        </div>

        <div className="dashboard-columns">
          {/* Pickup Form */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="header-icon-title">
                <div className="header-icon">
                  <i className="fa-solid fa-calendar-plus" />
                </div>
                <div>
                  <h3 className="card-title">Jadwalkan Penjemputan Ampas Kopi</h3>
                  <p className="card-subtitle">
                    Penjemputan terjadwal untuk kedai mitra (min. 10 kg ampas tiris)
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                margin: '0 1.5rem 1rem',
                padding: '0.75rem 0.9rem',
                background: '#FAF5EE',
                border: '1px solid #E6D5C3',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#6F4E37',
                lineHeight: 1.45,
              }}
            >
              <i className="fa-solid fa-circle-info" style={{ marginRight: '0.4rem', color: '#B08968' }} />
              <strong>Transisi Armada EV:</strong> Penggunaan kendaraan listrik dijalankan secara bertahap dengan mempertimbangkan biaya pengadaan armada, biaya charging/listrik, pemeliharaan berkala (maintenance), serta kesiapan infrastruktur charging.
            </div>
            <form id="pickupForm" onSubmit={handleSchedulePickup} className="interactive-form">
              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">
                    Tanggal Penjemputan <span className="req">*</span>
                  </label>
                  <div className="input-with-icon">
                    <i className="fa-regular fa-calendar input-icon" />
                    <input
                      type="date"
                      name="date"
                      required
                      className="form-control"
                      defaultValue={getTodayString()}
                    />
                  </div>
                </div>
                <div className="form-group col-6">
                  <label className="form-label">
                    Sesi Waktu <span className="req">*</span>
                  </label>
                  <div className="input-with-icon">
                    <i className="fa-regular fa-clock input-icon" />
                    <select name="slot" required className="form-control">
                      <option value="Sesi Pagi (08:30 - 11:30 WIB)">
                        Sesi Pagi (08:30 - 11:30 WIB)
                      </option>
                      <option value="Sesi Sore (14:00 - 17:00 WIB)" defaultValue="selected">
                        Sesi Sore (14:00 - 17:00 WIB)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Estimasi Berat Ampas (Kg) <span className="req">*</span>
                </label>
                <div className="weight-input-group">
                  <div className="input-with-icon flex-grow">
                    <i className="fa-solid fa-scale-balanced input-icon" />
                    <input
                      type="number"
                      name="weight"
                      min={5}
                      max={300}
                      value={pickupWeightInput}
                      onChange={(e) => setPickupWeightInput(parseFloat(e.target.value) || 0)}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="preset-weight-btns">
                    {[10, 25, 50].map((w) => (
                      <button
                        key={w}
                        type="button"
                        className={`btn-preset${pickupWeightInput === w ? ' active' : ''}`}
                        onClick={() => setPickupWeightInput(w)}
                      >
                        +{w} kg
                      </button>
                    ))}
                  </div>
                </div>
                <small className="form-help">
                  💡 Tips: 1 kg ampas kopi menghasilkan <strong>5 Eco-Points</strong> &amp; mencegah{' '}
                  <strong>1.9 kg CO₂e</strong> emisi metana.
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Wadah yang Dijemput &amp; Catatan Khusus</label>
                <textarea
                  name="notes"
                  rows={2}
                  className="form-control"
                  defaultValue="Ember Smart Bar Utama (#SRK-BIN-01) penuh di area bar belakang, ampas espresso telah ditiriskan."
                  placeholder="Contoh: Tersedia di 2 ember Sirkula warna hijau di area bar belakang..."
                />
              </div>

              <div className="form-action-row">
                <button type="submit" className="btn-submit-pickup">
                  <i className="fa-solid fa-truck-fast" />
                  <span>Konfirmasi &amp; Panggil Kurir EV</span>
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Tracking Stepper */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="header-icon-title">
                <div className="header-icon tracker-icon">
                  <i className="fa-solid fa-route" />
                </div>
                <div>
                  <h3 className="card-title">Pelacak Penjemputan Real-Time</h3>
                  <p className="card-subtitle">Status armada dan penimbangan penjemputan aktif</p>
                </div>
              </div>
              <div className="pipeline-badge">Order {orderId}</div>
            </div>

            {/* Driver Contact Quick Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: '#FAF7F2',
                border: '1px solid #EDE0D4',
                borderRadius: '12px',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#1B4D3E',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                  }}
                >
                  KR
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#0F172A', display: 'block' }}>
                    Kang Rahmat (Kurir EV)
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Armada Listrik Uji Efisiensi Rute • Rating 4.9 ★
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-subnav-action"
                style={{ fontSize: '0.72rem' }}
                onClick={() =>
                  showToast(
                    'Menghubungi Kang Rahmat (+62 812-8877-6655 via WhatsApp)...',
                    'info'
                  )
                }
              >
                <i className="fa-brands fa-whatsapp" style={{ color: '#059669' }} />
                <span>Chat Kurir</span>
              </button>
            </div>

            <div className="pipeline-stepper">
              {steps.map((s, idx) => {
                const stepNum = idx + 1;
                const cls =
                  stepNum < currentStep
                    ? 'completed'
                    : stepNum === currentStep
                    ? 'current'
                    : 'pending';
                return (
                  <div key={stepNum}>
                    <div className={`step-node ${cls}`}>
                      <div className="step-circle">
                        {stepNum < currentStep ? (
                          <i className="fa-solid fa-check" />
                        ) : (
                          <i className={`fa-solid ${s.icon}`} />
                        )}
                      </div>
                      <div className="step-details">
                        <span className="step-title">{s.title}</span>
                        <span className="step-time">{s.time}</span>
                        <span className="step-desc">{s.desc}</span>
                      </div>
                    </div>
                    {stepNum < 4 && (
                      <div className={`step-connector${stepNum < currentStep ? ' active' : ''}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pipeline-demo-controller">
              <span className="demo-tag">
                <i className="fa-solid fa-play" /> Simulasi Pipeline:
              </span>
              <div className="demo-btns">
                {steps.map((s, idx) => (
                  <button
                    key={idx}
                    className={`btn-demo-step${currentStep === idx + 1 ? ' active' : ''}`}
                    onClick={() => handleStep(idx + 1)}
                  >
                    {idx + 1}. {s.title.split('.')[1]?.trim().split(' ')[0] || s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="pickup-history-summary">
              <h4 className="history-title">
                <i className="fa-solid fa-clock-rotate-left" /> Riwayat Penjemputan Ampas
              </h4>
              <div className="history-list">
                {history.slice(0, 3).map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-left">
                      <span className="hist-id">{item.id}</span>
                      <span className="hist-date">{item.date}</span>
                    </div>
                    <div className="history-mid">
                      <span className="hist-weight">{item.weight} kg SCG</span>
                      <span className="hist-co2">{item.co2} kg CO₂e dicegah</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#1B4D3E',
                          cursor: 'pointer',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textDecoration: 'underline',
                        }}
                        onClick={() => setShowSlipModal(item)}
                      >
                        Nota Timbang
                      </button>
                      <span
                        className="badge-status-done"
                        style={
                          item.status === 'scheduled'
                            ? { background: '#FEF3C7', color: '#92400E' }
                            : undefined
                        }
                      >
                        {item.status === 'done' ? 'Selesai' : 'Dijadwalkan'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: ECO-POINTS & KATALOG REWARD
          ID: rewards (Exact navbar match)
          ======================================================== */}
      <section
        id="rewards"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Eco-Points dan Katalog Penukaran Hadiah"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon rewards-icon">
              <i className="fa-solid fa-coins" />
            </div>
            <div>
              <span className="csh-tag">Program Loyalty Sirkular</span>
              <h3 className="csh-title">Katalog Hadiah &amp; Saldo Eco-Points</h3>
              <p className="csh-subtitle">
                Tukarkan poin hasil pengalihan ampas kopi Anda dengan perlengkapan bar ramah
                lingkungan, diskon biji kopi, hingga voucher mesin espresso.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <span className="partner-tier-badge">
              <i className="fa-solid fa-leaf" /> 1 kg ampas = 5 Eco-Points
            </span>
          </div>
        </div>

        {/* Big Points Hero Card */}
        <div className="rewards-hero-card">
          <div className="rhc-left">
            <span className="rhc-pill">
              <i className="fa-solid fa-sparkles" /> Saldo Poin Kemitraan Sirkular
            </span>
            <div className="rhc-balance-row">
              <span className="rhc-balance-num">{metrics.cafePoints.toLocaleString('id-ID')}</span>
              <span className="rhc-balance-unit">Eco-Points Tersedia</span>
            </div>
            <p className="rhc-desc">
              Poin diakumulasikan setiap kali armada logistik menimbang ampas kopi terverifikasi di bar Anda.
              Poin tidak pernah hangus selama kemitraan aktif.
            </p>
          </div>

          <div className="rhc-tier-box">
            <div className="rtb-header">
              <span className="rtb-tier-name">
                <i className="fa-solid fa-medal" /> Green Partner Tier 1
              </span>
              <span className="rtb-next-tier">Menuju Champion Tier 2</span>
            </div>
            <div className="rtb-progress-bar">
              <div
                className="rtb-progress-fill"
                style={{
                  width: `${Math.min(100, Math.round((metrics.cafePoints / 4000) * 100))}%`,
                }}
              />
            </div>
            <div className="rtb-footer">
              <span>{metrics.cafePoints} / 4.000 pts</span>
              <span style={{ float: 'right' }}>
                Kurang {Math.max(0, 4000 - metrics.cafePoints)} pts lagi
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="rewards-filter-row">
          <div className="reward-category-pills">
            {[
              { id: 'all', label: 'Semua Hadiah' },
              { id: 'merch', label: 'Eco-Merchandise' },
              { id: 'beans', label: 'Pasokan Biji Kopi' },
              { id: 'ops', label: 'Operasional & Kemasan' },
              { id: 'esg', label: 'Sertifikasi Fisik' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`btn-reward-cat${activeRewardCat === cat.id ? ' active' : ''}`}
                onClick={() => setActiveRewardCat(cat.id as any)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Menampilkan <strong>{filteredRewards.length}</strong> hadiah
          </span>
        </div>

        {/* Reward Cards Grid */}
        <div className="rewards-cards-grid">
          {filteredRewards.map((item) => {
            const canAfford = metrics.cafePoints >= item.points;
            return (
              <div key={item.id} className="reward-card">
                <div className="rc-top-row">
                  <div className="rc-icon-wrap">
                    <i className={`fa-solid ${item.icon}`} />
                  </div>
                  <div className="rc-points-badge">
                    <i className="fa-solid fa-coins" />
                    <span>{item.points.toLocaleString('id-ID')} pts</span>
                  </div>
                </div>

                <span className="rc-category-tag">{item.badge}</span>
                <h4 className="rc-title">{item.title}</h4>
                <p className="rc-desc">{item.desc}</p>

                <div className="rc-footer">
                  <span className="rc-stock">
                    Nilai: <strong>{item.value}</strong> • Sisa: {item.stock} unit
                  </span>
                  <button
                    type="button"
                    className="btn-redeem"
                    disabled={!canAfford}
                    onClick={() => handleRedeemReward(item)}
                  >
                    <i className="fa-solid fa-gift" />
                    <span>{canAfford ? 'Tukar Poin' : 'Poin Kurang'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Redeemed History */}
        {vouchers.length > 0 && (
          <div className="redeemed-history-box">
            <h4 className="rhb-title">
              <i className="fa-solid fa-ticket" /> Riwayat Voucher Hadiah yang Ditukar
            </h4>
            {vouchers.map((v) => (
              <div key={v.id} className="rhb-item">
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{v.title}</strong>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>
                    Kode Voucher: <code style={{ color: '#6F4E37', fontWeight: 800 }}>{v.code}</code> •
                    Ditukar: {v.date} ({v.points} pts)
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-subnav-action"
                  onClick={() => setSelectedVoucher(v)}
                >
                  <i className="fa-solid fa-qrcode" />
                  <span>Lihat Kode &amp; QR</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          SECTION 4: SERTIFIKAT ESG & AUDIT EMISI
          ID: esg (Exact navbar match)
          ======================================================== */}
      <section
        id="esg"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Sertifikat ESG dan Audit Emisi"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon esg-icon">
              <i className="fa-solid fa-award" />
            </div>
            <div>
              <span className="csh-tag">Kepatuhan Berkelanjutan &amp; Transparansi</span>
              <h3 className="csh-title">Sertifikat Dampak ESG &amp; Neraca Emisi</h3>
              <p className="csh-subtitle">
                Bukti verifikasi formal pengurangan emisi gas metana (CH₄) dan pengalihan limbah
                organik kedai kopi dari Tempat Pembuangan Akhir (TPA).
              </p>
            </div>
          </div>
          <div className="csh-right">
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              onClick={() => setShowCertModal(true)}
            >
              <i className="fa-solid fa-print" />
              <span>Cetak Sertifikat Resmi</span>
            </button>
          </div>
        </div>

        <div className="esg-split-layout">
          {/* Certificate Frame */}
          <div className="esg-certificate-frame">
            <div className="ecf-header">
              <div className="ecf-logo-group">
                <div className="ecf-logo-badge">
                  <i className="fa-solid fa-recycle" />
                </div>
                <div>
                  <div className="ecf-issuer-title">Sirkula Circular Network</div>
                  <span className="ecf-issuer-sub">
                    Verified B2B Sustainability Standard • SK-ESG/2026/0881
                  </span>
                </div>
              </div>
              <div className="ecf-cert-badge">
                <i className="fa-solid fa-shield-check" />
                <span>Terverifikasi Aktif</span>
              </div>
            </div>

            <div className="ecf-body">
              <span className="ecf-awarded-to">Sertifikat Resmi Kemitraan Sirkular Diberikan Kepada:</span>
              <h2 className="ecf-partner-name">Kopi Titik Koma (Sudirman Hub)</h2>
              <h4 className="ecf-title-main">
                Green Partner: Pengalihan Residu Ampas Kopi dari TPA
              </h4>
              <p className="ecf-description">
                Telah berkontribusi nyata dalam transisi ekonomi sirkular Indonesia melalui
                pemilahan ampas kopi murni tanpa kontaminan anorganik untuk diproses menjadi baglog media tanam jamur
                tiram di Bio-Hub Lembang.
              </p>
            </div>

            <div className="ecf-stats-grid">
              <div className="ecf-stat-item">
                <div className="ecf-stat-val">{metrics.cafeSavedKg.toLocaleString('id-ID')} kg</div>
                <div className="ecf-stat-lbl">Ampas Kopi Dialihkan</div>
              </div>
              <div className="ecf-stat-item">
                <div className="ecf-stat-val">{metrics.cafeCo2Kg.toLocaleString('id-ID')} kg</div>
                <div className="ecf-stat-lbl">Emisi CO₂e Tercegah</div>
              </div>
              <div className="ecf-stat-item">
                <div className="ecf-stat-val">570 Unit</div>
                <div className="ecf-stat-lbl">Baglog Jamur Dihasilkan</div>
              </div>
            </div>

            <div className="ecf-footer">
              <div className="ecf-seal-group">
                <div className="ecf-seal-circle">
                  <i className="fa-solid fa-seal" />
                </div>
                <div className="ecf-seal-text">
                  <strong>Dewan Standarisasi Sirkula</strong>
                  <span>Audit Emisi Periode Q3 2026</span>
                </div>
              </div>

              <div className="ecf-action-btns">
                <button
                  type="button"
                  className="btn-subnav-action"
                  onClick={() => setShowCertModal(true)}
                >
                  <i className="fa-solid fa-expand" />
                  <span>Perbesar</span>
                </button>
                <button
                  type="button"
                  className="btn-subnav-action"
                  onClick={() => {
                    showToast(
                      'Mengunduh Laporan Audit Emisi Lengkap (Format PDF & CSV)...',
                      'success'
                    );
                    setTimeout(
                      () =>
                        showToast(
                          'Unduhan selesai: Laporan_ESG_KopiTitikKoma_Q3_2026.pdf',
                          'info'
                        ),
                      1200
                    );
                  }}
                >
                  <i className="fa-solid fa-file-arrow-down" />
                  <span>Unduh Audit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown & Methodology */}
          <div className="esg-side-column">
            <div className="esg-monthly-card">
              <h4 className="emc-title">
                <span>Tren Pengalihan Ampas Bulanan</span>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                  <i className="fa-solid fa-arrow-trend-up" /> +16.2% MoM
                </span>
              </h4>

              <div className="emc-bars-list">
                {[
                  { month: 'Juni 2026', kg: 120, co2: 228, pct: 55 },
                  { month: 'Juli 2026', kg: 165, co2: 313.5, pct: 75 },
                  { month: 'Agustus 2026', kg: 185, co2: 351.5, pct: 86 },
                  { month: 'September 2026', kg: 215, co2: 408.5, pct: 100 },
                ].map((b) => (
                  <div key={b.month} className="emc-bar-row">
                    <div className="emc-bar-header">
                      <span>{b.month}</span>
                      <span>
                        <strong>{b.kg} kg</strong> ({b.co2} kg CO₂e)
                      </span>
                    </div>
                    <div className="emc-bar-track">
                      <div className="emc-bar-fill" style={{ width: `${b.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: '#FAF7F2',
                border: '1px solid #EDE0D4',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <h5
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#6F4E37',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <i className="fa-solid fa-calculator" /> Metodologi Perhitungan IPCC Tier 2
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5 }}>
                Tiap 1 kg ampas kopi basah yang membusuk di TPA tanpa oksigen menghasilkan gas
                metana ekuivalen <strong>1.9 kg CO₂e</strong> (Global Warming Potential 28x lebih
                tinggi dari CO₂). Melalui proses konversi substrat jamur Sirkula, seluruh emisi
                tersebut berhasil dicegah secara terverifikasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MODAL 1: VOUCHER REDEEMED CODE
          ======================================================== */}
      {selectedVoucher && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setSelectedVoucher(null);
            }
          }}
        >
          <div className="coffee-modal-dialog">
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-ticket" style={{ color: '#D97706' }} /> Voucher Hadiah
                Sirkula
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setSelectedVoucher(null)}
              >
                &times;
              </button>
            </div>
            <div className="voucher-display-box">
              <span
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#6F4E37',
                  fontWeight: 800,
                }}
              >
                Kode Penukaran Hadiah
              </span>
              <div className="vdb-code">{selectedVoucher.code}</div>
              <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>
                {selectedVoucher.title}
              </strong>
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                Telah ditukar menggunakan {selectedVoucher.points} Eco-Points
              </p>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Tunjukkan kode ini kepada kurir EV saat penjemputan berikutnya, atau masukkan pada saat
              melakukan pemesanan biji kopi / perlengkapan bar di Sirkula Partner Portal.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-subnav-action btn-subnav-primary"
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => {
                  navigator.clipboard?.writeText(selectedVoucher.code);
                  showToast('Kode voucher berhasil disalin ke clipboard!', 'success');
                }}
              >
                <i className="fa-solid fa-copy" />
                <span>Salin Kode Voucher</span>
              </button>
              <button
                type="button"
                className="btn-subnav-action"
                onClick={() => setSelectedVoucher(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: PRINTABLE ESG CERTIFICATE
          ======================================================== */}
      {showCertModal && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setShowCertModal(false);
            }
          }}
        >
          <div className="coffee-modal-dialog" style={{ maxWidth: '680px' }}>
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-award" style={{ color: '#059669' }} /> Sertifikat Resmi
                Dampak ESG Kedai Kopi
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowCertModal(false)}
              >
                &times;
              </button>
            </div>
            <div
              style={{
                border: '3px double #1B4D3E',
                padding: '2rem',
                borderRadius: '16px',
                background: '#FAF7F2',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#1B4D3E',
                  marginBottom: '1rem',
                }}
              >
                <i className="fa-solid fa-leaf" /> SIRKULA CIRCULAR ECONOMY CERTIFICATION
              </div>
              <h2
                style={{
                  fontSize: '1.6rem',
                  fontFamily: 'var(--font-display)',
                  color: '#0F172A',
                  marginBottom: '0.25rem',
                }}
              >
                Kopi Titik Koma — Sudirman
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Nomor Sertifikat: ESG-CERT-2026-UP0881 • Tanggal Terbit: 28 September 2026
              </span>
              <div
                style={{
                  margin: '1.5rem 0',
                  padding: '1rem',
                  background: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.3rem', color: '#1B4D3E', display: 'block' }}>
                    {metrics.cafeSavedKg} kg
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Ampas Kopi Teralihkan
                  </span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.3rem', color: '#059669', display: 'block' }}>
                    {metrics.cafeCo2Kg} kg
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>CO₂e Metana Dicegah</span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.3rem', color: '#D97706', display: 'block' }}>
                    65 Pohon
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Ekuivalen Serapan</span>
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
                Sertifikat ini membuktikan komitmen kedai kopi dalam mewujudkan sistem minim limbah
                menuju ekonomi sirkular dan mendukung kesejahteraan petani jamur lokal binaan Sirkula.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-subnav-action btn-subnav-primary"
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => {
                  window.print?.();
                  showToast('Menyiapkan dialog cetak sertifikat resolusi tinggi...', 'info');
                }}
              >
                <i className="fa-solid fa-print" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                type="button"
                className="btn-subnav-action"
                onClick={() => setShowCertModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: REQUEST EXTRA SMART BIN
          ======================================================== */}
      {showOrderBinModal && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setShowOrderBinModal(false);
            }
          }}
        >
          <div className="coffee-modal-dialog">
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-trash-can" style={{ color: '#6F4E37' }} /> Tambah Ember
                Smart Bin Sirkula
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowOrderBinModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleOrderExtraBin} className="interactive-form">
              <div className="form-group">
                <label className="form-label">Jenis Ember Sirkula</label>
                <select className="form-control" defaultValue="25L">
                  <option value="25L">Ember Kedap Udara 25 Liter (Standar Espresso Bar)</option>
                  <option value="15L">Ember Kompak 15 Liter (Slow Bar / Kios Kecil)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Penempatan di Kedai</label>
                <input
                  type="text"
                  required
                  defaultValue="Area Bar Outdoor / Rooftop"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  className="form-control"
                  defaultValue="Mohon sertakan stiker barcode cadangan dan panduan barcode barista."
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#059669' }}>
                ✓ Subsidi fasilitas wadah kedap udara untuk mitra aktif Sirkula.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-subnav-action btn-subnav-primary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  Kirim Permintaan Ember
                </button>
                <button
                  type="button"
                  className="btn-subnav-action"
                  onClick={() => setShowOrderBinModal(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: DIGITAL WEIGHT SLIP
          ======================================================== */}
      {showSlipModal && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setShowSlipModal(null);
            }
          }}
        >
          <div className="coffee-modal-dialog">
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-receipt" style={{ color: '#059669' }} /> Bukti Timbang
                Digital Bluetooth
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowSlipModal(null)}
              >
                &times;
              </button>
            </div>
            <div
              style={{
                background: '#FAF7F2',
                border: '1px solid #EDE0D4',
                padding: '1.25rem',
                borderRadius: '12px',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.8rem',
                }}
              >
                <span>ID Penjemputan:</span>
                <strong>{showSlipModal.id}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.8rem',
                }}
              >
                <span>Tanggal &amp; Sesi:</span>
                <strong>
                  {showSlipModal.date} ({showSlipModal.slot})
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.8rem',
                }}
              >
                <span>Petugas Penimbang (Kurir EV):</span>
                <strong>{showSlipModal.driver}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.8rem',
                }}
              >
                <span>Bobot Netto Terverifikasi:</span>
                <strong style={{ color: '#1B4D3E', fontSize: '1.1rem' }}>
                  {showSlipModal.weight} kg SCG
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                }}
              >
                <span>Kredit Emisi Metana:</span>
                <strong style={{ color: '#059669' }}>{showSlipModal.co2} kg CO₂e</strong>
              </div>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Data ini telah tersinkronisasi langsung ke Bio-Hub Lembang sebagai bahan baku media
              tanam jamur tiram bersubsidi.
            </p>
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              style={{ width: '100%', padding: '0.75rem' }}
              onClick={() => {
                showToast('Bukti timbang resmi telah diunduh ke perangkat Anda.', 'success');
                setShowSlipModal(null);
              }}
            >
              Unduh Bukti Timbang (PNG)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: BARISTA SOP CHECKLIST
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
                <i className="fa-solid fa-clipboard-list" style={{ color: '#6F4E37' }} /> SOP
                Pemilahan Ampas Kopi Sirkula
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowSopModal(false)}
              >
                &times;
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                {
                  no: '01',
                  title: 'Tiriskan Air Knockbox',
                  desc: 'Keluarkan ampas dari porta filter tanpa menambahkan air mengalir. Ampas tiris memiliki kelembapan 55-65% yang optimal untuk jamur.',
                },
                {
                  no: '02',
                  title: 'Bebaskan dari Kontaminasi Asing',
                  desc: 'Jangan masukkan sedotan, kantung teh celup, kemasan sachet gula, atau puntung rokok ke dalam ember Sirkula.',
                },
                {
                  no: '03',
                  title: 'Hindari Residu Susu & Pembersih Kimia',
                  desc: 'Jangan buang susu sisa steaming jug atau tablet backflush mesin espresso ke dalam ember ampas karena dapat merusak miselium jamur.',
                },
                {
                  no: '04',
                  title: 'Kunci Tutup Silikon Kedap Udara',
                  desc: 'Segera tutup rapat setelah menuang ampas agar terhindar dari lalat buah dan menjaga aroma seduhan tetap segar.',
                },
              ].map((s) => (
                <div
                  key={s.no}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '0.75rem',
                    background: '#FAF7F2',
                    borderRadius: '10px',
                    border: '1px solid #EDE0D4',
                  }}
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#6F4E37',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {s.no}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#0F172A', display: 'block' }}>
                      {s.title}
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}
              onClick={() => setShowSopModal(false)}
            >
              Paham &amp; Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
