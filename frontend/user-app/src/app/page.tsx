import { Suspense } from 'react';
import Hero from '@/components/home/Hero/Hero';
import FeaturedListings from '@/components/home/FeaturedListings/FeaturedListings';
import HowItWorks from '@/components/home/Features/HowItWorks';
import { SkeletonGrid } from '@/components/SkeletonCard';

/**
 * Skeleton fallback section — same visual wrapper as FeaturedListings
 * so the page height stays stable while data loads.
 */
function FeaturedSkeleton() {
  return (
    <section style={{ padding: '5rem 0 6rem', background: 'var(--bg-white)' }}>
      <div className="container">
        {/* Mirror the section header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            height: '2rem', width: '220px',
            background: 'linear-gradient(90deg, #e8edf3 25%, #f1f5f9 50%, #e8edf3 75%)',
            backgroundSize: '600px 100%',
            animation: 'shimmer 1.6s ease-in-out infinite',
            borderRadius: '8px',
          }} />
        </div>
        <SkeletonGrid count={6} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <div id="featured">
        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedListings />
        </Suspense>
      </div>
      <HowItWorks />
    </>
  );
}
