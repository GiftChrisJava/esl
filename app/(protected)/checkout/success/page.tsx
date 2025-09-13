"use client";

import { useAuth } from "@/contexts/AuthContext";
import { COMPANY_INFO } from "@/lib/config";
import { ordersService } from "@/lib/supabase/orders";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Home,
  Mail,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CheckoutSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      const result = await ordersService.getOrderById(orderId);
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        setError("Order not found");
      }
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  const handleDownloadReceipt = () => {
    if (!order) return;

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
${COMPANY_INFO.name}
${COMPANY_INFO.phone}
${COMPANY_INFO.email}
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order.order_number}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Order Confirmed!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Thank you for your order. We&apos;ve received your payment and
              will start processing your order shortly.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold">{order.order_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Date:</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {order.payment_status === "completed" ? "Paid" : "Processing"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Items Ordered
                </h3>
                <div className="space-y-4">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src="/image 1.jpg"
                          alt={item.product_name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × {formatPrice(item.unit_price)}
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
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Delivery Address
                  </h3>
                  <div className="text-gray-700">
                    <p>{order.shipping_address?.fullName}</p>
                    <p>{order.shipping_address?.area}</p>
                    <p>{order.shipping_address?.district}</p>
                    <p>Phone: {order.shipping_address?.phoneNumber}</p>
                    {order.shipping_address?.landmarks && (
                      <p className="text-sm text-gray-600 mt-1">
                        Landmarks: {order.shipping_address.landmarks}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Delivery Timeline
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Order confirmed
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Preparing for shipment (1-2 days)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Estimated delivery in 5-7 days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-8"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                What&apos;s Next?
              </h3>

              <div className="space-y-6">
                {/* Tracking Info */}
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Package className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Track Your Order
                    </h4>
                    <p className="text-sm text-gray-600">
                      Reference: {order.order_number}
                    </p>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <Truck className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Free Delivery
                    </h4>
                    <p className="text-sm text-gray-600">
                      Estimated: 5-7 business days
                    </p>
                  </div>
                </div>

                {/* Support Info */}
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-8 h-8 text-gray-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Need Help?</h4>
                    <p className="text-sm text-gray-600">
                      Call us: {COMPANY_INFO.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-8">
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Receipt</span>
                </button>

                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>View All Orders</span>
                </Link>

                <Link
                  href="/products"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-green-800 text-green-800 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Company Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{COMPANY_INFO.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{COMPANY_INFO.email}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-green-50 border border-green-200 rounded-xl p-8 mt-8 text-center"
        >
          <h3 className="text-lg font-bold text-green-800 mb-2">
            Thank You for Choosing {COMPANY_INFO.shortName}!
          </h3>
          <p className="text-green-700">
            We appreciate your business and trust in our energy solutions. Our
            team will contact you soon to confirm installation details if
            applicable.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;