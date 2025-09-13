"use client";

import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { COMPANY_INFO } from "@/lib/config";
import { productsService } from "@/lib/supabase/products";
import type { Product as ProductType } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  CreditCard,
  Info,
  Lock,
  Mail,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

// Malawi districts for the dropdown
const MALAWI_DISTRICTS = [
  'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Chitipa', 'Dedza',
  'Dowa', 'Karonga', 'Kasungu', 'Likoma', 'Lilongwe', 'Machinga',
  'Mangochi', 'Mchinji', 'Mwanza', 'Mzimba', 'Neno', 'Nkhata Bay',
  'Nkhotakota', 'Nsanje', 'Ntcheu', 'Ntchisi', 'Phalombe', 'Rumphi',
  'Salima', 'Thyolo', 'Zomba'
];

const ProductDetailPage = ({
  params,
}: {
  params: Promise<{ product: string }>;
}) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const { isAuthenticated, user } = useAuth();
  const { addToCart, isInCart, getCartItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [pendingAction, setPendingAction] = useState<"buy" | "cart" | null>(null);

  // Inquiry form state (for non-e-commerce inquiries)
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    quantity: 1,
  });

  // Load product from Supabase
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const result = await productsService.getProductBySlug(resolvedParams.product);
      if (result.success && result.data) {
        setProduct(result.data);
      }
      setLoading(false);
    };
    
    loadProduct();
  }, [resolvedParams.product]);

  const handleAuthSuccess = useCallback(() => {
    if (!product) return;

    const isProductInCart = isInCart(product.id);

    if (pendingAction === "buy") {
      // Add to cart and redirect to checkout
      if (!isProductInCart) {
        addToCart(product.id, quantity);
      }
      // Small delay to let the user see they're logged in and ensure cart state is updated
      setTimeout(() => {
        router.push("/checkout?from=buynow");
      }, 1000);
    } else if (pendingAction === "cart") {
      // Just add to cart
      addToCart(product.id, quantity);
    }
    setPendingAction(null);
  }, [pendingAction, addToCart, product, quantity, isInCart, router]);

  // Only proceed with pending action if user is authenticated AND email is verified
  useEffect(() => {
    if (isAuthenticated && user?.email_verified && pendingAction) {
      handleAuthSuccess();
    }
  }, [isAuthenticated, user?.email_verified, pendingAction, handleAuthSuccess]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Link
            href="/products"
            className="text-blue-800 hover:text-green-700 font-medium"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const cartItem = getCartItem(product.id);
  const isProductInCart = isInCart(product.id);

  const handleBuyNow = () => {
    if (!isAuthenticated || !user?.email_verified) {
      setPendingAction("buy");
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    // Add to cart and redirect to checkout
    if (!isProductInCart) {
      addToCart(product.id, quantity);
    }

    setTimeout(() => {
      router.push("/checkout?from=buynow");
    }, 50);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated || !user?.email_verified) {
      setPendingAction("cart");
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    addToCart(product.id, quantity);
  };

  const handleInquiry = (type: "email" | "whatsapp") => {
    const subject = `Inquiry about ${product.name}`;
    const body = `Hello ${COMPANY_INFO.name} Team,

I am interested in the ${product.name} (Product ID: ${product.id}).

Product Details:
- Name: ${product.name}
- Price: ${formatPrice(product.price)}
- Quantity: ${inquiryForm.quantity}

${inquiryForm.message ? `Additional Message: ${inquiryForm.message}` : ""}

Contact Information:
- Name: ${inquiryForm.name || "Not provided"}
- Email: ${inquiryForm.email || "Not provided"}
- Phone: ${inquiryForm.phone || "Not provided"}

Please provide more information about availability, installation, and delivery options.

Best regards`;

    if (type === "email") {
      window.location.href = `mailto:${
        COMPANY_INFO.email
      }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`;
    } else if (type === "whatsapp") {
      const whatsappMessage = `Hello! I'm interested in the ${product.name}. ${
        inquiryForm.message ? `Message: ${inquiryForm.message}` : ""
      }`;
      window.open(
        `https://wa.me/${COMPANY_INFO.whatsapp.replace(
          /[\s\+\-\(\)]/g,
          ""
        )}?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank"
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 -mt-4">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/products"
                className="text-gray-500 hover:text-gray-700"
              >
                Products
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-blue-800 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={product.images?.[selectedImage] || product.image_url || "/image 1.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.is_featured && (
                  <div
                    className={cn(
                      "absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold",
                      "bg-green-600 text-white"
                    )}
                  >
                    Featured
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-4">
                {(product.images || [product.image_url || "/image 1.jpg"]).map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative h-24 rounded-xl overflow-hidden transition-all",
                      selectedImage === index
                        ? "ring-2 ring-green-600"
                        : "hover:ring-2 hover:ring-gray-300"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-blue-800 font-medium mb-2">
                  {product.category?.name || 'Product'}
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < 4 // Default rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    4.8 (24 reviews)
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      (product.stock_quantity || 0) > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {(product.stock_quantity || 0) > 0
                      ? `In Stock (${product.stock_quantity})`
                      : "Out of Stock"}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                    )}
                    {product.compare_at_price && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                        Save{" "}
                        {formatPrice(product.compare_at_price - product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* E-commerce Section */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
                    Purchase Online
                  </h3>

                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-sm font-medium text-gray-700">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 rounded-l-lg"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stock_quantity || 0, quantity + 1)
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                        disabled={quantity >= (product.stock_quantity || 0)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      Total: {formatPrice(product.price * quantity)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      onClick={handleBuyNow}
                      disabled={!product.stock_quantity || product.stock_quantity <= 0}
                      className={cn(
                        "w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg transition-colors",
                        product.stock_quantity && product.stock_quantity > 0
                          ? "bg-green-800 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      )}
                      whileHover={product.stock_quantity && product.stock_quantity > 0 ? { scale: 1.02 } : {}}
                      whileTap={product.stock_quantity && product.stock_quantity > 0 ? { scale: 0.98 } : {}}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Buy Now</span>
                    </motion.button>

                    <button
                      onClick={handleAddToCart}
                      disabled={!product.stock_quantity || product.stock_quantity <= 0}
                      className={cn(
                        "w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 rounded-xl font-semibold transition-colors",
                        product.stock_quantity && product.stock_quantity > 0
                          ? "border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
                          : "border-gray-300 text-gray-500 cursor-not-allowed"
                      )}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {isProductInCart
                          ? `In Cart (${cartItem?.quantity || 0})`
                          : "Add to Cart"}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Secure checkout powered by Paychangu</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Shield className="w-8 h-8 text-blue-800 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Warranty
                    </p>
                    <p className="text-xs text-gray-600">
                      {product.warranty_period || "Full Coverage"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Truck className="w-8 h-8 text-blue-800 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Delivery
                    </p>
                    <p className="text-xs text-gray-600">Nationwide</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Settings className="w-8 h-8 text-blue-800 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Installation
                    </p>
                    <p className="text-xs text-gray-600">
                      {product.installation_available ? "Available" : "Not Required"}
                    </p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Need help or have questions?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleInquiry("email")}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </button>
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </a>
                    <button
                      onClick={() => handleInquiry("whatsapp")}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    📞 {COMPANY_INFO.phone} | ✉️ {COMPANY_INFO.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                {[
                  { id: "description", label: "Description", icon: Info },
                  {
                    id: "specifications",
                    label: "Specifications",
                    icon: Settings,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors",
                        activeTab === tab.id
                          ? "border-green-600 text-green-800"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {product.long_description || product.description}
                  </div>

                  {/* Features */}
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(product.features || []).map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-700"
                        >
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications || {}).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-3 border-b border-gray-100"
                      >
                        <span className="font-medium text-gray-900">
                          {key}:
                        </span>
                        <span className="text-gray-700">{String(value)}</span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact/Inquiry Form */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Request More Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={inquiryForm.name}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inquiryForm.email}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+265 XXX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Needed
                </label>
                <input
                  type="number"
                  min="1"
                  value={inquiryForm.quantity}
                  onChange={(e) =>
                    setInquiryForm({
                      ...inquiryForm,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea
                  rows={4}
                  value={inquiryForm.message}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Tell us about your project requirements, installation preferences, or any questions..."
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleInquiry("email")}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Send Email Inquiry</span>
                  </button>
                  <button
                    onClick={() => handleInquiry("whatsapp")}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp Inquiry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        mode={authMode}
        onModeChange={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default ProductDetailPage;
