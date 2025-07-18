"use client"

import { useState, useEffect, ReactNode } from 'react'

interface ClientFormProps {
  onSubmit: (e: React.FormEvent) => void
  children: ReactNode
  className?: string
}

export default function ClientForm({ onSubmit, children, className = "" }: ClientFormProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={className}>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={className} suppressHydrationWarning>
      {children}
    </form>
  )
} 