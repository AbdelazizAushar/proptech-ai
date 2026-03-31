import { Suspense } from 'react';
import { fetchListings } from '@/lib/api';
import PropertiesClient from '@/components/PropertiesClient';
import { SkeletonGrid } from '@/components/SkeletonCard';

interface PageProps {
  searchParams: Promise<{ location?: string; category?: string }>;
}

/** Fallback shown while the server fetches listings */
function PropertiesSkeleton() {
  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      <div className="container">
        {/* Mirror props-header height */}
        <div style={{ padding: '2.5rem 0 2rem' }}>
          <div style={{
            height: '2rem', width: '260px', marginBottom: '0.75rem',
            background: 'linear-gradient(90deg, #e8edf3 25%, #f1f5f9 50%, #e8edf3 75%)',
            backgroundSize: '600px 100%',
            animation: 'shimmer 1.6s ease-in-out infinite',
            borderRadius: '8px',
          }} />
          <div style={{
            height: '1rem', width: '380px',
            background: 'linear-gradient(90deg, #e8edf3 25%, #f1f5f9 50%, #e8edf3 75%)',
            backgroundSize: '600px 100%', animation: 'shimmer 1.6s ease-in-out infinite',
            borderRadius: '8px',
          }} />
        </div>
        <SkeletonGrid count={9} />
      </div>
    </div>
  );
}

// Server Component – fetch data, pass to interactive client
async function PropertiesServer({ location, category }: { location?: string; category?: string }) {
  const listings = await fetchListings();
  return (
    <PropertiesClient
      initialListings={listings}
      initialFilter={{ location, category }}
    />
  );
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <Suspense fallback={<PropertiesSkeleton />}>
      <PropertiesServer location={params.location} category={params.category} />
    </Suspense>
  );
}

export const metadata = {
  title: 'عقارات سوريا | تصفح العقارات',
  description: 'تصفح جميع العقارات المتاحة للبيع والإيجار في مختلف المحافظات السورية',
};
