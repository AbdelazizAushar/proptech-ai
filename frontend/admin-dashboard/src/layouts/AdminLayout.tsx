import { Outlet, NavLink } from 'react-router-dom';
import clsx from 'clsx';

export default function AdminLayout() {
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
            <img alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsAk0IZM8b8NQ4XzJ1YwS_k5XyAvVOYcTmYqLCobGH7Tp6Slao4GiJtrDG4b8SOC8hKZT_NpbgpFBglRatA8wDHbIaU57Bg4OoPMT9-n5olPM0ivFpvkEAMhjuRlzXyTfWzXDJNlPjD6fmUeqiq5qVPiiFfMOf2-BVEbM_LLRt4u7Fe36pjKUsYAvKQ5vAyXjp8mGN2ok_KLoQZIE5XgPBBw60AB7EegKXYkJK4H-iu6XcP7dI4lUEbuFEcHeB5W7BQYSR9zQ8Nuja"/>
            <div className="text-right">
              <p className="text-white text-sm font-bold">أحمد العمر</p>
              <p className="text-xs text-slate-400">مدير النظام</p>
            </div>
          </div>
          <button className="flex flex-row-reverse items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-error transition-colors">
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
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span className="material-symbols-outlined text-lg" data-icon="calendar_today">calendar_today</span>
              <span>١٢ أكتوبر ٢٠٢٣</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="hover:bg-slate-50 rounded-full p-2 text-slate-500 relative">
                <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              <img alt="Admin Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO0rLtxDNwP-QQgL6kKd_JpErFzl-USAnMpUyk1jcMD3Y4uPu8v7-tDtYTbcsykxKMFd_qhhXbGgH3rhWWD6CP7n_d_POIaLIBYW6G7BD_WYWtXYyeUlT63D7CTLV7KfK8j-cjZ5D5ry37-wgvGS0RNjidotcc3Lj8yK13s3Fot03_1PhAM2Unq8SAtzneFo1lYNvsZapux0olt6avc134f7W757qBGNQcr_xGP5zNbh2ndZ9GpvZVGEe5gcQVb3A51if7eex2s9Ph"/>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <Outlet />
    </div>
  );
}
