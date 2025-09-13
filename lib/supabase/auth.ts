import { createClient } from './client'
import type { Database } from './types'

export type UserRole = Database['public']['Enums']['user_role']

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  phone_number?: string
  district?: string
  area?: string
  landmarks?: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phoneNumber: string
  district: string
  area?: string
  landmarks?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  private supabase = createClient()

  async signUp(data: SignUpData) {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
            district: data.district,
            area: data.area,
            landmarks: data.landmarks,
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user' }
      }

      // Update profile with additional data
      const { error: profileError } = await this.supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          district: data.district,
          area: data.area,
          landmarks: data.landmarks,
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
      }

      return { 
        success: true, 
        user: authData.user,
        needsVerification: !authData.session
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: authData.user, session: authData.session }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) return null

      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) return null

      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || undefined,
        phone_number: profile.phone_number || undefined,
        district: profile.district || undefined,
        area: profile.area || undefined,
        landmarks: profile.landmarks || undefined,
        avatar_url: profile.avatar_url || undefined,
        role: profile.role || 'customer',
        is_active: profile.is_active || false,
        email_verified: profile.email_verified || false,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  async updateProfile(updates: Partial<AuthUser>) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { error } = await this.supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()