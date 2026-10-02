'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

export default function EcoBadgeModal() {
  const { ecoBadgeOpen, closeEcoBadge, state, showToast } = useApp();
  const { metrics } = state;
  const qrRef = useRef<HTMLDivElement>(null);
  const qrGenerated = useRef(false);

  useEffect(() => {
    if (ecoBadgeOpen && qrRef.current && !qrGenerated.current) {
      // Wait for QRCode library to load
      const tryGenerate = () => {
        if ((window as any).QRCode && qrRef.current) {
          qrRef.current.innerHTML = '';
          new (window as any).QRCode(qrRef.current, {
            text: 'https://sirkula.id/verify/partner/SRK-UP-0881',
            width: 130, height: 130,
            colorDark: '#1B4D3E', colorLight: '#FFFFFF',
            correctLevel: (window as any).QRCode.CorrectLevel?.H ?? 1,
          });
          qrGenerated.current = true;
        } else {
          setTimeout(tryGenerate, 300);
        }
      };
      tryGenerate();
    }
  }, [ecoBadgeOpen]);

  const copyLink = () => {
    navigator.clipboard.writeText('https://sirkula.id/verify/partner/SRK-UP-0881')
      .then(() => showToast('Tautan sertifikat berhasil disalin ke clipboard!', 'success'))
      .catch(() => showToast('Tautan: https://sirkula.id/verify/partner/SRK-UP-0881', 'info'));
  };

  const downloadBadge = () => {
    showToast('Mengunduh paket Eco-Badge Sirkula (PNG Resolusi Tinggi untuk Table Tent Meja Kasir)...', 'success');
    setTimeout(() => showToast('Unduhan selesai: Sirkula_Eco_Badge_Sudirman_2026.png', 'info'), 1200);
  };

  if (!ecoBadgeOpen) return null;

  return (
    <div className="modal-backdrop open" id="ecoBadgeModal" onClick={(e) => { if ((e.target as HTMLElement).id === 'ecoBadgeModal') closeEcoBadge(); }}>
      <div className="modal-dialog badge-dialog">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-sup">Media Pemasaran Hijau Mitra</span>
            <h2 className="modal-title">Sertifikat &amp; Eco-Badge Sirkula Kedai Kopi</h2>
          </div>
          <button className="btn-modal-close" onClick={closeEcoBadge}>&times;</button>
        </div>
        <div className="modal-body text-center">
          <p className="badge-subtitle-info">Tampilkan badge ini di meja kasir, feed Instagram, atau website kedai Anda untuk menarik pelanggan yang sadar lingkungan.</p>
          <div className="shareable-eco-card" id="printableEcoCard">
            <div className="eco-card-header">
              <div className="eco-brand-badge"><i className="fa-solid fa-leaf" /><span>SIRKULA VERIFIED ECO-PARTNER</span></div>
              <div className="eco-year">2026 CERTIFIED</div>
            </div>
            <div className="eco-card-body">
              <h3 className="eco-cafe-title">Kopi Titik Temu — Sudirman</h3>
              <p className="eco-cafe-sub">Mitra Pelopor Nol Sampah Organik Kedai Kopi</p>
              <div className="eco-stat-highlight">
                <div className="esh-box">
                  <strong className="esh-num">{metrics.cafeSavedKg.toLocaleString('id-ID')}</strong>
                  <span className="esh-lbl">Kg Residu Kopi Didaur Ulang</span>
                </div>
                <div className="esh-divider" />
                <div className="esh-box">
                  <strong className="esh-num">{metrics.cafeCo2Kg.toLocaleString('id-ID')}</strong>
                  <span className="esh-lbl">Kg CO₂e Metana Dicegah</span>
                </div>
              </div>
              <div className="qr-container-box">
                <div ref={qrRef} id="ecoBadgeQr" />
                <span className="qr-caption">Pindai untuk verifikasi jejak karbon resmi di <strong>sirkula.id/verify/SRK-0881</strong></span>
              </div>
              <div className="eco-sdg-row">
                <span className="sdg-pill-mini" style={{ background: '#059669', color: 'white' }}><i className="fa-solid fa-leaf" /> Circular Coffee Partner</span>
                <span className="sdg-pill-mini" style={{ background: '#6F4E37', color: 'white' }}><i className="fa-solid fa-seedling" /> Dukung Petani Lokal</span>
              </div>
            </div>
            <div className="eco-card-footer">
              <span>Didukung oleh Bio-Teknologi Sirkula • www.sirkula.id</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={closeEcoBadge}>Tutup</button>
          <button className="btn-secondary" onClick={copyLink}><i className="fa-solid fa-link" /> Salin Tautan Verifikasi</button>
          <button className="btn-primary" onClick={downloadBadge}><i className="fa-solid fa-download" /> Unduh Eco-Badge (PNG Table-Tent)</button>
        </div>
      </div>
    </div>
  );
}
