// "use client";

// import { COMPANY_INFO } from "@/lib/config";
// import { motion } from "framer-motion";
// import {
//   ArrowLeft,
//   CreditCard,
//   Mail,
//   MessageCircle,
//   Phone,
//   RefreshCw,
//   ShoppingCart,
//   XCircle,
// } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// const CheckoutCancelPage: React.FC = () => {
//   const commonIssues = [
//     {
//       title: "Payment Declined",
//       description:
//         "Your card may have insufficient funds or security restrictions.",
//       solution: "Try a different payment method or contact your bank.",
//     },
//     {
//       title: "Network Issues",
//       description: "Connection problems during payment processing.",
//       solution: "Check your internet connection and try again.",
//     },
//     {
//       title: "Session Timeout",
//       description: "The payment session may have expired.",
//       solution: "Return to your cart and start the checkout process again.",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="text-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", duration: 0.5 }}
//               className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
//             >
//               <XCircle className="w-8 h-8 text-red-600" />
//             </motion.div>
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="text-3xl font-bold text-gray-900 mb-2"
//             >
//               Payment Cancelled
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="text-gray-600"
//             >
//               Your payment was not completed. Don&apos;t worry, no charges have
//               been made to your account.
//             </motion.p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Main Content */}
//           <div className="space-y-6">
//             {/* What Happened */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="bg-white rounded-xl shadow-sm p-6"
//             >
//               <h2 className="text-xl font-bold text-gray-900 mb-4">
//                 What Happened?
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 The payment process was interrupted or cancelled. This could
//                 happen for various reasons:
//               </p>

//               <div className="space-y-4">
//                 {commonIssues.map((issue, index) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 rounded-lg p-4"
//                   >
//                     <h3 className="font-semibold text-gray-900 mb-2">
//                       {issue.title}
//                     </h3>
//                     <p className="text-sm text-gray-600 mb-2">
//                       {issue.description}
//                     </p>
//                     <p className="text-sm text-blue-600 font-medium">
//                       {issue.solution}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Next Steps */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//               className="bg-white rounded-xl shadow-sm p-6"
//             >
//               <h2 className="text-xl font-bold text-gray-900 mb-4">
//                 What Can You Do Next?
//               </h2>

//               <div className="space-y-4">
//                 <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                     <RefreshCw className="w-5 h-5 text-green-600" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900">
//                       Try Payment Again
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Your items are still in your cart. You can complete the
//                       purchase.
//                     </p>
//                   </div>
//                   <Link
//                     href="/checkout"
//                     className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     Retry
//                   </Link>
//                 </div>

//                 <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                     <ShoppingCart className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900">
//                       Review Your Cart
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Check your items, quantities, and shipping information.
//                     </p>
//                   </div>
//                   <Link
//                     href="/products"
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     View Cart
//                   </Link>
//                 </div>

//                 <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//                     <CreditCard className="w-5 h-5 text-purple-600" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900">
//                       Try Different Payment Method
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Use mobile money, different card, or bank transfer.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Alternative Options */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="bg-blue-50 border border-blue-200 rounded-xl p-6"
//             >
//               <h3 className="text-lg font-bold text-blue-900 mb-3">
//                 Prefer to Order by Phone?
//               </h3>
//               <p className="text-blue-800 mb-4">
//                 You can also place your order directly with our sales team.
//                 We&apos;ll handle the payment and delivery arrangements for you.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <a
//                   href={`tel:${COMPANY_INFO.phone}`}
//                   className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <Phone className="w-4 h-4" />
//                   <span>Call Now</span>
//                 </a>
//                 <a
//                   href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(
//                     /[\s\+\-\(\)]/g,
//                     ""
//                   )}?text=Hi, I need help with placing an order`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   <MessageCircle className="w-4 h-4" />
//                   <span>WhatsApp</span>
//                 </a>
//               </div>
//             </motion.div>
//           </div>

//           {/* Sidebar */}
//           <div>
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.8 }}
//               className="bg-white rounded-xl shadow-sm p-6 sticky top-8"
//             >
//               <h3 className="text-lg font-bold text-gray-900 mb-6">
//                 Need Immediate Help?
//               </h3>

//               <div className="space-y-6">
//                 {/* Contact Support */}
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-3">
//                     Contact Our Support Team
//                   </h4>
//                   <div className="space-y-3">
//                     <a
//                       href={`tel:${COMPANY_INFO.phone}`}
//                       className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <Phone className="w-5 h-5 text-gray-600" />
//                       <div>
//                         <p className="font-medium text-gray-900">Call Us</p>
//                         <p className="text-sm text-gray-600">
//                           {COMPANY_INFO.phone}
//                         </p>
//                       </div>
//                     </a>

//                     <a
//                       href={`mailto:${COMPANY_INFO.email}`}
//                       className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <Mail className="w-5 h-5 text-gray-600" />
//                       <div>
//                         <p className="font-medium text-gray-900">Email Us</p>
//                         <p className="text-sm text-gray-600">
//                           {COMPANY_INFO.email}
//                         </p>
//                       </div>
//                     </a>

//                     <a
//                       href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(
//                         /[\s\+\-\(\)]/g,
//                         ""
//                       )}?text=Hi, I need help with my payment that was cancelled`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <MessageCircle className="w-5 h-5 text-gray-600" />
//                       <div>
//                         <p className="font-medium text-gray-900">WhatsApp</p>
//                         <p className="text-sm text-gray-600">Instant support</p>
//                       </div>
//                     </a>
//                   </div>
//                 </div>

//                 {/* Business Hours */}
//                 <div className="pt-6 border-t border-gray-200">
//                   <h4 className="font-semibold text-gray-900 mb-3">
//                     Business Hours
//                   </h4>
//                   <div className="space-y-1 text-sm text-gray-600">
//                     <div className="flex justify-between">
//                       <span>Mon - Fri:</span>
//                       <span>{COMPANY_INFO.businessHours.monday}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Saturday:</span>
//                       <span>{COMPANY_INFO.businessHours.saturday}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Sunday:</span>
//                       <span>{COMPANY_INFO.businessHours.sunday}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="pt-6 border-t border-gray-200">
//                   <div className="space-y-3">
//                     <Link
//                       href="/checkout"
//                       className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       <RefreshCw className="w-5 h-5" />
//                       <span>Try Again</span>
//                     </Link>

//                     <Link
//                       href="/products"
//                       className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <ArrowLeft className="w-5 h-5" />
//                       <span>Continue Shopping</span>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         {/* Assurance Message */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.9 }}
//           className="bg-gray-100 border border-gray-200 rounded-xl p-6 mt-8 text-center"
//         >
//           <h3 className="text-lg font-bold text-gray-900 mb-2">
//             Your Information is Safe
//           </h3>
//           <p className="text-gray-700">
//             No payment was processed, and your personal information remains
//             secure. All transactions are encrypted and protected by
//             industry-standard security measures.
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutCancelPage;
