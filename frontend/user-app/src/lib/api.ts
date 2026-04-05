import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from './supabase';
import { Listing, ListingFilter } from '@/types';

const isSupabaseConfigured = () => {
  const configured = supabase !== null;
  if (!configured && typeof window !== 'undefined') {
    console.warn('[Supabase] Client not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }
  return configured;
};

// ─── Public API Functions ─────────────────────────────────────────────────────

/** Fetch all available listings, optionally filtered */
export async function fetchListings(filters?: ListingFilter): Promise<Listing[]> {
  noStore();
  if (!isSupabaseConfigured()) return [];

  try {
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
      console.error('[fetchListings] Supabase error:', error.message);
      return [];
    }
    return data ?? [];
  } catch (err: any) {
    console.error('[fetchListings] Unexpected error:', err.message || err);
    return [];
  }
}

/** Fetch first 6 available listings for the homepage — no caching (always fresh) */
export async function fetchFeaturedListings(): Promise<Listing[]> {
  noStore();
  if (!isSupabaseConfigured()) {
    console.warn('[fetchFeaturedListings] Supabase not configured');
    return [];
  }

  try {
    const { data, error } = await supabase!
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('[fetchFeaturedListings] Supabase error:', error.message);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn('[fetchFeaturedListings] No listings found in DB');
    }

    return data ?? [];
  } catch (err: any) {
    console.error('[fetchFeaturedListings] Unexpected error:', err.message || err);
    return [];
  }
}

/** Fetch a single listing by ID */
export async function fetchListingById(id: string): Promise<Listing | null> {
  noStore();
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase!
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[fetchListingById] Supabase error:', error.message);
      return null;
    }
    return data;
  } catch (err: any) {
    console.error('[fetchListingById] Unexpected error:', err.message || err);
    return null;
  }
}

