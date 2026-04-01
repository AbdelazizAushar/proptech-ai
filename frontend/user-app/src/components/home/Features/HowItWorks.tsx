'use client';

/**
 * ARCHITECTURE DECISION:
 * Decoupled into `/home/Features` to group all feature-related components.
 * Enhanced UI with Glassmorphism cards and hover lift effects.
 * Improved typography hierarchy to guide reading flow.
 */

import React from 'react';
import { IconSearch, IconKey, IconCalendar } from '@/components/Icons';
import './HowItWorks.css';

const STEPS = [
  {
    id: 1,
    Icon: IconSearch,
    title: 'ابحث عن عقارك',
    desc: 'تصفح تشكيلة واسعة من العقارات الفاخرة الموثقة في أرقى مناطق دمشق وحلب وكافة المحافظات السورية بسهولة فائقة.',
  },
  {
    id: 2,
    Icon: IconCalendar,
    title: 'حدد موعد للمعاينة',
    desc: 'تواصل بسلاسة مع وكلائنا المعتمدين لتنظيم زيارة ميدانية في الوقت الذي يناسب جدولك بشكل مثالي.',
  },
  {
    id: 3,
    Icon: IconKey,
    title: 'استلم مفتاحك',
    desc: 'أتمم جميع إجراءات الشراء أو الاستئجار بأعلى معايير الأمان والثقة وابدأ الفصل الجديد في منزلك الاستثنائي.',
  },
];

const HowItWorks = () => (
  <section className="features-section" id="how-it-works" aria-label="كيف يعمل الموقع">
    <div className="container">

      <div className="features__header">
        <h2 className="section-title text-center">رحلتك نحو منزلك المثالي</h2>
        <p className="section-subtitle text-center mx-auto">
          ثلاث خطوات بسيطة وموثوقة تفصلك عن تجربة سكنية ترتقي لتطلعاتك
        </p>
      </div>

      <div className="features__grid">
        {STEPS.map(({ id, Icon, title, desc }) => (
          <div key={id} className="feature-card glass-card hover-lift">
            <div className="feature-card__glow" />
            
            <div className="feature-card__icon-wrap">
              <Icon size={32} strokeWidth={1.5} className="text-primary" />
              <div className="feature-card__step-num">0{id}</div>
            </div>
            
            <h3 className="feature-card__title">{title}</h3>
            <p className="feature-card__desc">{desc}</p>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default HowItWorks;
