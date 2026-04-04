import React from 'react';
import Link from 'next/link';
import BookingButton from '@/components/BookingButton';
import { notFound } from 'next/navigation';
import { fetchListingById, fetchFeaturedListings } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import GalleryTrigger from '@/components/GalleryTrigger';
import {
  IconMapPin, IconBed, IconBath, IconSquare,
  IconFloor, IconTag, IconElevator,
  IconWhatsApp, IconBookmark, IconShare,
  IconCheckBadge, IconXCircle, IconArrowLeft,
} from '@/components/Icons';
import './page.css';

interface Props {
  params: Promise<{ id: string }>;
}

const formatPrice = (n: number) => n.toLocaleString('en-US');

const STATUS_MAP = {
  available: { label: 'متاح',  cls: 'badge-available' },
  sold:      { label: 'مباع',  cls: 'badge-sold'      },
  rented:    { label: 'مؤجر', cls: 'badge-rented'    },
} as const;

/* ── Icon helpers ── */
const Pool = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 18c0-1.1.9-2 2-2 2.2 0 2.2 2 4.4 2 2.2 0 2.2-2 4.4-2 2.2 0 2.2 2 4.4 2 2.2 0 2.2-2 4.4-2"/>
    <path d="M2 14c0-1.1.9-2 2-2 2.2 0 2.2 2 4.4 2 2.2 0 2.2-2 4.4-2 2.2 0 2.2 2 4.4 2 2.2 0 2.2-2 4.4-2"/>
    <path d="M15 2a3 3 0 0 0-6 0v6H7l2 4h6l2-4h-2V2z"/>
  </svg>
);
const Garden = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22V12"/>
    <path d="M5 12c0-3.9 3.1-7 7-7s7 3.1 7 7H5z"/>
    <path d="M12 12c-4 0-7-3-7-7h14c0 4-3 7-7 7z"/>
  </svg>
);
const Parking = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 17V7h5a3 3 0 0 1 0 6H9"/>
  </svg>
);
const Kitchen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18v12H3z"/>
    <path d="M7 10v4M12 10v4M17 10v4"/>
    <path d="M3 10h18"/>
  </svg>
);
const Balcony = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="14" width="20" height="4" rx="1"/>
    <line x1="6" y1="14" x2="6" y2="8"/>
    <line x1="18" y1="14" x2="18" y2="8"/>
    <line x1="4" y1="8" x2="20" y2="8"/>
    <line x1="2" y1="18" x2="2" y2="22"/>
    <line x1="22" y1="18" x2="22" y2="22"/>
  </svg>
);
const LivingRoom = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/>
    <path d="M2 11a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3h10v-3a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5z"/>
    <line x1="6" y1="19" x2="6" y2="22"/>
    <line x1="18" y1="19" x2="18" y2="22"/>
  </svg>
);
const MaidRoom = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M16 3s1 1 1 3-1 3-1 3"/>
  </svg>
);
const Storage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 3H19a2 2 0 0 1 2 2v2H3V5a2 2 0 0 1 2-2z"/>
    <path d="M3 7h18v14H3z"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <path d="M10 10h4"/>
    <path d="M10 15h4"/>
  </svg>
);
const Heating = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 14c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1-.4-1.9-1-2.6L12 8l-3 3.4A4 4 0 0 0 8 14z"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);
const AC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="6" width="20" height="8" rx="2"/>
    <path d="M7 14v4M12 14v2M17 14v4"/>
    <line x1="6" y1="10" x2="18" y2="10"/>
  </svg>
);
const SeaView = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 18c0-1.1.9-2 2-2 2.2 0 2.2 2 4.4 2 2.2 0 2.2-2 4.4-2 2.2 0 2.2 2 4.4 2 2.2 0 2.2-2 4.4-2"/>
    <circle cx="12" cy="8" r="3"/>
    <path d="M5 4l2 2M19 4l-2 2M12 2v2"/>
  </svg>
);

