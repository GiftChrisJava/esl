// "use client";

// import { useAuth } from "@/contexts/AuthContext";
// import { User } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     // Don't redirect while auth is still loading
//     if (isLoading) {
//       return;
//     }

//     if (!isAuthenticated) {
//       router.push("/login");
//       return;
//     }
//   }, [isAuthenticated, isLoading, router]);

//   // Show loading state while auth is initializing
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-800 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show sign-in prompt if not authenticated
//   if (!user || !isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Please sign in
//           </h2>
//           <p className="text-gray-600 mb-6">
//             You need to be signed in to access this page
//           </p>
//           <div className="space-x-4">
//             <Link
//               href="/login"
//               className="inline-flex items-center bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Sign In
//             </Link>
//             <Link
//               href="/products"
//               className="inline-flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
//             >
//               Go to Products
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render protected content if authenticated
//   return <>{children}</>;
// }
