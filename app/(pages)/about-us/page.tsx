"use client";

import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import Image from "next/image";

// NOTE: Remote image URLs from Pexels (royalty‑free). Replace with your own brand photos later.
// All images are portrait / neutral to fit grid.
const heroImage = "/image 1.jpg";

const teamMembers = [
  {
    name: "Zoe Daniels",
    role: "Founder & CEO",
    image: "/image 1.jpg",
    linkedin: "https://www.linkedin.com/",
    bio: "Strategy, partnerships & sustainable growth leadership.",
  },
  {
    name: "Michael Carter",
    role: "Chief Technology Officer",
    image: "/image 2.jpg",
    linkedin: "https://www.linkedin.com/",
    bio: "Engineering scalable renewable platforms & innovation culture.",
  },
  {
    name: "Amelia Brooks",
    role: "Head of Engineering",
    image: "/image 3.jpg",
    linkedin: "https://www.linkedin.com/",
    bio: "Deploying reliable solar & hybrid systems across regions.",
  },
  {
    name: "Daniel Lee",
    role: "Product Manager",
    image: "/image 1.jpg",
    linkedin: "https://www.linkedin.com/",
    bio: "Translating client requirements into sustainable products.",
  },
  {
    name: "Priya Shah",
    role: "Energy Analyst",
    image: "/image 2.jpg",
    linkedin: "https://www.linkedin.com/",
    bio: "Data‑driven optimization & impact measurement.",
  },
  {
    name: "Carlos Rivera",
    role: "Operations Lead",
    image: "/image 3.jpg",
    linkedin: "https://www.linkedin.com/",
    bio: "Quality execution & regional delivery excellence.",
  },
];

const stats = [
  { number: "10+", label: "Years Experience" },
  { number: "500+", label: "Projects Completed" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "24/7", label: "Support" },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white px-4">
      {/* TOP HERO / STORY + IMAGE + STATS CARD */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Text card */}
          <motion.div
            className="lg:col-span-5 bg-white rounded-3xl p-10 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-3">
              How It Started
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Our Dream is Global Energy Transformation
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed space-y-4">
              <span className="block mb-3">
                Founded to accelerate equitable access to clean, reliable
                energy, we unite engineering excellence with community-centered
                impact.
              </span>
              <span className="block">
                We design, deploy and support renewable & efficiency projects
                that lower costs, strengthen resilience and unlock sustainable
                growth for clients and communities.
              </span>
            </p>
          </motion.div>
          {/* Image + stats */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <div className="relative h-[430px] rounded-3xl overflow-hidden shadow-lg bg-white">
              <Image
                src={heroImage}
                alt="Team collaboration"
                fill
                className="object-cover"
                sizes="(max-width:768px)100vw,(max-width:1200px)60vw,700px"
                priority
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {s.number}
                  </p>
                  <p className="text-xs mt-1 font-medium text-gray-500 tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-3">
              Meet the Team
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-700 leading-tight">
              Our Dedicated Team of Innovators
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map((m) => (
              <motion.div
                key={m.name}
                className="relative h-64 rounded-xl overflow-hidden bg-white shadow-lg group border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
              >
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width:768px)50vw,(max-width:1200px)33vw,300px"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>

                {/* Hover info card */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[85%] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {m.name}
                    </h3>
                    <p className="text-xs text-green-600 mb-2 font-medium">
                      {m.role}
                    </p>
                    <p className="text-[11px] text-gray-600 leading-snug line-clamp-2 mb-3">
                      {m.bio}
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition"
                      >
                        <Linkedin size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision & Mission Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            className="bg-white rounded-xl p-10 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-3">
              Our Vision
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
              Empowering Lives Through Sustainable Energy
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              We envision a resilient, low‑carbon world where energy systems are
              inclusive, efficient and regenerative— enabling communities to
              thrive while protecting natural resources.
            </p>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl p-10 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-3">
              Our Mission
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
              Clean, Affordable Energy For All
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              We deliver practical renewable & efficiency solutions— integrating
              design, technology and service— to reduce emissions, improve
              reliability and expand access for businesses & communities.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
