"use client";

import { motion } from "framer-motion";
import {
  Award,
  Building2,
  CheckCircle,
  GraduationCap,
  Heart,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const clients = [
  {
    id: 1,
    name: "National Oil Company of Malawi",
    icon: Building2,
    sector: "Energy & Infrastructure",
    description:
      "Comprehensive electrical infrastructure solutions for critical fuel depot operations and water systems.",
    services: [
      "Repair of electrical fault on water booster pump and rewiring of water pump in star-delta configuration",
      "Electrical fault rectification at industrial fuel depot",
      "Repair of electrical fault on Automatic Tank Gauging system",
      "Repair of electrical fault on common pump control and power circuits",
      "Warning lights installation for enhanced safety protocols",
    ],
    impact: "Enhanced operational reliability and safety compliance",
    duration: "Ongoing Partnership",
    iconColor: "text-blue-600",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    id: 2,
    name: "Ministry of Natural Resources, Energy and Mining",
    subtitle: "Department of Energy",
    icon: Zap,
    sector: "Government Infrastructure",
    description:
      "Large-scale rural electrification infrastructure development under the Malawi Rural Electrification Project (MAREP).",
    services: [
      "Construction of over 120 km of powerlines and substations",
      "Multi-district implementation across Dedza, Lilongwe, Balaka, and Mchinji",
      "Site development at Kanyenda, Nanze, Tambala, Chitowo, Ndevu, Mua and Tukuliza",
      "Regional expansion including Chawantha, Mdera, Mlanga, and Chisumbu",
      "Complete electrical infrastructure for rural communities",
    ],
    impact: "Electrification access to thousands of rural households",
    duration: "Multi-year Government Contract",
    iconColor: "text-emerald-600",
    bgGradient: "from-emerald-50 to-green-50",
  },
  {
    id: 3,
    name: "SAWA Group",
    icon: Target,
    sector: "Infrastructure Development",
    description:
      "Complex powerline construction in challenging terrain for rural electrification expansion.",
    services: [
      "Construction of over 90km of powerlines and substations",
      "Corridor clearing in rugged Chitipa mountainous terrain",
      "Implementation under Department of Energy's MAREP Phase 8",
      "Specialized high-altitude installation techniques",
      "Environmental compliance and terrain adaptation",
    ],
    impact: "Extended grid access to remote highland communities",
    duration: "18-month Project Completion",
    iconColor: "text-orange-600",
    bgGradient: "from-orange-50 to-amber-50",
  },
  {
    id: 4,
    name: "University Research Co. LLC",
    icon: GraduationCap,
    sector: "Research & Development",
    description:
      "Advanced power backup solutions for critical research operations and data continuity.",
    services: [
      "Custom power backup system design and engineering",
      "High-capacity uninterruptible power supply integration",
      "Automated failover and monitoring systems",
      "Research-grade power quality assurance",
      "24/7 technical support and maintenance protocols",
    ],
    impact: "Uninterrupted research operations and data protection",
    duration: "Design-Build-Operate Contract",
    iconColor: "text-purple-600",
    bgGradient: "from-purple-50 to-violet-50",
  },
  {
    id: 5,
    name: "Care Malawi",
    icon: Heart,
    sector: "Education & Development",
    description:
      "Solar energy solutions for educational institutions in underserved communities.",
    services: [
      "Solar system design for primary school infrastructure",
      "Installation across Kasungu and Salima districts",
      "Educational facility lighting and power systems",
      "Community engagement and training programs",
      "Sustainable energy education initiatives",
    ],
    impact: "Enhanced learning environments for 1,000+ students",
    duration: "Community Development Partnership",
    iconColor: "text-rose-600",
    bgGradient: "from-rose-50 to-pink-50",
  },
  {
    id: 6,
    name: "United Purpose",
    icon: Users,
    sector: "International Development",
    description:
      "Comprehensive solar energy solutions supporting international development initiatives.",
    services: [
      "Multi-site solar system supply and installation",
      "Community-centered renewable energy solutions",
      "Technical capacity building and training",
      "Sustainable energy access programs",
      "Long-term maintenance and support frameworks",
    ],
    impact: "Sustainable energy access for development programs",
    duration: "Strategic Implementation Partnership",
    iconColor: "text-teal-600",
    bgGradient: "from-teal-50 to-cyan-50",
  },
];

const stats = [
  { number: "6+", label: "Major Clients", icon: Building2 },
  { number: "200+", label: "Kilometers of Powerlines", icon: Zap },
  { number: "1000+", label: "Beneficiaries", icon: Users },
  { number: "100%", label: "Client Satisfaction", icon: Award },
];

export default function ClientsPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      // Create mailto link
      const subject = encodeURIComponent(
        "Consultation Request - Energy Solutions"
      );
      const body = encodeURIComponent(
        `Hello ESL Team,

I would like to request a consultation for energy solutions.

Contact Email: ${email}

Please reach out to me to discuss our energy infrastructure needs.

Thank you,
`
      );

      const mailtoLink = `mailto:energysolutions@esl.mw?subject=${subject}&body=${body}`;
      window.open(mailtoLink, "_blank");

      setMessage("Consultation request sent! We'll be in touch soon.");
      setEmail("");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="-mt-10">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12 min-h-[60vh]">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our{" "}
              <span className="relative inline-block">
                <span className="bg-green-100 px-2 rounded-md text-green-700">
                  Clients
                </span>
              </span>{" "}
              First
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              We build trusted partnerships with leading organizations across
              Malawi, delivering exceptional energy infrastructure solutions
              that power progress and prosperity.
            </motion.p>
            <form className="flex w-full max-w-md mb-8" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 text-gray-700 bg-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-800 text-white font-semibold rounded-r-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Book a consultation"}
              </button>
            </form>
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  message.includes("sent")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full border-t border-gray-200 pt-8 mt-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-left">
                  <div className="flex items-center mb-2">
                    <stat.icon className="w-6 h-6 text-green-500 mr-2" />
                    <span className="text-2xl font-bold text-gray-900">
                      {stat.number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Client Image */}
          <div className="w-full lg:w-1/2 flex items-center justify-center mb-12 lg:mb-0">
            <div className="relative w-full max-w-lg">
              <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/image 1.jpg"
                  alt="ESL team working on solar energy solutions"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Active Projects
                    </p>
                    <p className="text-xs text-gray-500">6+ Major Clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Strategic Partnerships
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each client relationship represents our commitment to excellence,
              innovation, and sustainable energy solutions that create lasting
              impact.
            </p>
          </motion.div>

          <div className="space-y-8">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                className={`bg-gradient-to-r ${client.bgGradient} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Content Section */}
                    <div className="lg:col-span-9 space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {client.name}
                          </h3>
                          {client.subtitle && (
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                              {client.subtitle}
                            </p>
                          )}
                          <span className="inline-block px-3 py-1 bg-white/60 rounded-full text-sm font-medium text-gray-700">
                            {client.sector}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {client.description}
                      </p>

                      {/* Services */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          Key Services Delivered
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {client.services.map((service, serviceIndex) => (
                            <li key={serviceIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm leading-relaxed">
                                {service}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Impact & Duration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">
                            Project Impact
                          </h5>
                          <p className="text-gray-700 text-sm">
                            {client.impact}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">
                            Partnership Duration
                          </h5>
                          <p className="text-gray-700 text-sm">
                            {client.duration}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Icon Section */}
                    <div className="lg:col-span-3 flex justify-center lg:justify-end">
                      <div className="relative">
                        <div
                          className={`w-32 h-32 rounded-2xl bg-gradient-to-br from-white to-gray-100 shadow-lg flex items-center justify-center`}
                        >
                          <client.icon
                            className={`w-16 h-16 ${client.iconColor}`}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Partner With Excellence
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join our distinguished client portfolio and experience the
              difference that professional energy solutions can make for your
              organization.
            </p>
            <motion.button
              className="px-8 py-4 bg-white text-green-800 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Partnership
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
