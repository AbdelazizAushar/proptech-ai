'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admins from './pages/Admins';
import Bookings from './pages/Bookings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <Login />;
  }

  const page =
    pathname === '/admins'
      ? <Admins />
      : pathname === '/bookings'
        ? <Bookings />
        : <Dashboard />;

  return (
    <ProtectedRoute>
      <AdminLayout>{page}</AdminLayout>
    </ProtectedRoute>
  );
}

export default App;
