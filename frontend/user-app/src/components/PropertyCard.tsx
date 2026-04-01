import React from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import { IconMapPin, IconBed, IconBath, IconSquare } from './Icons';
import './PropertyCard.css';

interface Props {
  listing: Listing;
}

const STATUS_LABEL: Record<Listing['status'], string> = {
  available: 'متاح',
  sold:      'مباع',
  rented:    'مؤجر',
};
const STATUS_CLASS: Record<Listing['status'], string> = {
  available: 'badge-available',
  sold:      'badge-sold',
  rented:    'badge-rented',
};

// Western numerals only
const formatPrice = (price: number) =>
  price.toLocaleString('en-US');

const PropertyCard: React.FC<Props> = ({ listing }) => {
  const { id, name, location, price, images, specs, status, category } = listing;
  const imgSrc =
    images?.[0] ??
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600';
  const isForRent = category?.includes('إيجار');

  return (
    <article className="pcard">
      {/* ── Image ── */}
      <div className="pcard__image-wrap">
        <img src={imgSrc} alt={name} className="pcard__img" loading="lazy" />
        <div className="pcard__badges">
          <span className={`badge ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
        </div>
        <div className="pcard__overlay" />
      </div>

      {/* ── Body ── */}
      <div className="pcard__body">
        <h3 className="pcard__title">{name}</h3>

        <p className="pcard__location">
          <IconMapPin size={14} strokeWidth={2} className="pcard__location-icon" />
          {location}
        </p>

        {/* Specs — supports both Arabic keys (DB seed) and English keys (dashboard) */}
        <div className="pcard__specs">
          {(specs.غرف_النوم !== undefined || specs.bedroom !== undefined) && (
            <span className="pcard__spec">
              <IconBed size={14} strokeWidth={1.75} />
              {Number(specs.غرف_النوم ?? specs.bedroom)} غرف
            </span>
          )}
          {(specs.الحمامات !== undefined || specs.bathroom !== undefined) && (
            <span className="pcard__spec">
              <IconBath size={14} strokeWidth={1.75} />
              {Number(specs.الحمامات ?? specs.bathroom)} حمام
            </span>
          )}
          {specs.المساحة_م2 !== undefined && (
            <span className="pcard__spec">
              <IconSquare size={14} strokeWidth={1.75} />
              {specs.المساحة_م2} م²
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="pcard__footer">
          <div className="pcard__price">
            <span className="pcard__price-amount">{formatPrice(price)}</span>
            <span className="pcard__price-currency">$</span>
            {isForRent && <span className="pcard__price-period">/شهر</span>}
          </div>
          <Link href={`/properties/${id}`} className="pcard__link btn btn-primary">
            التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
