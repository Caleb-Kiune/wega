"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useToast } from "@/lib/hooks/use-toast"
import { customerAuthApi, Customer, CustomerProfile, AuthResponse } from "@/lib/customer-auth"

interface CustomerAuthContextType {
  customer: Customer | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone?: string
  }) => Promise<boolean>
  logout: () => void
  getProfile: () => Promise<CustomerProfile | null>
  updateProfile: (data: {
    first_name?: string
    last_name?: string
    phone?: string
  }) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  migrateGuestData: (sessionId: string) => Promise<boolean>
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load customer data from localStorage on initial render
  useEffect(() => {
    const loadCustomerData = () => {
      try {
        const storedToken = localStorage.getItem('customer_token')
        const storedCustomer = localStorage.getItem('customer_data')
        
        if (storedToken && storedCustomer) {
          setToken(storedToken)
          setCustomer(JSON.parse(storedCustomer))
        }
      } catch (error) {
        console.error('Failed to load customer data:', error)
        // Clear invalid data
        localStorage.removeItem('customer_token')
        localStorage.removeItem('customer_data')
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomerData()
  }, [])

  const saveCustomerData = (customerData: Customer, authToken: string) => {
    localStorage.setItem('customer_token', authToken)
    localStorage.setItem('customer_data', JSON.stringify(customerData))
    setCustomer(customerData)
    setToken(authToken)
  }

  const clearCustomerData = () => {
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_data')
    setCustomer(null)
    setToken(null)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response: AuthResponse = await customerAuthApi.login({ email, password })
      
      saveCustomerData(response.customer, response.token)
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.customer.first_name}!`,
      })
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone?: string
  }): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response: AuthResponse = await customerAuthApi.register(data)
      
      saveCustomerData(response.customer, response.token)
      
      toast({
        title: "Registration successful",
        description: `Welcome to Wega Kitchenware, ${response.customer.first_name}!`,
      })
      
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearCustomerData()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const getProfile = async (): Promise<CustomerProfile | null> => {
    if (!token) return null
    
    try {
      const response = await customerAuthApi.getProfile(token)
      return response.customer
    } catch (error) {
      console.error('Failed to get profile:', error)
      // If token is invalid, logout
      if (error instanceof Error && error.message.includes('Invalid or expired token')) {
        clearCustomerData()
      }
      return null
    }
  }

  const updateProfile = async (data: {
    first_name?: string
    last_name?: string
    phone?: string
  }): Promise<boolean> => {
    if (!token) return false
    
    try {
      setIsLoading(true)
      const response = await customerAuthApi.updateProfile(token, data)
      
      // Update stored customer data
      if (customer) {
        const updatedCustomer = { ...customer, ...data }
        saveCustomerData(updatedCustomer, token)
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      
      return true
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!token) return false
    
    try {
      setIsLoading(true)
      await customerAuthApi.changePassword(token, {
        current_password: currentPassword,
        new_password: newPassword
      })
      
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      })
      
      return true
    } catch (error) {
      console.error('Failed to change password:', error)
      toast({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Failed to change password.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const migrateGuestData = async (sessionId: string): Promise<boolean> => {
    if (!token) return false
    
    try {
      setIsLoading(true)
      const response = await customerAuthApi.migrateGuestData(token, sessionId)
      
      toast({
        title: "Data migrated",
        description: `${response.migrated_orders} orders have been migrated to your account.`,
      })
      
      return true
    } catch (error) {
      console.error('Failed to migrate guest data:', error)
      toast({
        title: "Migration failed",
        description: error instanceof Error ? error.message : "Failed to migrate guest data.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!customer && !!token,
        isLoading,
        login,
        register,
        logout,
        getProfile,
        updateProfile,
        changePassword,
        migrateGuestData,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext)
  if (context === undefined) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider")
  }
  return context
} 