'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface FleetDriver {
  id: string;
  code: string;
  driverName: string;
  vehicle: string;
  plate: string;
  route: string;
  currentStop: string;
  nextStop: string;
  cargoKg: number;
  maxCargoKg: number;
  batteryPct: number;
  speedKmH: number;
  status: 'moving' | 'weighing' | 'standby';
  etaMin: number;
  phone: string;
}

interface QaParam {
  id: string;
  paramName: string;
  symbol: string;
  measuredVal: string;
  targetRange: string;
  status: 'optimal' | 'warning' | 'critical';
  desc: string;
  icon: string;
}

interface ReactorChamber {
  id: string;
  chamberName: string;
  code: string;
  type: string;
  temp: number;
  targetTemp: number;
  pressure: number;
  targetPressure: number;
  cycleMinutes: number;
  maxCycleMinutes: number;
  batchCode: string;
  capacityUnits: string;
  fuelType: string;
  status: 'active' | 'cooling' | 'ready';
}

const INIT_FLEET: FleetDriver[] = [
  {
    id: 'flt-1',
    code: 'EV-FLEET-01',
    driverName: 'Kang Rahmat',
    vehicle: 'Motor Kargo Listrik Selis EV',
    plate: 'B-1492-SRK',
    route: 'Koridor Sudirman — SCBD — Senopati',
    currentStop: 'Selesai: Kopi Titik Koma (42 kg)',
    nextStop: 'Tanamera Coffee SCBD (~35 kg)',
    cargoKg: 42,
    maxCargoKg: 80,
    batteryPct: 78,
    speedKmH: 28,
    status: 'moving',
    etaMin: 18,
    phone: '+62 812-8877-6655',
  },
  {
    id: 'flt-2',
    code: 'EV-FLEET-02',
    driverName: 'Pak Dede Permana',
    vehicle: 'Van Kargo Wuling EV Blind Van',
    plate: 'B-1830-SRK',
    route: 'Koridor Menteng — Cikini — Thamrin',
    currentStop: 'Timbang di Lokasi: Filosofi Kopi Menteng',
    nextStop: 'Giyanti Coffee Roastery (~50 kg)',
    cargoKg: 95,
    maxCargoKg: 250,
    batteryPct: 64,
    speedKmH: 0,
    status: 'weighing',
    etaMin: 5,
    phone: '+62 813-9988-7711',
  },
  {
    id: 'flt-3',
    code: 'EV-FLEET-03',
    driverName: 'Kang Asep Suherman',
    vehicle: 'DFSK Gelora E Electric Pick-up',
    plate: 'D-1102-SRK',
    route: 'Lembang Hub — Jalur Kumbung Cibodas',
    currentStop: 'Outflow Logistik: 2.000 Baglog F2',
    nextStop: 'Kumbung Berkah Jamur Farm',
    cargoKg: 2400,
    maxCargoKg: 3000,
    batteryPct: 85,
    speedKmH: 35,
    status: 'moving',
    etaMin: 12,
    phone: '+62 821-3344-5566',
  },
  {
    id: 'flt-4',
    code: 'EV-FLEET-04',
    driverName: 'Kang Dadang',
    vehicle: 'Motor Kargo Listrik Selis EV',
    plate: 'B-1662-SRK',
    route: 'Koridor Kemang — Cilandak — Blok M',
    currentStop: 'Pool Logistik Bio-Hub (Siaga Cadangan)',
    nextStop: 'Menunggu Rute Tambahan',
    cargoKg: 0,
    maxCargoKg: 80,
    batteryPct: 100,
    speedKmH: 0,
    status: 'standby',
    etaMin: 0,
    phone: '+62 819-7766-5544',
  },
];

const INIT_REACTORS: ReactorChamber[] = [
  {
    id: 'r-1',
    chamberName: 'Chamber Autoclave Utama A',
    code: 'REACTOR-ST-01',
    type: 'Sterilisasi Uap Bertekanan Tinggi',
    temp: 121.4,
    targetTemp: 121.0,
    pressure: 1.52,
    targetPressure: 1.50,
    cycleMinutes: 200,
    maxCycleMinutes: 240,
    batchCode: 'Batch #88 (Formula SCG-20)',
    capacityUnits: '15.000 Baglog Jamur Tiram',
    fuelType: 'Biomassa Pelet Ampas Kopi Kering (Zero Fossil Fuel)',
    status: 'active',
  },
  {
    id: 'r-2',
    chamberName: 'Rotary Dryer & Chamber Pendinginan B',
    code: 'REACTOR-CL-02',
    type: 'Pengeringan & Cooling Steril HEPA',
    temp: 48.2,
    targetTemp: 28.0,
    pressure: 1.0,
    targetPressure: 1.0,
    cycleMinutes: 75,
    maxCycleMinutes: 120,
    batchCode: 'Batch #89 (Raw SCG Moisture Prep)',
    capacityUnits: '1.200 kg Ampas Tiris Siap Campur',
    fuelType: 'Heat Exchanger Kondensor Sirkular',
    status: 'cooling',
  },
];

