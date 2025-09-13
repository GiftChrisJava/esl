"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const allProjects = [
  {
    id: "bright-future-initiative",
    title: "Bright Future Initiative",
    description:
      "Empowering communities with clean, renewable energy solutions that drive sustainable development and economic growth.",
    shortDescription:
      "Community solar program providing clean energy access to 50+ households in rural Malawi",
    image: "/image 1.jpg",
    category: "Solar Energy",
    impact: "50+ Households",
    year: "2024",
    status: "Completed",
    location: "Lilongwe Rural",
    duration: "6 months",
  },
  {
    id: "green-energy-transformation",
    title: "Green Energy Transformation",
    description:
      "Large-scale renewable energy infrastructure project transforming how communities access and use clean energy.",
    shortDescription:
      "Grid extension project connecting 200+ homes to reliable power distribution network",
    image: "/image 2.jpg",
    category: "Hydro Power",
    impact: "200+ Homes Connected",
    year: "2024",
    status: "Ongoing",
    location: "Blantyre",
    duration: "12 months",
  },
  {
    id: "sustainable-cooking-program",
    title: "Sustainable Cooking Program",
    description:
      "Innovative cooking solutions reducing energy consumption and improving health outcomes for families.",
    shortDescription:
      "Energy-efficient cookstove program serving 100+ families with 60% fuel savings",
    image: "/image 3.jpg",
    category: "Energy Cooking",
    impact: "100+ Families",
    year: "2023",
    status: "Completed",
    location: "Mzuzu",
    duration: "4 months",
  },
  {
    id: "solar-school-project",
    title: "Solar Schools Initiative",
    description:
      "Bringing reliable electricity to rural schools through solar energy installations, enabling digital learning and extended study hours.",
    shortDescription:
      "Solar power installation in 15 rural schools, benefiting 3000+ students with reliable electricity",
    image: "/image 1.jpg",
    category: "Solar Energy",
    impact: "15 Schools, 3000+ Students",
    year: "2023",
    status: "Completed",
    location: "Kasungu",
    duration: "8 months",
  },
  {
    id: "micro-hydro-village",
    title: "Micro-Hydro Village Power",
    description:
      "Small-scale hydroelectric power generation system providing sustainable electricity to remote mountain villages.",
    shortDescription:
      "Micro-hydro installation powering entire village of 500+ residents with clean energy",
    image: "/image 2.jpg",
    category: "Hydro Power",
    impact: "500+ Residents",
    year: "2023",
    status: "Completed",
    location: "Chitipa",
    duration: "10 months",
  },
  {
    id: "urban-cooking-efficiency",
    title: "Urban Cooking Efficiency Program",
    description:
      "City-wide initiative to replace traditional cooking methods with energy-efficient solutions in urban households.",
    shortDescription:
      "Urban cookstove replacement program reaching 300+ households with modern cooking solutions",
    image: "/image 3.jpg",
    category: "Energy Cooking",
    impact: "300+ Households",
    year: "2024",
    status: "Ongoing",
    location: "Lilongwe City",
    duration: "6 months",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-white">
        <Image
          src="/image 3.jpg"
          alt="Projects background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Our Innovative Projects
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Discover how we are pioneering sustainable energy solutions and
            transforming communities across the nation.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto -mt-14 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* <h2 className="text-3xl lg:text-4xl font-bold text-gray-700 mb-4">
              Project Portfolio
            </h2> */}
            <p className="text-xl text-gray-700 font-semibold max-w-3xl mx-auto">
              A comprehensive look at our work in solar, hydro, and
              energy-efficient cooking. Filter by category or browse all our
              initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-xl shadow-xl hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col"
                whileHover={{ y: -8 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>

                  {/* Status badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === "Completed"
                        ? "bg-green-600 text-white"
                        : "bg-blue-900 text-white"
                    }`}
                  >
                    {project.status}
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-700 group-hover:text-blue-900 transition-colors line-clamp-1 mb-3">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2 flex-grow">
                    {project.shortDescription}
                  </p>

                  <Link href={`/projects/${project.id}`}>
                    <motion.button
                      className="px-4 py-2 cursor-pointer bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm mb-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Learn More
                    </motion.button>
                  </Link>

                  {/* Project details */}
                  <div className="space-y-2 flex justify-between ">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 text-blue-900" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 text-blue-900" />
                      <span>Duration: {project.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
