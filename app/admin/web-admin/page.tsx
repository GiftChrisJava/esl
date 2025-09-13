"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const WebAdminPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalProjects: 0,
    totalStaff: 0,
    totalTestimonials: 0,
  });
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    const supabase = createClient();
    
    try {
      // Get content stats
      const [servicesResult, projectsResult, staffResult, testimonialsResult] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true),
        supabase.from('projects').select('*').eq('is_active', true),
        supabase.from('staff_members').select('*').eq('is_active', true),
        supabase.from('testimonials').select('*').eq('is_active', true),
      ]);

      setStats({
        totalServices: servicesResult.data?.length || 0,
        totalProjects: projectsResult.data?.length || 0,
        totalStaff: staffResult.data?.length || 0,
        totalTestimonials: testimonialsResult.data?.length || 0,
      });

      // Get recent content updates
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      setRecentContent(recentProjects || []);
    } catch (error) {
      console.error('Error loading content data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'web_admin' && user?.role !== 'system_admin') {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have web admin privileges</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-800 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading content dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">
          Manage website content, services, projects, and team information
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
              <p className="text-sm text-gray-600">Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
            <Settings className="w-8 h-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
            <Building2 className="w-8 h-8 text-green-600" />
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
              <p className="text-sm text-gray-600">Staff Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStaff}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
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
              <p className="text-sm text-gray-600">Testimonials</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTestimonials}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Plus className="w-6 h-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Service</p>
              <p className="text-sm text-gray-600">Create new service</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Plus className="w-6 h-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Project</p>
              <p className="text-sm text-gray-600">Showcase new project</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Plus className="w-6 h-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Staff</p>
              <p className="text-sm text-gray-600">Add team member</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
            <Plus className="w-6 h-6 text-gray-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Testimonial</p>
              <p className="text-sm text-gray-600">Client feedback</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Content Updates */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Content Updates</h2>
        <div className="space-y-4">
          {recentContent.map((content, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Building2 className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{content.title}</p>
                  <p className="text-sm text-gray-600">
                    Updated {new Date(content.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-600">{content.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebAdminPage;