'use client';

/**
 * ARCHITECTURE DECISION:
 * Decoupled Header into `/layout/Header` to isolate layout concerns.
 * Implemented conditional glassmorphism based on scroll position for a premium feel.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconMapPin, IconSearch } from '@/components/Icons'; // Alias to shared icons
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--glass' : ''}`}>
      <div className="container navbar__container">
        
        {/* Logo */}
        <Link href="/" className="navbar__logo" aria-label="عقارات سوريا - الرئيسية">
          <span className="navbar__logo-icon">
            <IconMapPin size={24} strokeWidth={2.5} />
          </span>
          <span className="navbar__logo-text">
            PropTech <span className="text-accent">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="navbar__links" aria-label="القائمة الرئيسية للدسك توب">
          <Link href="/" className="navbar__link">الرئيسية</Link>
          <Link href="/properties" className="navbar__link">العقارات</Link>
          <Link href="/#featured" className="navbar__link">المميزة</Link>
          <Link href="/#how-it-works" className="navbar__link">آلية العمل</Link>
        </nav>

        {/* CTA */}
        <div className="navbar__actions">
          <Link href="/properties" className="btn btn-primary btn--glass">
            <IconSearch size={18} />
            البحث الآن
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="navbar__toggle show-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="القائمة المنسدلة"
          >
            <span className={`toggle-bar ${menuOpen ? 'toggle-bar--cross1' : ''}`} />
            <span className={`toggle-bar ${menuOpen ? 'toggle-bar--hidden' : ''}`} />
            <span className={`toggle-bar ${menuOpen ? 'toggle-bar--cross2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <nav className="mobile-nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
          <Link href="/properties" onClick={() => setMenuOpen(false)}>العقارات</Link>
          <Link href="/#featured" onClick={() => setMenuOpen(false)}>المميزة</Link>
          <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>آلية العمل</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
