"use client";

import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, MapPin, Phone, RefreshCw, User, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

// Malawi districts for the dropdown
const MALAWI_DISTRICTS = [
  'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Chitipa', 'Dedza',
  'Dowa', 'Karonga', 'Kasungu', 'Likoma', 'Lilongwe', 'Machinga',
  'Mangochi', 'Mchinji', 'Mwanza', 'Mzimba', 'Neno', 'Nkhata Bay',
  'Nkhotakota', 'Nsanje', 'Ntcheu', 'Ntchisi', 'Phalombe', 'Rumphi',
  'Salima', 'Thyolo', 'Zomba'
]

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
  onSuccess?: () => void
}

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onVerified: () => void
}

interface FormData {
  email: string
  password: string
  fullName: string
  phoneNumber: string
  district: string
  area: string
  landmarks: string
}

// Email Verification Modal Component
const EmailVerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerified
}) => {
  const { verifyEmail, resendVerificationCode } = useAuth()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [canResend, setCanResend] = useState(true)
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Handle timer for resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Focus first input on mount
  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus()
    }
  }, [isOpen])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newCode.every((digit) => digit !== '') && value) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (verificationCode: string) => {
    setIsVerifying(true)
    setError('')
    setSuccess('')

    try {
      const result = await verifyEmail(email, verificationCode)

      if (result.success) {
        setSuccess(result.message || 'Email verified successfully!')
        setTimeout(() => {
          onVerified()
          onClose()
        }, 1500)
      } else {
        setError(result.error || 'Verification failed')
        // Reset code on error
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      setError('Verification failed. Please try again.')
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || isResending) return

    setIsResending(true)
    setError('')
    setSuccess('')

    try {
      const result = await resendVerificationCode(email)

      if (result.success) {
        setSuccess(result.message || 'New verification code sent!')
        setCanResend(false)
        setResendTimer(60) // 60 second cooldown
      } else {
        setError(result.error || 'Failed to resend code')
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit code to{' '}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Verification Form */}
        <div className="p-6">
          {/* Status Messages */}
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {success}
            </motion.div>
          )}

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center space-x-3" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={cn(
                    "w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg transition-colors",
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : success
                      ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-200",
                    "focus:outline-none focus:ring-2"
                  )}
                  disabled={isVerifying}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Manual Verify Button */}
            {code.every((digit) => digit !== '') && !isVerifying && (
              <button
                onClick={() => handleVerify(code.join(''))}
                className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Verify Email
              </button>
            )}

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={cn(
                  "inline-flex items-center space-x-2 text-sm font-medium transition-colors",
                  canResend && !isResending
                    ? "text-green-600 hover:text-green-700"
                    : "text-gray-400 cursor-not-allowed"
                )}
              >
                <RefreshCw className={cn("w-4 h-4", isResending && "animate-spin")} />
                <span>
                  {isResending
                    ? 'Sending...'
                    : !canResend
                    ? `Resend code in ${resendTimer}s`
                    : 'Resend code'}
                </span>
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Check your spam folder if you don't see the email.
                <br />
                The verification code expires in 10 minutes.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  onModeChange,
  onSuccess 
}) => {
  const { signIn, signUp, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    district: '',
    area: '',
    landmarks: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitError, setSubmitError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    setSubmitError('')
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    // Registration-specific validations
    if (mode === 'register') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required'
      }

      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required'
      } else if (!/^(\+265|0)(99[0-9]|88[0-9]|77[0-9])[0-9]{6}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid Malawi phone number'
      }

      if (!formData.district) {
        newErrors.district = 'Please select your district'
      }

      if (!formData.area.trim()) {
        newErrors.area = 'Area/location is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      let result

      if (mode === 'login') {
        result = await signIn({
          email: formData.email,
          password: formData.password,
        })
      } else {
        result = await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          district: formData.district,
          area: formData.area,
          landmarks: formData.landmarks,
        })
      }

      if (result.success) {
        handleReset()
        
        if (result.needsVerification) {
          // Show verification modal
          setPendingEmail(formData.email)
          setShowVerification(true)
        } else {
          onSuccess?.()
          onClose()
        }
      } else {
        setSubmitError(result.error || 'An error occurred')
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      district: '',
      area: '',
      landmarks: '',
    })
    setErrors({})
    setSubmitError('')
  }

  const handleVerificationSuccess = () => {
    setShowVerification(false)
    setPendingEmail('')
    handleReset()
    onSuccess?.()
    onClose()
  }

  const handleClose = () => {
    handleReset()
    setShowVerification(false)
    setPendingEmail('')
    onClose()
  }

  if (!isOpen) return null

  // Show verification modal if needed
  if (showVerification && pendingEmail) {
    return (
      <EmailVerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        email={pendingEmail}
        onVerified={handleVerificationSuccess}
      />
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose()
          }
        }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {submitError && (
              <motion.div
                className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {submitError}
              </motion.div>
            )}

            {/* Full Name - Register only */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                      errors.fullName ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                    errors.email ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Number - Register only */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="e.g., 0999123456 or +265999123456"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>
            )}

            {/* District - Register only */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none",
                      errors.district ? "border-red-300" : "border-gray-300"
                    )}
                    disabled={isSubmitting}
                  >
                    <option value="">Select your district</option>
                    {MALAWI_DISTRICTS.map(district => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                )}
              </div>
            )}

            {/* Area - Register only */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area/Location
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                    errors.area ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="e.g., Area 47, Sector 3"
                  disabled={isSubmitting}
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                )}
              </div>
            )}

            {/* Landmarks - Register only */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmarks (Optional)
                </label>
                <input
                  type="text"
                  value={formData.landmarks}
                  onChange={(e) => handleInputChange('landmarks', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="e.g., Near Shoprite, opposite mosque"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                    errors.password ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder={mode === 'login' ? "Enter your password" : "Create a strong password"}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              {mode === 'register' && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-green-800 text-white py-3 rounded-xl font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>

            {/* Mode Switch */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                  disabled={isSubmitting}
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal