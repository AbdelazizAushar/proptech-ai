import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const navLinks = [
  { to: '/', icon: 'dashboard', label: 'نظرة عامة', end: true },
  { to: '/properties', icon: 'domain', label: 'العقارات' },
  { to: '/bookings', icon: 'calendar_month', label: 'الحجوزات' },
  { to: '/admins', icon: 'group', label: 'المشرفون' },
  { to: '/settings', icon: 'settings', label: 'الإعدادات' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<{name: string, email: string} | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      navigate('/login');
    } else {
      setAdminData(JSON.parse(auth));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="bg-surface text-on-surface antialiased overflow-x-hidden min-h-screen" dir="rtl">

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={clsx(
          'fixed right-0 top-0 h-full w-64 border-l border-white/10 bg-[#1B3A5C] shadow-xl z-50 transition-transform duration-300 font-[\'Almarai\',\'Manrope\'] text-right leading-[1.2] flex flex-col py-8 justify-between',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div>
          <div className="px-6 mb-8 flex justify-between items-center">
            <button className="lg:hidden text-white/60 hover:text-white" onClick={closeSidebar}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div>
              <span className="text-xl font-bold text-white block">عقاري</span>
              <span className="text-xs text-on-primary-container/60 tracking-widest">لوحة التحكم</span>
            </div>
          </div>
          <nav className="space-y-1">
            {navLinks.map(({ to, icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-row-reverse items-center gap-3 px-6 py-3 transition-all duration-300 active:opacity-80',
                    isActive
                      ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-r-4 border-[#C9A84C] font-bold'
                      : 'text-slate-300/70 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <span className="material-symbols-outlined">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="px-6 mt-auto pt-6 border-t border-white/5">
          <div className="flex flex-row-reverse items-center gap-3 p-3 bg-white/5 rounded-xl mb-4">
            <div className="text-right">
              <p className="text-white text-sm font-bold">{adminData?.name || 'مدير النظام'}</p>
              <p className="text-xs text-slate-400">مدير النظام</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex flex-row-reverse items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-error transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ── Top App Bar ── */}
      <header className="fixed top-0 left-0 right-0 lg:right-64 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 z-30">
        <div className="flex flex-row-reverse justify-between items-center px-4 md:px-8 h-full w-full font-['Almarai','Manrope'] text-right">
          <h1 className="text-lg md:text-xl font-extrabold text-[#1B3A5C]">المنسق العقاري</h1>
          {/* Hamburger – mobile only */}
          <button
            className="lg:hidden p-2 text-[#1B3A5C] hover:bg-slate-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <div className="lg:mr-64">
        <Outlet />
      </div>
    </div>
  );
}
