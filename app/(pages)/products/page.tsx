"use client";

import { Battery, Eye, Grid, Home, List, Search, Sun, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Product categories
  const categories = [
    { id: "all", name: "All Products", icon: Grid },
    { id: "solar-panels", name: "Solar Panels", icon: Sun },
    { id: "batteries", name: "Batteries", icon: Battery },
    { id: "inverters", name: "Inverters", icon: Zap },
    { id: "home-systems", name: "Home Systems", icon: Home },
  ];

  // Products data
  const products = [
    {
      id: 1,
      name: "Monocrystalline Solar Panel 400W",
      slug: "monocrystalline-solar-panel-400w",
      category: "solar-panels",
      price: 450000,
      originalPrice: 520000,
      image: "/image 1.jpg",
      description:
        "High-efficiency monocrystalline solar panel with 22% efficiency rating. Perfect for residential and commercial installations.",
      features: [
        "400W Power Output",
        "22% Efficiency",
        "25-Year Warranty",
        "Weather Resistant",
      ],
      inStock: true,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Lithium Battery 100Ah",
      slug: "lithium-battery-100ah",
      category: "batteries",
      price: 850000,
      originalPrice: null,
      image: "/image 2.jpg",
      description:
        "Deep cycle lithium battery with advanced BMS protection. Ideal for solar energy storage systems.",
      features: [
        "100Ah Capacity",
        "Built-in BMS",
        "10-Year Warranty",
        "Fast Charging",
      ],
      inStock: true,
      badge: "New",
    },
    {
      id: 3,
      name: "Pure Sine Wave Inverter 3000W",
      slug: "pure-sine-wave-inverter-3000w",
      category: "inverters",
      price: 380000,
      originalPrice: 420000,
      image: "/image 3.jpg",
      description:
        "High-quality pure sine wave inverter with LCD display and multiple protection features.",
      features: [
        "3000W Continuous Power",
        "Pure Sine Wave",
        "LCD Display",
        "Multiple Protections",
      ],
      inStock: true,
      badge: "Sale",
    },
    {
      id: 4,
      name: "Complete Home Solar System 5kW",
      slug: "complete-home-solar-system-5kw",
      category: "home-systems",
      price: 2800000,
      originalPrice: 3200000,
      image: "/image 1.jpg",
      description:
        "Complete solar system package including panels, inverter, batteries, and installation materials.",
      features: [
        "5kW System",
        "Complete Package",
        "Installation Included",
        "Monitoring System",
      ],
      inStock: true,
      badge: "Popular",
    },
    {
      id: 5,
      name: "Polycrystalline Solar Panel 320W",
      slug: "polycrystalline-solar-panel-320w",
      category: "solar-panels",
      price: 350000,
      originalPrice: null,
      image: "/image 2.jpg",
      description:
        "Cost-effective polycrystalline solar panel suitable for various applications.",
      features: [
        "320W Power Output",
        "19% Efficiency",
        "20-Year Warranty",
        "Durable Frame",
      ],
      inStock: false,
      badge: null,
    },
    {
      id: 6,
      name: "MPPT Charge Controller 60A",
      slug: "mppt-charge-controller-60a",
      category: "inverters",
      price: 180000,
      originalPrice: null,
      image: "/image 3.jpg",
      description:
        "Advanced MPPT charge controller with bluetooth monitoring and programmable settings.",
      features: [
        "60A Rating",
        "MPPT Technology",
        "Bluetooth Monitoring",
        "Programmable",
      ],
      inStock: true,
      badge: null,
    },
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-MW", {
      style: "currency",
      currency: "MWK",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("MWK", "MK");
  };

  return (
    <div className="min-h-screen bg-gray-50 -mt-8">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-700 mb-2">
                Energy Products
              </h1>
              <p className="text-gray-600">
                Discover our range of high-quality solar energy solutions
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-80"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg border ${
                    viewMode === "grid"
                      ? "bg-green-800 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg border ${
                    viewMode === "list"
                      ? "bg-green-800 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        selectedCategory === category.id
                          ? "bg-green-800 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Summary</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-medium">
                      {filteredProducts.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Stock:</span>
                    <span className="font-medium text-green-600">
                      {filteredProducts.filter((p) => p.inStock).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">{categories.length - 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <div
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                            product.badge === "Sale"
                              ? "bg-red-500 text-white"
                              : product.badge === "New"
                              ? "bg-blue-500 text-white"
                              : product.badge === "Best Seller"
                              ? "bg-green-800 text-white"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          {product.badge}
                        </div>
                      )}

                      {/* Stock Status */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white px-4 py-2 rounded-lg font-semibold text-gray-700">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link
                          href={`/products/${product.slug}`}
                          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-800 hover:text-white transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-md font-bold text-gray-700">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <Link
                          href={`/products/${product.slug}`}
                          className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                      {/* Image */}
                      <div className="relative h-32 rounded-xl overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.badge && (
                          <div
                            className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold ${
                              product.badge === "Sale"
                                ? "bg-red-500 text-white"
                                : product.badge === "New"
                                ? "bg-blue-500 text-white"
                                : product.badge === "Best Seller"
                                ? "bg-green-800 text-white"
                                : "bg-orange-500 text-white"
                            }`}
                          >
                            {product.badge}
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="md:col-span-2">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="text-center md:text-right">
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-gray-700 block">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Link
                            href={`/products/${product.slug}`}
                            className="block w-full px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                          >
                            View Details
                          </Link>
                          <p
                            className={`text-sm ${
                              product.inStock
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse different
                  categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
