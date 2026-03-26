import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<{name: string, email: string} | null>(null);

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

  return (
    <div className="bg-surface text-on-surface antialiased overflow-x-hidden min-h-screen">
      {/* Side Navigation Shell */}
      <aside className="fixed right-0 top-0 h-full w-64 border-l border-white/10 bg-[#1B3A5C] dark:bg-slate-950 shadow-xl z-50 transition-all duration-300 font-['Almarai','Manrope'] text-right leading-[1.2] flex flex-col py-8 justify-between">
        <div>
          <div className="px-6 mb-8">
            <span className="text-xl font-bold text-white block">عقاري</span>
            <span className="text-xs text-on-primary-container/60 tracking-widest">لوحة التحكم</span>
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                clsx(
                  "flex flex-row-reverse items-center gap-3 px-6 py-3 transition-all duration-300 scale-95-on-click active:opacity-80",
                  isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border-r-4 border-[#C9A84C] font-bold"
                    : "text-slate-300/70 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
              <span>نظرة عامة</span>
            </NavLink>
            <NavLink
              to="/properties"
              className={({ isActive }) =>
                clsx(
                  "flex flex-row-reverse items-center gap-3 px-6 py-3 transition-all duration-300 scale-95-on-click active:opacity-80",
                  isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border-r-4 border-[#C9A84C] font-bold"
                    : "text-slate-300/70 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <span className="material-symbols-outlined" data-icon="domain">domain</span>
              <span>العقارات</span>
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                clsx(
                  "flex flex-row-reverse items-center gap-3 px-6 py-3 transition-all duration-300 scale-95-on-click active:opacity-80",
                  isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border-r-4 border-[#C9A84C] font-bold"
                    : "text-slate-300/70 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <span className="material-symbols-outlined" data-icon="calendar_month">calendar_month</span>
              <span>الحجوزات</span>
            </NavLink>
            <NavLink
              to="/admins"
              className={({ isActive }) =>
                clsx(
                  "flex flex-row-reverse items-center gap-3 px-6 py-3 transition-all duration-300 scale-95-on-click active:opacity-80",
                  isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border-r-4 border-[#C9A84C] font-bold"
                    : "text-slate-300/70 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <span className="material-symbols-outlined" data-icon="group">group</span>
              <span>المشرفون</span>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                clsx(
                  "flex flex-row-reverse items-center gap-3 px-6 py-3 transition-all duration-300 scale-95-on-click active:opacity-80",
                  isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border-r-4 border-[#C9A84C] font-bold"
                    : "text-slate-300/70 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
              <span>الإعدادات</span>
            </NavLink>
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
            <span className="material-symbols-outlined" data-icon="logout">logout</span>
            <span className="text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-64 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 transition-colors duration-200">
        <div className="flex flex-row-reverse justify-between items-center px-8 h-full w-full font-['Almarai','Manrope'] text-right">
          <div>
            <h1 className="text-xl font-extrabold text-[#1B3A5C]">المنسق العقاري</h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <Outlet />
    </div>
  );
}
