'use client';

import React from 'react';
import { IconCalendar } from '@/components/Icons';

interface BookingButtonProps {
  propertyName: string;
}

export default function BookingButton({ propertyName }: BookingButtonProps) {
  const handleBooking = () => {
    // Current state check: Login will be added in future updates
    alert('الحجز متاح للأعضاء المسجلين فقط. سيتم تفعيل ميزة تسجيل الدخول للعملاء في التحديثات القادمة.');
  };

  return (
    <button
      onClick={handleBooking}
      className="btn"
      style={{
        width: '100%',
        backgroundColor: 'var(--surface)',
        color: 'var(--primary)',
        border: '2px solid var(--primary)',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
      }}
      aria-label="حجز العقار"
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--primary)';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface)';
        e.currentTarget.style.color = 'var(--primary)';
      }}
    >
      <IconCalendar size={20} strokeWidth={2} />
      طلب حجز / معاينة
    </button>
  );
}
