/**
 * SkeletonCard — نسخة Shimmer من بطاقة العقار.
 * نفس الأبعاد تماماً كالـ PropertyCard لمنع layout shifts.
 * يُستخدم مع Suspense أو أثناء client-side fetch.
 */

import React from 'react';
import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="sk-card" aria-hidden="true" role="presentation">
      {/* Image area */}
      <div className="sk-card__image sk-shimmer" />

      {/* Content */}
      <div className="sk-card__body">
        {/* Badge */}
        <div className="sk-card__badge sk-shimmer" />

        {/* Title */}
        <div className="sk-card__title sk-shimmer" />
        <div className="sk-card__title sk-card__title--short sk-shimmer" />

        {/* Location */}
        <div className="sk-card__location sk-shimmer" />

        {/* Specs row */}
        <div className="sk-card__specs">
          <div className="sk-card__spec sk-shimmer" />
          <div className="sk-card__spec sk-shimmer" />
          <div className="sk-card__spec sk-shimmer" />
        </div>

        {/* Price + CTA */}
        <div className="sk-card__footer">
          <div className="sk-card__price sk-shimmer" />
          <div className="sk-card__btn sk-shimmer" />
        </div>
      </div>
    </div>
  );
}

/** Grid of N skeleton cards — same grid as featured / properties */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="sk-grid" aria-label="جاري التحميل..." aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
