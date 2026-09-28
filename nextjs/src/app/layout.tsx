import type { Metadata } from 'next';
import Script from 'next/script';
import { AppProvider } from '@/context/AppContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sirkula — Platform Digital B2B Penyeimbang Ekosistem Ampas Kopi & Media Tanam Jamur Tiram',
  description: 'Platform B2B Ekonomi Sirkular yang mengintegrasikan penjemputan ampas kopi dari kedai kopi dengan produksi baglog jamur tiram berbiaya rendah dan bernutrisi tinggi untuk petani.',
  keywords: 'ampas kopi, baglog jamur tiram, ekonomi sirkular, B2B, SCG, spent coffee grounds, media tanam',
  openGraph: {
    title: 'Sirkula — Platform B2B Ekosistem Kopi & Jamur',
    description: 'Menghubungkan kedai kopi perkotaan dengan petani jamur tiram lokal melalui ekonomi sirkular.',
    type: 'website',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
        {/* FontAwesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>

        {/* External scripts - loaded after page */}
        <Script
          src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
