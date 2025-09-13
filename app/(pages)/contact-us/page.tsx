"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  Globe,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    contact: "energysolutions@esl.mw",
    action: "mailto:energysolutions@esl.mw",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our energy consultants",
    contact: "+265 (0) 991 234 567",
    action: "tel:+265991234567",
    color: "from-green-500 to-green-600",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come see our showroom and meet our team",
    contact: "Area 47, Sector 3, Lilongwe",
    action: "#location",
    color: "from-purple-500 to-purple-600",
  },
];

const officeHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 5:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 1:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

const reasons = [
  {
    icon: Users,
    title: "Expert Team",
    description: "Certified professionals with years of experience",
  },
  {
    icon: Zap,
    title: "Quick Response",
    description: "Fast turnaround on quotes and consultations",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description: "Your satisfaction is our top priority",
  },
  {
    icon: Globe,
    title: "Local Knowledge",
    description: "Deep understanding of Malawi's energy landscape",
  },
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    projectType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(
        `${formData.projectType ? `[${formData.projectType}] ` : ""}${
          formData.subject || "Contact Form Submission"
        }`
      );
      const body = encodeURIComponent(
        `Hello ESL Team,

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company || "N/A"}
Project Type: ${formData.projectType || "General Inquiry"}

Message:
${formData.message}

Please get back to me at your earliest convenience.

Thank you!`
      );

      const mailtoLink = `mailto:energysolutions@esl.mw?subject=${subject}&body=${body}`;
      window.open(mailtoLink, "_blank");

      setSubmitMessage("Email client opened! Your message is ready to send.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        projectType: "",
      });
    } catch {
      setSubmitMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="-mt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-34 pb-8 bg-gradient-to-br from-green-800 via-blue-800 to-green-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                Let&apos;s Power Your{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Future
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                Ready to transform your energy solutions? Our expert team is
                here to guide you every step of the way.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Free Consultation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Local Expertise</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Methods Quick Access */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.action}
                  className="block p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${method.color}`}
                    >
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{method.title}</h3>
                      <p className="text-white/80 text-sm">
                        {method.description}
                      </p>
                      <p className="text-white font-medium">{method.contact}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/60" />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            onClick={() => {
              document.getElementById("contact-form")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="group flex flex-col items-center space-y-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            whileHover={{ y: -2 }}
            animate={{ y: [0, 8, 0] }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <span className="text-sm font-medium">Get in Touch</span>
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300">
              <ChevronDown className="w-6 h-6" />
            </div>
          </motion.button>
        </motion.div>
      </section>

      {/* Main Contact Form Section */}
      <section id="contact-form" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Send us a message
                    </h2>
                    <p className="text-gray-600">
                      We&apos;ll get back to you within 24 hours
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="+265 (0) 991 234 567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Project Type
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      >
                        <option value="">Select project type</option>
                        <option value="Solar Installation">
                          Solar Installation
                        </option>
                        <option value="Power Infrastructure">
                          Power Infrastructure
                        </option>
                        <option value="Energy Consultation">
                          Energy Consultation
                        </option>
                        <option value="Maintenance & Support">
                          Maintenance & Support
                        </option>
                        <option value="Rural Electrification">
                          Rural Electrification
                        </option>
                        <option value="Commercial Solutions">
                          Commercial Solutions
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="How can we help you?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                      placeholder="Tell us about your energy needs, project timeline, budget, and any specific requirements..."
                    ></textarea>
                  </div>

                  {submitMessage && (
                    <div
                      className={`p-4 rounded-xl text-sm ${
                        submitMessage.includes("opened")
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-800 to-green-700 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5" />
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Office Hours */}
              <motion.div
                className="bg-white rounded-3xl shadow-xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Office Hours
                  </h3>
                </div>
                <div className="space-y-4">
                  {officeHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600 font-medium">
                        {schedule.day}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Why Choose Us */}
              <motion.div
                className="bg-white rounded-3xl shadow-xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Why Choose ESL?
                </h3>
                <div className="space-y-4">
                  {reasons.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg mt-1">
                        <reason.icon className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {reason.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-3xl shadow-xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-4">Emergency Support</h3>
                <p className="mb-4 text-red-100">
                  Need urgent assistance with your energy systems?
                </p>
                <a
                  href="tel:+265991234567"
                  className="block w-full bg-white text-red-600 text-center py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                >
                  Call Emergency Line
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section id="location" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Visit Our Showroom
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See our energy solutions in action and meet our expert team at our
              state-of-the-art facility in Lilongwe.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Map Placeholder */}
              <div className="h-96 lg:h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium text-lg">
                    Interactive Map
                  </p>
                  <p className="text-gray-600 text-sm">
                    Area 47, Sector 3, Lilongwe
                  </p>
                  <div className="mt-4">
                    <a
                      href="https://maps.google.com/?q=Area+47+Sector+3+Lilongwe+Malawi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Energy Solutions Limited Headquarters
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-green-700 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600">
                        Plot 123, Area 47, Sector 3<br />
                        Lilongwe, Central Region
                        <br />
                        Malawi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-green-700 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+265 (0) 991 234 567</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-green-700 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">energysolutions@esl.mw</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    What to Expect
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Product demonstrations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Technical consultations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Custom solution design</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Free parking available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-800 via-blue-800 to-green-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take the first step towards sustainable energy solutions. Our team
              is ready to help you power your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#contact-form"
                className="px-8 py-4 bg-white text-green-800 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.a>
              <motion.a
                href="tel:+265991234567"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-green-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Call Now
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
