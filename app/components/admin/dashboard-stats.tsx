'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, MapPin, DollarSign, TrendingUp, AlertTriangle, Check, Star, Zap, Tag, Activity, Users, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
  stats: {
    totalProducts: number;
    inStockProducts: number;
    outOfStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    todaysSales: number;
    totalLocations: number;
    activeLocations: number;
    inactiveLocations: number;
    freeDeliveryLocations: number;
    paidDeliveryLocations: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      description: 'Products in catalog',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'In Stock',
      value: stats.inStockProducts,
      description: 'Available products',
      icon: Check,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockProducts,
      description: 'Unavailable products',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      description: 'All time orders',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      description: 'Awaiting processing',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Processing',
      value: stats.processingOrders,
      description: 'Currently processing',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Shipped',
      value: stats.shippedOrders,
      description: 'In transit',
      icon: Zap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Delivered',
      value: stats.deliveredOrders,
      description: 'Successfully delivered',
      icon: Check,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: "Today's Sales",
      value: `$${stats.todaysSales.toFixed(2)}`,
      description: 'Revenue today',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Locations',
      value: stats.totalLocations,
      description: 'Delivery locations',
      icon: MapPin,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50'
    },
    {
      title: 'Active Locations',
      value: stats.activeLocations,
      description: 'Currently active',
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Free Delivery',
      value: stats.freeDeliveryLocations,
      description: 'Free shipping zones',
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="region"
      aria-label="Dashboard statistics"
    >
      {statCards.map((card, index) => (
        <motion.div key={card.title} variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {card.value}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
} 