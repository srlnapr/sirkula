'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getTodayString, getFutureDateString, formatRupiah } from '@/lib/utils';

export default function CheckoutModal() {
  const { checkoutOpen, closeCheckout, state, updateMetrics, showToast } = useApp();
  const { metrics } = state;
  const qty = metrics.baglogsOrdered;
  const total = qty * 2500;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    updateMetrics({ baglogsDistributed: metrics.baglogsDistributed + qty });
    closeCheckout();
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({ particleCount: 65, spread: 70, origin: { y: 0.65 }, colors: ['#10B981','#1B4D3E','#DDB892','#FBBF24'] });
    }
    showToast(`Pemesanan grosir ${qty.toLocaleString('id-ID')} baglog (${formatRupiah(total)}) berhasil dikonfirmasi! Surat Jalan & Faktur diterbitkan.`, 'success');
  };

  if (!checkoutOpen) return null;

  return (
    <div className="modal-backdrop open" id="checkoutModal" onClick={(e) => { if ((e.target as HTMLElement).id === 'checkoutModal') closeCheckout(); }}>
      <div className="modal-dialog checkout-dialog">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-sup">Formulir Pemesanan Grosir B2B</span>
            <h2 className="modal-title">Konfirmasi Pembelian Baglog Sirkula</h2>
          </div>
          <button className="btn-modal-close" onClick={closeCheckout}>&times;</button>
        </div>
        <form onSubmit={handleConfirm}>
          <div className="modal-body">
            <div className="order-summary-review">
              <div className="osr-item"><span>Produk:</span><strong>Baglog Jamur Tiram Nutrisi Kopi (SCG-20)</strong></div>
              <div className="osr-item"><span>Jumlah Pesanan:</span><strong>{qty.toLocaleString('id-ID')} Unit</strong></div>
              <div className="osr-item"><span>Harga Satuan:</span><strong>Rp 2.500 / baglog (Hemat Rp500/unit)</strong></div>
              <div className="osr-item osr-total"><span>Total Tagihan:</span><strong className="text-emerald">{formatRupiah(total)}</strong></div>
            </div>
            <div className="form-group">
              <label className="form-label">Alamat Pengiriman Kumbung Jamur:</label>
              <textarea rows={2} className="form-control" required defaultValue="Kumbung Berkah Jamur, Blok Sukamaju No. 14, Desa Cibodas, Kec. Lembang, Kab. Bandung Barat (Patokan dekat Kantor Desa)." />
            </div>
            <div className="form-row">
              <div className="form-group col-6">
                <label className="form-label">Metode Pembayaran B2B:</label>
                <select className="form-control">
                  <option value="dp30">DP 30% (Pelunasan Saat Baglog Tiba)</option>
                  <option value="tempo14">Tempo 14 Hari (Khusus Mitra Binaan)</option>
                  <option value="transfer">Transfer Bank Penuh (Diskon Ekstra 1%)</option>
                </select>
              </div>
              <div className="form-group col-6">
                <label className="form-label">Jadwal Kirim Diinginkan:</label>
                <input type="date" className="form-control" required defaultValue={getFutureDateString(3)} />
              </div>
            </div>
            <div className="checkout-guarantee-note">
              <i className="fa-solid fa-shield-check" />
              <span>Pesanan Anda dilindungi <strong>Garansi 100% Ganti Baru</strong> bila miselium tidak merambat aktif dalam 14 hari pasca serah terima.</span>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={closeCheckout}>Batal</button>
            <button type="submit" className="btn-primary">
              <i className="fa-solid fa-lock" /> Konfirmasi Pesanan Grosir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
