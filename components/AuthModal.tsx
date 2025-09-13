// "use client";

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Eye, EyeOff, User, Mail, Phone, MapPin, Lock, Loader2 } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { MALAWI_DISTRICTS } from '@/lib/types';
// import { cn } from '@/lib/utils';
// import EmailVerification from './EmailVerification';

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mode: 'login' | 'register';
//   onModeChange: (mode: 'login' | 'register') => void;
// }

// interface FormData {
//   email: string;
//   password: string;
//   fullName: string;
//   phoneNumber: string;
//   district: string;
// }

// const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
//   const { login, register, verifyEmail, resendVerification, isLoading } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);
//   const [currentView, setCurrentView] = useState<'auth' | 'verify'>('auth');
//   const [pendingEmail, setPendingEmail] = useState('');
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     password: '',
//     fullName: '',
//     phoneNumber: '',
//     district: '',
//   });
//   const [errors, setErrors] = useState<Partial<FormData>>({});
//   const [submitError, setSubmitError] = useState<string>('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//     setSubmitError('');
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<FormData> = {};

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters long';
//     }

//     // Registration-specific validations
//     if (mode === 'register') {
//       if (!formData.fullName.trim()) {
//         newErrors.fullName = 'Full name is required';
//       }

//       if (!formData.phoneNumber.trim()) {
//         newErrors.phoneNumber = 'Phone number is required';
//       } else if (!/^(\+265|0)(99[0-9]|88[0-9]|77[0-9])[0-9]{6}$/.test(formData.phoneNumber)) {
//         newErrors.phoneNumber = 'Please enter a valid Malawi phone number';
//       }

//       if (!formData.district) {
//         newErrors.district = 'Please select your district';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     setSubmitError('');

//     try {
//       let result;

//       if (mode === 'login') {
//         result = await login(formData.email, formData.password);
//       } else {
//         result = await register({
//           email: formData.email,
//           password: formData.password,
//           fullName: formData.fullName,
//           phoneNumber: formData.phoneNumber,
//           district: formData.district,
//         });
//       }

//       if (result.success) {
//         if ('needsVerification' in result && result.needsVerification) {
//           // Show verification screen
//           setPendingEmail(formData.email);
//           setCurrentView('verify');
//           setSubmitError('');
//         } else {
//           // Login successful or registration without verification needed
//           onClose();
//           handleReset();
//         }
//       } else {
//         setSubmitError(result.message);
//       }
//     } catch (error) {
//       setSubmitError('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       email: '',
//       password: '',
//       fullName: '',
//       phoneNumber: '',
//       district: '',
//     });
//     setErrors({});
//     setSubmitError('');
//     setCurrentView('auth');
//     setPendingEmail('');
//   };

//   const handleClose = () => {
//     handleReset();
//     onClose();
//   };

//   const handleVerifyEmail = async (email: string, token: string) => {
//     try {
//       const result = await verifyEmail(email, token);

//       if (result.success) {
//         // Close modal and reset after successful verification
//         setTimeout(() => {
//           handleClose();
//         }, 1500);
//         return { success: true, message: "Email verified successfully! Welcome to ESL." };
//       } else {
//         return { success: false, message: result.message };
//       }
//     } catch {
//       return {
//         success: false,
//         message: "Verification failed. Please try again.",
//       };
//     }
//   };

//   const handleResendCode = async (email: string) => {
//     try {
//       const result = await resendVerification(email);
//       return {
//         success: result.success,
//         message: result.success ? "Verification code sent!" : result.message,
//       };
//     } catch {
//       return {
//         success: false,
//         message: "Failed to resend verification code. Please try again.",
//       };
//     }
//   };

