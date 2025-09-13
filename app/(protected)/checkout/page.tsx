"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { COMPANY_INFO } from "@/lib/config";
import { ordersService } from "@/lib/supabase/orders";
import { cn, formatPrice } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Malawi districts
const MALAWI_DISTRICTS = [
  'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Chitipa', 'Dedza',
  'Dowa', 'Karonga', 'Kasungu', 'Likoma', 'Lilongwe', 'Machinga',
  'Mangochi', 'Mchinji', 'Mwanza', 'Mzimba', 'Neno', 'Nkhata Bay',
  'Nkhotakota', 'Nsanje', 'Ntcheu', 'Ntchisi', 'Phalombe', 'Rumphi',
  'Salima', 'Thyolo', 'Zomba'
];

interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  district: string;
  area: string;
  landmarks: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.full_name || "",
    phoneNumber: user?.phone_number || "",
    district: user?.district || "",
    area: user?.area || "",
    landmarks: user?.landmarks || "",
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Partial<ShippingAddress>>({});

  useEffect(() => {
    if (!user?.email_verified) {
      router.push("/products");
      return;
    }
    
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items.length, router, user?.email_verified]);

  useEffect(() => {
    if (user) {
      setShippingAddress({
        fullName: user.full_name || "",
        phoneNumber: user.phone_number || "",
        district: user.district || "",
        area: user.area || "",
        landmarks: user.landmarks || "",
      });
    }
  }, [user]);

  const validateShippingAddress = (): boolean => {
    const errors: Partial<ShippingAddress> = {};

    if (!shippingAddress.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!shippingAddress.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (
      !/^(\+265|0)(99[0-9]|88[0-9]|77[0-9])[0-9]{6}$/.test(
        shippingAddress.phoneNumber
      )
    ) {
      errors.phoneNumber = "Please enter a valid Malawi phone number";
    }

    if (!shippingAddress.district) {
      errors.district = "District is required";
    }

    if (!shippingAddress.area.trim()) {
      errors.area = "Area/location is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setError("");
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateShippingAddress()) {
      return;
    }
    setCurrentStep((prev) => Math.min(3, prev + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setError("Please sign in to place an order");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create order data
      const orderData = {
        customer_email: user.email,
        customer_name: shippingAddress.fullName,
        customer_phone: shippingAddress.phoneNumber,
        shipping_address: shippingAddress,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.product.price
        })),
        subtotal: totalAmount,
        tax_amount: 0,
        shipping_cost: 0,
        total_amount: totalAmount,
      };

      const result = await ordersService.createOrder(user.id, orderData);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to create order");
      }

      // Clear cart after successful order creation
      await clearCart();

      // Redirect to success page
      router.push(`/checkout/success?order=${result.data.id}`);
    } catch (error) {
      console.error("Order placement error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Shipping", icon: MapPin },
    { number: 2, title: "Review", icon: ShoppingCart },
    { number: 3, title: "Payment", icon: CreditCard },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">
                Complete your purchase securely
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;

                  return (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                          isActive && "bg-green-800 text-white",
                          isCompleted && "bg-green-600 text-white",
                          !isActive &&
                            !isCompleted &&
                            "bg-gray-200 text-gray-600"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div className="flex-1 mx-4 h-px bg-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                {/* Step 1: Shipping Address */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <MapPin className="w-6 h-6 mr-2 text-green-600" />
                      Shipping Address
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={shippingAddress.fullName}
                            onChange={(e) =>
                              handleAddressChange("fullName", e.target.value)
                            }
                            className={cn(
                              "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                              validationErrors.fullName
                                ? "border-red-300"
                                : "border-gray-300"
                            )}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {validationErrors.fullName && (
                          <p className="mt-1 text-sm text-red-600">
                            {validationErrors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={shippingAddress.phoneNumber}
                            onChange={(e) =>
                              handleAddressChange("phoneNumber", e.target.value)
                            }
                            className={cn(
                              "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                              validationErrors.phoneNumber
                                ? "border-red-300"
                                : "border-gray-300"
                            )}
                            placeholder="e.g., 0999123456"
                          />
                        </div>
                        {validationErrors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {validationErrors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          District *
                        </label>
                        <select
                          value={shippingAddress.district}
                          onChange={(e) =>
                            handleAddressChange("district", e.target.value)
                          }
                          className={cn(
                            "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none",
                            validationErrors.district
                              ? "border-red-300"
                              : "border-gray-300"
                          )}
                        >
                          <option value="">Select your district</option>
                          {MALAWI_DISTRICTS.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                        {validationErrors.district && (
                          <p className="mt-1 text-sm text-red-600">
                            {validationErrors.district}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Area/Location *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.area}
                          onChange={(e) =>
                            handleAddressChange("area", e.target.value)
                          }
                          className={cn(
                            "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                            validationErrors.area
                              ? "border-red-300"
                              : "border-gray-300"
                          )}
                          placeholder="e.g., Area 47, Sector 3"
                        />
                        {validationErrors.area && (
                          <p className="mt-1 text-sm text-red-600">
                            {validationErrors.area}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Landmarks (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={shippingAddress.landmarks}
                          onChange={(e) =>
                            handleAddressChange("landmarks", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="e.g., Near Shoprite, opposite mosque, blue gate"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Order Review */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <ShoppingCart className="w-6 h-6 mr-2 text-green-600" />
                      Review Your Order
                    </h2>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={item.product.images?.[0] || "/image 1.jpg"}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.product.price)} × {item.quantity}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100 rounded-l-lg"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100 rounded-r-lg"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product_id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address Summary */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Shipping Address
                      </h3>
                      <p className="text-gray-700">
                        {shippingAddress.fullName}
                        <br />
                        {shippingAddress.area}
                        <br />
                        {shippingAddress.district}
                        <br />
                        Phone: {shippingAddress.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                      Payment Method
                    </h2>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <Lock className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-blue-800 font-medium">
                          Secure Payment with Paychangu
                        </span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        Your payment information is encrypted and secure. We
                        accept mobile money, cards, and bank transfers.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="paychangu"
                              name="payment"
                              checked={true}
                              readOnly
                              className="w-4 h-4 text-green-600"
                            />
                            <label
                              htmlFor="paychangu"
                              className="ml-3 font-medium text-gray-900"
                            >
                              Paychangu Payment Gateway
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              💳 📱 🏦
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 ml-7">
                          Pay securely using mobile money (TNM Mpamba, Airtel
                          Money), debit/credit cards, or bank transfer.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">
                        What happens next?
                      </h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>
                          • You&apos;ll be redirected to Paychangu&apos;s secure
                          payment page
                        </li>
                        <li>• Choose your preferred payment method</li>
                        <li>• Complete the payment process</li>
                        <li>
                          • Receive order confirmation and tracking details
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      onClick={handlePrevStep}
                      className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Previous</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <span>Next</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-8 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Place Order</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src={item.product.images?.[0] || "/image 1.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Free nationwide delivery
                </p>
                <p className="flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Professional installation available
                </p>
                <p className="flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Full warranty coverage
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Contact our support team if you need assistance with your
                  order.
                </p>
                <div className="flex flex-col space-y-2 text-sm">
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="text-green-600 hover:text-green-700"
                  >
                    📞 {COMPANY_INFO.phone}
                  </a>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="text-green-600 hover:text-green-700"
                  >
                    ✉️ {COMPANY_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;