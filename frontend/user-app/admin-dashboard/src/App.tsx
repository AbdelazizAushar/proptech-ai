import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admins from './pages/Admins';
import Bookings from './pages/Bookings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحة تسجيل الدخول — عامة */}
        <Route path="/login" element={<Login />} />

        {/* ── المسارات المحمية (تتطلب تسجيل دخول) ── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="admins"   element={<Admins />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
