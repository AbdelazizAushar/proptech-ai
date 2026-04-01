import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Listing {
  id: string; // uuid
  name: string;
  location: string;
  price: number;
  status: string;
  images: string[];
}

function CustomSelect({ label, value, options, onChange }: { label: string, value: string, options: { value: string, label: string }[], onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border rounded-lg py-2.5 px-3 text-sm flex justify-between items-center cursor-pointer transition-all duration-200 ${
          isOpen ? 'border-secondary ring-2 ring-secondary/20 bg-white shadow-sm' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className={value ? 'text-primary font-bold' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : 'اختر...'}
        </span>
        <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-2xl z-[70] py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  value === opt.value 
                    ? 'bg-secondary/10 text-primary font-bold border-r-4 border-secondary' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Enhanced Add Property modal state
  const SPECS_LIST = [
    { key: 'bathroom',    icon: 'bathtub',       label: 'حمام' },
    { key: 'bedroom',     icon: 'bed',           label: 'غرفة نوم' },
    { key: 'kitchen',     icon: 'countertops',   label: 'مطبخ' },
    { key: 'living_room', icon: 'weekend',       label: 'صالة معيشة' },
    { key: 'balcony',     icon: 'balcony',       label: 'بلكون' },
    { key: 'garden',      icon: 'yard',          label: 'حديقة' },
    { key: 'pool',        icon: 'pool',          label: 'مسبح' },
    { key: 'parking',     icon: 'garage',        label: 'موقف سيارات' },
    { key: 'maid_room',   icon: 'room_service',  label: 'غرفة خادمة' },
    { key: 'storage',     icon: 'inventory_2',   label: 'غرفة مخزن' },
  ];
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, number>>({});
  const [areaValue, setAreaValue] = useState('');
  const [areaUnit, setAreaUnit] = useState<'م²' | 'قدم²'>('م²');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState('سكني');
  const [propertyStatus, setPropertyStatus] = useState('available');

  const toggleSpec = (key: string) => {
    setSelectedSpecs(prev => {
      const next = { ...prev };
      if (next[key] !== undefined) { delete next[key]; } 
      else { next[key] = 1; }
      return next;
    });
  };
  const changeSpecQty = (key: string, delta: number) => {
    setSelectedSpecs(prev => {
      const val = Math.max(1, (prev[key] ?? 1) + delta);
      return { ...prev, [key]: val };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetModal = () => {
    setSelectedSpecs({});
    setAreaValue('');
    setAreaUnit('م²');
    imagePreviews.forEach(URL.revokeObjectURL);
    setImages([]);
    setImagePreviews([]);
    setPropertyType('سكني');
    setPropertyStatus('available');
    setShowAddModal(false);
  };
  
  const [stats, setStats] = useState({
    totalThisMonth: 0,
    available: 0,
    pendingAppointments: 0,
    totalUsers: 0
  });

  const currentDate = new Intl.DateTimeFormat('ar-EG', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch Listings
    const { data: listingsData } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
    if (listingsData) {
      setListings(listingsData);
    }

    // 2. Fetch Analytics
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    const isoStart = startOfMonth.toISOString();

    const [res1, res2, res3, res4] = await Promise.all([
      supabase.from('listings').select('id').gte('created_at', isoStart),
      supabase.from('listings').select('id').eq('status', 'available'),
      supabase.from('appointments').select('id').eq('status', 'pending'),
      supabase.from('users').select('id')
    ]);

    setStats({
      totalThisMonth: res1.data?.length || 0,
      available: res2.data?.length || 0,
      pendingAppointments: res3.data?.length || 0,
      totalUsers: res4.data?.length || 0
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) {
        console.error('Error deleting listing:', error);
        alert('حدث خطأ أثناء החذف');
      } else {
        setListings(listings.filter(listing => listing.id !== id));
      }
    }
  };

  const filteredListings = listings.filter(l => 
    (l.name && l.name.toLowerCase().includes(search.toLowerCase())) || 
    (l.location && l.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="pt-20 pb-12 px-4 md:px-8 min-h-screen relative">
      <div className="absolute inset-0 arabesque-pattern pointer-events-none"></div>
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4 relative z-10 pt-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-almarai text-primary mb-2">لوحة التحكم السريعة</h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide">{currentDate}</p>
        </div>
        <div className="w-full md:w-1/3">
           <input 
              type="text" 
              placeholder="ابحث بالاسم أو الموقع..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-2 px-4 shadow-sm focus:ring-2 focus:ring-secondary text-sm font-body"
           />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
        {/* Card 1 - Listings this month */}
        <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 border-primary transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined" data-icon="apartment">apartment</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold">إجمالي العقارات</span>
          </div>
          <div className="text-3xl font-extrabold text-primary">{stats.totalThisMonth}</div>
          <div className="mt-2 text-[10px] text-tertiary font-bold">تم إضافتها هذا الشهر</div>
        </div>
        {/* Card 2 - Available Listings */}
        <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 border-tertiary-container transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-container/10 text-tertiary-container rounded-lg">
              <span className="material-symbols-outlined" data-icon="check_circle">check_circle</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold">المتاحة</span>
          </div>
          <div className="text-3xl font-extrabold text-on-background">{stats.available}</div>
          <div className="mt-2 text-[10px] text-on-surface-variant">عقارات جاهزة للبيع/الإيجار</div>
        </div>
        {/* Card 3 - Pending Appointments */}
        <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 border-[#755b00] transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#755b00]/10 text-[#755b00] rounded-lg">
              <span className="material-symbols-outlined" data-icon="pending_actions">pending_actions</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold">المحجوزة</span>
          </div>
          <div className="text-3xl font-extrabold text-on-background">{stats.pendingAppointments}</div>
          <div className="mt-2 text-[10px] text-on-surface-variant">طلبات قيد الانتظار</div>
        </div>
        {/* Card 4 - Total Customers */}
        <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 border-[#C9A84C] transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#C9A84C]/10 text-[#C9A84C] rounded-lg">
              <span className="material-symbols-outlined" data-icon="group">group</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold">إجمالي العملاء</span>
          </div>
          <div className="text-3xl font-extrabold text-[#C9A84C]">{stats.totalUsers}</div>
          <div className="mt-2 text-[10px] text-slate-500 font-bold">المهتمين والمسجلين بالمنصة</div>
        </div>
      </div>

      {/* Listings Grid Cards */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-almarai text-primary">العقارات المدرجة</h2>
          <button onClick={fetchData} className="text-sm text-secondary font-bold hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" data-icon="refresh">refresh</span>
            تحديث البيانات
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between">
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-4 bg-slate-50 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-slate-300">event_busy</span>
            </div>
            <h3 className="text-xl font-bold font-almarai text-primary mb-2">لا توجد سجلات مطابقة</h3>
            <p className="text-slate-500 max-w-sm">لم يتم العثور على أي عقارات مسجلة. يمكنك البدء بإضافة عقار جديد عبر الضغط على الزر أدناه.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col group cursor-pointer">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    alt={listing.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={listing.images && listing.images.length > 0 && listing.images[0].startsWith('http') ? listing.images[0] : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold rounded-full shadow-sm">
                      {listing.status === 'available' ? 'متاح' : listing.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-primary font-almarai text-lg mb-1 line-clamp-1">{listing.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="font-extrabold text-secondary text-lg">{listing.price?.toLocaleString('ar-SY')} <span className="text-xs font-normal">ل.س</span></span>
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button onClick={(e) => handleDelete(listing.id, e)} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-error hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 left-8 w-14 h-14 bg-secondary text-primary rounded-full flex items-center justify-center shadow-xl shadow-[#C9A84C]/30 hover:scale-110 hover:bg-[#d8b556] transition-all z-40"
      >
        <span className="material-symbols-outlined" data-icon="add">add</span>
      </button>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={resetModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">

            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold font-almarai text-primary">إضافة عقار جديد</h2>
              <button onClick={resetModal} className="text-slate-400 hover:text-error transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); resetModal(); }}>

                {/* ── Basic Info ── */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">عنوان العقار</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm" placeholder="مثال: فيلا الياسمين بالقرب من المركز" type="text" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">الموقع/المدينة</label>
                      <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm" placeholder="دمشق، المزة" type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">السعر (ل.س)</label>
                      <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm text-left no-spinner" dir="ltr" placeholder="0" type="number" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <CustomSelect 
                      label="نوع العقار"
                      value={propertyType}
                      onChange={setPropertyType}
                      options={[
                        { value: 'سكني', label: 'سكني' },
                        { value: 'تجاري', label: 'تجاري' },
                        { value: 'أرض', label: 'أرض' }
                      ]}
                    />
                    <CustomSelect 
                      label="الحالة"
                      value={propertyStatus}
                      onChange={setPropertyStatus}
                      options={[
                        { value: 'available', label: 'متاح' },
                        { value: 'rented', label: 'مؤجّر' },
                        { value: 'sold', label: 'مباع' }
                      ]}
                    />
                  </div>
                </div>

                {/* ── Area ── */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5">مساحة العقار</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={areaValue}
                      onChange={e => setAreaValue(e.target.value)}
                      placeholder="0"
                      dir="ltr"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm no-spinner"
                    />
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 text-sm font-bold shrink-0">
                      {(['م²', 'قدم²'] as const).map(unit => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => setAreaUnit(unit)}
                          className={`px-4 py-2 transition-colors ${
                            areaUnit === unit
                              ? 'bg-primary text-white'
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Specs ── */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-3">مواصفات العقار <span className="text-slate-400 font-normal">(اختر ما ينطبق)</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SPECS_LIST.map(({ key, icon, label }) => {
                      const isSelected = selectedSpecs[key] !== undefined;
                      return (
                        <div
                          key={key}
                          className={`rounded-xl border-2 p-2.5 transition-all select-none ${
                            isSelected
                              ? 'border-secondary bg-secondary/5'
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-2" onClick={() => toggleSpec(key)}>
                            <span className={`material-symbols-outlined text-[18px] ${
                              isSelected ? 'text-secondary' : 'text-slate-400'
                            }`}>{icon}</span>
                            <span className={`text-xs font-bold ${
                              isSelected ? 'text-primary' : 'text-slate-500'
                            }`}>{label}</span>
                          </div>
                          {isSelected && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-secondary/20">
                              <button
                                type="button"
                                onClick={() => changeSpecQty(key, -1)}
                                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm hover:bg-primary/20"
                              >−</button>
                              <span className="text-sm font-extrabold text-primary">{selectedSpecs[key]}</span>
                              <button
                                type="button"
                                onClick={() => changeSpecQty(key, +1)}
                                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm hover:bg-primary/20"
                              >+</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Images ── */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2">صور العقار</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {imagePreviews.map((preview, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-error/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                    <label 
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all cursor-pointer bg-slate-50 p-2"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files) {
                          const newFiles = Array.from(e.dataTransfer.files);
                          setImages(prev => [...prev, ...newFiles]);
                          const newPreviews = newFiles.map(file => URL.createObjectURL(file));
                          setImagePreviews(prev => [...prev, ...newPreviews]);
                        }
                      }}
                    >
                      <span className="material-symbols-outlined text-2xl mb-1">add_photo_alternate</span>
                      <span className="text-[10px] font-bold text-center">أضف صور</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                {/* ── Submit ── */}
                <button
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold font-almarai text-sm hover:bg-[#003666] transition-colors shadow-lg shadow-primary/20"
                  type="submit"
                >
                  حفظ مسودة العقار
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
