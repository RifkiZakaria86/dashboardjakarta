'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function AnimatedCounter({ value, duration = 1800 }) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!value) return;
    startTime.current = null;
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return new Intl.NumberFormat('id-ID').format(count);
}

function formatRupiah(value) {
  if (!value) return 'Rp 0';
  if (value >= 1e12) return `Rp ${(value / 1e12).toFixed(2)} T`;
  if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(2)} M`;
  if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(2)} Jt`;
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

export default function RegionCard({ region, isLoading, index }) {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const totalRupiah = region?.totalRupiah || 0;

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ background: `linear-gradient(135deg, ${region.color}60, ${region.color}20)` }}
      />

      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col">
        {/* Top color bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${region.color}, ${region.color}80)` }}
        />

        <div className="p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${region.color}25, ${region.color}10)`,
                  border: `1px solid ${region.color}40`,
                }}
              >
                {region.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{region.name}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{region.province}</p>
              </div>
            </div>
            <div
              className="px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ background: `${region.color}20`, color: region.color }}
            >
              AKTIF
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 mb-5" />

          {/* Nilai Rupiah */}
          <div className="mb-6 flex-1">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Total Nilai Stok
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-tight">
                  <span className="text-base font-bold" style={{ color: region.color }}>Rp </span>
                  <AnimatedCounter value={totalRupiah} />
                </div>
                <div
                  className="mt-1.5 text-sm font-semibold"
                  style={{ color: region.color + 'cc' }}
                >
                  {formatRupiah(totalRupiah)}
                </div>
              </>
            )}
          </div>

          {/* Progress bar (visual only) */}
          {!isLoading && (
            <div className="mb-5">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-2000"
                  style={{
                    background: `linear-gradient(90deg, ${region.color}, ${region.color}80)`,
                    width: '100%',
                    animation: 'progress 2s ease-out forwards',
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Link
              href={`/wilayah/${region.slug}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${region.color}, ${region.color}cc)`,
                boxShadow: `0 4px 15px ${region.color}30`,
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Detail
            </Link>
            <a
              href={region.gasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-semibold text-xs border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-300"
              title="Buka Dashboard GAS di tab baru"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
