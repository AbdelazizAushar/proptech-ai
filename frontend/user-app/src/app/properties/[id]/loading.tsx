/**
 * loading.tsx — Next.js route-level loading UI for /properties/[id]
 * يُعرض تلقائياً أثناء تحميل صفحة التفاصيل (Suspense boundary)
 */

import '../../globals.css';
import '../[id]/page.css';
import '../../../components/SkeletonCard.css';

export default function PropertyDetailLoading() {
  return (
    <div className="detail-page page-wrapper">
      <div className="container">

        {/* Breadcrumb skeleton */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '1.5rem 0 0.75rem' }}>
          {[80, 60, 130].map((w, i) => (
            <div key={i} className="sk-shimmer"
              style={{ height: '14px', width: `${w}px`, borderRadius: '6px' }} />
          ))}
        </div>

        {/* Title + Price skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div className="sk-shimmer" style={{ height: '2rem', width: '60%', marginBottom: '0.75rem', borderRadius: '8px' }} />
            <div className="sk-shimmer" style={{ height: '1rem', width: '40%', borderRadius: '6px' }} />
          </div>
          <div>
            <div className="sk-shimmer" style={{ height: '0.75rem', width: '80px', marginBottom: '0.5rem', borderRadius: '4px' }} />
            <div className="sk-shimmer" style={{ height: '2.5rem', width: '160px', borderRadius: '8px' }} />
          </div>
        </div>

        {/* Gallery skeleton */}
        <div className="detail-gallery" style={{ marginBottom: '2.5rem' }}>
          <div className="sk-shimmer" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div className="sk-shimmer" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
            <div className="sk-shimmer" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
          </div>
        </div>

        {/* Layout skeleton: specs + sidebar */}
        <div className="detail-layout">
          <div>
            {/* Specs grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sk-shimmer" style={{ height: '90px', borderRadius: 'var(--radius)' }} />
              ))}
            </div>
            {/* Description lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[100, 85, 92, 70, 95].map((w, i) => (
                <div key={i} className="sk-shimmer"
                  style={{ height: '14px', width: `${w}%`, borderRadius: '6px' }} />
              ))}
            </div>
          </div>
          {/* Sidebar */}
          <div>
            <div className="sk-shimmer" style={{ height: '280px', borderRadius: 'var(--radius-lg)', marginBottom: '1.25rem' }} />
            <div className="sk-shimmer" style={{ height: '150px', borderRadius: 'var(--radius-lg)' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
