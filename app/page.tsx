'use client';

import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import RegionCard from '../components/RegionCard';
import { REGIONS } from '../lib/regions';

export default function HomePage() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/data', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLastUpdated(json.updatedAt);
      } else {
        setError('Gagal memuat data');
      }
    } catch (e) {
      setError('Terjadi kesalahan: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const totalAll = Object.values(data).reduce((sum, r) => sum + (r?.totalRupiah || 0), 0);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection totalAllRegions={totalAll} isLoading={isLoading} />

      {/* Regions Section */}
      <section id="wilayah" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#000d2e]">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              7 Wilayah Operasional
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Nilai Stok Per{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Wilayah
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Klik wilayah untuk melihat detail lengkap atau buka dashboard interaktif langsung.
            </p>

            {/* Last updated & refresh */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {lastUpdated && !isLoading && (
                <span className="text-gray-500 text-xs">
                  Diperbarui:{' '}
                  {new Date(lastUpdated).toLocaleString('id-ID', {
                    day: '2-digit', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              )}
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs font-medium disabled:opacity-50"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Memuat...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Region Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {REGIONS.map((region, index) => (
              <RegionCard
                key={region.id}
                region={{ ...region, ...(data[region.slug] || {}) }}
                isLoading={isLoading}
                index={index}
              />
            ))}
          </div>

          {/* Total Summary Bar */}
          {!isLoading && totalAll > 0 && (
            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-400/20 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-yellow-400/70 text-xs font-bold uppercase tracking-widest mb-1">
                    Grand Total — Semua Wilayah
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                    <span className="text-yellow-400">Rp </span>
                    {new Intl.NumberFormat('id-ID').format(totalAll)}
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {REGIONS.map((r) => (
                    <div key={r.id} className="text-center">
                      <div className="text-2xl">{r.icon}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{r.name.split(' ')[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
