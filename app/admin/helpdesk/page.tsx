"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  FileText,
  Mail,
  MessageSquare,
  Package,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const HelpdeskPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalInquiries: 0,
    newContacts: 0,
    newInquiries: 0,
  });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHelpdeskData();
  }, []);

  const loadHelpdeskData = async () => {
    const supabase = createClient();
    
    try {
      // Get contact submissions
      const { data: contacts } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      // Get product inquiries
      const { data: inquiries } = await supabase
        .from('product_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      const totalContacts = contacts?.length || 0;
      const totalInquiries = inquiries?.length || 0;
      const newContacts = contacts?.filter(c => c.status === 'new').length || 0;
      const newInquiries = inquiries?.filter(i => i.status === 'new').length || 0;

      setStats({
        totalContacts,
        totalInquiries,
        newContacts,
        newInquiries,
      });

      setRecentContacts(contacts?.slice(0, 5) || []);
      setRecentInquiries(inquiries?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error loading helpdesk data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyToContact = (contact: any) => {
    const subject = `Re: ${contact.subject}`;
    const body = `Dear ${contact.name},

Thank you for contacting Energy Solutions Limited.

[Your response here]

Best regards,
${user?.full_name}
Energy Solutions Limited
${contact.phone ? `Phone: ${contact.phone}` : ''}
Email: ${contact.email}`;

    window.open(`mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (user?.role !== 'helpdesk' && user?.role !== 'system_admin') {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have helpdesk privileges</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-800 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading helpdesk dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Helpdesk Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage customer communications and support requests
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
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">New Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newContacts}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-600" />
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
              <p className="text-sm text-gray-600">Product Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
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
              <p className="text-sm text-gray-600">New Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newInquiries}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Recent Communications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contact Forms */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Contact Forms</h3>
          <div className="space-y-4">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.subject}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleReplyToContact(contact)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Reply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Product Inquiries */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Product Inquiries</h3>
          <div className="space-y-4">
            {recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{inquiry.name}</p>
                  <p className="text-sm text-gray-600">Product inquiry</p>
                  <p className="text-xs text-gray-500">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const subject = `Re: Product Inquiry`;
                    const body = `Dear ${inquiry.name},

Thank you for your interest in our products.

[Your response here]

Best regards,
${user?.full_name}
Energy Solutions Limited`;
                    window.open(`mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Reply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpdeskPage;