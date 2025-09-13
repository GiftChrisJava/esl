"use client";

import { authService, type AuthUser, type SignInData, type SignUpData } from '@/lib/supabase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>
  createAdminUser: (data: SignUpData & { role: UserRole }) => Promise<{ success: boolean; error?: string; message?: string }>
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string; message?: string }>
  resendVerificationCode: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }

    getInitialUser()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (data: SignUpData) => {
    setIsLoading(true)
    const result = await authService.signUp(data)
    
    // Don't auto-login for customers who need verification
    if (result.success && result.user && !result.needsVerification) {
      const user = await authService.getCurrentUser()
      setUser(user)
    }
    
    setIsLoading(false)
    return result
  }

  const createAdminUser = async (data: SignUpData & { role: UserRole }) => {
    setIsLoading(true)
    const result = await authService.createAdminUser(data)
    setIsLoading(false)
    return result
  }

  const signIn = async (data: SignInData) => {
    setIsLoading(true)
    const result = await authService.signIn(data)
    
    if (result.success) {
      const user = await authService.getCurrentUser()
      setUser(user)
    }
    
    setIsLoading(false)
    return result
  }

  const signOut = async () => {
    setIsLoading(true)
    const result = await authService.signOut()
    
    if (result.success) {
      setUser(null)
    }
    
    setIsLoading(false)
    return result
  }

  const verifyEmail = async (email: string, code: string) => {
    return await authService.verifyEmailCode(email, code)
  }

  const resendVerificationCode = async (email: string) => {
    return await authService.resendVerificationCode(email)
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    const result = await authService.updateProfile(updates)
    
    if (result.success && user) {
      setUser({ ...user, ...updates })
    }
    
    return result
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    createAdminUser,
    signIn,
    signOut,
    verifyEmail,
    resendVerificationCode,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}