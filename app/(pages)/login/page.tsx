// "use client";

// import { useRouter } from "next/navigation";
// import React from "react";
// import AuthForm from "../../../components/AuthForm";
// import { useAuth } from "../../../contexts/AuthContext";

// const LoginPage: React.FC = () => {
//   const router = useRouter();
//   const { user } = useAuth();

//   // Redirect if already logged in
//   React.useEffect(() => {
//     if (user) {
//       router.push("/");
//     }
//   }, [user, router]);

//   const handleAuthSuccess = () => {
//     router.push("/");
//   };

//   if (user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Redirecting...</p>
//         </div>
//       </div>
//     );
//   }

//   return <AuthForm onClose={handleAuthSuccess} initialMode="login" />;
// };

// export default LoginPage;
