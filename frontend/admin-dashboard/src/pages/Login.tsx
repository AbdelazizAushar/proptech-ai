import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Real authentication checking both email AND password.
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .single();

    if (adminError || !admin) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        setLoading(false);
        return;
    }
    
    // If successful, save session
    localStorage.setItem('adminAuth', JSON.stringify({ name: admin.name, email: admin.email }));
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="bg-surface font-body antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed" dir="rtl">
      {/* Main Container */}
      <main className="min-h-screen flex flex-col md:flex-row-reverse overflow-hidden">
        
        {/* Left Section: Visual Identity (RTL: Left is the large image) */}
        <section className="relative hidden md:flex w-1/2 lg:w-3/5 bg-primary-container items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              alt="Luxury modern glass architecture at dusk" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3HraA9sTFioXxYKCuQsarQfpeFLatleuEYAtNCCL_lAziueeggMHDEP7B5C3v4a9JFcpDXWM9Bj4UEgiiprvzwSj7J5c81FD8oZJ6tahw_wORzYZpy-Wz72QJIUakYveJ8abkfRl77BBwEtiwQ7SV-zmnHPRIRV7iPpCHIqP6Y__xYfGXABcFRFSsHhkrECK0Mb6bNfVR8w2qK2QmkjykHjudXDIbaDRfETXGSxCeUPLnFGlP1uE2aNH_nwKpdmh3CTDJJTCAk7E"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
            {/* Syrian Geometric Pattern Overlay */}
            <div className="absolute inset-0 syrian-pattern"></div>
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 px-12 max-w-2xl text-white space-y-8">
            <div className="inline-block p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <span className="material-symbols-outlined text-4xl text-secondary-fixed" data-icon="domain">domain</span>
            </div>
            <div className="space-y-4">
              <h1 className="font-headline text-5xl font-extrabold tracking-tight leading-tight">
                المنسق العقاري <br/> <span className="text-secondary-fixed">بوابة الإدارة المركزية</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed font-light">
                إدارة الأصول العقارية والعمليات بنظرة شاملة ودقيقة. التجربة الرقمية الأكثر تطوراً في السوق العقاري.
              </p>
            </div>
            <div className="flex gap-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-secondary-fixed">2.4k+</div>
                <div className="text-sm opacity-60 uppercase tracking-widest">عقار مدار</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-fixed">98%</div>
                <div className="text-sm opacity-60 uppercase tracking-widest">نسبة الإشغال</div>
              </div>
            </div>
          </div>
          {/* Decorative Element */}
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary-fixed/5 rounded-full blur-[100px]"></div>
        </section>

        {/* Right Section: Login Form (RTL: Right is the form) */}
        <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col bg-surface-container-lowest relative">
          
          {/* Mobile Logo Placeholder */}
          <div className="md:hidden p-8 flex justify-center">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl text-primary" data-icon="domain">domain</span>
              <span className="font-headline font-bold text-xl text-primary mt-2">المنسق العقاري</span>
            </div>
          </div>
          
          <div className="flex-grow flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-md space-y-10">
              
              {/* Header */}
              <div className="space-y-2 text-right">
                <h2 className="font-headline text-3xl font-extrabold text-primary leading-tight">
                  تسجيل دخول المشرف
                </h2>
                <p className="text-on-surface-variant font-medium">مرحباً بك مجدداً في نظام الإدارة</p>
              </div>
              
              {/* Form */}
              <form className="space-y-6" onSubmit={handleLogin}>
                {error && <div className="p-3 bg-error-container text-on-error-container rounded-md text-sm text-center">{error}</div>}
                
                {/* Email Input */}
                <div className="relative group">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 pr-1" htmlFor="email">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-4 px-1 focus:ring-0 focus:border-secondary transition-all duration-300 placeholder:text-surface-variant text-primary font-medium" 
                      id="email" 
                      name="email" 
                      placeholder="admin@aqari.sy" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary">
                      <span className="material-symbols-outlined" data-icon="mail">mail</span>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 pr-1" htmlFor="password">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-4 px-1 focus:ring-0 focus:border-secondary transition-all duration-300 placeholder:text-surface-variant text-primary font-medium" 
                      id="password" 
                      name="password" 
                      placeholder="••••••••" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary">
                      <span className="material-symbols-outlined" data-icon="lock">lock</span>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox"/>
                    <span className="text-on-surface-variant group-hover:text-primary transition-colors">تذكرني</span>
                  </label>
                  <a className="text-secondary font-bold hover:underline" href="#">نسيت كلمة المرور؟</a>
                </div>

                {/* Submit Button */}
                <button 
                  className="w-full bg-primary text-white py-5 rounded-lg font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-container transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  {!loading && <span className="material-symbols-outlined text-secondary-fixed" data-icon="arrow_back">arrow_back</span>}
                </button>
              </form>

              {/* Footer Text */}
              <div className="pt-8 border-t border-surface-container flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-error-container/10 rounded-full">
                  <span className="material-symbols-outlined text-error text-sm" data-icon="gpp_maybe">gpp_maybe</span>
                  <span className="text-sm text-on-surface-variant">هذه البوابة مخصصة لمسؤولي النظام فقط</span>
                </div>
                <p className="text-xs text-outline-variant text-center leading-relaxed">
                  بمجرد تسجيل الدخول، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بالمنصة.
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar Accent (The Gold Detail) */}
          <div className="absolute right-0 top-1/4 bottom-1/4 w-[3px] bg-secondary shadow-[0_0_15px_rgba(117,91,0,0.3)]"></div>
        </section>
      </main>

      {/* Help FAB */}
      <button className="fixed bottom-8 left-8 p-4 bg-white shadow-2xl rounded-full text-primary border border-surface-container-high hover:bg-surface transition-transform active:scale-90 z-50 group">
        <span className="material-symbols-outlined text-3xl" data-icon="support_agent">support_agent</span>
        <span className="absolute right-full mr-3 whitespace-nowrap bg-primary text-white px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">الدعم الفني</span>
      </button>
    </div>
  );
}
