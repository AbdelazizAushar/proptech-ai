import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — يحمي مسارات الداشبورد.
 * إذا لم يكن المستخدم مسجلاً دخوله (لا يوجد adminAuth في localStorage)
 * يُعيد التوجيه إلى /login تلقائياً.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem('adminAuth');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
