'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Home, 
  ShoppingBag, 
  Package, 
  Settings, 
  LogOut, 
  UserCheck, 
  UserPlus,
  Heart,
  CreditCard,
  Shield,
  Bell,
  ChevronRight,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useCustomerAuth } from '@/contexts/customer-auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

export default function AccountDropdown({ isOpen, onClose, triggerRef }: AccountDropdownProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useCustomerAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {isAuthenticated ? (
          /* Logged In User Menu */
          <div className="py-3">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>



            {/* Navigation Links */}
            <div className="px-2 py-1">
              <div className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Home</span>
                </Link>
                
                <Link
                  href="/products"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Shop</span>
                </Link>
                
                <Link
                  href="/customer/wishlist"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <Heart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Wishlist</span>
                  <Badge variant="secondary" className="ml-auto text-xs">3</Badge>
                </Link>
                
                <Link
                  href="/customer/orders"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <Package className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">My Orders</span>
                  <Badge variant="secondary" className="ml-auto text-xs">2</Badge>
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Account Management */}
            <div className="px-2 py-1">
              <div className="space-y-1">
                <Link
                  href="/customer/profile"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <Settings className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Account Settings</span>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Logout */}
            <div className="px-2 py-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group w-full"
              >
                <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Guest Menu Items */
          <div className="py-3">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm text-gray-600">Welcome to Wega Kitchenware</p>
              <p className="text-xs text-gray-500 mt-1">Sign in to access your account</p>
            </div>

            <div className="px-2 py-2">
              <div className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Home</span>
                </Link>
                
                <Link
                  href="/products"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Shop</span>
                </Link>
                
                <Link
                  href="/track-order"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <Package className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Track Order</span>
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Authentication Links */}
            <div className="px-2 py-2">
              <div className="space-y-2">
                <Link
                  href="/customer/login"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <UserCheck className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Sign In</span>
                </Link>
                
                <Link
                  href="/customer/register"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                  onClick={onClose}
                >
                  <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Create Account</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