//   const handleVerificationCancel = () => {
//     setCurrentView('auth');
//     setPendingEmail('');
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={(e) => {
//           if (e.target === e.currentTarget) {
//             handleClose();
//           }
//         }}
//       >
//         <motion.div
//           className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
//           initial={{ scale: 0.9, opacity: 0, y: 20 }}
//           animate={{ scale: 1, opacity: 1, y: 0 }}
//           exit={{ scale: 0.9, opacity: 0, y: 20 }}
//           transition={{ type: "spring", damping: 25, stiffness: 300 }}
//         >
//           {currentView === 'verify' ? (
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold text-gray-700">Verify Email</h2>
//                 <button
//                   onClick={handleClose}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>
//               <EmailVerification
//                 email={pendingEmail}
//                 onVerify={handleVerifyEmail}
//                 onResendCode={handleResendCode}
//                 onCancel={handleVerificationCancel}
//               />
//             </div>
//           ) : (
//             <>
//               {/* Header */}
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h2 className="text-2xl font-bold text-gray-700">
//                   {mode === 'login' ? 'Welcome Back' : 'Create Account'}
//                 </h2>
//                 <button
//                   onClick={handleClose}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-6 space-y-4">
//             {submitError && (
//               <motion.div
//                 className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 {submitError}
//               </motion.div>
//             )}

//             {/* Full Name - Register only */}
//             {mode === 'register' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) => handleInputChange('fullName', e.target.value)}
//                     className={cn(
//                       "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
//                       errors.fullName ? "border-red-300" : "border-gray-300"
//                     )}
//                     placeholder="Enter your full name"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 {errors.fullName && (
//                   <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
//                 )}
//               </div>
//             )}

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   className={cn(
//                     "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
//                     errors.email ? "border-red-300" : "border-gray-300"
//                   )}
//                   placeholder="Enter your email address"
//                   disabled={isSubmitting}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             {/* Phone Number - Register only */}
//             {mode === 'register' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="tel"
//                     value={formData.phoneNumber}
//                     onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
//                     className={cn(
//                       "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
//                       errors.phoneNumber ? "border-red-300" : "border-gray-300"
//                     )}
//                     placeholder="e.g., 0999123456 or +265999123456"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 {errors.phoneNumber && (
//                   <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
//                 )}
//               </div>
//             )}

//             {/* District - Register only */}
//             {mode === 'register' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   District
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <select
//                     value={formData.district}
//                     onChange={(e) => handleInputChange('district', e.target.value)}
//                     className={cn(
//                       "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none",
//                       errors.district ? "border-red-300" : "border-gray-300"
//                     )}
//                     disabled={isSubmitting}
//                   >
//                     <option value="">Select your district</option>
//                     {MALAWI_DISTRICTS.map(district => (
//                       <option key={district} value={district}>
//                         {district}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {errors.district && (
//                   <p className="mt-1 text-sm text-red-600">{errors.district}</p>
//                 )}
//               </div>
//             )}

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={(e) => handleInputChange('password', e.target.value)}
//                   className={cn(
//                     "w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
//                     errors.password ? "border-red-300" : "border-gray-300"
//                   )}
//                   placeholder={mode === 'login' ? "Enter your password" : "Create a strong password"}
//                   disabled={isSubmitting}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5 text-gray-400" />
//                   ) : (
//                     <Eye className="w-5 h-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//               )}
//               {mode === 'register' && (
//                 <p className="mt-1 text-xs text-gray-500">
//                   Password must be at least 8 characters long
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting || isLoading}
//               className="w-full bg-green-800 text-white py-3 rounded-xl font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {isSubmitting || isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin mr-2" />
//                   {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
//                 </>
//               ) : (
//                 mode === 'login' ? 'Sign In' : 'Create Account'
//               )}
//             </button>

//             {/* Mode Switch */}
//             <div className="text-center pt-4 border-t border-gray-200">
//               <p className="text-sm text-gray-600">
//                 {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
//                 <button
//                   type="button"
//                   onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
//                   className="text-green-600 hover:text-green-700 font-semibold transition-colors"
//                   disabled={isSubmitting}
//                 >
//                   {mode === 'login' ? 'Sign Up' : 'Sign In'}
//                 </button>
//               </p>
//             </div>
//           </form>
//             </>
//           )}
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default AuthModal;
