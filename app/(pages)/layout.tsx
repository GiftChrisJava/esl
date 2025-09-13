"use client";

// import { useAuth } from "@/contexts/AuthContext";

import { motion } from "framer-motion";
import {
  Clock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Authentication-aware navigation component
function AuthNavigation() {
  // const { user, isAuthenticated, logout } = useAuth();

  // const handleLogout = async () => {
  //   await logout();
  //   window.location.href = "/products";
  // };

  return (
    <div className="hidden md:flex items-center space-x-2">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
      >
        <User className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      <button
        // onClick={handleLogout}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );

  // return (
  //   <div className="hidden md:flex items-center space-x-2">
  //     <Link
  //       href="/login"
  //       className="flex items-center space-x-2 px-4 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition-colors font-semibold"
  //     >
  //       <User className="w-4 h-4" />
  //       <span>Sign In</span>
  //     </Link>
  //     <Link
  //       href="/signup"
  //       className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
  //     >
  //       <span>Sign Up</span>
  //     </Link>
  //   </div>
  // );
}

// Mobile authentication navigation
function MobileAuthNavigation({ onItemClick }: { onItemClick: () => void }) {
  // const { user, isAuthenticated, logout } = useAuth();

  // const handleLogout = async () => {
  //   await logout();
  //   onItemClick();
  //   window.location.href = "/products";
  // };

  // if (isAuthenticated && user) {
  //   return (
  //     <>
  //       <Link
  //         href="/dashboard"
  //         className="flex items-center justify-center space-x-2 px-4 py-3 mt-2 rounded-lg text-base font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
  //         onClick={onItemClick}
  //       >
  //         <span>Dashboard</span>
  //       </Link>
  //       <button
  //         onClick={handleLogout}
  //         className="flex items-center justify-center space-x-2 px-4 py-3 w-full rounded-lg text-base font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
  //       >
  //         <LogOut className="w-4 h-4" />
  //       </button>
  //     </>
  //   );
  // }

  return (
    <>
      <Link
        href="/login"
        className="flex items-center justify-center space-x-2 px-4 py-3 mt-2 rounded-lg text-base font-medium transition-colors bg-green-800 text-white hover:bg-green-700"
        onClick={onItemClick}
      >
        <User className="w-4 h-4" />
        <span>Sign In</span>
      </Link>
      <Link
        href="/signup"
        className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-base font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
        onClick={onItemClick}
      >
        <span>Sign Up</span>
      </Link>
      <Link
        href="/contact"
        className="block px-4 py-3 rounded-lg text-base font-medium transition-colors bg-gray-600 text-white hover:bg-gray-500"
        onClick={onItemClick}
      >
        Contact Us
      </Link>
    </>
  );
}

export default function ScreensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 -py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">ESL</span>
              </Link>
            </div>

            {/* Desktop Navigation (Middle) */}
            <nav className="hidden md:flex flex-grow justify-center items-center space-x-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about-us", label: "About Us" },
                { href: "/clients", label: "Clients" },
                { href: "/projects", label: "Projects" },
                { href: "/partnerships", label: "Partnerships" },
                { href: "/products", label: "Products" },
                { href: "/contact-us", label: "Contact Us" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    pathname === item.href
                      ? "bg-blue-900 text-white"
                      : "text-gray-100 bg-green-800 hover:text-gray-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Navigation (Right) */}
            <AuthNavigation />

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 py-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-2 text-center">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about-us", label: "About Us" },
                  { href: "/clients", label: "Clients" },
                  { href: "/projects", label: "Projects" },
                  { href: "/partnerships", label: "Partnerships" },
                  { href: "/products", label: "Products" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-green-800 text-white"
                        : "bg-gray-700 text-white hover:bg-green-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Auth Navigation */}
                <MobileAuthNavigation
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-green-800">
                Energy Solutions Limited
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Specialists in renewable energy and energy-efficient solutions.
                We provide comprehensive energy solutions including solar
                installations, hydro power distribution, and energy-efficient
                cooking systems.
              </p>
              <div className="flex items-center space-x-2 text-gray-300 mb-2">
                <Clock className="w-5 h-5 text-green-800" />
                <span>Available 24/7 for emergency services</span>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-800">
                Contact Info
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-800" />
                  <a
                    href="tel:+265999123456"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +265 999 123 456
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-green-800" />
                  <a
                    href="https://wa.me/265999123456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    WhatsApp Us
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-800" />
                  <a
                    href="mailto:info@esl.mw"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    info@esl.mw
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-800 mt-1" />
                  <div className="text-gray-300">
                    <p>Area 49, Lilongwe</p>
                    <p className="text-sm">The Solar Warehouse - Best Oil</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-800">
                Our Services
              </h4>
              <div className="space-y-3">
                <Link
                  href="/services/solar-energy"
                  className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  → Solar Energy Solutions
                </Link>
                <Link
                  href="/services/hydro-power"
                  className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  → Hydro Power Distribution
                </Link>
                <Link
                  href="/services/energy-cooking"
                  className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  → Energy Efficient Cooking
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <motion.a
                  href="tel:+265999123456"
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </motion.a>

                <motion.a
                  href="https://wa.me/265999123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </motion.a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Energy Solutions Limited. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
