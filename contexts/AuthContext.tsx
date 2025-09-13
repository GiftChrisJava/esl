"use client";

import { authService, type AuthUser, type SignInData, type SignUpData } from '@/lib/supabase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
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
    
    if (result.success && result.user) {
      const user = await authService.getCurrentUser()
      setUser(user)
    }
    
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
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}