'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ProtectedRoute — يحمي مسارات الداشبورد.
 * إذا لم يكن المستخدم مسجلاً دخوله (لا يوجد adminAuth في localStorage)
 * يُعيد التوجيه إلى /login تلقائياً.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authed = !!localStorage.getItem('adminAuth');
    setIsAuthenticated(authed);

    if (!authed) {
      router.replace('/login');
    }
  }, [router]);

  if (isAuthenticated !== true) {
    return null;
  }

  return <>{children}</>;
}
