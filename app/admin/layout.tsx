'use client';

import { Suspense, lazy } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePathname } from 'next/navigation';

// Lazy load admin components for code splitting
const AdminSidebar = lazy(() => import('@/components/admin/admin-sidebar'));
const AdminHeader = lazy(() => import('@/components/admin/admin-header'));

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If we're on the login page, render children directly without authentication check
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // User is authenticated, show admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Suspense fallback={<LoadingSpinner />}>
        <AdminHeader user={user} />
      </Suspense>
      
      <div className="flex">
        <Suspense fallback={<LoadingSpinner />}>
          <AdminSidebar />
        </Suspense>
        
        <main className="flex-1 p-6">
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
} 