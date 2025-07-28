'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  MapPin, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: Home,
    description: 'View overview and statistics'
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
    description: 'Manage product catalog'
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: ShoppingCart,
    description: 'View and manage orders'
  },
  {
    href: '/admin/delivery-locations',
    label: 'Delivery',
    icon: MapPin,
    description: 'Manage delivery locations'
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    description: 'Manage user accounts'
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: FileText,
    description: 'View analytics and reports'
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    description: 'Configure system settings'
  }
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCollapsed(false);
        setFocusedIndex(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavItemClick = (href: string) => {
    router.push(href);
  };

  const handleNavItemKeyDown = (event: React.KeyboardEvent, index: number, href: string) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleNavItemClick(href);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((index + 1) % navItems.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(index === 0 ? navItems.length - 1 : index - 1);
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(navItems.length - 1);
        break;
    }
  };

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-white border-r border-slate-200 h-screen overflow-hidden"
      role="navigation"
      aria-label="Admin navigation"
    >
      <div className="flex flex-col h-full">
        {/* Toggle button */}
        <div className="p-4 border-b border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full justify-center"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-2" role="menubar">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isFocused = focusedIndex === index;
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-12',
                    isActive && 'bg-emerald-600 text-white hover:bg-emerald-700',
                    isFocused && !isActive && 'bg-slate-100',
                    isCollapsed && 'justify-center px-2'
                  )}
                  onClick={() => handleNavItemClick(item.href)}
                  onKeyDown={(e) => handleNavItemKeyDown(e, index, item.href)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={isCollapsed ? item.label : `${item.label} - ${item.description}`}
                  tabIndex={0}
                >
                  <item.icon className={cn('h-5 w-5', isCollapsed ? 'mr-0' : 'mr-3')} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </nav>

        {/* Collapsed tooltip */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-md opacity-0 pointer-events-none transition-opacity group-hover:opacity-100">
            Navigation menu
          </div>
        )}
      </div>
    </motion.aside>
  );
} 