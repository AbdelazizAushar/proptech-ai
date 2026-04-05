'use client';

import React, { useState } from 'react';
import { IconCalendar, IconXCircle } from '@/components/Icons';
import { supabase } from '@/lib/supabase';

interface BookingButtonProps {
  propertyName: string;
  propertyId: string;
}

export default function BookingButton({ propertyName, propertyId }: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('appointments')
        .insert({
          listing_id: propertyId,
          'Full name': name,
          'Phone number': phone,
          appointment_date: date,
          appointment_time: time,
          status: 'pending',
        });

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setName('');
        setPhone('');
        setDate('');
        setTime('');
      }, 3000);

    } catch (err: any) {
      console.error('Booking err:', err);
      alert('حدث خطأ أثناء تقديم الطلب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
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

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '400px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute', top: '15px', right: '15px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#666'
              }}
            >
              <IconXCircle size={24} />
            </button>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              طلب حجز موعد
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              عقار: <strong>{propertyName}</strong>
            </p>

            {success ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'green', fontWeight: 'bold' }}>
                تم تسجيل طلبك بنجاح! سنتواصل معك قريباً.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-body)' }}>الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid var(--border)', fontFamily: 'inherit'
                    }}
                    placeholder="أدخل اسمك الكريم"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-body)' }}>رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid var(--border)', fontFamily: 'inherit',
                      direction: 'ltr', textAlign: 'left'
                    }}
                    placeholder="+963 9XX XXX XXXX"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-body)' }}>تاريخ الموعد</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid var(--border)', fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-body)' }}>الوقت المفضل</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid var(--border)', fontFamily: 'inherit'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: '0.5rem',
                    width: '100%', padding: '0.85rem', borderRadius: '8px',
                    background: loading ? '#ccc' : 'var(--primary)',
                    color: 'white', border: 'none', fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
