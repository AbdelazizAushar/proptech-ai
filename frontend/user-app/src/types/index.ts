// ─── Core Data Types ──────────────────────────────────────────────────────────

export interface Listing {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  location: string;
  specs: ListingSpecs;
  images: string[];
  status: 'available' | 'sold' | 'rented';
  area?: number | null;
  area_unit?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingSpecs {
  // Arabic keys (legacy / mock data)
  غرف_النوم?: number;
  الحمامات?: number;
  المساحة_م2?: number;
  الطابق?: number | string;
  مصعد?: boolean;
  موقف_سيارة?: boolean;
  مسبح?: boolean;
  حديقة?: boolean;
  مفروشة?: boolean;
  تدفئة?: string;
  تكييف?: boolean;
  إطلالة_بحر?: boolean;
  الطوابق?: number;
  النوع?: string;
  // English keys (saved by admin form)
  bedroom?: number;
  bathroom?: number;
  kitchen?: number;
  living_room?: number;
  balcony?: number;
  garden?: number;
  pool?: number;
  parking?: number;
  maid_room?: number;
  storage?: number;
  rentPeriod?: string;
  area?: string;
  [key: string]: unknown;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ListingFilter {
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  status?: 'sale' | 'rent' | 'all';
}

// ─── UI Component Props ───────────────────────────────────────────────────────

export interface PropertyCardProps {
  listing: Listing;
  variant?: 'default' | 'horizontal';
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
