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

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
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
          <div className="text-center py-12 text-slate-500">جاري التحميل...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-100">لا توجد عقارات حالياً</div>
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
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold font-almarai text-primary">إضافة عقار جديد</h2>
                    <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-error transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
                <div className="p-6 max-h-[75vh] overflow-y-auto">
                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
                        <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-2">عنوان العقار</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm" placeholder="مثال: فيلا الياسمين بالقرب من المركز" type="text"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant mb-2">الموقع/المدينة</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm" placeholder="دمشق، المزة" type="text"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant mb-2">السعر (ل.س)</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm text-left" dir="ltr" placeholder="0" type="number"/>
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant mb-2">عدد الغرف</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm" placeholder="0" type="number"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant mb-2">نوع العقار</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm">
                            <option>سكني</option>
                            <option>تجاري</option>
                            <option>أرض</option>
                            </select>
                        </div>
                        </div>
                        <div className="mt-4">
                        <label className="block text-xs font-bold text-on-surface-variant mb-2">صورة العقار الرئيسية</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all cursor-pointer bg-slate-50">
                            <span className="material-symbols-outlined text-3xl mb-2" data-icon="cloud_upload">cloud_upload</span>
                            <span className="text-xs font-medium">اسحب الصورة هنا أو اضغط للرفع</span>
                        </div>
                        </div>
                        <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold font-almarai text-sm hover:bg-[#003666] transition-colors shadow-lg shadow-primary/20 mt-6" type="submit">
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
