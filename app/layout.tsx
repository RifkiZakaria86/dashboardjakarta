import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Dashboard Stok Wilayah | WIKA Beton',
  description:
    'Dashboard monitoring nilai rupiah stok PT WIKA Beton per wilayah. Pantau data opname stockyard dari 7 wilayah operasional secara real-time.',
  keywords: 'WIKA Beton, dashboard stok, wilayah, nilai rupiah, stockyard, opname',
  authors: [{ name: 'PT WIKA Beton' }],
  openGraph: {
    title: 'Dashboard Stok Wilayah | WIKA Beton',
    description: 'Monitoring nilai rupiah stok PT WIKA Beton dari 7 wilayah operasional',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="bg-[#000d2e] text-white antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-white/5 bg-[#000820]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-white font-bold text-lg">PT WIKA Beton</div>
                <div className="text-gray-500 text-sm mt-1">Dashboard Monitoring Stok Wilayah</div>
              </div>
              <div className="text-gray-600 text-xs text-center">
                © {new Date().getFullYear()} PT Wijaya Karya Beton Tbk. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
