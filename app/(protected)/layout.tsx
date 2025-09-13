"use client";

import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/products");
      return;
    }

    // Check if user's email is verified
    if (user && !user.email_verified) {
      router.push("/products");
      return;
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please sign in
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page
          </p>
          <div className="space-x-4">
            <Link
              href="/products"
              className="inline-flex items-center bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check email verification
  if (!user.email_verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Mail className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verification Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please verify your email address to access this page
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated and verified
  return <>{children}</>;
}