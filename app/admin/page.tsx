'use client';

import { useAdminDashboard } from '@/hooks/use-admin-dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import DashboardStats from '@/components/admin/dashboard-stats';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function AdminPage() {
  const { loading, error, stats, refetch } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[600px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}. Please try refreshing the page or contact support if the problem persists.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-600">
              Overview of your e-commerce store performance and statistics
            </p>
          </div>

          {/* Statistics Grid */}
          <DashboardStats stats={stats} />
        </motion.div>
      </div>
    </div>
  );
} 