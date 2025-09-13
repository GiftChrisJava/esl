"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ordersService } from "@/lib/supabase/orders";
import { cn, formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  Filter,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  ShoppingBag,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">("overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.email_verified) {
      loadUserData();
    } else if (user && !user.email_verified) {
      // Redirect unverified users
      router.push("/products");
    }
  }, [user, router]);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items?.some((item: any) =>
            item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const loadUserData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [ordersResult, statsResult] = await Promise.all([
        ordersService.getUserOrders(user.id),
        ordersService.getOrderStats(user.id)
      ]);

      if (ordersResult.success) {
        setOrders(ordersResult.data);
        setFilteredOrders(ordersResult.data);
      }

      if (statsResult.success) {
        setOrderStats({
          totalOrders: statsResult.data.totalOrders,
          totalSpent: statsResult.data.totalRevenue,
          completedOrders: statsResult.data.completedOrders,
          pendingOrders: statsResult.data.pendingOrders,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/products");
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleDownloadReceipt = (order: any) => {
    const receiptContent = `
ENERGY SOLUTIONS LIMITED
Receipt for Order #${order.order_number}

Order Date: ${new Date(order.created_at).toLocaleDateString()}
Customer: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone}

ITEMS:
${order.items?.map((item: any) => 
  `${item.product_name} x${item.quantity} - ${formatPrice(item.total_price)}`
).join('\n')}

TOTAL: ${formatPrice(order.total_amount)}

Thank you for your business!
Energy Solutions Limited
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order.order_number}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "processing":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "cancelled":
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {user?.full_name}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user?.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "overview", label: "Overview", icon: TrendingUp },
                    { id: "orders", label: "Order History", icon: Package },
                    { id: "profile", label: "Profile", icon: User },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          setActiveTab(item.id as "overview" | "orders" | "profile")
                        }
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                          activeTab === item.id
                            ? "bg-green-800 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {orderStats.totalOrders}
                          </p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Spent</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(orderStats.totalSpent)}
                          </p>
                        </div>
                        <CreditCard className="w-8 h-8 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Completed</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {orderStats.completedOrders}
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Pending</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {orderStats.pendingOrders}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">
                        Recent Orders
                      </h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        View all orders →
                      </button>
                    </div>

                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {order.order_number}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(order.total_amount)}
                            </p>
                            <p
                              className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                getStatusColor(order.status)
                              )}
                            >
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {orders.length === 0 && (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">No orders yet</p>
                          <Link
                            href="/products"
                            className="inline-flex items-center bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Start Shopping
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  {/* Search and Filter */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="delivered">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <h3 className="font-semibold text-gray-900">
                                {order.order_number}
                              </h3>
                            </div>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                getStatusColor(order.status)
                              )}
                            >
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-gray-900">
                              {formatPrice(order.total_amount)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadReceipt(order)}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span>{order.items?.length || 0} item(s)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{order.shipping_address?.district}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {order.items?.slice(0, 3).map((item: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1"
                            >
                              <span className="text-sm text-gray-700">
                                {item.product_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                          {(order.items?.length || 0) > 3 && (
                            <div className="flex items-center px-3 py-1 bg-gray-100 rounded-lg">
                              <span className="text-sm text-gray-600">
                                +{(order.items?.length || 0) - 3} more
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {filteredOrders.length === 0 && (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No orders found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "Start shopping to see your orders here"}
                        </p>
                        <Link
                          href="/products"
                          className="inline-flex items-center bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Browse Products
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Profile Information
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={user?.full_name || ""}
                            readOnly
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={user?.email || ""}
                            readOnly
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={user?.phone_number || ""}
                            readOnly
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          District
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={user?.district || ""}
                            readOnly
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Account Status
                          </h4>
                          <p className="text-sm text-gray-600">
                            Member since {new Date(user?.created_at || "").toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Order Details {selectedOrder.order_number}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Order Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          getStatusColor(selectedOrder.status)
                        )}
                      >
                        {selectedOrder.status?.charAt(0).toUpperCase() +
                          selectedOrder.status?.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          getStatusColor(selectedOrder.payment_status)
                        )}
                      >
                        {selectedOrder.payment_status?.charAt(0).toUpperCase() +
                          selectedOrder.payment_status?.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold">
                        {formatPrice(selectedOrder.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <h4 className="font-semibold text-gray-900 mt-6 mb-4">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-gray-700">
                    <p>{selectedOrder.shipping_address?.fullName}</p>
                    <p>{selectedOrder.shipping_address?.area}</p>
                    <p>{selectedOrder.shipping_address?.district}</p>
                    <p>Phone: {selectedOrder.shipping_address?.phoneNumber}</p>
                    {selectedOrder.shipping_address?.landmarks && (
                      <p>Landmarks: {selectedOrder.shipping_address.landmarks}</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Items Ordered
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src="/image 1.jpg"
                            alt={item.product_name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {item.product_name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.unit_price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.total_price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleDownloadReceipt(selectedOrder)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Receipt</span>
                </button>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;