'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { REGIONS } from '../lib/regions';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#001a4d]/95 backdrop-blur-xl shadow-2xl shadow-blue-900/30 border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 p-1 border border-white/20 group-hover:border-yellow-400/50 transition-all duration-300" style={{ position: 'relative' }}>
              <Image
                src="/logo.png"
                alt="WIKA Beton Logo"
                width={44}
                height={44}
                className="object-contain w-full h-full"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight tracking-wide">WIKA Beton</div>
              <div className="text-yellow-400 text-xs font-medium tracking-widest uppercase">Dashboard Stok</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border ${
                  dropdownOpen
                    ? 'bg-yellow-400 text-blue-900 border-yellow-400 shadow-lg shadow-yellow-400/30'
                    : 'text-white border-white/20 hover:bg-white/10 hover:border-white/40'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Wilayah
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#001a4d]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-blue-900/50 overflow-hidden animate-fadeIn">
                  <div className="p-2">
                    {REGIONS.map((region) => (
                      <Link
                        key={region.id}
                        href={`/wilayah/${region.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ backgroundColor: region.color + '25', border: `1px solid ${region.color}50` }}
                        >
                          {region.icon}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">
                            {region.name}
                          </div>
                          <div className="text-gray-400 text-xs">{region.province}</div>
                        </div>
                        <svg className="w-4 h-4 text-gray-500 group-hover:text-yellow-400 ml-auto transition-all duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">Pilih Wilayah</span>
              </div>
              {REGIONS.map((region) => (
                <Link
                  key={region.id}
                  href={`/wilayah/${region.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                >
                  <span className="text-xl">{region.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">{region.name}</div>
                    <div className="text-gray-400 text-xs">{region.province}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
