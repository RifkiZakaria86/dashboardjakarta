'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    if (!value) return;
    startTime.current = null;
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{new Intl.NumberFormat('id-ID').format(count)}</span>;
}

export default function HeroSection({ totalAllRegions, isLoading }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000d2e] via-[#001a4d] to-[#00082a]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400/60 rounded-full animate-float"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${3 + i * 0.5}s` }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Logo */}
        <div className={`flex justify-center mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/10 border border-white/20 shadow-2xl shadow-blue-500/30 p-2 flex items-center justify-center">
            <Image src="/logo.png" alt="WIKA Beton" width={80} height={80} className="object-contain" style={{ objectFit: 'contain', maxWidth: '80px', maxHeight: '80px' }} />
          </div>
        </div>

        {/* Badge */}
        <div className={`flex justify-center mb-6 transition-all duration-1000 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Stockyard Management System
          </span>
        </div>

        {/* Heading */}
        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Dashboard SMS
          <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            WIKA Beton
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`text-lg sm:text-xl text-blue-200/80 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Pantau nilai rupiah stok <strong className="text-white">7 Pabrik Produk Beton</strong> PT WIKA Beton secara real-time.
          Data terupdate langsung dari laporan opname stockyard.
        </p>

        {/* Total Card */}
        <div className={`inline-block mb-12 transition-all duration-1000 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm">
            <div className="text-yellow-400/70 text-sm font-semibold uppercase tracking-widest mb-2">
              Total Nilai Stok Keseluruhan
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tabular-nums">
              {isLoading ? (
                <span className="text-2xl text-gray-400 animate-pulse">Menghitung...</span>
              ) : (
                <>
                  <span className="text-yellow-400 text-2xl sm:text-3xl font-bold">Rp </span>
                  <AnimatedCounter value={totalAllRegions} />
                </>
              )}
            </div>
            <div className="text-blue-300/50 text-xs mt-2">Dari 7 Pabrik Produk Beton</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="#wilayah"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/30 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Lihat Semua Wilayah
          </a>
          <Link
            href="/wilayah/pasuruan"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Mulai Eksplorasi
          </Link>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 gap-6 max-w-lg mx-auto mt-20 transition-all duration-1000 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { label: 'PPB', value: '7' },
            { label: 'Stockyard', value: '15+' },
            { label: 'Update', value: 'Real-time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-blue-300/60 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
