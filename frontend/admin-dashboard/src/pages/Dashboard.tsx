import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Listing {
  id: string; // or number based on schema
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

  // Fetch listings on component mount
  const fetchListings = async () => {
    setLoading(true);
    let query = supabase.from('listings').select('*');
    
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching listings:', error);
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) {
        console.error('Error deleting listing:', error);
        alert('حدث خطأ أثناء החذف');
      } else {
        // Optimistic UI update
        setListings(listings.filter(listing => listing.id !== id));
      }
    }
  };

  // Filter listings by search
  const filteredListings = listings.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="mr-64 pt-28 pb-12 px-8 min-h-screen relative">
      <div className="absolute inset-0 arabesque-pattern pointer-events-none"></div>
      
      {/* Search Header Add-on */}
      <div className="mb-8 flex justify-between items-center relative z-10">
        <h1 className="text-2xl font-bold font-['Almarai'] text-primary">لوحة التحكم السريعة</h1>
        <div className="w-1/3">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 relative z-10">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 border-primary transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined" data-icon="apartment">apartment</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold">إجمالي العقارات</span>
          </div>
          <div className="text-3xl font-extrabold text-primary">{listings.length || '٢٤'}</div>
          <div className="mt-2 text-[10px] text-tertiary font-bold">+١٢٪ من الشهر الماضي</div>
        </div>
        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 border-tertiary-container transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-container/10 text-tertiary-container rounded-lg">
              <span className="material-symbols-outlined" data-icon="check_circle">check_circle</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold">المتاحة</span>
          </div>
          <div className="text-3xl font-extrabold text-on-background">١٨</div>
          <div className="mt-2 text-[10px] text-on-surface-variant">محدث منذ ٣ ساعات</div>
        </div>
        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 border-[#755b00] transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#755b00]/10 text-[#755b00] rounded-lg">
              <span className="material-symbols-outlined" data-icon="pending_actions">pending_actions</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold">المحجوزة</span>
          </div>
          <div className="text-3xl font-extrabold text-on-background">٦</div>
          <div className="mt-2 text-[10px] text-on-surface-variant">قيد المعالجة النهائية</div>
        </div>
        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 border-[#C9A84C] transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#C9A84C]/10 text-[#C9A84C] rounded-lg">
              <span className="material-symbols-outlined" data-icon="add_alert">add_alert</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold">طلبات جديدة</span>
          </div>
          <div className="text-3xl font-extrabold text-[#C9A84C]">٣</div>
          <div className="mt-2 text-[10px] text-error font-bold">تتطلب استجابة فورية</div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative z-10">
        
        {/* Recent Properties Table (2/3) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl editorial-shadow overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-primary">العقارات</h2>
            <button onClick={fetchListings} className="text-sm text-secondary font-bold hover:underline">تحديث</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">رقم العقار</th>
                  <th className="px-6 py-4">الاسم</th>
                  <th className="px-6 py-4">الموقع</th>
                  <th className="px-6 py-4">السعر</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8">جاري التحميل...</td></tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">لا توجد عقارات حالياً</td>
                  </tr>
                ) : (
                  filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-primary">#{listing.id.toString().substring(0,6)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 flex-row-reverse justify-end">
                          <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden">
                            <img alt={listing.name} className="w-full h-full object-cover" src={listing.images && listing.images.length > 0 ? listing.images[0] : "https://lh3.googleusercontent.com/aida-public/AB6AXuADTu7VCOOtUI_TGaDWh60bao-TdtT8ZefDTk1s_HKceZT-RwQs_LC-zRNviL2eys67pbgWSOBRXGaYyfe85jVEd2W-R1ZpsenbzpG71RcXwkGwqLW2NnF-xLTxMYwmhopuQU8H_AgjrzX6PkwCfoGgu-cOw-CC9i80G2LnLRdGkyQ_zWT-RNyeRPvApxlhgcKWl4kqWdiLCquInleOyqkl8KVxTB9WFD3L8nRfXPGADS8C3ZNhe1wD_NFiA0bsct3FyziDE1Dsxi9h"}/>
                          </div>
                          <span className="text-sm font-medium">{listing.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{listing.location}</td>
                      <td className="px-6 py-4 text-sm font-bold">{listing.price.toLocaleString('ar-SY')} ل.س</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold rounded-full">{listing.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button className="p-1.5 hover:bg-primary/5 text-primary rounded" title="Edit"><span className="material-symbols-outlined text-sm" data-icon="edit">edit</span></button>
                          <button onClick={() => handleDelete(listing.id)} className="p-1.5 hover:bg-error/5 text-error rounded" title="Delete"><span className="material-symbols-outlined text-sm" data-icon="delete">delete</span></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Property Form (1/3) */}
        <div className="bg-surface-container-lowest rounded-xl editorial-shadow overflow-hidden p-6 border-t-4 border-secondary h-fit">
          <h2 className="text-lg font-bold text-primary mb-6">إضافة عقار جديد</h2>
          {/* UI Only - no strict action submitted here right now as per requirements */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">عنوان العقار</label>
              <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary transition-colors py-2 text-sm" placeholder="مثال: فيلا الياسمين" type="text"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">الموقع/المدينة</label>
                <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary transition-colors py-2 text-sm" placeholder="دمشق" type="text"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">السعر</label>
                <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary transition-colors py-2 text-sm text-left" dir="ltr" placeholder="ل.س" type="text"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">عدد الغرف</label>
                <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary transition-colors py-2 text-sm" placeholder="0" type="number"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">نوع العقار</label>
                <select className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary transition-colors py-2 text-sm pr-0">
                  <option>سكني</option>
                  <option>تجاري</option>
                  <option>أرض</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-xs font-bold text-on-surface-variant mb-3">صورة العقار</label>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-secondary hover:text-secondary transition-all cursor-pointer bg-surface-container-low/30">
                <span className="material-symbols-outlined text-3xl mb-2" data-icon="cloud_upload">cloud_upload</span>
                <span className="text-xs">اسحب الصورة هنا أو اضغط للرفع</span>
              </div>
            </div>
            <button className="w-full bg-primary text-on-primary py-3 rounded-md font-bold text-sm hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 mt-6" type="submit">
                حفظ العقار عبر n8n (لاحقاً)
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section: Recent Bookings */}
      <section className="bg-surface-container-lowest rounded-xl editorial-shadow overflow-hidden relative z-10">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3 flex-row-reverse">
            <span className="material-symbols-outlined text-secondary" data-icon="history">history</span>
            <h2 className="text-lg font-bold text-primary">الحجوزات الأخيرة</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant text-xs font-bold">
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">العقار المحجوز</th>
                <th className="px-6 py-4">تاريخ الحجز</th>
                <th className="px-6 py-4">قيمة العربون</th>
                <th className="px-6 py-4">حالة الدفع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="px-6 py-4 text-sm font-medium">ياسر القحطاني</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">فيلا المزة الحديثة</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">١٠ أكتوبر ٢٠٢٣</td>
                <td className="px-6 py-4 text-sm font-bold">٥,٠٠٠,٠٠٠ ل.س</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 flex-row-reverse justify-end">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
                    <span className="text-xs font-bold text-on-tertiary-container">مكتمل</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium">ليلى العبدالله</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">شقة مشروع دمر</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">١١ أكتوبر ٢٠٢٣</td>
                <td className="px-6 py-4 text-sm font-bold">٢,٥٠٠,٠٠٠ ل.س</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 flex-row-reverse justify-end">
                    <span className="w-2 h-2 rounded-full bg-[#755b00]"></span>
                    <span className="text-xs font-bold text-[#755b00]">قيد الانتظار</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contextual FAB (Only on main dashboard) */}
      <button className="fixed bottom-8 left-8 w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50">
        <span className="material-symbols-outlined" data-icon="add">add</span>
      </button>

    </main>
  );
}
