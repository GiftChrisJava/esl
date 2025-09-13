// "use client";

// import {
//   AlertCircle,
//   ArrowRight,
//   CheckCircle,
//   Eye,
//   EyeOff,
//   Lock,
//   Mail,
//   User,
// } from "lucide-react";
// import React, { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import EmailVerification from "./EmailVerification";

// interface AuthFormProps {
//   onClose?: () => void;
//   initialMode?: "login" | "signup";
// }

// const AuthForm: React.FC<AuthFormProps> = ({
//   onClose,
//   initialMode = "login",
// }) => {
//   const [mode, setMode] = useState<"login" | "signup" | "verify">(initialMode);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [pendingEmail, setPendingEmail] = useState("");

//   const { login, register, verifyEmail, resendVerification } = useAuth();

//   // Form validation
//   const validateForm = () => {
//     // Check if required fields exist and are not empty
//     if (!formData.email?.trim() || !formData.password?.trim()) {
//       setError("Please fill in all required fields");
//       return false;
//     }

//     if (mode === "signup") {
//       if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
//         setError("Please provide your full name");
//         return false;
//       }

//       if (!formData.password || formData.password.length < 6) {
//         setError("Password must be at least 6 characters long");
//         return false;
//       }

//       if (formData.password !== formData.confirmPassword) {
//         setError("Passwords do not match");
//         return false;
//       }
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError("Please enter a valid email address");
//       return false;
//     }

//     return true;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError("");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       if (mode === "login") {
//         const email = String(formData.email || "").trim();
//         const password = String(formData.password || "");
//         const result = await login(email, password);

//         if (result.success) {
//           setSuccess("Login successful!");
//           onClose?.();
//         } else {
//           setError(result.message);
//         }
//       } else {
//         // Signup mode
//         const email = String(formData.email || "").trim();
//         const firstName = String(formData.firstName || "").trim();
//         const lastName = String(formData.lastName || "").trim();
//         const password = String(formData.password || "");

//         const result = await register(email, password, firstName, lastName);

//         if (result.success) {
//           if (result.needsVerification) {
//             // Switch to verification mode
//             setPendingEmail(email);
//             setMode("verify");
//             setSuccess(
//               "Account created! Please check your email for a verification code."
//             );
//           } else {
//             // Since we're using link verification for now, just show success message
//             setSuccess(
//               "Account created! Please check your email for a confirmation link."
//             );
//             // Auto-close after showing success message for a moment
//             setTimeout(() => {
//               onClose?.();
//             }, 3000);
//           }
//         } else {
//           setError(result.message);
//         }
//       }
//     } catch {
//       setError("An unexpected error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyEmail = async (email: string, token: string) => {
//     try {
//       const result = await verifyEmail(email, token);

//       if (result.success) {
//         setSuccess("Email verified successfully! Welcome to ESL.");
//         // Close the modal after a brief success message
//         setTimeout(() => {
//           onClose?.();
//         }, 1500);
//         return { success: true, message: "Email verified successfully!" };
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
//     setMode("signup");
//     setPendingEmail("");
//     setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
//   };

//   // Email verification screen
//   if (mode === "verify") {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//         <EmailVerification
//           email={pendingEmail}
//           onVerify={handleVerifyEmail}
//           onResendCode={handleResendCode}
//           onCancel={handleVerificationCancel}
//         />
//       </div>
//     );
//   }

//   // Render login/signup form
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900">
//               {mode === "login" ? "Welcome Back" : "Create Account"}
//             </h2>
//             <p className="text-gray-600 mt-2">
//               {mode === "login"
//                 ? "Sign in to your account"
//                 : "Join us and start your journey"}
//             </p>
//           </div>

//           {/* Status Messages */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
//               <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//               <p className="text-green-700 text-sm">{success}</p>
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name Fields (Signup only) */}
//             {mode === "signup" && (
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     First Name *
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
//                       placeholder="First name"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Name *
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
//                       placeholder="Last name"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address *
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
//                   placeholder="your@email.com"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
//                   placeholder={
//                     mode === "signup" ? "Min. 6 characters" : "Your password"
//                   }
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password Field (Signup only) */}
//             {mode === "signup" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm Password *
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
//                     placeholder="Confirm your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//             >
//               {isLoading ? (
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Toggle Mode */}
//           <div className="mt-8 text-center">
//             <p className="text-gray-600">
//               {mode === "login"
//                 ? "Don't have an account?"
//                 : "Already have an account?"}
//               <button
//                 type="button"
//                 onClick={() => {
//                   setMode(mode === "login" ? "signup" : "login");
//                   setError("");
//                   setSuccess("");
//                   setFormData((prev) => ({
//                     ...prev,
//                     password: "",
//                     confirmPassword: "",
//                   }));
//                 }}
//                 className="ml-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
//               >
//                 {mode === "login" ? "Sign up" : "Sign in"}
//               </button>
//             </p>
//           </div>

//           {/* Close Button (if in modal) */}
//           {onClose && (
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;
