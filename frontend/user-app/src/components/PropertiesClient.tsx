'use client';

import React, { useState, useMemo } from 'react';
import Fuse, { IFuseOptions } from 'fuse.js';
import { Listing, ListingFilter } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import EmptyState from '@/components/EmptyState';
import { IconSearch, IconFilter, IconX } from '@/components/Icons';
import './PropertiesClient.css';

// ─── Fuse.js config ───────────────────────────────────────────────────────────
const FUSE_OPTIONS: IFuseOptions<Listing> = {
  keys: ['name', 'location', 'description', 'category'],
  threshold: 0.4,
  minMatchCharLength: 2,
  includeScore: true,
};

const CATEGORIES = ['الكل', 'شقة', 'فيلا', 'أرض', 'شقة للإيجار'];
const CITIES     = ['الكل', 'دمشق', 'حلب', 'اللاذقية', 'حمص', 'طرطوس'];
const ROOMS      = [
  { label: 'الكل', value: 0 },
  { label: '1+',   value: 1 },
  { label: '2+',   value: 2 },
  { label: '3+',   value: 3 },
  { label: '4+',   value: 4 },
];

interface Props {
  initialListings: Listing[];
  initialFilter: { location?: string; category?: string };
}

const PropertiesClient: React.FC<Props> = ({ initialListings, initialFilter }) => {
  const [searchQuery, setSearchQuery] = useState(initialFilter.location ?? '');
  const [filters, setFilters] = useState<ListingFilter>({
    location: '',
    category: initialFilter.category ?? '',
    rooms: 0,
    minPrice: undefined,
    maxPrice: undefined,
    status: 'all',
  });
  const [sortBy, setSortBy]   = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [page,   setPage]     = useState(1);
  const PER_PAGE = 9;

  // Fuse instance memoized on the full dataset
  const fuse = useMemo(() => new Fuse(initialListings, FUSE_OPTIONS), [initialListings]);

  // ─── Filtering + Fuzzy Search pipeline ────────────────────────────────────
  const filtered = useMemo(() => {
    // 1. Fuzzy search (handles Arabic typos)
    let list: Listing[] = searchQuery.trim()
      ? fuse.search(searchQuery).map((r) => r.item)
      : [...initialListings];

    // 2. Hard filters on top of fuzzy results
    if (filters.location && filters.location !== 'الكل') {
      list = list.filter((l) => l.location?.includes(filters.location!));
    }
    
    if (filters.category && filters.category !== 'الكل') {
      list = list.filter((l) => l.category?.includes(filters.category!));
    }
    
    // Status here means "Sale" vs "Rent" based on the UI options
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'sale') {
        list = list.filter((l) => !l.category?.includes('إيجار'));
      } else if (filters.status === 'rent') {
        list = list.filter((l) => l.category?.includes('إيجار'));
      }
    }
    
    // Rooms
    if (filters.rooms) {
      list = list.filter((l) => {
        const specs = l.specs ?? {};
        const roomsCount = Number(specs['غرف_النوم'] ?? specs['bedroom'] ?? 0);
        return roomsCount >= filters.rooms!;
      });
    }
    
    // Price
    if (filters.minPrice != null)
      list = list.filter((l) => l.price >= filters.minPrice!);
    if (filters.maxPrice != null)
      list = list.filter((l) => l.price <= filters.maxPrice!);

    // 3. Sort (skip when in fuzzy mode — Fuse already ranks by relevance)
    if (!searchQuery.trim()) {
      if (sortBy === 'newest')
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      else if (sortBy === 'price_asc')
        list.sort((a, b) => a.price - b.price);
      else
        list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [initialListings, searchQuery, filters, sortBy, fuse]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const set = (key: keyof ListingFilter, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ location: '', category: '', rooms: 0, minPrice: undefined, maxPrice: undefined, status: 'all' });
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery || filters.category || filters.status !== 'all' ||
    filters.rooms || filters.minPrice || filters.maxPrice;

  return (
    <div className="props-page page-wrapper">
      <div className="container">

        {/* ── Page Header ── */}
        <div className="props-header">
          <div>
            <h1 className="props-header__title">
              العقارات المتاحة
              <span className="props-header__count">{filtered.length.toLocaleString('en-US')} عقار</span>
            </h1>
            <p className="props-header__desc">
              اكتشف العقارات والفرص الاستثمارية في أفضل المواقع السورية.
            </p>
          </div>
          <div className="props-header__sort">
            <label className="sort-label" htmlFor="sort-select">ترتيب حسب:</label>
            <select
              id="sort-select"
              className="form-select sort-select"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setPage(1); }}
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="price_asc">السعر — الأقل</option>
              <option value="price_desc">السعر — الأعلى</option>
            </select>
          </div>
        </div>

        {/* ── Fuzzy Search Bar ── */}
        <div className="fuzzy-search-bar">
          <span className="fuzzy-search-bar__icon">
            <IconSearch size={18} strokeWidth={1.75} />
          </span>
          <input
            id="fuzzy-search"
            type="search"
            placeholder="ابحث بالاسم، المنطقة، النوع... (يتحمّل الأخطاء الإملائية)"
            className="fuzzy-search-bar__input"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            aria-label="بحث ضبابي في العقارات"
          />
          {searchQuery && (
            <button
              className="fuzzy-search-bar__clear"
              onClick={() => { setSearchQuery(''); setPage(1); }}
              aria-label="مسح البحث"
            >
              <IconX size={14} strokeWidth={2.5} />
            </button>
          )}
          {searchQuery && (
            <span className="fuzzy-search-bar__hint">
              {filtered.length.toLocaleString('en-US')} نتيجة
            </span>
          )}
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div className="filter-bar__inner">
            {/* City */}
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-city">المدينة</label>
              <select
                id="filter-city"
                className="form-select"
                value={filters.location ?? ''}
                onChange={(e) => set('location', e.target.value === 'الكل' ? '' : e.target.value)}
              >
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Category */}
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-cat">النوع</label>
              <select
                id="filter-cat"
                className="form-select"
                value={filters.category ?? ''}
                onChange={(e) => set('category', e.target.value === 'الكل' ? '' : e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group filter-group--price">
              <label className="filter-label">السعر ($)</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="من"
                  className="form-input"
                  min={0}
                  onChange={(e) => set('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                />
                <span className="price-range__sep">—</span>
                <input
                  type="number"
                  placeholder="إلى"
                  className="form-input"
                  min={0}
                  onChange={(e) => set('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Rooms */}
            <div className="filter-group">
              <label className="filter-label">الغرف</label>
              <div className="rooms-toggle">
                {ROOMS.map((r) => (
                  <button
                    key={r.value}
                    className={`room-btn ${filters.rooms === r.value ? 'room-btn--active' : ''}`}
                    onClick={() => set('rooms', r.value)}
                    type="button"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="filter-group">
              <label className="filter-label">الحالة</label>
              <div className="status-toggle">
                {[{ v: 'all', l: 'الكل' }, { v: 'sale', l: 'للبيع' }, { v: 'rent', l: 'للإيجار' }].map(({ v, l }) => (
                  <label key={v} className="status-radio">
                    <input
                      type="radio"
                      name="status"
                      value={v}
                      checked={filters.status === v}
                      onChange={() => set('status', v)}
                    />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Reset button — visible only when filters are active */}
          {hasActiveFilters && (
            <button className="btn btn-ghost filter-reset" onClick={resetFilters} type="button">
              <IconX size={14} strokeWidth={2.5} />
              مسح الكل
            </button>
          )}
        </div>

        {/* ── Results Grid ── */}
        {paged.length === 0 ? (
          <EmptyState
            icon={
              searchQuery
                ? <IconSearch size={36} strokeWidth={1.25} />
                : <IconFilter size={36} strokeWidth={1.25} />
            }
            title={
              searchQuery
                ? `لم يتم العثور على نتائج لـ «${searchQuery}»`
                : 'لا توجد عقارات تطابق الفلاتر'
            }
            description={
              searchQuery
                ? 'جرّب كلمات بحث مختلفة، أو تحقّق من المدينة ونوع العقار.'
                : 'جرّب توسيع نطاق الفلاتر أو تغيير معايير البحث للحصول على نتائج أكثر.'
            }
            action={{ label: 'إعادة التهيئة', onClick: resetFilters }}
          />
        ) : (
          <div className="props-grid">
            {paged.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-ghost pg-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="الصفحة السابقة"
            >
              &rsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`btn pg-btn ${page === p ? 'pg-btn--active' : 'btn-ghost'}`}
                onClick={() => setPage(p)}
                aria-current={page === p ? 'page' : undefined}
              >
                {p}
              </button>
            ))}
            <button
              className="btn btn-ghost pg-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="الصفحة التالية"
            >
              &lsaquo;
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PropertiesClient;
