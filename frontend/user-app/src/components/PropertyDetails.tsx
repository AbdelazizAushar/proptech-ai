import React from 'react';
import './PropertyDetails.css';

// Using mock data matching our database seed
const mockProperty = {
  id: '00000000-0000-0000-0002-000000000001',
  name: 'شقة فاخرة في حي المزة - دمشق',
  location: 'دمشق، المزة، بالقرب من حي الفيلات',
  description: 'نقدم لكم هذه الشقة الاستثنائية في قلب حي المزة الراقي بدمشق. تتميز الشقة بتشطيبات سوبر ديلوكس تجمع بين الفخامة المعاصرة واللمسات الجمالية الفريدة. التصميم الداخلي مفتوح ليسمح بدخول الضوء الطبيعي، مع إطلالات خلابة على المدينة والجبال المحيطة. الموقع استراتيجي بالقرب من كافة الخدمات والمراكز الحيوية، مما يجعلها الخيار المثالي للعائلات التي تبحث عن الرقي والراحة في آن واحد. البناء حديث ومجهز بمصعد متطور ونظام أمني متكامل.',
  price: 250000,
  images: [
    '/luxury_apartment.png', // We will copy the generated image here
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800'
  ],
  specs: {
    غرف_النوم: 3,
    الحمامات: 2,
    المساحة_م2: 185,
    الطابق: 'الثالث',
    النوع: 'شقة سكنية'
  },
  status: 'available'
};

const PropertyDetails = () => {
  return (
    <div className="property-details-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <a href="/">الرئيسية</a> &gt; <a href="/properties">العقارات</a> &gt; <span>{mockProperty.name}</span>
        </div>

        {/* Top Header Section */}
        <div className="property-header">
          <div className="header-text">
            <h1 className="property-title">{mockProperty.name}</h1>
            <p className="property-location">📍 {mockProperty.location}</p>
          </div>
          <div className="header-price">
            <span className="price-label">السعر المطلوب</span>
            <div className="price-value">
              <span className="currency">ل.س</span> 
              <span>{mockProperty.price.toLocaleString()}</span>
            </div>
            {mockProperty.status === 'available' && <span className="status-badge">متاح</span>}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="property-layout">
          
          {/* Main Info (Right Area) */}
          <div className="main-info">
            
            {/* Gallery */}
            <div className="gallery-grid">
              <div className="gallery-main">
                {/* Fallback to unsplash if generated image is missing */}
                <img src={mockProperty.images[0] || mockProperty.images[1]} alt="غرفة المعيشة" />
              </div>
              <div className="gallery-side">
                <img src={mockProperty.images[1]} alt="المطبخ" />
                <img src={mockProperty.images[2]} alt="غرفة النوم" />
              </div>
            </div>

            {/* Specifications Cards */}
            <div className="specs-grid mt-4">
              <div className="spec-card">
                <span className="spec-card-icon">🛏️</span>
                <span className="spec-card-label">الغرف</span>
                <span className="spec-card-value">{mockProperty.specs.غرف_النوم} غرف نوم</span>
              </div>
              <div className="spec-card">
                <span className="spec-card-icon">🛁</span>
                <span className="spec-card-label">الحمامات</span>
                <span className="spec-card-value">{mockProperty.specs.الحمامات} حمام</span>
              </div>
              <div className="spec-card">
                <span className="spec-card-icon">📐</span>
                <span className="spec-card-label">المساحة</span>
                <span className="spec-card-value">{mockProperty.specs.المساحة_م2} م²</span>
              </div>
              <div className="spec-card">
                <span className="spec-card-icon">🏢</span>
                <span className="spec-card-label">الطابق</span>
                <span className="spec-card-value">{mockProperty.specs.الطابق}</span>
              </div>
              <div className="spec-card">
                <span className="spec-card-icon">📍</span>
                <span className="spec-card-label">نوع العقار</span>
                <span className="spec-card-value">{mockProperty.specs.النوع}</span>
              </div>
            </div>

            {/* Description */}
            <div className="description-section mt-4">
              <h2 className="section-title-sm">الوصف والتفاصيل</h2>
              <p className="description-text">{mockProperty.description}</p>
            </div>

            {/* Map Placeholder */}
            <div className="map-section mt-4">
              <h2 className="section-title-sm">الموقع على الخريطة</h2>
              <div className="map-placeholder">
                <div className="map-pin">📍</div>
                <p>خريطة الموقع التقريبية للعقار</p>
              </div>
            </div>

          </div>

          {/* Sidebar (Left Area) */}
          <div className="sidebar-info">
            
            {/* Contact Card */}
            <div className="contact-card">
              <h3 className="contact-title">تواصل معنا</h3>
              <p className="contact-desc">فريقنا جاهز للإجابة على جميع استفساراتك بشكل فوري.</p>
              
              <button className="btn whatsapp-btn w-100">
                <span className="btn-icon">💬</span>
                تواصل عبر واتساب
              </button>
              
              <div className="property-ref">رقم العقار: AQ-1042</div>
              
              <div className="action-buttons">
                <button className="btn btn-outline flex-1">
                  <span className="btn-icon">🔖</span> حفظ
                </button>
                <button className="btn btn-outline flex-1">
                  <span className="btn-icon">🔗</span> مشاركة
                </button>
              </div>
            </div>

            {/* Premium service banner */}
            <div className="premium-banner mt-4">
              <div className="banner-badge">خدمات عقاري المميزة</div>
              <h4 className="banner-title">احصل على استشارة قانونية</h4>
              <p className="banner-desc">نحن نضمن لك سلامة العقود والتوثيق القانوني الكامل.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
