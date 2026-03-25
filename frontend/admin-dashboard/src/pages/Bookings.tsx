import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Defining types based on the schema and joined data
interface Appointment {
  id: string; // uuid
  appointment_date: string;
  status: string;
  notes?: string;
  users: {
    name: string;
  };
  listings: {
    name: string;
    price: number;
  };
}

export default function Bookings() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    // Fetch all appointments, join users for name, listings for name and price
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        users ( name ),
        listings ( name, price )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data as any || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  // Deposit calculation (Assuming 5% or fixed based on listing price if needed, but we'll try to show it nicely)
  // The design showed fixed string "٥,٠٠٠,٠٠٠ ل.س", let's make it 5% of property price for mockup realism
  const calculateDeposit = (price: number) => {
    if (!price) return 'غير محدد';
    const deposit = price * 0.05;
    return `${deposit.toLocaleString('ar-SY')} ل.س`;
  };

  return (
    <main className="mr-64 pt-28 pb-12 px-8 min-h-screen relative">
      <div className="absolute inset-0 arabesque-pattern pointer-events-none"></div>
      
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold font-almarai text-primary mb-2">إدارة الحجوزات</h1>
          <p className="text-slate-500 max-w-lg text-sm">شاهد وتتبع جميع طلبات الحجز والاستفسارات المقدمة من العملاء.</p>
        </div>
        <button onClick={fetchAppointments} className="bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          تحديث السجل
        </button>
      </div>

      <section className="bg-surface-container-lowest py-2 rounded-xl editorial-shadow overflow-hidden relative z-10">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center mb-2">
          <div className="flex items-center gap-3 flex-row-reverse">
            <span className="p-2 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined" data-icon="history">history</span>
            </span>
            <h2 className="text-xl font-bold font-almarai text-primary">سجل الحجوزات</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold font-almarai uppercase">
                <th className="px-8 py-4">العميل</th>
                <th className="px-8 py-4">العقار المحجوز</th>
                <th className="px-8 py-4">تاريخ الحجز المبدئي</th>
                <th className="px-8 py-4">العربون التقديري</th>
                <th className="px-8 py-4">حالة الحجز</th>
                <th className="px-8 py-4">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">جاري التحميل...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">لا توجد حجوزات حتى الآن</td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {apt.users?.name ? apt.users.name.substring(0, 1) : 'U'}
                        </div>
                        <span className="font-bold text-primary font-almarai text-sm">{apt.users?.name || 'غير معروف'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600 font-medium">{apt.listings?.name || 'عقار محذوف'}</td>
                    <td className="px-8 py-5 text-sm text-slate-500">{formatDate(apt.appointment_date)}</td>
                    <td className="px-8 py-5 text-sm font-extrabold text-slate-700">{calculateDeposit(apt.listings?.price || 0)}</td>
                    <td className="px-8 py-5">
                      {apt.status === 'pending' || apt.status === 'قيد الانتظار' ? (
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-[#755b00]"></span>
                           <span className="text-xs font-bold text-[#755b00]">قيد الانتظار</span>
                        </div>
                      ) : apt.status === 'completed' || apt.status === 'مكتمل' ? (
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
                           <span className="text-xs font-bold text-on-tertiary-container">مكتمل</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                           <span className="text-xs font-bold text-slate-500">{apt.status}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-400 truncate max-w-[150px]">{apt.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
