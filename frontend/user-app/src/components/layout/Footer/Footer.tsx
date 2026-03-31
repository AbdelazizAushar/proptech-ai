'use client';

/**
 * ARCHITECTURE DECISION:
 * Decoupled into `/layout/Footer` to maintain modularity.
 * Included 'use client' explicitly to allow form interactions without causing SSR hydration errors.
 */

import React from 'react';
import Link from 'next/link';
import { IconBuilding, IconWhatsApp, IconPhone, IconMail } from '@/components/Icons';
import './Footer.css';

const Footer = () => (
  <footer className="footer" id="footer">
    <div className="container footer-grid">

      {/* ── Brand ── */}
      <div className="footer-col footer-col--brand">
        <Link href="/" className="footer-logo">
          <span className="footer-logo__icon">
            <IconBuilding size={20} strokeWidth={1.5} />
          </span>
          <span>عقارات سوريا</span>
        </Link>
        <p className="footer-about">
          المنصة الرائدة في السوق العقاري السوري، نوفر لكم وصولاً مباشراً
          لأفضل العقارات بأسلوب عصري، آمن، وموثوق.
        </p>
        <div className="footer-social">
          <a href="#" aria-label="تواصل عبر واتساب" className="social-btn">
            <IconWhatsApp size={18} />
          </a>
          <a href="#" aria-label="اتصال هاتفي" className="social-btn">
            <IconPhone size={18} strokeWidth={1.75} />
          </a>
          <a href="#" aria-label="مراسلة عبر البريد الإلكتروني" className="social-btn">
            <IconMail size={18} strokeWidth={1.75} />
          </a>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="footer-col">
        <h3 className="footer-heading">روابط سريعة</h3>
        <ul className="footer-links">
          <li><Link href="/properties">استكشف العقارات</Link></li>
          <li><Link href="/properties?category=شقة للإيجار">عقارات للإيجار</Link></li>
          <li><Link href="/#how-it-works">آلية عمل المنصة</Link></li>
          <li><Link href="/#footer">تواصل معنا</Link></li>
        </ul>
      </div>

      {/* ── Regions ── */}
      <div className="footer-col">
        <h3 className="footer-heading">أهم المحافظات</h3>
        <ul className="footer-links">
          <li><Link href="/properties?location=دمشق">دمشق وريفها</Link></li>
          <li><Link href="/properties?location=حلب">حلب الشهباء</Link></li>
          <li><Link href="/properties?location=اللاذقية">اللاذقية وطرطوس</Link></li>
          <li><Link href="/properties?location=حمص">حمص وحماة</Link></li>
        </ul>
      </div>

      {/* ── Newsletter ── */}
      <div className="footer-col footer-col--newsletter">
        <h3 className="footer-heading">نشرتنا البريدية</h3>
        <p className="footer-newsletter-desc">
          كن أول من يعلم عند توفر عقارات استثنائية أو عروض حصرية.
        </p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="البريد الإلكتروني..."
            className="newsletter-input"
            required
            aria-label="البريد الإلكتروني للاشتراك"
          />
          <button type="submit" className="btn btn-accent newsletter-btn">
            اشتراك
          </button>
        </form>
      </div>

    </div>

    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <p>© {new Date().getFullYear()} PropTech AI Syria. جميع الحقوق محفوظة.</p>
        <div className="footer-legal-links">
          <Link href="#">سياسة الخصوصية</Link>
          <Link href="#">شروط الاستخدام</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
