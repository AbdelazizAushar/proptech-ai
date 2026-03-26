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
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

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
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;

    // Direct insert to admins table
    const { data, error } = await supabase.from('admins').insert([
      { name: newAdmin.name, email: newAdmin.email, password_hash: newAdmin.password }
    ]).select();

    if (error) {
      console.error('Error adding admin:', error);
      alert('حدث خطأ أثناء الإضافة');
    } else {
      if (data && data.length > 0) {
        setAdmins([...admins, data[0]]);
      }
      setShowAddForm(false);
      setNewAdmin({ name: '', email: '', password: '' });
    }
  };


  return (
    <main className="mr-64 pt-28 pb-12 px-8 min-h-screen relative">
      <div className="absolute inset-0 arabesque-pattern pointer-events-none"></div>

      {/* Header Section with CTA */}
      <section className="mb-10 flex justify-between items-end relative z-10 pt-4">
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
            <div className="flex-1">
               <label className="block text-xs font-bold text-slate-500 mb-2">كلمة المرور</label>
               <input 
                 type="password" 
                 value={newAdmin.password}
                 onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
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


      {/* Admins Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 font-almarai">اسم المشرف</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 font-almarai">البريد الإلكتروني</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 font-almarai text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">جاري التحميل...</td></tr>
              ) : admins.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">لا يوجد مشرفون</td></tr>
              ) : (
                admins.map((admin) => (
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
                      <div className="flex justify-center gap-4">
                        <button onClick={() => handleDelete(admin.id)} className="p-2 text-slate-400 hover:text-error transition-colors rounded-lg hover:bg-error/10">
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

    </main>
  );
}
