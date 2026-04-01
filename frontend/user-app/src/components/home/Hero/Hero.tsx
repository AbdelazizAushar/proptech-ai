'use client';

/**
 * ARCHITECTURE DECISION:
 * Decoupled into `/home/Hero` to isolate home-page specific features.
 * Shifted towards a visually striking layout focusing on high conversion:
 * "Glassmorphic Search Bar", "Floating Micro-interactions", and a strong typography scale.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch, IconMapPin, IconHome, IconCheckCircle, IconStar, IconLocation } from '@/components/Icons';
import './Hero.css';

const Hero = () => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="hero-section" aria-label="واجهة التطبيق الرئيسية">
      {/* Dynamic Background */}
      <div className="hero-bg">
        <div className="hero-bg__gradient-1" />
        <div className="hero-bg__gradient-2" />
        <div className="hero-bg__pattern" />
      </div>

      <div className="container hero-container">
        {/* Content Column */}
        <div className="hero-content">
          <div className="hero-badge fade-in-up">
            <span className="hero-badge__dot pulse" />
            <span className="hero-badge__text">منصتك الموثوقة للعقارات في سوريا</span>
          </div>

          <h1 className="hero-title fade-in-up delay-1">
            اكتشف <span className="hero-title__highlight">عقارك المثالي</span> <br/>
            لبداية حياة جديدة
          </h1>

          <p className="hero-description fade-in-up delay-2">
            استكشف مجموعة استثنائية من الشقق والفلل المصممة لراحتك. مع تقنيات الذكاء الاصطناعي، نربطك بأفضل العروض في أسرع وقت وبأعلى معايير الثقة.
          </p>

          {/* Glassmorphic Search Container */}
          <form className="hero-search-glass fade-in-up delay-3" onSubmit={handleSearch}>
            <div className="hero-search__field">
              <IconMapPin size={22} className="text-primary" />
              <input
                type="text"
                placeholder="أين تبحث؟ (دمشق، المزة...)"
                className="hero-search__input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="hero-search__divider" />

            <div className="hero-search__field">
              <IconHome size={22} className="text-primary" />
              <select
                className="hero-search__select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">جميع العقارات</option>
                <option value="شقة">شقة سكنية</option>
                <option value="فيلا">فيلا</option>
                <option value="شقة للإيجار">للإيجار</option>
              </select>
            </div>

            <button type="submit" className="hero-search__btn">
              <IconSearch size={20} strokeWidth={2.5} />
              <span className="hero-search__btn-text">بحث</span>
            </button>
          </form>

          {/* Social Proof Stats */}
          <div className="hero-stats fade-in-up delay-4">
            <div className="stat-item">
              <span className="stat-item__value">500+</span>
              <span className="stat-item__label">عقار موثق</span>
            </div>
            <div className="stat-item__divider" />
            <div className="stat-item">
              <span className="stat-item__value">4</span>
              <span className="stat-item__label">مدن سورية</span>
            </div>
            <div className="stat-item__divider" />
            <div className="stat-item">
              <span className="stat-item__value">99%</span>
              <span className="stat-item__label">رضا العملاء</span>
            </div>
          </div>
        </div>

        {/* Visual / Image Column */}
        <div className="hero-visual fade-in">
          <div className="hero-image-wrapper">
             {/* 
                Use an elegant placeholder or the existing asset provided by you 
                Since "hero_building_3d_1774904405998.png" is available, we use the original URL path.
             */}
            <img 
              src="/hero_building.png" 
              alt="شقة فاخرة ذات تصميم حديث" 
              className="hero-image"
              loading="eager"
            />
            <div className="hero-image__overlay" />
          </div>

          {/* Micro-interaction Panels */}
          <div className="hero-panel hero-panel--top float-anim">
            <div className="hero-panel__icon bg-white">
              <IconCheckCircle size={22} className="text-green" />
            </div>
            <div className="hero-panel__text">
              <p className="font-bold">مُوثّق رسمياً</p>
              <p className="text-sm">تم فحص العقار</p>
            </div>
          </div>

          <div className="hero-panel hero-panel--bottom float-anim-delayed">
            <div className="hero-panel__icon bg-primary">
              <IconLocation size={22} className="text-white" />
            </div>
            <div className="hero-panel__text">
              <p className="font-bold">يعقوبية، دمشق</p>
              <p className="text-sm text-accent">متاح الآن للإيجار</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
