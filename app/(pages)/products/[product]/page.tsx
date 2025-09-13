"use client";

// Auth-related imports commented out - no backend yet
// import AuthModal from "@/components/AuthModal";
// import { useAuth } from "@/contexts/AuthContext";
// import { useCart } from "@/contexts/CartContext";
import { COMPANY_INFO } from "@/lib/config";
import type { Product as ProductType } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
// E-commerce related imports commented out - no backend yet
// import { motion } from "framer-motion";
import {
  // CreditCard, // Commented out - no checkout
  Info,
  // Lock, // Commented out - no checkout
  Mail,
  MessageCircle,
  // Minus, // Commented out - no quantity selector
  Phone,
  // Plus, // Commented out - no quantity selector
  Settings,
  Shield,
  // ShoppingCart, // Commented out - no cart
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

// Enhanced Product interface with e-commerce fields
interface Product extends ProductType {
  images: string[];
  longDescription: string;
  stockCount: number;
  rating: number;
  reviews: number;
  warranty?: string;
  installation?: boolean;
}

// This would normally come from a database or API
const getProductBySlug = (slug: string): Product | null => {
  const products: Record<string, Product> = {
    "monocrystalline-solar-panel-400w": {
      id: 1,
      name: "Monocrystalline Solar Panel 400W",
      slug: "monocrystalline-solar-panel-400w",
      category: "solar-panels",
      price: 450000,
      originalPrice: 520000,
      image: "/image 1.jpg",
      images: ["/image 1.jpg", "/image 2.jpg", "/image 3.jpg"],
      description:
        "High-efficiency monocrystalline solar panel with 22% efficiency rating. Perfect for residential and commercial installations.",
      longDescription: `This premium monocrystalline solar panel delivers exceptional performance with its high-efficiency cells and robust construction. Designed for both residential and commercial applications, it offers reliable power generation for decades.

The panel features anti-reflective glass coating that maximizes light absorption while the aluminum frame provides structural integrity and corrosion resistance. With IP67-rated junction box and MC4 connectors, installation is straightforward and secure.

Perfect for grid-tied systems, off-grid installations, and hybrid solar solutions. Each panel undergoes rigorous quality testing to ensure consistent performance in various weather conditions.`,
      features: [
        "400W Maximum Power Output",
        "22% High Efficiency Rating",
        "25-Year Performance Warranty",
        "Weather Resistant IP67 Rating",
      ],
      specifications: {
        "Maximum Power": "400W",
        Efficiency: "22%",
        "Voltage at Max Power": "40.5V",
        "Operating Temperature": "-40°C to +85°C",
        Dimensions: "2008 × 1002 × 35mm",
        Weight: "22.5kg",
        Warranty: "25 Years",
      },
      inStock: true,
      stockCount: 50,
      rating: 4.8,
      reviews: 24,
      badge: "Best Seller",
      warranty: "25 Years",
      installation: true,
    },
    "lithium-battery-100ah": {
      id: 2,
      name: "Lithium Battery 100Ah",
      slug: "lithium-battery-100ah",
      category: "batteries",
      price: 850000,
      originalPrice: null,
      image: "/image 2.jpg",
      images: ["/image 2.jpg", "/image 1.jpg", "/image 3.jpg"],
      description:
        "Deep cycle lithium battery with advanced BMS protection. Ideal for solar energy storage systems.",
      longDescription: `This advanced lithium iron phosphate (LiFePO4) battery offers superior performance and longevity for solar energy storage applications. With built-in Battery Management System (BMS), it provides comprehensive protection against overcharging, over-discharging, and thermal issues.

The battery delivers consistent power output throughout its discharge cycle and can handle thousands of charge-discharge cycles with minimal capacity degradation. Its compact design and lightweight construction make installation easy.

Ideal for residential solar systems, RV applications, marine use, and backup power systems. The battery is maintenance-free and environmentally friendly.`,
      features: [
        "100Ah Capacity (1280Wh)",
        "Built-in BMS Protection",
        "10-Year Warranty",
        "Fast Charging Capability",
      ],
      specifications: {
        Capacity: "100Ah (1280Wh)",
        Voltage: "12.8V",
        Chemistry: "LiFePO4",
        "Cycle Life": "6000+ cycles",
        Dimensions: "330 × 173 × 220mm",
        Weight: "13kg",
        Warranty: "10 Years",
      },
      inStock: true,
      stockCount: 25,
      rating: 4.9,
      reviews: 18,
      badge: "New",
      warranty: "10 Years",
      installation: false,
    },
    "pure-sine-wave-inverter-3000w": {
      id: 3,
      name: "Pure Sine Wave Inverter 3000W",
      slug: "pure-sine-wave-inverter-3000w",
      category: "inverters",
      price: 380000,
      originalPrice: 420000,
      image: "/image 3.jpg",
      images: ["/image 3.jpg", "/image 1.jpg", "/image 2.jpg"],
      description:
        "High-quality pure sine wave inverter with LCD display and multiple protection features.",
      longDescription: `This professional-grade pure sine wave inverter converts DC power to clean AC power, suitable for sensitive electronic equipment. Features advanced LCD display for real-time monitoring and multiple protection systems for safe operation.

Built with high-quality components and robust cooling system, this inverter provides reliable power conversion for residential and commercial applications. The pure sine wave output ensures optimal performance of connected devices.`,
      features: [
        "3000W Continuous Power",
        "Pure Sine Wave Output",
        "LCD Display",
        "Multiple Protection Features",
      ],
      specifications: {
        "Continuous Power": "3000W",
        "Peak Power": "6000W",
        "Input Voltage": "12V DC",
        "Output Voltage": "230V AC",
        Efficiency: "90%",
        Dimensions: "350 × 240 × 150mm",
        Weight: "8.5kg",
        Warranty: "2 Years",
      },
      inStock: true,
      stockCount: 15,
      rating: 4.7,
      reviews: 12,
      badge: "Sale",
      warranty: "2 Years",
      installation: true,
    },
  };

  return products[slug] || null;
};

const ProductDetailPage = ({
  params,
}: {
  params: Promise<{ product: string }>;
}) => {
  const router = useRouter();
  const resolvedParams = use(params);
  // Auth-related hooks commented out - no backend yet
  // const { isAuthenticated } = useAuth();
  // const { addToCart, isInCart, getCartItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  // Quantity state commented out - no e-commerce functionality
  // const [quantity, setQuantity] = useState(1);
  // Auth modal state commented out - no backend yet
  // const [showAuthModal, setShowAuthModal] = useState(false);
  // const [authMode, setAuthMode] = useState<"login" | "register">("register");
  // Auth-related pending action state commented out - no backend yet
  // const [pendingAction, setPendingAction] = useState<"buy" | "cart" | null>(
  //   null
  // );

  // Inquiry form state (for non-e-commerce inquiries)
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    quantity: 1,
  });

  const product = getProductBySlug(resolvedParams.product);

  // Auth success handler commented out - no backend yet
  // const handleAuthSuccess = useCallback(() => {
  //   if (!product) return;

  //   const isProductInCart = isInCart(product.id);

  //   if (pendingAction === "buy") {
  //     // Add to cart and redirect to checkout
  //     if (!isProductInCart) {
  //       addToCart(product.id, quantity);
  //     }
  //     // Small delay to let the user see they're logged in and ensure cart state is updated
  //     setTimeout(() => {
  //       router.push("/checkout?from=buynow");
  //     }, 1000);
  //   } else if (pendingAction === "cart") {
  //     // Just add to cart
  //     addToCart(product.id, quantity);
  //   }
  //   setPendingAction(null);
  // }, [pendingAction, addToCart, product, quantity, isInCart, router]);

  // Auth change handler commented out - no backend yet
  // useEffect(() => {
  //   if (isAuthenticated && pendingAction) {
  //     handleAuthSuccess();
  //   }
  // }, [isAuthenticated, pendingAction, handleAuthSuccess]);

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

  // Cart-related variables commented out - no backend yet
  // const cartItem = getCartItem(product.id);
  // const isProductInCart = isInCart(product.id);

  // Buy now handler commented out - no backend yet
  // const handleBuyNow = () => {
  //   if (!FEATURE_FLAGS.ecommerceEnabled) {
  //     // Fallback to inquiry
  //     handleInquiry("whatsapp");
  //     return;
  //   }

  //   if (!isAuthenticated) {
  //     setPendingAction("buy");
  //     setAuthMode("login"); // Default to login for existing users
  //     setShowAuthModal(true);
  //     return;
  //   }

  //   // Add to cart and redirect to checkout
  //   if (!isProductInCart) {
  //     addToCart(product.id, quantity);
  //   }

  //   // Small delay to ensure cart state is updated before navigation
  //   setTimeout(() => {
  //     router.push("/checkout?from=buynow");
  //   }, 50);
  // };

  // Add to cart handler commented out - no backend yet
  // const handleAddToCart = () => {
  //   if (!FEATURE_FLAGS.ecommerceEnabled) {
  //     // Fallback to inquiry
  //     handleInquiry("whatsapp");
  //     return;
  //   }

  //   if (!isAuthenticated) {
  //     setPendingAction("cart");
  //     setAuthMode("login"); // Default to login for existing users
  //     setShowAuthModal(true);
  //     return;
  //   }

  //   addToCart(product.id, quantity);
  // };

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
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.badge && (
                  <div
                    className={cn(
                      "absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold",
                      product.badge === "Sale" && "bg-red-500 text-white",
                      product.badge === "New" && "bg-blue-500 text-white",
                      product.badge === "Best Seller" &&
                        "bg-green-600 text-white",
                      !["Sale", "New", "Best Seller"].includes(product.badge) &&
                        "bg-orange-500 text-white"
                    )}
                  >
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image: string, index: number) => (
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
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1).replace("-", " ")}
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
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {product.inStock
                      ? `In Stock (${product.stockCount})`
                      : "Out of Stock"}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                        Save{" "}
                        {formatPrice(product.originalPrice - product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* E-commerce Section - COMMENTED OUT - No backend yet */}
                {/* 
                {FEATURE_FLAGS.ecommerceEnabled && (
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
                              Math.min(product.stockCount, quantity + 1)
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-r-lg"
                          disabled={quantity >= product.stockCount}
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
                        disabled={!product.inStock}
                        className={cn(
                          "w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg transition-colors",
                          product.inStock
                            ? "bg-green-800 text-white hover:bg-green-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        )}
                        whileHover={product.inStock ? { scale: 1.02 } : {}}
                        whileTap={product.inStock ? { scale: 0.98 } : {}}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Buy Now</span>
                      </motion.button>

                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className={cn(
                          "w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 rounded-xl font-semibold transition-colors",
                          product.inStock
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
                )}
                */}

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Shield className="w-8 h-8 text-blue-800 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Warranty
                    </p>
                    <p className="text-xs text-gray-600">
                      {product.warranty || "Full Coverage"}
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
                      {product.installation ? "Available" : "Not Required"}
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
                    {product.longDescription}
                  </div>

                  {/* Features */}
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
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

      {/* Authentication Modal - COMMENTED OUT - No backend yet */}
      {/* 
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        mode={authMode}
        onModeChange={setAuthMode}
      />
      */}
    </>
  );
};

export default ProductDetailPage;
