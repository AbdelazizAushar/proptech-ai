import { supabase } from './supabase';
import { Listing, ListingFilter } from '@/types';

const isSupabaseConfigured = () => supabase !== null;

// ─── Mock Data (fallback when Supabase is not configured) ─────────────────────
const MOCK_LISTINGS: Listing[] = [
  {
    id: '00000000-0000-0000-0002-000000000001',
    name: 'شقة فاخرة في المزة فيلات غربية',
    description: 'شقة واسعة بتشطيبات راقية في أرقى أحياء دمشق، إطلالة جميلة، قريبة من السفارات والمراكز التجارية.',
    price: 85000,
    category: 'شقة',
    location: 'دمشق - المزة فيلات غربية',
    specs: { غرف_النوم: 3, الحمامات: 2, المساحة_م2: 175, الطابق: 4, مصعد: true, موقف_سيارة: true },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    ],
    status: 'available',
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2025-03-01T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0002-000000000002',
    name: 'شقة للإيجار - أبو رمانة',
    description: 'شقة مفروشة بالكامل في حي أبو رمانة الراقي، قريبة من وسط المدينة، تصلح للعائلات والأزواج.',
    price: 1200,
    category: 'شقة للإيجار',
    location: 'دمشق - أبو رمانة',
    specs: { غرف_النوم: 2, الحمامات: 1, المساحة_م2: 120, الطابق: 3, مصعد: true, مفروشة: true },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    ],
    status: 'available',
    created_at: '2025-03-02T10:00:00Z',
    updated_at: '2025-03-02T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0002-000000000005',
    name: 'فيلا فاخرة - قاسيون دمشق',
    description: 'فيلا مستقلة على سفح جبل قاسيون بإطلالة بانورامية على دمشق، حديقة خاصة وموقف واسع.',
    price: 450000,
    category: 'فيلا',
    location: 'دمشق - قاسيون',
    specs: { غرف_النوم: 5, الحمامات: 4, المساحة_م2: 400, الطوابق: 2, حديقة: true },
    images: [
      'https://images.unsplash.com/photo-1600607687931-cebfad7e145b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    ],
    status: 'available',
    created_at: '2025-03-03T10:00:00Z',
    updated_at: '2025-03-03T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0002-000000000006',
    name: 'شقة فاخرة - حلب الجديدة',
    description: 'شقة واسعة في قلب حلب الجديدة، تشطيبات ممتازة، قريبة من الجامعة والمستشفيات.',
    price: 55000,
    category: 'شقة',
    location: 'حلب - حلب الجديدة',
    specs: { غرف_النوم: 3, الحمامات: 2, المساحة_م2: 165, الطابق: 5, مصعد: true },
    images: [
      'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?auto=format&fit=crop&q=80&w=800',
    ],
    status: 'available',
    created_at: '2025-03-04T10:00:00Z',
    updated_at: '2025-03-04T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0002-000000000008',
    name: 'شقة بإطلالة بحرية - اللاذقية الكورنيش',
    description: 'شقة فاخرة في برج ساحلي بإطلالة مباشرة على البحر المتوسط، تشطيب سياحي راقٍ.',
    price: 95000,
    category: 'شقة',
    location: 'اللاذقية - الكورنيش',
    specs: { غرف_النوم: 3, الحمامات: 2, المساحة_م2: 180, الطابق: 8, إطلالة_بحر: true, مصعد: true },
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    ],
    status: 'available',
    created_at: '2025-03-05T10:00:00Z',
    updated_at: '2025-03-05T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0002-000000000009',
    name: 'فيلا صيفية - شاطئ الشرفة اللاذقية',
    description: 'فيلا مستقلة مطلة على البحر مباشرة، مثالية كمصيف، تُباع مفروشة بالكامل.',
    price: 280000,
    category: 'فيلا',
    location: 'اللاذقية - الشرفة',
    specs: { غرف_النوم: 4, الحمامات: 3, المساحة_م2: 280, الطوابق: 2, مسبح: true, حديقة: true, مفروشة: true },
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800',
    ],
    status: 'available',
    created_at: '2025-03-06T10:00:00Z',
    updated_at: '2025-03-06T10:00:00Z',
  },
];

// ─── Public API Functions ─────────────────────────────────────────────────────

/** Fetch all available listings, optionally filtered */
export async function fetchListings(filters?: ListingFilter): Promise<Listing[]> {
  if (!isSupabaseConfigured()) {
    let results = [...MOCK_LISTINGS];
    if (filters?.location) results = results.filter((l) => l.location.toLowerCase().includes(filters.location!.toLowerCase()));
    if (filters?.category) results = results.filter((l) => l.category?.includes(filters.category!));
    // 'sale' / 'rent' are UI-only — filter by category inclusion of 'إيجار'
    if (filters?.status && filters.status === 'rent') results = results.filter((l) => l.category?.includes('إيجار'));
    if (filters?.status && filters.status === 'sale') results = results.filter((l) => !l.category?.includes('إيجار'));
    if (filters?.rooms)    results = results.filter((l) => ((l.specs as any)['bedroom'] ?? (l.specs as any)['غرف_النوم'] ?? 0) >= filters.rooms!);
    if (filters?.minPrice) results = results.filter((l) => l.price >= filters.minPrice!);
    if (filters?.maxPrice) results = results.filter((l) => l.price <= filters.maxPrice!);
    return results;
  }

  let query = supabase!
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.location) query = query.ilike('location', `%${filters.location}%`);
  // category filter: use 'ilike' for partial match (e.g. 'سكني' matches 'سكني للإيجار' too)
  if (filters?.category) query = query.ilike('category', `%${filters.category}%`);
  // Note: sale/rent are UI-only filters (based on category), not DB status values.
  // They are handled client-side in PropertiesClient.tsx.

  const { data, error } = await query;
  if (error) {
    console.error('[fetchListings]', error.message);
    return MOCK_LISTINGS;
  }
  return data ?? [];
}

/** Fetch first 6 available listings for the homepage — no caching (always fresh) */
export async function fetchFeaturedListings(): Promise<Listing[]> {
  if (!isSupabaseConfigured()) return MOCK_LISTINGS.slice(0, 3);

  const { data, error } = await supabase!
    .from('listings')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('[fetchFeaturedListings]', error.message);
    return MOCK_LISTINGS.slice(0, 3);
  }
  return data ?? [];
}

/** Fetch a single listing by ID */
export async function fetchListingById(id: string): Promise<Listing | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_LISTINGS.find((l) => l.id === id) ?? MOCK_LISTINGS[0];
  }

  const { data, error } = await supabase!
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[fetchListingById]', error.message);
    return null;
  }
  return data;
}
