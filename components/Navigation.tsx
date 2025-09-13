// "use client";

// import { LogIn, LogOut, Menu, User, UserPlus, X } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";

// const Navigation: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const { user, logout } = useAuth();
//   const router = useRouter();

//   const handleLogout = async () => {
//     await logout();
//     setShowUserMenu(false);
//     router.push("/");
//   };

//   const navigationItems = [
//     { href: "/", label: "Home" },
//     { href: "/about-us", label: "About Us" },
//     { href: "/projects", label: "Projects" },
//     { href: "/partnerships", label: "Partnerships" },
//     { href: "/clients", label: "Clients" },
//   ];

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-lg">E</span>
//             </div>
//             <span className="font-bold text-xl text-gray-900">ESL</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navigationItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="text-gray-700 hover:text-green-600 font-medium transition-colors"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </div>

//           {/* Auth Section */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowUserMenu(!showUserMenu)}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
//                 >
//                   <User className="w-5 h-5" />
//                   <span>
//                     {user.fullName || user.email}
//                   </span>
//                 </button>

//                 {showUserMenu && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//                     <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
//                       {user.email}
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       <span>Sign Out</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <Link
//                   href="/login"
//                   className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
//                 >
//                   <LogIn className="w-5 h-5" />
//                   <span>Sign In</span>
//                 </Link>
//                 <Link
//                   href="/signup"
//                   className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
//                 >
//                   <UserPlus className="w-5 h-5" />
//                   <span>Sign Up</span>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-gray-700 hover:text-green-600 transition-colors"
//             >
//               {isOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden border-t border-gray-200 py-4">
//             <div className="flex flex-col space-y-3">
//               {navigationItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-700 hover:text-green-600 font-medium transition-colors px-2 py-1"
//                 >
//                   {item.label}
//                 </Link>
//               ))}

//               <div className="border-t border-gray-200 pt-3 mt-3">
//                 {user ? (
//                   <div className="space-y-3">
//                     <div className="px-2 py-1 text-sm text-gray-600">
//                       {user.fullName || user.email}
//                       <br />
//                       <span className="text-xs">{user.email}</span>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors px-2 py-1"
//                     >
//                       <LogOut className="w-5 h-5" />
//                       <span>Sign Out</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     <Link
//                       href="/login"
//                       onClick={() => setIsOpen(false)}
//                       className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors px-2 py-1"
//                     >
//                       <LogIn className="w-5 h-5" />
//                       <span>Sign In</span>
//                     </Link>
//                     <Link
//                       href="/signup"
//                       onClick={() => setIsOpen(false)}
//                       className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors w-fit"
//                     >
//                       <UserPlus className="w-5 h-5" />
//                       <span>Sign Up</span>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Click outside to close user menu */}
//       {showUserMenu && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setShowUserMenu(false)}
//         />
//       )}
//     </nav>
//   );
// };

// export default Navigation;
