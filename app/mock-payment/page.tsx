"use client";

import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  Smartphone,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const MockPaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txRef = searchParams.get("tx_ref");
  const amount = searchParams.get("amount");
  const orderId = txRef; // Use the full tx_ref as order ID since it's already in the correct format

  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "failed"
  >("pending");
  const [selectedMethod, setSelectedMethod] = useState<
    "card" | "mobile" | "bank"
  >("mobile");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!txRef || !amount) {
      router.push("/products");
    }
  }, [txRef, amount, router]);

  const handlePayment = async (success: boolean = true) => {
    setIsProcessing(true);
    setPaymentStatus("processing");

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (success) {
      setPaymentStatus("success");

      // Simulate webhook callback to our server
      try {
        await fetch("/api/payment/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Signature": "mock-signature-for-testing",
          },
          body: JSON.stringify({
            status: "successful",
            reference: `ESL-${txRef}`, // Add ESL- prefix as expected by callback
            transaction_id: `mock_tx_${Date.now()}`,
            amount: parseInt(amount || "0"),
            currency: "MWK",
            customer_email: "test@example.com",
            payment_method: selectedMethod,
          }),
        });
      } catch (error) {
        console.error("Error calling webhook:", error);
      }

      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push(`/checkout/success?order=${orderId}`);
      }, 2000);
    } else {
      setPaymentStatus("failed");

      // Simulate failed payment webhook
      try {
        await fetch("/api/payment/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Signature": "mock-signature-for-testing",
          },
          body: JSON.stringify({
            status: "failed",
            reference: `ESL-${txRef}`, // Add ESL- prefix as expected by callback
            transaction_id: `mock_tx_${Date.now()}`,
            amount: parseInt(amount || "0"),
            currency: "MWK",
            customer_email: "test@example.com",
            payment_method: selectedMethod,
            error_message: "Payment declined by user",
          }),
        });
      } catch (error) {
        console.error("Error calling webhook:", error);
      }
    }

    setIsProcessing(false);
  };

  const paymentMethods = [
    {
      id: "mobile" as const,
      name: "Mobile Money",
      description: "Airtel Money, TNM Mpamba",
      icon: Smartphone,
      popular: true,
    },
    {
      id: "card" as const,
      name: "Debit/Credit Card",
      description: "Visa, Mastercard",
      icon: CreditCard,
      popular: false,
    },
    {
      id: "bank" as const,
      name: "Bank Transfer",
      description: "Direct bank transfer",
      icon: Banknote,
      popular: false,
    },
  ];

  if (paymentStatus === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we process your payment...
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Amount: {formatPrice(parseInt(amount || "0"))}
              </p>
              <p className="text-sm text-blue-600">Reference: {txRef}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Redirecting to order confirmation...
            </p>
            <div className="animate-pulse h-2 bg-green-200 rounded-full">
              <div
                className="h-2 bg-green-600 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment could not be processed.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handlePayment(true)}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/checkout/cancel"
                className="block w-full text-center py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              href="/checkout"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Complete Payment
              </h1>
              <p className="text-gray-600">
                Secure payment powered by PayChangu
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Payment Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Payment Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Reference:</span>
                <span className="font-medium">{txRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg">
                  {formatPrice(parseInt(amount || "0"))}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Payment Method
            </h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="sr-only"
                    />
                    <Icon className="w-6 h-6 text-gray-600 mr-3" />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {method.name}
                        </span>
                        {method.popular && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Test Payment Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">
                  Test Environment
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                This is a mock payment page for testing. Choose an outcome
                below:
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handlePayment(true)}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Simulate Successful Payment</span>
              </button>

              <button
                onClick={() => handlePayment(false)}
                disabled={isProcessing}
                className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Simulate Failed Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentPage;
