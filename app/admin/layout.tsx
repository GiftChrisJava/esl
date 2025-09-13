"use client";

import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  FileText,
  LogOut,
  Package,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const adminRoutes = {
  'system_admin': [
    { href: '/admin/system-admin', label: 'System Admin', icon: Shield },
    { href: '/admin/sales-admin', label: 'Sales Admin', icon: BarChart3 },
    { href: '/admin/web-admin', label: 'Web Admin', icon: FileText },
    { href: '/admin/helpdesk', label: 'Helpdesk', icon: Users },
  ],
  'sales_admin': [
    { href: '/admin/sales-admin', label: 'Sales Dashboard', icon: BarChart3 },
    { href: '/admin/sales-admin/products', label: 'Products', icon: Package },
    { href: '/admin/sales-admin/orders', label: 'Orders', icon: FileText },
    { href: '/admin/sales-admin/customers', label: 'Customers', icon: Users },
  ],
  'web_admin': [
    { href: '/admin/web-admin', label: 'Content Dashboard', icon: FileText },
    { href: '/admin/web-admin/services', label: 'Services', icon: Settings },
    { href: '/admin/web-admin/projects', label: 'Projects', icon: Building2 },
    { href: '/admin/web-admin/staff', label: 'Staff', icon: Users },
  ],
  'helpdesk': [
    { href: '/admin/helpdesk', label: 'Helpdesk Dashboard', icon: Users },
    { href: '/admin/helpdesk/contacts', label: 'Contact Forms', icon: FileText },
    { href: '/admin/helpdesk/inquiries', label: 'Product Inquiries', icon: Package },
  ],
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role === 'customer')) {
      router.push('/');
      return;
    }

    // Redirect to appropriate admin dashboard based on role
    if (user && pathname === '/admin') {
      router.push(`/admin/${user.role.replace('_', '-')}`);
    }
  }, [user, isLoading, router, pathname]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role === 'customer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel
          </p>
          <Link
            href="/"
            className="inline-flex items-center bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const userRoutes = adminRoutes[user.role as keyof typeof adminRoutes] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-800 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-600 capitalize">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className="px-4 pb-4">
          <div className="space-y-2">
            {userRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;
              
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-800 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{route.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}