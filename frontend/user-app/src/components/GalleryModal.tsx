'use client';

import { useEffect, useState, useCallback } from 'react';
import { IconX, IconArrowLeft } from '@/components/Icons';

interface Props {
  images: string[];
  propertyName: string;
  initialIndex?: number;
  onClose: () => void;
}

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14,6 20,12 14,18" />
  </svg>
);

export default function GalleryModal({ images, propertyName, initialIndex = 0, onClose }: Props) {
  const [active, setActive] = useState(initialIndex);
  const total = images.length;

  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive(i => (i + 1) % total), [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, next, prev]);

  const fallback = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="gallery-modal-overlay" role="dialog" aria-modal="true" aria-label="معرض الصور">
      {/* Header */}
      <div className="gallery-modal-header">
        <span className="gallery-modal-counter">
          {(active + 1).toLocaleString('en-US')} / {total.toLocaleString('en-US')}
        </span>
        <span className="gallery-modal-title">{propertyName}</span>
        <button className="gallery-modal-close" onClick={onClose} aria-label="إغلاق">
          <IconX size={22} strokeWidth={2} />
        </button>
      </div>

      {/* Main Image */}
      <div className="gallery-modal-main" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-nav gallery-nav--prev" onClick={prev} aria-label="السابق">
          <ArrowRight />
        </button>

        <div className="gallery-modal-img-wrap">
          <img
            key={active}
            src={images[active] || fallback}
            alt={`صورة ${active + 1} لـ ${propertyName}`}
            className="gallery-modal-img"
            onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
          />
        </div>

        <button className="gallery-nav gallery-nav--next" onClick={next} aria-label="التالي">
          <IconArrowLeft size={22} strokeWidth={2} />
        </button>
      </div>

      {/* Thumbnails Strip */}
      <div className="gallery-modal-thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`gallery-thumb${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`صورة ${i + 1}`}
          >
            <img
              src={img || fallback}
              alt=""
              onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
            />
          </button>
        ))}
      </div>

      {/* Click backdrop to close */}
      <div className="gallery-modal-backdrop" onClick={onClose} />
    </div>
  );
}
