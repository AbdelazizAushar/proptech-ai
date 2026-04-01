import { redirect } from 'next/navigation';

// /admin → redirect to admin dashboard
export default function AdminRedirectPage() {
  redirect(process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:5173');
}
