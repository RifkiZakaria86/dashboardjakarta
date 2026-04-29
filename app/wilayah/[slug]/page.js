'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getRegionBySlug, REGIONS } from '../../../lib/regions';

function AnimatedCounter({ value, duration = 2200 }) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!value) return;
    startTime.current = null;
    const animate = (ts) => {
      if (!startTime.current) startTime.current = ts;
      const p = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * value));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return new Intl.NumberFormat('id-ID').format(count);
}

function formatRupiah(v) {
  if (!v) return 'Rp 0';
  if (v >= 1e12) return `Rp ${(v / 1e12).toFixed(3)} Triliun`;
  if (v >= 1e9) return `Rp ${(v / 1e9).toFixed(3)} Miliar`;
  if (v >= 1e6) return `Rp ${(v / 1e6).toFixed(2)} Juta`;
  return `Rp ${new Intl.NumberFormat('id-ID').format(v)}`;
}

export default function WilayahPage() {
  const params = useParams();
  const slug = params?.slug;
  const region = getRegionBySlug(slug);

  const [data, setData] = useState(null);
  const [allData, setAllData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetchData();
  }, [slug]);

  async function fetchData() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/data', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setAllData(json.data);
        setData(json.data[slug] || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  if (!region) {
    return (
      <div className="min-h-screen bg-[#000d2e] flex items-center justify-center text-center px-4 pt-20">
        <div>
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Wilayah tidak ditemukan</h1>
          <p className="text-gray-400 mb-6">Slug &quot;{slug}&quot; tidak dikenali.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const totalRupiah = data?.totalRupiah || 0;
  const totalAll = Object.values(allData).reduce((s, r) => s + (r?.totalRupiah || 0), 0);
  const percentage = totalAll > 0 ? ((totalRupiah / totalAll) * 100).toFixed(1) : 0;
  const regionIndex = REGIONS.findIndex((r) => r.slug === slug);
  const prevRegion = regionIndex > 0 ? REGIONS[regionIndex - 1] : null;
  const nextRegion = regionIndex < REGIONS.length - 1 ? REGIONS[regionIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#000d2e]">
      {/* Hero Banner */}
      <div
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: `linear-gradient(135deg, #000d2e, ${region.color}15, #000d2e)` }}
      >
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: region.color }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />

        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className={`flex items-center gap-2 text-sm text-gray-400 mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="hover:text-white">Wilayah</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span style={{ color: region.color }} className="font-semibold">{region.name}</span>
          </div>

          {/* Title */}
          <div className={`flex flex-col sm:flex-row sm:items-center gap-6 mb-12 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${region.color}30, ${region.color}10)`,
                border: `2px solid ${region.color}50`,
                boxShadow: `0 0 40px ${region.color}30`,
              }}
            >
              {region.icon}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: region.color }}>
                Stockyard Wilayah — {region.province}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white">{region.name}</h1>
            </div>
          </div>

          {/* Main Nilai Rupiah Card */}
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div
              className="lg:col-span-2 rounded-2xl p-8 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${region.color}20, ${region.color}05)`, border: `1px solid ${region.color}40` }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: region.color }} />
              <div className="relative z-10">
                <div className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-3">
                  Total Nilai Stok Wilayah {region.name}
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-14 bg-white/10 rounded-xl animate-pulse" />
                    <div className="h-6 bg-white/5 rounded w-1/2 animate-pulse" />
                  </div>
                ) : (
                  <>
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tabular-nums leading-tight">
                      <span className="text-2xl sm:text-3xl font-bold" style={{ color: region.color }}>Rp </span>
                      <AnimatedCounter value={totalRupiah} />
                    </div>
                    <div className="mt-2 text-xl font-semibold" style={{ color: region.color + 'bb' }}>
                      {formatRupiah(totalRupiah)}
                    </div>
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${region.color}, ${region.color}80)`,
                          transition: 'width 2.5s ease-out',
                        }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500">{percentage}% dari total semua wilayah</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex-1 rounded-2xl p-5 bg-white/5 border border-white/10">
                <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Wilayah</div>
                <div className="text-white font-bold text-lg">{region.name}</div>
                <div className="text-gray-400 text-sm">{region.province}</div>
              </div>
              <div className="flex-1 rounded-2xl p-5 bg-white/5 border border-white/10">
                <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Status</div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 font-semibold">Operasional</span>
                </div>
              </div>
              <div className="flex-1 rounded-2xl p-5 bg-white/5 border border-white/10">
                <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Porsi Nasional</div>
                <div className="text-white font-bold text-2xl">{isLoading ? '...' : `${percentage}%`}</div>
                <div className="text-gray-500 text-xs mt-0.5">dari total 7 wilayah</div>
              </div>
            </div>
          </div>

          {/* Dashboard Link */}
          <div className={`mt-8 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <a
              href={region.gasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 w-full sm:w-auto justify-center px-8 py-5 rounded-2xl font-bold text-base text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${region.color}, ${region.color}cc)`, boxShadow: `0 8px 30px ${region.color}40` }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Buka Dashboard Interaktif {region.name}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p className="text-gray-500 text-xs mt-2 ml-1">* Dashboard interaktif akan terbuka di tab baru</p>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Perbandingan Antar Wilayah</h2>
          <div className="space-y-3">
            {REGIONS.map((r) => {
              const rData = allData[r.slug];
              const rTotal = rData?.totalRupiah || 0;
              const rPct = totalAll > 0 ? (rTotal / totalAll) * 100 : 0;
              const isActive = r.slug === slug;
              return (
                <Link
                  key={r.id}
                  href={`/wilayah/${r.slug}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                    isActive ? 'border-white/20 bg-white/10' : 'border-white/5 bg-white/3 hover:bg-white/8 hover:border-white/10'
                  }`}
                >
                  <div className="text-2xl flex-shrink-0">{r.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {r.name}
                        {isActive && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: r.color + '30', color: r.color }}>
                            Halaman ini
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400 tabular-nums flex-shrink-0 ml-2">
                        {isLoading ? '...' : `Rp ${new Intl.NumberFormat('id-ID').format(rTotal)}`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: isLoading ? '0%' : `${rPct}%`, background: `linear-gradient(90deg, ${r.color}, ${r.color}80)`, transition: 'width 1.5s ease-out' }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{isLoading ? '' : `${rPct.toFixed(1)}%`}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prev/Next navigation */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {prevRegion ? (
            <Link href={`/wilayah/${prevRegion.slug}`} className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-200 group">
              <svg className="w-5 h-5 text-gray-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
                <div className="text-gray-500 text-xs">Sebelumnya</div>
                <div className="text-white font-semibold text-sm">{prevRegion.name}</div>
              </div>
            </Link>
          ) : <div />}
          <Link href="/" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Beranda
          </Link>
          {nextRegion ? (
            <Link href={`/wilayah/${nextRegion.slug}`} className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-200 group text-right">
              <div>
                <div className="text-gray-500 text-xs">Berikutnya</div>
                <div className="text-white font-semibold text-sm">{nextRegion.name}</div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
