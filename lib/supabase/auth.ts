import { createClient } from './client'
import type { Database } from './types'
import { generateId } from '../utils'

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

export interface VerificationCode {
  email: string
  code: string
  expires_at: string
  attempts: number
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
  private verificationCodes = new Map<string, VerificationCode>()

  // Generate 6-digit verification code
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Store verification code temporarily
  private storeVerificationCode(email: string, code: string) {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    this.verificationCodes.set(email, {
      email,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0
    })
  }

  // Verify code
  private verifyCode(email: string, inputCode: string): { valid: boolean; error?: string } {
    const stored = this.verificationCodes.get(email)
    
    if (!stored) {
      return { valid: false, error: 'No verification code found. Please request a new one.' }
    }

    if (new Date() > new Date(stored.expires_at)) {
      this.verificationCodes.delete(email)
      return { valid: false, error: 'Verification code has expired. Please request a new one.' }
    }

    if (stored.attempts >= 3) {
      this.verificationCodes.delete(email)
      return { valid: false, error: 'Too many attempts. Please request a new verification code.' }
    }

    stored.attempts++

    if (stored.code !== inputCode) {
      return { valid: false, error: 'Invalid verification code. Please try again.' }
    }

    // Code is valid, remove it
    this.verificationCodes.delete(email)
    return { valid: true }
  }

  async signUp(data: SignUpData) {
    try {
      // For customers, create unconfirmed user and send verification code
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation link
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

      // Generate and send verification code
      const verificationCode = this.generateVerificationCode()
      this.storeVerificationCode(data.email, verificationCode)

      // In a real implementation, you would send this via email service
      // For development, we'll log it to console
      console.log(`Verification code for ${data.email}: ${verificationCode}`)
      
      // Simulate email sending
      await this.sendVerificationEmail(data.email, verificationCode)

      return { 
        success: true, 
        user: authData.user,
        needsVerification: true,
        message: 'Please check your email for a 6-digit verification code'
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async verifyEmailCode(email: string, code: string) {
    try {
      const verification = this.verifyCode(email, code)
      
      if (!verification.valid) {
        return { success: false, error: verification.error }
      }

      // Mark user as verified in our system
      const { error: updateError } = await this.supabase
        .from('profiles')
        .update({ email_verified: true })
        .eq('email', email)

      if (updateError) {
        console.error('Profile verification update error:', updateError)
        return { success: false, error: 'Failed to verify email' }
      }

      return { success: true, message: 'Email verified successfully!' }
    } catch (error) {
      console.error('Email verification error:', error)
      return { success: false, error: 'Verification failed' }
    }
  }

  async resendVerificationCode(email: string) {
    try {
      // Check if we can resend (rate limiting)
      const stored = this.verificationCodes.get(email)
      if (stored && new Date() < new Date(stored.expires_at)) {
        const timeLeft = Math.ceil((new Date(stored.expires_at).getTime() - Date.now()) / 1000)
        if (timeLeft > 540) { // More than 9 minutes left
          return { success: false, error: 'Please wait 60 seconds before requesting a new code' }
        }
      }

      const verificationCode = this.generateVerificationCode()
      this.storeVerificationCode(email, verificationCode)

      console.log(`New verification code for ${email}: ${verificationCode}`)
      await this.sendVerificationEmail(email, verificationCode)

      return { success: true, message: 'New verification code sent to your email' }
    } catch (error) {
      console.error('Resend verification error:', error)
      return { success: false, error: 'Failed to resend verification code' }
    }
  }

  private async sendVerificationEmail(email: string, code: string) {
    // In development, just log the code
    // In production, integrate with email service (SendGrid, Mailgun, etc.)
    console.log(`
📧 EMAIL VERIFICATION CODE
To: ${email}
Subject: Your ESL Verification Code

Your 6-digit verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Energy Solutions Limited Team
    `)

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Create admin user (bypasses email verification)
  async createAdminUser(data: SignUpData & { role: UserRole }) {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: undefined, // No email confirmation for admins
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
            district: data.district,
            area: data.area,
            landmarks: data.landmarks,
            role: data.role,
            email_verified: true, // Auto-verify admin emails
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create admin user' }
      }

      // Update profile with admin role and verified status
      const { error: profileError } = await this.supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          district: data.district,
          area: data.area,
          landmarks: data.landmarks,
          role: data.role,
          email_verified: true,
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Admin profile update error:', profileError)
        return { success: false, error: 'Failed to set admin role' }
      }

      return { 
        success: true, 
        user: authData.user,
        message: 'Admin user created successfully'
      }
    } catch (error) {
      console.error('Create admin error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async signIn(data: SignInData) {
    try {
      // Check if user exists and is verified for customers
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('role, email_verified')
        .eq('email', data.email)
        .single()

      const { data: authData, error } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // For customers, check email verification
      if (profile?.role === 'customer' && !profile?.email_verified) {
        return { 
          success: false, 
          error: 'Please verify your email address before signing in. Check your email for the verification code.' 
        }
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