const INIT_QA_PARAMS: QaParam[] = [
  {
    id: 'qa-1',
    paramName: 'Rasio C:N (Karbon : Nitrogen)',
    symbol: 'C:N Ratio',
    measuredVal: '28.4 : 1',
    targetRange: '25.0 - 30.0 : 1',
    status: 'optimal',
    desc: 'Ampas kopi menyumbang nitrogen tinggi (2.2%), diimbangi karbon serbuk gergaji sengon untuk percepatan miselium.',
    icon: 'fa-dna',
  },
  {
    id: 'qa-2',
    paramName: 'Derajat Keasaman Substrat (pH)',
    symbol: 'pH Meter',
    measuredVal: '6.48',
    targetRange: '6.20 - 6.80',
    status: 'optimal',
    desc: 'Stabil dinetralkan dengan kalsium karbonat (CaCO₃) 2% untuk mencegah perkembangan jamur kompetitor Trichoderma.',
    icon: 'fa-flask-vial',
  },
  {
    id: 'qa-3',
    paramName: 'Kadar Air Campuran (Moisture)',
    symbol: 'Moisture Analyzer',
    measuredVal: '62.5%',
    targetRange: '60.0% - 65.0%',
    status: 'optimal',
    desc: 'Tiris optimal: saat substrat dikepal tangan tidak meneteskan air namun tetap menyatu padat saat dilepas.',
    icon: 'fa-droplet',
  },
  {
    id: 'qa-4',
    paramName: 'Tingkat Kontaminasi Biologis',
    symbol: 'Spora Liar / Penicillium',
    measuredVal: '0.8%',
    targetRange: 'Maks. ≤ 3.0%',
    status: 'optimal',
    desc: 'Lolos uji mikrobiologi pasca sterilisasi autoklaf suhu 121°C selama 4 jam penuh.',
    icon: 'fa-shield-virus',
  },
  {
    id: 'qa-5',
    paramName: 'Densitas & Bobot Substrat',
    symbol: 'Weight Scale',
    measuredVal: '1.20 kg',
    targetRange: '1.18 - 1.25 kg / baglog',
    status: 'optimal',
    desc: 'Massa jenis ideal memungkinkan aerasi oksigen optimal bagi pernapasan miselium jamur tiram.',
    icon: 'fa-weight-scale',
  },
  {
    id: 'qa-6',
    paramName: 'Waktu Inkubasi Kolonisasi F2',
    symbol: 'Mycelium Spawn Run',
    measuredVal: '18 - 20 Hari',
    targetRange: '24 - 28 Hari (Kontrol Biasa)',
    status: 'optimal',
    desc: '3 - 5 hari lebih cepat berkat nutrisi lipid, asam amino, dan mineral yang terkandung dalam ampas kopi.',
    icon: 'fa-bolt-lightning',
  },
];

