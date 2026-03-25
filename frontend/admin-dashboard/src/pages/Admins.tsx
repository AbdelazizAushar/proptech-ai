import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Admin {
  id: string; // uuid
  email: string;
  name: string;
  created_at?: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '' });
  const [search, setSearch] = useState('');

  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('admins').select('*');
    if (error) {
      console.error('Error fetching admins:', error);
    } else {
      setAdmins(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشرف؟')) {
      const { error } = await supabase.from('admins').delete().eq('id', id);
      if (error) {
        console.error('Error deleting admin:', error);
        alert('حدث خطأ أثناء الحذف');
      } else {
        setAdmins(admins.filter(a => a.id !== id));
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) return;

    // Direct insert to admins table assuming RLS allows it or we have service key (mocking for now)
    // Supabase Auth isn't created automatically here just table insert.
    const { data, error } = await supabase.from('admins').insert([
      { name: newAdmin.name, email: newAdmin.email }
    ]).select();

    if (error) {
      console.error('Error adding admin:', error);
      alert('حدث خطأ أثناء الإضافة');
    } else {
      if (data && data.length > 0) {
        setAdmins([...admins, data[0]]);
      }
      setShowAddForm(false);
      setNewAdmin({ name: '', email: '' });
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="mr-64 pt-16 min-h-screen p-8">
      {/* Header Section with CTA */}
      <section className="mb-10 flex justify-between items-end mt-12">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1B3A5C] font-almarai tracking-tight mb-2">إدارة المشرفين</h2>
          <p className="text-slate-500 max-w-lg">قم بإدارة صلاحيات الوصول والتحكم في فريق العمل الخاص بالمنصة العقارية.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#C9A84C] hover:bg-[#b39540] text-primary px-6 py-3 rounded-md flex items-center gap-2 font-bold font-almarai transition-all transform active:scale-95 shadow-lg shadow-[#C9A84C]/20"
        >
          <span className="material-symbols-outlined" data-icon="person_add">person_add</span>
          <span>{showAddForm ? 'إلغاء' : '+ إضافة مشرف جديد'}</span>
        </button>
      </section>

      {/* Add Admin Form (Toggleable) */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-100">
          <h3 className="font-bold text-lg mb-4">إضافة مشرف جديد</h3>
          <form className="flex gap-4 items-end" onSubmit={handleAdd}>
            <div className="flex-1">
               <label className="block text-xs font-bold text-slate-500 mb-2">الاسم</label>
               <input 
                 type="text" 
                 value={newAdmin.name}
                 onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                 className="w-full border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#C9A84C]"
                 required
               />
            </div>
            <div className="flex-1">
               <label className="block text-xs font-bold text-slate-500 mb-2">البريد الإلكتروني</label>
               <input 
                 type="email" 
                 value={newAdmin.email}
                 onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                 className="w-full border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#C9A84C]"
                 required
               />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold h-[42px]">
              حفظ
            </button>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="relative flex items-center max-w-md">
            <span className="material-symbols-outlined absolute right-3 text-slate-400" data-icon="search">search</span>
            <input 
              className="w-full bg-white border border-slate-200 rounded-full py-2 pr-10 pl-4 focus:ring-2 focus:ring-[#C9A84C]/50 text-sm transition-all" 
              placeholder="البحث عن مشرفين..." 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* Bento Style Stats (Optional for Premium Feel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100/50">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-primary rounded-lg">
              <span className="material-symbols-outlined" data-icon="group">group</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-1">إجمالي المشرفين</p>
          <h4 className="text-2xl font-bold text-primary font-almarai">{admins.length} مشرفاً</h4>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100/50">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-secondary rounded-lg">
              <span className="material-symbols-outlined" data-icon="shield_person">shield_person</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-1">مدراء النظام</p>
          <h4 className="text-2xl font-bold text-primary font-almarai">{admins.length} مسؤولين</h4>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100/50">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
              <span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-1">النشطون حالياً</p>
          <h4 className="text-2xl font-bold text-primary font-almarai">{admins.length} متصل</h4>
        </div>
      </div>

      {/* Admins Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 font-almarai">اسم المشرف</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 font-almarai">البريد الإلكتروني</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 font-almarai">الدور</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 font-almarai text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">جاري التحميل...</td></tr>
              ) : filteredAdmins.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">لا يوجد مشرفون</td></tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary font-bold">
                          {admin.name ? admin.name.substring(0,2) : 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-primary font-almarai">{admin.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-600 text-sm">{admin.email}</td>
                    <td className="px-8 py-5">
                      <span className="bg-[#1B3A5C]/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-almarai">مدير نظام</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-[#C9A84C] transition-colors rounded-lg hover:bg-slate-100">
                          <span className="material-symbols-outlined" data-icon="edit">edit</span>
                        </button>
                        <button onClick={() => handleDelete(admin.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <span className="material-symbols-outlined" data-icon="delete">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Context Card */}
      <div className="mt-12 p-8 bg-primary-container rounded-2xl relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h3 className="text-2xl font-bold font-almarai mb-3">دليل صلاحيات الأدوار</h3>
            <p className="text-white/70 max-w-md leading-relaxed">تعرف على الفرق بين صلاحيات "مدير النظام" و "المحرر" لضمان توزيع المهام بكفاءة وأمان داخل فريقك الرقمي.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/20 transition-all font-bold font-almarai">تحميل تقرير النشاط</button>
            <button className="bg-[#C9A84C] text-primary px-6 py-3 rounded-lg font-bold font-almarai shadow-lg shadow-black/20 hover:scale-105 transition-all">مراجعة الصلاحيات</button>
          </div>
        </div>
      </div>

    </main>
  );
}
