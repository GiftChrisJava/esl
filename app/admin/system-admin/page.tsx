"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  Plus,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const SystemAdminPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const supabase = createClient();
    
    try {
      // Get user stats
      const { data: users } = await supabase
        .from('profiles')
        .select('role')
        .eq('is_active', true);

      // Get order stats
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at, status');

      const totalUsers = users?.filter(u => u.role === 'customer').length || 0;
      const totalAdmins = users?.filter(u => u.role !== 'customer').length || 0;
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      setStats({
        totalUsers,
        totalAdmins,
        totalOrders,
        totalRevenue,
      });

      // Get recent activity (recent orders)
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(recentOrders || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmin = async (email: string, role: string) => {
    const supabase = createClient();
    
    try {
      // This would typically be done through a server action
      // For now, we'll show a message to manually create the admin
      alert(`To create admin: ${email} with role ${role}, please use the Supabase dashboard or contact system administrator.`);
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  if (user?.role !== 'system_admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have system admin privileges</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
        <p className="text-gray-600 mt-2">
          Manage users, admins, and system-wide settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                MK {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => createAdmin('sales@esl.mw', 'sales_admin')}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Sales Admin</p>
              <p className="text-sm text-gray-600">Add new sales administrator</p>
            </div>
          </button>

          <button
            onClick={() => createAdmin('web@esl.mw', 'web_admin')}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Web Admin</p>
              <p className="text-sm text-gray-600">Add content administrator</p>
            </div>
          </button>

          <button
            onClick={() => createAdmin('help@esl.mw', 'helpdesk')}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Helpdesk</p>
              <p className="text-sm text-gray-600">Add support administrator</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    New order: {activity.order_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">
                MK {activity.total_amount?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemAdminPage;