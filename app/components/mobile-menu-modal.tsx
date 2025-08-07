"use client"

import { useState } from "react"
import { Home, ShoppingBag, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuModalProps {
  children: React.ReactNode
  className?: string
}

const navigation = [
  { name: 'Home', href: '/', icon: Home, color: 'text-green-600', bgColor: 'bg-green-50' },
  { name: 'Shop', href: '/products', icon: ShoppingBag, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { name: 'Track Order', href: '/track-order', icon: Package, color: 'text-orange-600', bgColor: 'bg-orange-50' },
]

export default function MobileMenuModal({ children, className }: MobileMenuModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className={className}>
          {children}
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[350px] md:w-[400px] p-0">
        <SheetHeader className="px-6 py-4 border-b border-slate-200">
          <SheetTitle className="text-xl font-semibold text-slate-900">
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 py-4">
          <div className="px-6">
            {/* Main Navigation */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group active:bg-slate-100"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 ${item.bgColor}`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-white">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">
                WEGA Kitchenware
              </p>
              <p className="text-xs text-slate-400">
                Quality kitchen essentials for your home
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 