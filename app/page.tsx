"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// Removed Supabase import - using static data instead
// import { useHomepageData } from "@/lib/hooks/useHomepageData";

// Type for stats data
interface StatType {
  number: number;
  label: string;
  suffix: string;
}

// Custom hook for counting animation
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const startCounting = () => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = Date.now();
    const startValue = 0;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(
        startValue + (end - startValue) * easeOutQuart
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  };

  return { count, startCounting };
};

// Stats Card Component with counting animation
const StatsCard = ({
  stat,
  index,
  variant = "default",
}: {
  stat: StatType;
  index: number;
  variant?: "default" | "hero";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { count, startCounting } = useCountUp(stat.number);

  useEffect(() => {
    if (isInView) {
      startCounting();
    }
  }, [isInView, startCounting]);

  if (variant === "hero") {
    return (
      <motion.div
        ref={ref}
        className="text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <motion.div
          className="text-xl lg:text-2xl font-bold text-green-800 mb-1"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          {count}
          {stat.suffix}
        </motion.div>
        <motion.div
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
        >
          {stat.label}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <motion.div
        className="text-4xl lg:text-5xl font-bold mb-2"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
      >
        {count}
        {stat.suffix}
      </motion.div>
      <motion.div
        className="text-blue-100"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
      >
        {stat.label}
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Static slides data - no Supabase needed
  const slides = [
    {
      image: "/image 1.jpg",
      title: "Power Your Future with Solar Energy",
      description:
        "Clean, renewable energy solutions for homes and businesses across Kenya",
      cta_text: "Get Started",
      cta_link: "/products",
    },
    {
      image: "/image 2.jpg",
      title: "Professional Solar Installation",
      description:
        "Expert installation services with 25-year warranty coverage",
      cta_text: "Learn More",
      cta_link: "/services",
    },
    {
      image: "/image 3.jpg",
      title: "Join the Green Revolution",
      description:
        "Reduce your carbon footprint while saving on electricity bills",
      cta_text: "Contact Us",
      cta_link: "/contact-us",
    },
  ];

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const stats = [
    { number: 10, label: "Years Experience", suffix: "+" },
    { number: 500, label: "Projects Completed", suffix: "+" },
    { number: 98, label: "Client Satisfaction", suffix: "%" },
    { number: 24, label: "Support Available", suffix: "/7" },
  ];

  // Static services data - no Supabase needed
  const services = [
    {
      title: "Solar Energy Solutions",
      description:
        "Complete solar panel installations for residential and commercial properties with advanced monitoring systems.",
      image: "/image 1.jpg",
      slug: "solar-energy",
      features: ["Installation", "Maintenance", "Monitoring", "Consultation"],
      location: "The Solar Warehouse - Best Oil, Area 49",
    },
    {
      title: "Hydro Power Distribution",
      description:
        "Efficient hydro power systems and distribution networks for sustainable energy generation.",
      image: "/image 2.jpg",
      slug: "hydro-power",
      features: ["Design", "Installation", "Distribution", "Maintenance"],
    },
    {
      title: "Energy-Efficient Cooking",
      description:
        "Modern cooking solutions that reduce energy consumption and environmental impact.",
      image: "/image 3.jpg",
      slug: "efficient-cooking",
      features: [
        "Eco-friendly",
        "Cost-effective",
        "Modern Design",
        "Energy Saving",
      ],
    },
  ];

  // Static projects data - no Supabase needed
  const projects = [
    {
      id: "residential-nairobi-5kw",
      title: "Residential Solar Installation - Nairobi",
      description:
        "Complete 5kW residential solar system installation in Nairobi with battery backup and smart monitoring.",
      shortDescription: "5kW residential system with battery backup",
      image: "/image 1.jpg",
      category: "Residential",
      impact: "Reduced electricity bills by 80%",
      year: "2024",
      status: "Completed",
    },
    {
      id: "commercial-mombasa-100kw",
      title: "Commercial Solar Plant - Mombasa",
      description:
        "Large-scale commercial solar installation for manufacturing facility in Mombasa.",
      shortDescription: "100kW commercial solar plant",
      image: "/image 2.jpg",
      category: "Commercial",
      impact: "150 tons CO2 saved annually",
      year: "2024",
      status: "Completed",
    },
    {
      id: "rural-electrification-kisumu",
      title: "Rural Electrification Project - Kisumu",
      description:
        "Solar mini-grid system providing electricity to rural community in Kisumu.",
      shortDescription: "Rural community electrification",
      image: "/image 3.jpg",
      category: "Community",
      impact: "500 households connected",
      year: "2023",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-50"
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

            {/* Contact Button (Right) */}
            <div className="hidden md:flex items-center">
              <motion.a
                href="/contact-us"
                className="flex items-center space-x-2 px-5 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition-colors font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Contact Us</span>
              </motion.a>
            </div>

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
                <Link
                  href="/contact"
                  className="block px-4 py-3 mt-2 rounded-lg text-base font-medium transition-colors bg-green-800 text-white hover:bg-green-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full mx-auto px-1 sm:px-0 lg:px-0 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
          {/* Left side - Content */}
          <motion.div
            className="space-y-8 p-8 rounded-2xl "
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className="text-5xl lg:mt-20 lg:text-6xl font-bold text-gray-700 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Energy Solutions
                <span className="text-green-800"> Limited</span>
              </motion.h1>

              <motion.p
                className="text-md mb-4 text-gray-600 max-w-md leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Specialists in renewable energy and energy-efficient solutions,
                aiming to provide the highest quality, cost-effective, and
                environmentally friendly energy products and services
              </motion.p>
            </motion.div>

            <hr className="border-gray-300 border-1 w-120" />

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="px-4 py-2 bg-green-800 text-white text-sm rounded-lg hover:bg-green-900 transition-colors font-semibold shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Know Us
              </motion.button>
              <motion.button
                className="p-2 border-2 border-gray-300 text-sm text-gray-700 rounded-lg hover:border-green-800 hover:text-green-800 transition-colors font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Products
                <ArrowUpRight size={20} />
              </motion.button>
            </motion.div>

            {/* Moving Numbers Section */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                {stats.map((stat, index) => (
                  <StatsCard
                    key={index}
                    stat={stat}
                    index={index}
                    variant="hero"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Full Height Images */}
          <motion.div
            className="relative h-screen"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  transition={{ duration: 0.8, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slide indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-12 h-1 rounded-full transition-all duration-300 ${
                      index === currentSlide ? "bg-white" : "bg-white/40"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-gray-700 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our Specialized Services
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              We provide comprehensive energy solutions including solar
              installations, hydro power distribution, and energy-efficient
              cooking systems
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl duration-300 flex flex-col overflow-hidden group"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-full flex flex-col">
                  {/* Image Section */}
                  <div className="w-full h-56 relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>

                    {/* Location badge for solar service */}
                    {service.location && (
                      <div className="absolute top-4 left-4 bg-green-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {service.location.split(" - ")[0]}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-700 mb-3 group-hover:text-blue-900 transition-colors leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-4 flex-1 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full group-hover:bg-green-100 group-hover:text-green-800 transition-colors"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Location info for solar service */}
                    {service.location && (
                      <div className="text-sm text-blue-900 mb-4 font-medium">
                        {service.location}
                      </div>
                    )}

                    {/* Call to action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex cursor-pointer items-center space-x-2 text-green-800 font-semibold group-hover:text-green-900 transition-colors">
                        <Phone className="w-4 h-4" />
                        <span>Lets Talk</span>
                      </div>
                      <motion.a
                        href="https://wa.me/265999123456"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 bg-green-800 hover:bg-green-700 text-white rounded-full transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()} // Prevent card click
                      >
                        <MessageCircle className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-gray-700 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Understand Our Impact Through Projects
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Explore how our innovative solar solutions have transformed homes
              and businesses. Each project showcases our commitment to
              sustainability and excellence.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-700 group-hover:text-blue-900 transition-colors mb-3">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-4 flex-grow">
                    {project.shortDescription}
                  </p>

                  <Link href={`/projects/${project.id}`}>
                    <motion.button
                      className="px-4 py-2 bg-green-800 text-white rounded-full cursor-pointer hover:bg-green-700 transition-colors font-semibold text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Learn More
                    </motion.button>
                  </Link>
                </div>

                <div className="relative h-64 overflow-hidden mt-auto">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Explore More Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Link href="/projects">
              <motion.button
                className="px-8 cursor-pointer py-2 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors font-semibold text-lg shadow-lg flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore More Projects</span>
                <ArrowUpRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">Energy Solution Ltd</h3>
              <p className="text-gray-400 mb-4">
                Leading provider of innovative energy solutions with 10+ years
                of experience.
              </p>
              <p className="text-gray-400">
                © 2024 Energy Solution Ltd. All rights reserved.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter and receive weekly updates about our
                services and products.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  • Weekly articles about best products on the market
                </p>
                <p className="text-sm text-gray-400">• No spam - we promise!</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <motion.a
                  href="#home"
                  className="block text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Home
                </motion.a>
                <motion.a
                  href="#about"
                  className="block text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  About
                </motion.a>
                <motion.a
                  href="#services"
                  className="block text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Services
                </motion.a>
                <motion.a
                  href="#projects"
                  className="block text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Projects
                </motion.a>
                <motion.a
                  href="#contact"
                  className="block text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Contact
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