/* ─── Spec cell helper ─────────────────────────────────── */
function Spec({ icon, label, value, yes, isBoolean = false }: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  yes?: boolean;
  isBoolean?: boolean;
}) {
  if (isBoolean) {
    return (
      <div className="spec-item">
        <span className={`spec-item__icon spec-item__icon--${yes ? 'yes' : 'no'}`}>
          {yes ? <IconCheckBadge size={22} /> : <IconXCircle size={22} />}
        </span>
        <span className="spec-item__icon spec-item__icon--sub">{icon}</span>
        <span className="spec-item__label">{label}</span>
        <strong>{yes ? 'يوجد' : 'لا يوجد'}</strong>
      </div>
    );
  }
  return (
    <div className="spec-item">
      <span className="spec-item__icon">{icon}</span>
      <span className="spec-item__label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  if (!listing) return notFound();

  const related = await fetchFeaturedListings();
  const relatedListings = related.filter((l) => l.id !== listing.id).slice(0, 3);

  const { name, location, price, images, specs, description, status, category, area: listingArea, area_unit: listingAreaUnit } = listing;

  const allImages = Array.isArray(images) && images.length > 0 ? images : [];
  const mainImg  = allImages[0] ?? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200';
  const sideImgs = allImages.slice(1, 5);
  const isRent   = category?.includes('إيجار');
  const refCode  = id.slice(-6).toUpperCase();
  const waText   = `مرحباً، أريد الاستفسار عن العقار: ${name} (رقم مرجع: ${refCode})`;
  const waLink   = `https://wa.me/963994822045?text=${encodeURIComponent(waText)}`;

  const statusInfo = STATUS_MAP[status] ?? STATUS_MAP.available;

  /* ── Parse specs (support both Arabic keys and English keys from dashboard) ── */
  const s = specs ?? {};

  // Arabic keys (from seed data)
  const bedrooms    = s['غرف_النوم']   ?? s['bedroom']    ?? null;
  const bathrooms   = s['الحمامات']    ?? s['bathroom']   ?? null;
  // Area: top-level column takes priority over Arabic specs key
  const area        = listingArea ?? s['المساحة_م2'] ?? null;
  const areaUnit    = listingAreaUnit ?? 'م²';
  const floor       = s['الطابق']      ?? null;
  const elevator    = s['مصعد']        ?? null;
  const parking     = s['موقف_سيارة'] ?? s['موقف_سيارات'] ?? s['parking'] ?? null;
  const pool        = s['مسبح']        ?? s['pool']       ?? null;
  const garden      = s['حديقة']       ?? s['garden']     ?? null;
  const furnished   = s['مفروشة']      ?? null;
  const heating     = s['تدفئة']       ?? null;
  const ac          = s['تكييف']       ?? s['ac']         ?? null;
  const seaView     = s['إطلالة_بحر'] ?? null;
  const floors      = s['الطوابق']     ?? null;

  // English keys (from admin dashboard)
  const kitchen     = s['kitchen']     ?? null;
  const balcony     = s['balcony']     ?? null;
  const livingRoom  = s['living_room'] ?? null;
  const maidRoom    = s['maid_room']   ?? null;
  const storage     = s['storage']     ?? null;

  return (
    <div className="detail-page page-wrapper">
      <div className="container">

        {/* ── Breadcrumb ── */}
        <nav className="breadcrumb" aria-label="مسار التنقل">
          <Link href="/">الرئيسية</Link>
          <span aria-hidden="true">/</span>
          <Link href="/properties">العقارات</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>

        {/* ── Layout: Main + Sidebar ── */}
        <div className="detail-layout">

          {/* ── Left/Main Content Column ── */}
          <div className="detail-content-wrapper">
            
            {/* ── Status Badges ── */}
            <div className="detail-badges">
              <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
              {isRent && <span className="badge badge-rented">للإيجار</span>}
            </div>

            {/* ── Header: Title Only ── */}
            <div className="detail-header">
              <div className="detail-header__meta">
                <h1 className="detail-title">{name}</h1>
                <p className="detail-location">
                  <IconMapPin size={16} strokeWidth={1.75} className="detail-location__icon" />
                  {location}
                </p>
              </div>
            </div>

            {/* ── Gallery ── */}
            <div className="detail-gallery">
              <div className="gallery-main">
                <img
                  src={mainImg}
                  alt={`صورة رئيسية لـ ${name}`}
                  className="gallery-main__img"
                  loading="eager"
                  onError={undefined}
                />
                <GalleryTrigger images={allImages} propertyName={name} />
              </div>
              {sideImgs.length > 0 && (
                <div className="gallery-side">
                  {sideImgs.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`صورة ${(i + 2).toLocaleString('en-US')} لـ ${name}`}
                      className="gallery-side__img"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Main Content ── */}
            <div className="detail-main">

              {/* ── Specs Grid ── */}
              <div className="specs-grid">

                {/* Numeric specs */}
                {bedrooms != null && (
                  <Spec icon={<IconBed size={22} strokeWidth={1.5} />} label="غرف النوم"
                    value={`${Number(bedrooms).toLocaleString('en-US')}`} />
                )}
                {bathrooms != null && (
                  <Spec icon={<IconBath size={22} strokeWidth={1.5} />} label="الحمامات"
                    value={`${Number(bathrooms).toLocaleString('en-US')}`} />
                )}
                {area != null && (
                  <Spec icon={<IconSquare size={22} strokeWidth={1.5} />} label="المساحة"
                    value={`${Number(area).toLocaleString('en-US')} ${areaUnit}`} />
                )}
                {(floor != null || floors != null) && (
                  <Spec icon={<IconFloor size={22} strokeWidth={1.5} />} label="الطابق"
                    value={`${Number(floor ?? floors).toLocaleString('en-US')}`} />
                )}
                <Spec icon={<IconTag size={22} strokeWidth={1.5} />} label="النوع" value={category} />

                {kitchen != null && (
                  <Spec icon={<Kitchen />} label="مطبخ"
                    value={Number(kitchen) > 1 ? `${Number(kitchen).toLocaleString('en-US')} مطابخ` : 'يوجد'} />
                )}
                {livingRoom != null && (
                  <Spec icon={<LivingRoom />} label="صالة المعيشة"
                    value={Number(livingRoom) > 1 ? `${Number(livingRoom).toLocaleString('en-US')} صالات` : 'يوجد'} />
                )}

                {/* Boolean specs */}
                {elevator != null && (
                  <Spec icon={<IconElevator size={22} strokeWidth={1.5} />} label="مصعد"
                    isBoolean yes={!!elevator} />
                )}
                {parking != null && (
                  <Spec icon={<Parking />} label="موقف سيارات"
                    isBoolean yes={!!parking} />
                )}
                {pool != null && (
                  <Spec icon={<Pool />} label="مسبح"
                    isBoolean yes={!!pool} />
                )}
                {garden != null && (
                  <Spec icon={<Garden />} label="حديقة"
                    isBoolean yes={!!garden} />
                )}
                {balcony != null && (
                  <Spec icon={<Balcony />} label="بلكون"
                    isBoolean yes={Number(balcony) > 0} />
                )}
                {maidRoom != null && (
                  <Spec icon={<MaidRoom />} label="غرفة خادمة"
                    isBoolean yes={Number(maidRoom) > 0} />
                )}
                {storage != null && (
                  <Spec icon={<Storage />} label="غرفة مخزن"
                    isBoolean yes={Number(storage) > 0} />
                )}
                {furnished != null && (
                  <Spec icon={<IconCheckBadge size={22} />} label="مفروشة"
                    isBoolean yes={!!furnished} />
                )}
                {seaView != null && (
                  <Spec icon={<SeaView />} label="إطلالة بحرية"
                    isBoolean yes={!!seaView} />
                )}
                {ac != null && (
                  <Spec icon={<AC />} label="تكييف"
                    isBoolean yes={!!ac} />
                )}
                {heating && (
                  <Spec icon={<Heating />} label="التدفئة" value={String(heating)} />
                )}
              </div>

              {/* Description */}
              <section className="detail-section">
                <h2 className="detail-section__title">الوصف والتفاصيل</h2>
                <p className="detail-description">
                  {description ?? 'لا يوجد وصف متاح لهذا العقار.'}
                </p>
              </section>

              {/* Location Info */}
              <section className="detail-section">
                <h2 className="detail-section__title">الموقع</h2>
                <div className="location-info">
                  <IconMapPin size={18} strokeWidth={1.75} className="location-info__icon" />
                  <div>
                    <p className="location-info__city">{location}</p>
                    <p className="location-info__note">
                      للحصول على الموقع التفصيلي، تواصل معنا عبر واتساب.
                    </p>
                  </div>
                </div>
              </section>

            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="detail-sidebar">

            {/* Contact Card */}
            <div className="contact-card">
              {/* ── Price Moved Here ── */}
              <div className="contact-card__price">
                <span className="contact-card__price-label">السعر المطلوب</span>
                <div className="contact-card__price-value">
                  <span className="contact-card__price-amount">{formatPrice(price)}</span>
                  <span className="contact-card__price-currency">$</span>
                  {isRent && <span className="contact-card__price-period">/شهر</span>}
                </div>
              </div>

              <hr className="contact-card__divider" />

              <h3 className="contact-card__title">استفسر عن هذا العقار</h3>
              <p className="contact-card__desc">
                فريقنا متاح للإجابة على استفساراتك وترتيب موعد المعاينة.
              </p>

              <BookingButton propertyName={name} propertyId={id} />

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn wa-btn"
                aria-label="تواصل عبر واتساب"
              >
                <IconWhatsApp size={20} />
                تواصل عبر واتساب
              </a>

              <p className="contact-card__ref">
                رقم مرجعي: <strong>{refCode}</strong>
              </p>

              <div className="contact-card__actions">
                <button className="btn btn-outline contact-action-btn" type="button" style={{ gridColumn: '1 / -1' }}>
                  <IconShare size={16} strokeWidth={1.75} />
                  مشاركة
                </button>
              </div>
            </div>

            {/* Legal Banner */}
            <div className="legal-banner">
              <span className="legal-banner__tag">خدمات عقاري المميزة</span>
              <div className="legal-banner__icon">
                <IconCheckBadge size={28} strokeWidth={1.5} />
              </div>
              <h4>استشارة قانونية مجانية</h4>
              <p>نضمن لك سلامة العقود والتوثيق القانوني الكامل لجميع معاملاتك.</p>
            </div>

          </aside>
        </div>

        {/* ── Related Listings ── */}
        {relatedListings.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <h2 className="section-title">عقارات مشابهة</h2>
              <Link href="/properties" className="btn btn-ghost related-all-btn">
                <IconArrowLeft size={16} strokeWidth={2} />
                عرض الكل
              </Link>
            </div>
            <div className="related-grid">
              {relatedListings.map((l) => (
                <PropertyCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  return {
    title: listing ? `${listing.name} | عقارات سوريا` : 'تفاصيل العقار | عقارات سوريا',
    description: listing?.description?.slice(0, 160) ?? 'عقارات سوريا - تفاصيل العقار',
  };
}
