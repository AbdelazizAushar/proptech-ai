import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

/* ─── Types ────────────────────────────────────────── */
interface Listing {
  id: string;
  name: string;
  location: string;
  price: number;
  status: string;
  category: string;
  description: string;
  specs: Record<string, number | boolean>;
  images: string[];
  created_at?: string;
}

interface FormData {
  name: string;
  location: string;
  price: string;
  description: string;
  category: string;
  status: string;
  area: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  location: '',
  price: '',
  description: '',
  category: 'سكني',
  status: 'available',
  area: '',
};

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

/* ─── Helpers ───────────────────────────────────────── */
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

async function uploadImage(file: File, listingId: string): Promise<string | null> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const path = `listings/${listingId}/${Date.now()}.${ext}`;

  const { error } = await supabase
    .storage
    .from('property-images')
    .upload(path, file, { cacheControl: '3600', upsert: true });

  if (error) { console.error('[upload]', error.message); return null; }

  const { data } = supabase.storage.from('property-images').getPublicUrl(path);
  return data.publicUrl;
}

/* ─── CustomSelect ──────────────────────────────────── */
function CustomSelect({
  label, value, options, onChange,
}: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <div className="relative">
      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className={`w-full bg-slate-50 border rounded-lg py-2.5 px-3 text-sm flex justify-between items-center cursor-pointer transition-all duration-200 ${
          open ? 'border-secondary ring-2 ring-secondary/20 bg-white shadow-sm' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className={value ? 'text-primary font-bold' : 'text-slate-400'}>
          {selected?.label ?? 'اختر...'}
        </span>
        <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-2xl z-[70] py-1.5 overflow-hidden">
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
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

/* ─── Dashboard ─────────────────────────────────────── */
export default function Dashboard() {
  const [listings, setListings]     = useState<Listing[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);

  // Form fields
  const [form, setForm]             = useState<FormData>(INITIAL_FORM);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, number>>({});
  const [areaUnit, setAreaUnit]     = useState<'م²' | 'قدم²'>('م²');
  const [images, setImages]         = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // for edit mode

  const [stats, setStats] = useState({ totalThisMonth: 0, available: 0, pendingAppointments: 0, totalUsers: 0 });

  const currentDate = new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  /* ── Fetch ── */
  const fetchData = async () => {
    setLoading(true);
    const { data: listingsData } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
    if (listingsData) setListings(listingsData);

    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from('listings').select('id').gte('created_at', startOfMonth.toISOString()),
      supabase.from('listings').select('id').eq('status', 'available'),
      supabase.from('appointments').select('id').eq('status', 'pending'),
      supabase.from('users').select('id'),
    ]);
    setStats({
      totalThisMonth: r1.data?.length ?? 0,
      available: r2.data?.length ?? 0,
      pendingAppointments: r3.data?.length ?? 0,
      totalUsers: r4.data?.length ?? 0,
    });
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  /* ── Modal helpers ── */
  const openAddModal = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setSelectedSpecs({});
    setAreaUnit('م²');
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setSaveError(null);
    setShowModal(true);
  };

  const openEditModal = (listing: Listing) => {
    setEditingId(listing.id);
    setForm({
      name: listing.name ?? '',
      location: listing.location ?? '',
      price: String(listing.price ?? ''),
      description: listing.description ?? '',
      category: listing.category ?? 'سكني',
      status: listing.status ?? 'available',
      area: String(listing.specs?.المساحة_م2 ?? ''),
    });

    // Restore specs
    const restoredSpecs: Record<string, number> = {};
    SPECS_LIST.forEach(({ key }) => {
      const v = listing.specs?.[key];
      if (v !== undefined && v !== false && v !== 0) {
        restoredSpecs[key] = typeof v === 'number' ? v : 1;
      }
    });
    setSelectedSpecs(restoredSpecs);
    setAreaUnit('م²');
    setImages([]);
    setImagePreviews([]);
    setExistingImages(Array.isArray(listing.images) ? listing.images : []);
    setSaveError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    imagePreviews.forEach(URL.revokeObjectURL);
    setImages([]);
    setImagePreviews([]);
    setShowModal(false);
  };

  /* ── Specs ── */
  const toggleSpec = (key: string) => setSelectedSpecs(prev => {
    const next = { ...prev };
    if (next[key] !== undefined) delete next[key]; else next[key] = 1;
    return next;
  });
  const changeSpecQty = (key: string, delta: number) => setSelectedSpecs(prev => ({
    ...prev, [key]: Math.max(1, (prev[key] ?? 1) + delta),
  }));

  /* ── Images ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };
  const removeNewImage = (i: number) => {
    URL.revokeObjectURL(imagePreviews[i]);
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
  };
  const removeExistingImage = (i: number) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));

  /* ── Submit (Add or Edit) ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.price) {
      setSaveError('يرجى تعبئة العنوان والموقع والسعر على الأقل');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const specs: Record<string, number | boolean> = {};
      Object.entries(selectedSpecs).forEach(([k, v]) => { specs[k] = v; });
      if (form.area) specs['المساحة_م2'] = Number(form.area);

      const listingId = editingId ?? crypto.randomUUID();

      // Upload new images → Supabase Storage
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        const results = await Promise.all(images.map(f => uploadImage(f, listingId)));
        uploadedUrls = results.filter(Boolean) as string[];
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      const payload: Partial<Listing> & { updated_at: string } = {
        name: form.name.trim(),
        location: form.location.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        specs,
        images: finalImages,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        // UPDATE existing
        const { error } = await supabase.from('listings').update(payload).eq('id', editingId);
        if (error) throw error;
        setListings(prev => prev.map(l => l.id === editingId ? { ...l, ...payload, id: editingId } : l));
      } else {
        // INSERT new
        const { data, error } = await supabase
          .from('listings')
          .insert([{ ...payload, id: listingId, created_at: new Date().toISOString() }])
          .select()
          .single();
        if (error) throw error;
        if (data) setListings(prev => [data, ...prev]);
      }

      closeModal();
      // Refresh stats
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذا العقار؟')) return;
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) { alert('حدث خطأ أثناء الحذف'); return; }
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const filteredListings = listings.filter(l =>
    (l.name?.toLowerCase().includes(search.toLowerCase())) ||
    (l.location?.toLowerCase().includes(search.toLowerCase()))
  );

  /* ══════════════════════════════════ RENDER ══════════════════════════════════ */
  return (
    <main className="pt-20 pb-12 px-4 md:px-8 min-h-screen relative">
      <div className="absolute inset-0 arabesque-pattern pointer-events-none" />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4 relative z-10 pt-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-almarai text-primary mb-2">لوحة التحكم السريعة</h1>
          <p className="text-slate-500 font-bold text-sm">{currentDate}</p>
        </div>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="ابحث بالاسم أو الموقع..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full py-2 px-4 shadow-sm focus:ring-2 focus:ring-secondary text-sm font-body"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
        {[
          { label: 'إجمالي العقارات', sub: 'تم إضافتها هذا الشهر', val: stats.totalThisMonth, icon: 'apartment', border: 'border-primary', iconBg: 'bg-primary/10 text-primary' },
          { label: 'المتاحة', sub: 'عقارات جاهزة للبيع/الإيجار', val: stats.available, icon: 'check_circle', border: 'border-tertiary-container', iconBg: 'bg-tertiary-container/10 text-tertiary-container' },
          { label: 'المحجوزة', sub: 'طلبات قيد الانتظار', val: stats.pendingAppointments, icon: 'pending_actions', border: 'border-[#755b00]', iconBg: 'bg-[#755b00]/10 text-[#755b00]' },
          { label: 'إجمالي العملاء', sub: 'المهتمين والمسجلين', val: stats.totalUsers, icon: 'group', border: 'border-[#C9A84C]', iconBg: 'bg-[#C9A84C]/10 text-[#C9A84C]' },
        ].map(({ label, sub, val, icon, border, iconBg }) => (
          <div key={label} className={`bg-surface-container-lowest p-6 rounded-xl editorial-shadow border-r-4 ${border} transition-transform hover:-translate-y-1`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${iconBg} rounded-lg`}>
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <span className="text-xs text-on-surface-variant font-bold">{label}</span>
            </div>
            <div className="text-3xl font-extrabold text-primary">{val}</div>
            <div className="mt-2 text-[10px] text-on-surface-variant">{sub}</div>
          </div>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-almarai text-primary">العقارات المدرجة</h2>
          <button onClick={fetchData} className="text-sm text-secondary font-bold hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">refresh</span>
            تحديث البيانات
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between">
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-1/5" />
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
            {filteredListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col group">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    alt={listing.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={listing.images?.[0]?.startsWith('http') ? listing.images[0] : FALLBACK_IMG}
                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold rounded-full shadow-sm">
                      {listing.status === 'available' ? 'متاح' : listing.status === 'sold' ? 'مباع' : 'مؤجّر'}
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
                    <span className="font-extrabold text-secondary text-lg">
                      {listing.price?.toLocaleString('en-US')} <span className="text-xs font-normal">$</span>
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(listing)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-colors"
                        title="تعديل"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={e => handleDelete(listing.id, e)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-error hover:text-white transition-colors"
                        title="حذف"
                      >
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

      {/* FAB */}
      <button
        onClick={openAddModal}
        className="fixed bottom-8 left-8 w-14 h-14 bg-secondary text-primary rounded-full flex items-center justify-center shadow-xl shadow-[#C9A84C]/30 hover:scale-110 hover:bg-[#d8b556] transition-all z-40"
        title="إضافة عقار"
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[95vh] flex flex-col">

            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <h2 className="text-xl font-bold font-almarai text-primary">
                {editingId ? 'تعديل العقار' : 'إضافة عقار جديد'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-error transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <form className="space-y-5" onSubmit={handleSubmit}>

                {saveError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {saveError}
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">عنوان العقار *</label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm"
                      placeholder="مثال: فيلا الياسمين بالقرب من المركز"
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">وصف العقار</label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm resize-none"
                      placeholder="وصف مختصر للعقار..."
                      rows={2}
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">الموقع/المدينة *</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm"
                        placeholder="دمشق، المزة"
                        type="text"
                        value={form.location}
                        onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">السعر ($) *</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm text-left no-spinner"
                        dir="ltr"
                        placeholder="0"
                        type="number"
                        value={form.price}
                        onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <CustomSelect
                      label="نوع / تصنيف العقار"
                      value={form.category}
                      onChange={v => setForm(p => ({ ...p, category: v }))}
                      options={[
                        { value: 'سكني',         label: 'شقة سكنية' },
                        { value: 'شقة للإيجار',  label: 'شقة للإيجار' },
                        { value: 'فيلا',          label: 'فيلا' },
                        { value: 'تجاري',         label: 'تجاري' },
                        { value: 'أرض',           label: 'أرض' },
                      ]}
                    />
                    <CustomSelect
                      label="الحالة"
                      value={form.status}
                      onChange={v => setForm(p => ({ ...p, status: v }))}
                      options={[
                        { value: 'available', label: 'متاح' },
                        { value: 'rented',    label: 'مؤجّر' },
                        { value: 'sold',      label: 'مباع' },
                      ]}
                    />
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5">مساحة العقار</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={form.area}
                      onChange={e => setForm(p => ({ ...p, area: e.target.value }))}
                      placeholder="0"
                      dir="ltr"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all py-2.5 px-3 text-sm no-spinner"
                    />
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 text-sm font-bold shrink-0">
                      {(['م²', 'قدم²'] as const).map(unit => (
                        <button key={unit} type="button" onClick={() => setAreaUnit(unit)}
                          className={`px-4 py-2 transition-colors ${areaUnit === unit ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-3">
                    مواصفات العقار <span className="text-slate-400 font-normal">(اختر ما ينطبق)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SPECS_LIST.map(({ key, icon, label }) => {
                      const isSelected = selectedSpecs[key] !== undefined;
                      return (
                        <div key={key} className={`rounded-xl border-2 p-2.5 transition-all select-none ${isSelected ? 'border-secondary bg-secondary/5' : 'border-slate-200 bg-slate-50 hover:border-slate-300 cursor-pointer'}`}>
                          <div className="flex items-center gap-2" onClick={() => toggleSpec(key)}>
                            <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-secondary' : 'text-slate-400'}`}>{icon}</span>
                            <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-slate-500'}`}>{label}</span>
                          </div>
                          {isSelected && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-secondary/20">
                              <button type="button" onClick={() => changeSpecQty(key, -1)}
                                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm hover:bg-primary/20">−</button>
                              <span className="text-sm font-extrabold text-primary">{selectedSpecs[key]}</span>
                              <button type="button" onClick={() => changeSpecQty(key, +1)}
                                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm hover:bg-primary/20">+</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2">صور العقار</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-2">
                    {/* Existing images (edit mode) */}
                    {existingImages.map((url, i) => (
                      <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={url} alt="existing" className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                        <button type="button" onClick={() => removeExistingImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-error/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                    {/* New previews */}
                    {imagePreviews.map((preview, i) => (
                      <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-secondary/40 group">
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeNewImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-error/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-secondary/80 text-[9px] text-primary font-bold text-center py-0.5">جديدة</div>
                      </div>
                    ))}
                    {/* Upload button */}
                    <label
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all cursor-pointer bg-slate-50 p-2"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        if (e.dataTransfer.files) {
                          const files = Array.from(e.dataTransfer.files);
                          setImages(p => [...p, ...files]);
                          setImagePreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
                        }
                      }}
                    >
                      <span className="material-symbols-outlined text-2xl mb-1">add_photo_alternate</span>
                      <span className="text-[10px] font-bold text-center">أضف صور</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  {images.length > 0 && (
                    <p className="text-[11px] text-secondary font-bold">
                      {images.length} صورة جديدة ستُرفع عند الحفظ
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold font-almarai text-sm hover:bg-[#003666] transition-colors shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center justify-center gap-2"
                  type="submit"
                  disabled={saving}
                >
                  {saving && <span className="material-symbols-outlined text-base animate-spin" style={{ animationDuration: '0.8s' }}>progress_activity</span>}
                  {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة العقار'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
