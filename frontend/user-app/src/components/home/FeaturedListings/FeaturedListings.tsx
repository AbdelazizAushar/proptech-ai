import React from 'react';
import Link from 'next/link';
import { fetchFeaturedListings } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import EmptyState from '@/components/EmptyState';
import { IconBuilding } from '@/components/Icons';
import './FeaturedListings.css';

/**
 * ARCHITECTURE DECISION:
 * Decoupled into `/home/FeaturedListings` to maintain modularity.
 * Kept as Server Component for initial fast data fetching.
 */
const FeaturedListings = async () => {
  const listings = await fetchFeaturedListings();

  return (
    <section className="featured-section" aria-label="العقارات المميزة">
      <div className="container">

        <div className="featured__header">
          <div className="featured__header-text">
            <h2 className="section-title">العقارات المميزة</h2>
            <p className="section-subtitle">اكتشف أحدث العروض العقارية الاستثنائية في سوريا</p>
          </div>
          <Link href="/properties" className="featured__view-all btn btn-outline">
            مشاهدة الكل
            <span className="arrow">←</span>
          </Link>
        </div>

        {listings.length === 0 ? (
          <EmptyState
            icon={<IconBuilding size={36} strokeWidth={1.25} />}
            title="لا توجد عقارات متاحة حالياً"
            description="لم يتم إضافة أي عقارات بعد. تحقق مجدداً قريباً أو تواصل معنا عبر واتساب لمساعدتك في العثور على طلبك."
          />
        ) : (
          <div className="featured__grid">
            {listings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedListings;