export default function BiohubView() {
  const { showToast } = useApp();

  const [fleetList, setFleetList] = useState<FleetDriver[]>(INIT_FLEET);
  const [reactors, setReactors] = useState<ReactorChamber[]>(INIT_REACTORS);
  const [qaParams, setQaParams] = useState<QaParam[]>(INIT_QA_PARAMS);

  // Filter tabs
  const [activeSubTab, setActiveSubTab] = useState<'fleet' | 'reactor' | 'qa' | 'balance'>('fleet');
  const [fleetFilter, setFleetFilter] = useState<'all' | 'moving' | 'weighing' | 'standby'>('all');

  // Modals state
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showQaInputModal, setShowQaInputModal] = useState(false);
  const [showCoaModal, setShowCoaModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<FleetDriver | null>(null);

  const handleDispatchDriver = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const driverId = fd.get('driverId') as string;
    const cafeName = fd.get('cafeName') as string;

    setFleetList((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              status: 'moving',
              nextStop: `${cafeName} (~40 kg)`,
              speedKmH: 26,
              etaMin: 22,
            }
          : d
      )
    );

    setShowDispatchModal(false);
    showToast(`Penugasan rute baru ke ${cafeName} berhasil ditransmisikan ke perangkat kurir!`, 'success');
  };

  const handleAddQaSample = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cnVal = (fd.get('cnVal') as string) || '28.2 : 1';
    const phVal = (fd.get('phVal') as string) || '6.50';

    setQaParams((prev) =>
      prev.map((q) => {
        if (q.id === 'qa-1') return { ...q, measuredVal: cnVal };
        if (q.id === 'qa-2') return { ...q, measuredVal: phVal };
        return q;
      })
    );

    setShowQaInputModal(false);
    showToast('Hasil kalibrasi sampel lab QA Batch #88 berhasil diperbarui.', 'success');
  };

  const filteredFleet =
    fleetFilter === 'all'
      ? fleetList
      : fleetList.filter((f) => f.status === fleetFilter);

  const totalLoadedKg = fleetList.reduce((acc, f) => acc + f.cargoKg, 0);

  return (
    <>
      {/* ========================================================
          SUB-NAV QUICK JUMP BAR FOR OPERATOR
          Synchronized with TopNav links (#fleet-map, #reactor, #qa-lab, #esg-balance)
          ======================================================== */}
      <nav className="operator-subnav-bar" aria-label="Sub navigasi fasilitas Bio-Hub">
        <div className="operator-subnav-container">
          <div className="operator-subnav-pills">
            <a
              href="#fleet-map"
              className={`operator-subnav-link${activeSubTab === 'fleet' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('fleet')}
            >
              <i className="fa-solid fa-map-location-dot" />
              <span>Radar Armada EV</span>
            </a>
            <a
              href="#reactor"
              className={`operator-subnav-link${activeSubTab === 'reactor' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('reactor')}
            >
              <i className="fa-solid fa-fire" />
              <span>Reaktor Kiln 121°C</span>
            </a>
            <a
              href="#qa-lab"
              className={`operator-subnav-link${activeSubTab === 'qa' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('qa')}
            >
              <i className="fa-solid fa-shield-halved" />
              <span>Lab QA &amp; Mutu</span>
            </a>
            <a
              href="#esg-balance"
              className={`operator-subnav-link${activeSubTab === 'balance' ? ' active' : ''}`}
              onClick={() => setActiveSubTab('balance')}
            >
              <i className="fa-solid fa-chart-pie" />
              <span>Neraca Emisi Fasilitas</span>
            </a>
          </div>

          <div className="coffee-subnav-quick-actions">
            <button
              type="button"
              className="btn-subnav-action"
              onClick={() => setShowDispatchModal(true)}
            >
              <i className="fa-solid fa-paper-plane" />
              <span>Dispatch Armada</span>
            </button>
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              style={{ background: '#3730A3', borderColor: '#3730A3' }}
              onClick={() => setShowCoaModal(true)}
            >
              <i className="fa-solid fa-certificate" />
              <span>Sertifikat COA Lab</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================
          PORTAL HEADER
          ======================================================== */}
      <div className="portal-header biohub-header">
        <div className="portal-profile">
          <div className="profile-avatar biohub-avatar">
            <i className="fa-solid fa-flask" />
          </div>
          <div className="profile-details">
            <div className="profile-badges">
              <span className="role-pill biohub-pill">
                <i className="fa-solid fa-microchip" /> Operator Bio-Hub Command
              </span>
              <span className="partner-tier-badge emerald-tier">
                <i className="fa-solid fa-circle-check" /> Fasilitas Beroperasi Normal • Sterilisasi 121°C
              </span>
            </div>
            <h2 className="profile-name">Bio-Hub Lembang — Central Processing &amp; QA Center</h2>
            <p className="profile-address">
              <i className="fa-solid fa-location-dot" /> Kawasan Agrowisata Lembang Blok C-12, Kab. Bandung
              Barat • Facility ID: <strong>SRK-BIO-01</strong> • Akreditasi ISO 14001:2015
            </p>
          </div>
        </div>
        <div className="header-action-cards">
          <button
            type="button"
            className="btn-eco-badge-card"
            style={{ background: 'linear-gradient(135deg, #3730A3, #4F46E5)' }}
            onClick={() => setShowCoaModal(true)}
          >
            <i className="fa-solid fa-shield-halved" />
            <div className="text-left">
              <span className="btn-label-small">Standar Mikrobiologi</span>
              <strong>Sertifikat Uji COA Batch #88</strong>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================
          METRICS 4-COLUMN KPI GRID
          ======================================================== */}
      <div className="metrics-grid">
        {[
          {
            title: 'Batch Produksi Aktif',
            icon: 'fa-boxes-stacked',
            color: 'blue-soft',
            value: 'Batch #88',
            unit: 'In-Autoclave',
            footer: 'Target: 15.000 baglog SCG-20 bersubsidi',
          },
          {
            title: 'Suhu Chamber Sterilisasi',
            icon: 'fa-fire-flame-curved',
            color: 'orange-soft',
            value: '121.4°C',
            unit: 'Tekanan 1.52 Bar',
            footer: (
              <span className="text-positive">
                <i className="fa-solid fa-clock" /> Sisa Siklus: 40 Menit (ETA 14:30 WIB)
              </span>
            ),
          },
          {
            title: 'Inflow Ampas Kopi Hari Ini',
            icon: 'fa-weight-hanging',
            color: 'brown-soft',
            value: '380',
            unit: 'kg SCG tiris',
            footer: 'Dari 5 mitra kedai kopi Jabodetabek & Bandung',
          },
          {
            title: 'Tingkat Kontaminasi QA',
            icon: 'fa-vials',
            color: 'green-soft',
            value: '0.8%',
            unit: 'Batas Max ≤ 3%',
            footer: (
              <span className="text-positive">
                <i className="fa-solid fa-circle-check" /> Memenuhi Standar Lab Mikrobiologi
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
            <div className="metric-footer">{typeof footer === 'string' ? <span>{footer}</span> : footer}</div>
          </div>
        ))}
      </div>

      {/* ========================================================
          SECTION 1: RADAR ARMADA EV & LOGISTIK COMMAND
          ID: fleet-map (Exact navbar match)
          ======================================================== */}
      <section
        id="fleet-map"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Radar Armada EV dan Logistik"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon" style={{ background: '#EEF2FF', color: '#3730A3' }}>
              <i className="fa-solid fa-map-location-dot" />
            </div>
            <div>
              <span className="csh-tag" style={{ color: '#3730A3' }}>
                Dispatch &amp; Telemetri Kendaraan Listrik
              </span>
              <h3 className="csh-title">Radar Armada EV &amp; Antrian Logistik</h3>
              <p className="csh-subtitle">
                Pantau posisi armada penjemput ampas kopi kedai dan distribusi baglog jamur ke kumbung
                petani secara real-time.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              style={{ background: '#3730A3', borderColor: '#3730A3' }}
              onClick={() => setShowDispatchModal(true)}
            >
              <i className="fa-solid fa-truck-ramp-box" />
              <span>Tugaskan Rute Baru</span>
            </button>
          </div>
        </div>

        {/* Fleet Summary Bar */}
        <div className="fleet-stats-summary">
          <div className="fss-item">
            <span className="fss-lbl">Armada EV Beroperasi</span>
            <span className="fss-val">4 Kendaraan</span>
            <span className="fss-sub">3 Aktif di Jalan, 1 Siaga Pool</span>
          </div>
          <div className="fss-item">
            <span className="fss-lbl">Total Ampas Terangkut Hari Ini</span>
            <span className="fss-val">{totalLoadedKg} kg SCG</span>
            <span className="fss-sub">Inflow lancar ke Bio-Hub Lembang</span>
          </div>
          <div className="fss-item">
            <span className="fss-lbl">Efisiensi Karbon Armada</span>
            <span className="fss-val">100% Zero-Emission</span>
            <span className="fss-sub">Armada Motor &amp; Van Listrik</span>
          </div>
          <div className="fss-item">
            <span className="fss-lbl">Rata-rata Waktu Timbang</span>
            <span className="fss-val">6.5 Menit</span>
            <span className="fss-sub">Sensor Bluetooth digital terintegrasi</span>
          </div>
        </div>

        {/* Fleet Filter Tabs */}
        <div className="rewards-filter-row">
          <div className="reward-category-pills">
            {[
              { id: 'all', label: 'Semua Armada (4)' },
              { id: 'moving', label: 'Bergerak di Jalan (2)' },
              { id: 'weighing', label: 'Sedang Menimbang (1)' },
              { id: 'standby', label: 'Siaga di Pool (1)' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={`btn-reward-cat${fleetFilter === f.id ? ' active' : ''}`}
                style={fleetFilter === f.id ? { background: '#3730A3', borderColor: '#3730A3' } : undefined}
                onClick={() => setFleetFilter(f.id as any)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            GPS Refresh: <strong>Setiap 10 Detik</strong> (Online)
          </span>
        </div>

        {/* Fleet Cards Grid */}
        <div className="fleet-grid">
          {filteredFleet.map((fleet) => {
            const cargoPct = Math.min(100, Math.round((fleet.cargoKg / fleet.maxCargoKg) * 100));
            return (
              <div key={fleet.id} className="fleet-card">
                <div className="fc-top">
                  <div className="fc-fleet-id">
                    <div className="fc-avatar">
                      <i className="fa-solid fa-truck" />
                    </div>
                    <div className="fc-name-wrap">
                      <strong>{fleet.driverName}</strong>
                      <span>
                        {fleet.code} • {fleet.plate}
                      </span>
                    </div>
                  </div>
                  <span className={`fc-status-badge ${fleet.status}`}>
                    <i
                      className={`fa-solid ${
                        fleet.status === 'moving'
                          ? 'fa-arrow-trend-up'
                          : fleet.status === 'weighing'
                          ? 'fa-scale-balanced'
                          : 'fa-charging-station'
                      }`}
                    />
                    {fleet.status === 'moving'
                      ? 'Otw Tujuan'
                      : fleet.status === 'weighing'
                      ? 'Sedang Timbang'
                      : 'Siaga Pool'}
                  </span>
                </div>

                <div className="fc-route-box">
                  <div className="fc-route-point">
                    <i className="fa-solid fa-location-dot" style={{ color: '#059669' }} />
                    <span>
                      Lokasi: <strong>{fleet.currentStop}</strong>
                    </span>
                  </div>
                  <div className="fc-route-point">
                    <i className="fa-solid fa-flag-checkered" style={{ color: '#3730A3' }} />
                    <span>
                      Tujuan Berikutnya: <strong>{fleet.nextStop}</strong>
                      {fleet.etaMin > 0 && ` (ETA ~${fleet.etaMin} mnt)`}
                    </span>
                  </div>
                </div>

                <div className="fc-gauges-row">
                  <div className="fc-gauge-col">
                    <div className="fcg-label">
                      <span>Muatan Kargo</span>
                      <strong>
                        {fleet.cargoKg} / {fleet.maxCargoKg} kg ({cargoPct}%)
                      </strong>
                    </div>
                    <div className="fcg-track">
                      <div
                        className="fcg-fill"
                        style={{
                          width: `${cargoPct}%`,
                          background: cargoPct > 80 ? '#EA580C' : '#10B981',
                        }}
                      />
                    </div>
                  </div>

                  <div className="fc-gauge-col">
                    <div className="fcg-label">
                      <span>Baterai EV</span>
                      <strong>{fleet.batteryPct}%</strong>
                    </div>
                    <div className="fcg-track">
                      <div
                        className="fcg-fill"
                        style={{
                          width: `${fleet.batteryPct}%`,
                          background: fleet.batteryPct < 30 ? '#DC2626' : '#3B82F6',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="fc-footer">
                  <span>
                    <i className="fa-solid fa-gauge-high" /> Kecepatan: {fleet.speedKmH} km/h •{' '}
                    {fleet.vehicle}
                  </span>
                  <button
                    type="button"
                    className="btn-bin-action"
                    onClick={() => {
                      setSelectedDriver(fleet);
                      showToast(`Membuka kanal komunikasi radio/chat dengan ${fleet.driverName}`, 'info');
                    }}
                  >
                    <i className="fa-brands fa-whatsapp" style={{ color: '#059669' }} /> Kontak Kurir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION 2: REAKTOR KILN & AUTOCLAVE 121°C
          ID: reactor (Exact navbar match)
          ======================================================== */}
      <section
        id="reactor"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Reaktor Kiln dan Autoclave Sterilisasi"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon" style={{ background: '#FFEDD5', color: '#EA580C' }}>
              <i className="fa-solid fa-fire" />
            </div>
            <div>
              <span className="csh-tag" style={{ color: '#EA580C' }}>
                Industrial Chamber Telemetry
              </span>
              <h3 className="csh-title">Reaktor Kiln &amp; Chamber Autoclave 121°C</h3>
              <p className="csh-subtitle">
                Monitoring parameter uap jenuh, tekanan, dan kurva termal sterilisasi media tanam baglog
                jamur tiram bebas spora patogen.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <span
              className="partner-tier-badge"
              style={{ background: '#FFEDD5', color: '#9A3412', border: '1px solid #FED7AA' }}
            >
              <i className="fa-solid fa-fire" /> Bahan Bakar: 100% Pelet Ampas Kopi Kering
            </span>
          </div>
        </div>

        {/* 2 Industrial Chambers Grid */}
        <div className="reactor-chambers-grid">
          {reactors.map((r) => {
            const cyclePct = Math.round((r.cycleMinutes / r.maxCycleMinutes) * 100);
            return (
              <div
                key={r.id}
                className={`reactor-card${r.status === 'active' ? ' active-chamber' : ''}`}
              >
                <div className="reactor-header-row">
                  <div className="rhr-title-wrap">
                    <div className={`rhr-chamber-icon ${r.status === 'active' ? 'fire' : 'cooling'}`}>
                      <i className={`fa-solid ${r.status === 'active' ? 'fa-fire' : 'fa-wind'}`} />
                    </div>
                    <div>
                      <h4 className="rhr-name">{r.chamberName}</h4>
                      <span className="rhr-spec">
                        {r.code} • {r.type}
                      </span>
                    </div>
                  </div>
                  <span
                    className="fc-status-badge"
                    style={
                      r.status === 'active'
                        ? { background: '#FFEDD5', color: '#C2410C', border: '1px solid #FDBA74' }
                        : { background: '#CCFBF1', color: '#0F766E', border: '1px solid #99F6E4' }
                    }
                  >
                    <i
                      className={`fa-solid ${
                        r.status === 'active' ? 'fa-circle-dot' : 'fa-check'
                      }`}
                    />
                    {r.status === 'active' ? 'In-Sterilization (121°C)' : 'Cooling Down (48°C)'}
                  </span>
                </div>

                <div className="reactor-readings-box">
                  <div className="rrb-item">
                    <span className="rrb-lbl">Suhu Aktual</span>
                    <div
                      className={`rrb-val ${
                        r.status === 'active' ? 'highlight-hot' : 'highlight-teal'
                      }`}
                    >
                      {r.temp}°C
                    </div>
                    <small style={{ fontSize: '0.68rem', color: '#64748B' }}>
                      Target: {r.targetTemp}°C
                    </small>
                  </div>
                  <div className="rrb-item">
                    <span className="rrb-lbl">Tekanan Uap</span>
                    <div className="rrb-val">{r.pressure} Bar</div>
                    <small style={{ fontSize: '0.68rem', color: '#64748B' }}>
                      Pneumatik Uap Jenuh
                    </small>
                  </div>
                  <div className="rrb-item">
                    <span className="rrb-lbl">Waktu Siklus</span>
                    <div className="rrb-val">
                      {Math.floor(r.cycleMinutes / 60)}j {r.cycleMinutes % 60}m
                    </div>
                    <small style={{ fontSize: '0.68rem', color: '#64748B' }}>
                      Total: {r.maxCycleMinutes / 60} Jam
                    </small>
                  </div>
                </div>

                <div className="reactor-cycle-progress">
                  <div className="rcp-header">
                    <span>Progres Siklus Termal</span>
                    <span>{cyclePct}% Selesai</span>
                  </div>
                  <div className="rcp-track">
                    <div className="rcp-fill" style={{ width: `${cyclePct}%` }} />
                  </div>
                </div>

                <div className="reactor-details-list">
                  <div className="rd-item">
                    <span>Batch Terdaftar:</span>
                    <strong>{r.batchCode}</strong>
                  </div>
                  <div className="rd-item">
                    <span>Kapasitas Muat:</span>
                    <strong>{r.capacityUnits}</strong>
                  </div>
                  <div className="rd-item">
                    <span>Sumber Kalori:</span>
                    <span>{r.fuelType}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto' }}>
                  <button
                    type="button"
                    className="btn-subnav-action"
                    style={{ flex: 1 }}
                    onClick={() =>
                      showToast(
                        `Sensor suhu ${r.code}: Termokopel tipe-K terkalibrasi normal pada toleransi ±0.2°C.`,
                        'info'
                      )
                    }
                  >
                    <i className="fa-solid fa-chart-line" /> Kalibrasi Sensor
                  </button>
                  <button
                    type="button"
                    className="btn-subnav-action btn-subnav-primary"
                    style={{ background: '#EA580C', borderColor: '#EA580C' }}
                    onClick={() =>
                      showToast(
                        `Uji katup ventilasi pengaman uap darurat ${r.code} berhasil (Pressure relief normal 2.0 Bar).`,
                        'success'
                      )
                    }
                  >
                    <i className="fa-solid fa-shield" /> Test Katup Uap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION 3: LAB KENDALI MUTU (QA LAB)
          ID: qa-lab (Exact navbar match)
          ======================================================== */}
      <section
        id="qa-lab"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Lab Kendali Mutu dan Analisis Substrat"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon" style={{ background: '#D1FAE5', color: '#059669' }}>
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div>
              <span className="csh-tag" style={{ color: '#059669' }}>
                Laboratorium Mikrobiologi &amp; Bio-Nutrisi
              </span>
              <h3 className="csh-title">Lab Kendali Mutu &amp; Standar Substrat SCG</h3>
              <p className="csh-subtitle">
                Pemeriksaan ketat parameter C:N, pH, kadar air, dan kebersihan miselium F2 guna menjamin
                garansi tumbuh 100% bagi petani jamur.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <button
              type="button"
              className="btn-subnav-action"
              onClick={() => setShowQaInputModal(true)}
            >
              <i className="fa-solid fa-plus" />
              <span>Input Sampel Lab</span>
            </button>
            <button
              type="button"
              className="btn-subnav-action btn-subnav-primary"
              style={{ background: '#059669', borderColor: '#059669' }}
              onClick={() => setShowCoaModal(true)}
            >
              <i className="fa-solid fa-print" />
              <span>Cetak Lembar COA</span>
            </button>
          </div>
        </div>

        {/* QA Summary Banner */}
        <div className="qa-summary-banner">
          <div className="qsb-left">
            <div className="qsb-icon">
              <i className="fa-solid fa-certificate" />
            </div>
            <div className="qsb-text">
              <h4>Sampel Uji Batch #QA-88-26: Lolos Sertifikasi Grade A Super</h4>
              <p>
                Seluruh 6 parameter biokimia memenuhi standar baku mutu jamur tiram putih (Pleurotus
                ostreatus) dengan tingkat kontaminasi 0.8% (jauh di bawah batas toleransi 3.0%).
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-subnav-action"
            style={{ flexShrink: 0 }}
            onClick={() => setShowCoaModal(true)}
          >
            Lihat Analisis Lengkap
          </button>
        </div>

        {/* 6 QA Parameter Cards */}
        <div className="qa-params-grid">
          {qaParams.map((p) => (
            <div key={p.id} className="qa-card">
              <div className="qa-card-top">
                <span className="qa-specimen-id">{p.symbol}</span>
                <span className="qa-status-pill">
                  <i className="fa-solid fa-check" /> Optimal
                </span>
              </div>
              <h4 className="qa-card-name">{p.paramName}</h4>
              <div className="qa-value-row">
                <span className="qa-val-num">{p.measuredVal}</span>
                <span className="qa-target-txt">/ Standar: {p.targetRange}</span>
              </div>
              <p className="qa-card-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 4: NERACA MASSA & EMISI SIRKULAR BIO-HUB
          ID: esg-balance (Exact navbar match)
          ======================================================== */}
      <section
        id="esg-balance"
        className="coffee-portal-section coffee-section-anchor"
        aria-label="Neraca Massa dan Emisi Sirkular Fasilitas"
      >
        <div className="coffee-section-header">
          <div className="csh-left">
            <div className="csh-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
              <i className="fa-solid fa-chart-pie" />
            </div>
            <div>
              <span className="csh-tag" style={{ color: '#6D28D9' }}>
                Mass Balance &amp; Carbon Accounting Ledger
              </span>
              <h3 className="csh-title">Neraca Massa &amp; Emisi Sirkular Fasilitas</h3>
              <p className="csh-subtitle">
                Alur neraca tertutup (closed-loop) mengonversi 100% ampas kopi mentah menjadi biomassa media
                tanam bernutrisi tinggi dan mencatat audit mitigasi metana.
              </p>
            </div>
          </div>
          <div className="csh-right">
            <button
              type="button"
              className="btn-subnav-action"
              onClick={() => {
                showToast('Menyiapkan ekspor spreadsheet Neraca Massa Sirkula Q3 2026...', 'info');
                setTimeout(
                  () =>
                    showToast(
                      'Unduhan selesai: Sirkula_Mass_Balance_Ledger_Q3_2026.xlsx',
                      'success'
                    ),
                  1200
                );
              }}
            >
              <i className="fa-solid fa-file-excel" />
              <span>Ekspor Excel</span>
            </button>
          </div>
        </div>

        <div className="mass-balance-container">
          {/* Visual Sankey-Style Flow Card */}
          <div className="mb-diagram-card">
            <div className="mbd-header">
              <span className="mbd-title">Alur Konversi Tertutup (Closed-Loop Biomass Balance)</span>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                <i className="fa-solid fa-arrows-spin" /> Efisiensi Konversi: 98.6%
              </span>
            </div>

            <div className="mb-flow-row">
              <div className="mb-node highlight-gold">
                <span className="mbn-label">Inflow Ampas Kopi (SCG)</span>
                <div className="mbn-val">14.850 kg</div>
                <span className="mbn-sub">Dari 120+ Mitra Kedai</span>
              </div>

              <div className="mb-arrow">
                <i className="fa-solid fa-arrow-right-long" />
              </div>

              <div className="mb-node">
                <span className="mbn-label">Formulasi Bio-Substrat</span>
                <div className="mbn-val">74.250 kg</div>
                <span className="mbn-sub">SCG 20% + Sengon + Dedak</span>
              </div>

              <div className="mb-arrow">
                <i className="fa-solid fa-arrow-right-long" />
              </div>

              <div className="mb-node highlight-green">
                <span className="mbn-label">Outflow Baglog Jamur</span>
                <div className="mbn-val">42.600 Unit</div>
                <span className="mbn-sub">Ke 18 Kumbung Binaan</span>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.25rem',
                fontSize: '0.8rem',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#FBBF24' }}>
                <i className="fa-solid fa-seedling" /> Dampak Ekonomi Petani Jamur Lokal:
              </strong>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '0.35rem' }}>
                Dengan formulasi 20% ampas kopi bersubsidi (Rp 2.500 vs Rp 3.000 harga pasar), petani
                menghemat <strong>Rp 500 per baglog</strong>. Total penghematan biaya produksi petani binaan
                mencapai <strong>Rp 21.300.000</strong> pada periode ini.
              </p>
            </div>
          </div>

          {/* Ledger Numbers */}
          <div className="mb-ledger-box">
            <h4 className="mbl-title">
              <i className="fa-solid fa-clipboard-check" /> Buku Besar Audit Berkelanjutan
            </h4>
            <div className="mbl-item">
              <span>Total Ampas Teralihkan:</span>
              <strong>14.850 kg SCG</strong>
            </div>
            <div className="mbl-item">
              <span>Mitigasi Gas Metana (CH₄):</span>
              <strong style={{ color: '#059669' }}>28.215 kg CO₂e</strong>
            </div>
            <div className="mbl-item">
              <span>Ekuivalen Pohon Ditanam:</span>
              <strong>1.410 Pohon / Tahun</strong>
            </div>
            <div className="mbl-item">
              <span>Kelompok Tani Binaan Aktif:</span>
              <strong>18 Kelompok Tani</strong>
            </div>
            <div className="mbl-item">
              <span>Garansi Substrat Tumbuh:</span>
              <strong style={{ color: '#059669' }}>100% Replace Guarantee</strong>
            </div>
            <div className="mbl-item">
              <span>Status Audit Fasilitas:</span>
              <strong style={{ color: '#3730A3' }}>ISO 14001:2015 Terverifikasi</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MODAL 1: DISPATCH ARMADA EV BARU
          ======================================================== */}
      {showDispatchModal && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setShowDispatchModal(false);
            }
          }}
        >
          <div className="coffee-modal-dialog">
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-paper-plane" style={{ color: '#3730A3' }} /> Tugaskan Rute
                Armada EV
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowDispatchModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleDispatchDriver} className="interactive-form">
              <div className="form-group">
                <label className="form-label">Pilih Kurir / Armada</label>
                <select name="driverId" className="form-control" defaultValue="flt-4">
                  {fleetList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.driverName} ({d.plate}) — Baterai {d.batteryPct}% ({d.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mitra Kedai Kopi Penjemputan</label>
                <input
                  type="text"
                  name="cafeName"
                  required
                  defaultValue="Anomali Coffee — Senopati"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Instruksi Khusus &amp; Jumlah Wadah</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue="Jemput 2 ember Smart Bin di bar depan, lakukan penimbangan Bluetooth di tempat."
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-subnav-action btn-subnav-primary"
                  style={{ flex: 1, padding: '0.75rem', background: '#3730A3', borderColor: '#3730A3' }}
                >
                  Transmisikan Perintah Rute
                </button>
                <button
                  type="button"
                  className="btn-subnav-action"
                  onClick={() => setShowDispatchModal(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: INPUT DATA SAMPEL LAB QA
          ======================================================== */}
      {showQaInputModal && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setShowQaInputModal(false);
            }
          }}
        >
          <div className="coffee-modal-dialog">
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-vials" style={{ color: '#059669' }} /> Kalibrasi Hasil
                Uji Laboratorium
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowQaInputModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddQaSample} className="interactive-form">
              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Rasio C:N (Target 25-30:1)</label>
                  <input
                    type="text"
                    name="cnVal"
                    required
                    defaultValue="28.4 : 1"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">pH Substrat (Target 6.2-6.8)</label>
                  <input
                    type="text"
                    name="phVal"
                    required
                    defaultValue="6.48"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nomor Batch Sterilisasi</label>
                <input
                  type="text"
                  name="batchNumber"
                  required
                  defaultValue="Batch #88 (Formula SCG-20)"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Hasil Inkubasi &amp; Mikrobiologi</label>
                <textarea
                  name="labNotes"
                  rows={2}
                  defaultValue="Spora miselium F2 indukan Florida menyebar rata, bebas jamur liar Penicillium & Trichoderma."
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-subnav-action btn-subnav-primary"
                  style={{ flex: 1, padding: '0.75rem', background: '#059669', borderColor: '#059669' }}
                >
                  Simpan &amp; Perbarui COA
                </button>
                <button
                  type="button"
                  className="btn-subnav-action"
                  onClick={() => setShowQaInputModal(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CERTIFICATE OF ANALYSIS (COA)
          ======================================================== */}
      {showCoaModal && (
        <div
          className="modal-backdrop open"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setShowCoaModal(false);
            }
          }}
        >
          <div className="coffee-modal-dialog" style={{ maxWidth: '680px' }}>
            <div className="cmd-header">
              <h3 className="cmd-title">
                <i className="fa-solid fa-certificate" style={{ color: '#059669' }} /> Certificate
                of Analysis (COA)
              </h3>
              <button
                type="button"
                className="cmd-close"
                onClick={() => setShowCoaModal(false)}
              >
                &times;
              </button>
            </div>
            <div
              style={{
                border: '2px solid #059669',
                borderRadius: '16px',
                padding: '2rem',
                background: '#FAFDFB',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #D1FAE5',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.15rem', color: '#065F46', display: 'block' }}>
                    SIRKULA BIO-LABORATORY LEMBANG
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Standard Testing ISO 14001:2015 • Dokumen: COA-SRK-88-2026
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      background: '#D1FAE5',
                      color: '#065F46',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                    }}
                  >
                    STATUS: LULUS UJI
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  fontSize: '0.8rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  Produk: <strong>Baglog Jamur Tiram SCG-20</strong>
                </div>
                <div>
                  Nomor Batch: <strong>Batch #88</strong>
                </div>
                <div>
                  Kadar Ampas Kopi: <strong>20.0% Bobot Kering</strong>
                </div>
                <div>
                  Tanggal Uji: <strong>28 September 2026</strong>
                </div>
              </div>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.78rem',
                  marginBottom: '1.5rem',
                }}
              >
                <thead>
                  <tr style={{ background: '#E6F4EA', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Parameter Uji</th>
                    <th style={{ padding: '0.5rem' }}>Nilai Hasil</th>
                    <th style={{ padding: '0.5rem' }}>Rentang Standar</th>
                    <th style={{ padding: '0.5rem' }}>Hasil</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.5rem' }}>Rasio C:N</td>
                    <td style={{ padding: '0.5rem' }}>28.4 : 1</td>
                    <td style={{ padding: '0.5rem' }}>25.0 - 30.0 : 1</td>
                    <td style={{ padding: '0.5rem', color: '#059669', fontWeight: 700 }}>Memenuhi</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.5rem' }}>Derajat Keasaman (pH)</td>
                    <td style={{ padding: '0.5rem' }}>6.48</td>
                    <td style={{ padding: '0.5rem' }}>6.20 - 6.80</td>
                    <td style={{ padding: '0.5rem', color: '#059669', fontWeight: 700 }}>Memenuhi</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.5rem' }}>Kadar Air (Moisture)</td>
                    <td style={{ padding: '0.5rem' }}>62.5%</td>
                    <td style={{ padding: '0.5rem' }}>60.0% - 65.0%</td>
                    <td style={{ padding: '0.5rem', color: '#059669', fontWeight: 700 }}>Memenuhi</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>Tingkat Kontaminasi</td>
                    <td style={{ padding: '0.5rem' }}>0.8%</td>
                    <td style={{ padding: '0.5rem' }}>≤ 3.0%</td>
                    <td style={{ padding: '0.5rem', color: '#059669', fontWeight: 700 }}>Memenuhi</td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderTop: '1px solid #D1FAE5',
                  paddingTop: '1rem',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <span style={{ display: 'block', color: '#64748B' }}>Kepala Laboratorium Bio-Hub:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                    Dr. Ir. Hendra Gunawan, M.Biotech
                  </strong>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <i
                    className="fa-solid fa-certificate"
                    style={{ fontSize: '2rem', color: '#059669' }}
                  />
                  <span style={{ display: 'block', fontSize: '0.68rem', color: '#065F46', fontWeight: 800 }}>
                    TERVALIDASI
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-subnav-action btn-subnav-primary"
                style={{ flex: 1, padding: '0.75rem', background: '#059669', borderColor: '#059669' }}
                onClick={() => {
                  window.print?.();
                  showToast('Menyiapkan dokumen cetak Certificate of Analysis resmi...', 'info');
                }}
              >
                <i className="fa-solid fa-print" />
                <span>Cetak Lembar COA</span>
              </button>
              <button
                type="button"
                className="btn-subnav-action"
                onClick={() => setShowCoaModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
