"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  category: string;
  impact: string;
  year: string;
  status: string;
  location: string;
  duration: string;
  images: string[];
  objectives: string[];
  achievements: string[];
  beneficiaries: string;
  totalBudget: string;
  fundingSource: string;
  technicalSpecs: string[];
  challenges: string[];
  solutions: string[];
  futureExpansion: string;
}

const projectsData: Record<string, ProjectData> = {
  "bright-future-initiative": {
    id: "bright-future-initiative",
    title: "Bright Future Initiative",
    description:
      "The Bright Future Initiative aims to empower communities with clean, renewable energy solutions that drive sustainable development and economic growth. This comprehensive program focuses on providing reliable electricity access to rural households while building local capacity for maintenance and operation.",
    shortDescription:
      "Community solar program providing clean energy access to 50+ households in rural Malawi",
    image: "/image 1.jpg",
    category: "Solar Energy",
    impact: "50+ Households",
    year: "2024",
    status: "Completed",
    location: "Lilongwe Rural District",
    duration: "6 months",
    images: ["/image 1.jpg", "/image 2.jpg", "/image 3.jpg"],
    objectives: [
      "Provide reliable electricity access to 50+ rural households",
      "Reduce dependence on traditional energy sources",
      "Create local employment opportunities",
      "Build community capacity for system maintenance",
      "Demonstrate viability of solar energy in rural settings",
    ],
    achievements: [
      "Successfully installed solar systems in 52 households",
      "Trained 15 local technicians for maintenance",
      "Achieved 99.5% system uptime over 6 months",
      "Reduced household energy costs by 70%",
      "Created 8 permanent local jobs",
    ],
    beneficiaries: "280+ individuals across 52 households",
    totalBudget: "$125,000 USD",
    fundingSource: "World Bank Grant & ESL Investment",
    technicalSpecs: [
      "5kW solar panel systems per household",
      "Lithium-ion battery storage (10kWh capacity)",
      "Grid-tie capability with battery backup",
      "Smart monitoring systems for performance tracking",
      "Weather-resistant mounting systems",
    ],
    challenges: [
      "Remote location accessibility during rainy season",
      "Limited local technical expertise initially",
      "Community education on solar technology maintenance",
      "Coordination with local government authorities",
    ],
    solutions: [
      "Established local supply chains and logistics",
      "Comprehensive training programs for community members",
      "Regular maintenance schedules and support systems",
      "Strong partnerships with local government",
    ],
    futureExpansion:
      "Plans to expand to 200+ additional households in neighboring villages by 2025",
  },
  "green-energy-transformation": {
    id: "green-energy-transformation",
    title: "Green Energy Transformation",
    description:
      "A large-scale renewable energy infrastructure project transforming how communities access and use clean energy. This initiative focuses on grid extension and modernization to connect rural communities to reliable power distribution networks.",
    shortDescription:
      "Grid extension project connecting 200+ homes to reliable power distribution network",
    image: "/image 2.jpg",
    category: "Hydro Power",
    impact: "200+ Homes Connected",
    year: "2024",
    status: "Ongoing",
    location: "Blantyre Rural District",
    duration: "12 months",
    images: ["/image 2.jpg", "/image 1.jpg", "/image 3.jpg"],
    objectives: [
      "Extend power grid to reach 200+ rural homes",
      "Upgrade existing infrastructure for improved reliability",
      "Implement smart grid technologies",
      "Ensure sustainable power distribution",
      "Create economic opportunities through electrification",
    ],
    achievements: [
      "Connected 150+ homes to date (75% completion)",
      "Installed 25km of new power lines",
      "Upgraded 3 substations with modern equipment",
      "Achieved 98% power availability in connected areas",
      "Supported 12 new small businesses",
    ],
    beneficiaries: "800+ individuals across 200+ households",
    totalBudget: "$380,000 USD",
    fundingSource: "Government of Malawi & Development Partners",
    technicalSpecs: [
      "33kV and 11kV transmission lines",
      "Modern distribution transformers",
      "Smart metering systems",
      "Underground cables in urban sections",
      "Weather monitoring stations",
    ],
    challenges: [
      "Terrain difficulties in mountainous areas",
      "Environmental protection requirements",
      "Community land access negotiations",
      "Technical coordination with ESCOM",
    ],
    solutions: [
      "Helicopter transportation for remote installations",
      "Environmental impact assessments and mitigation",
      "Community engagement and compensation programs",
      "Regular coordination meetings with national utility",
    ],
    futureExpansion:
      "Phase 2 will connect an additional 300+ homes in adjacent districts",
  },
  "sustainable-cooking-program": {
    id: "sustainable-cooking-program",
    title: "Sustainable Cooking Program",
    description:
      "An innovative cooking solutions program designed to reduce energy consumption and improve health outcomes for families. This initiative focuses on replacing traditional cooking methods with energy-efficient alternatives.",
    shortDescription:
      "Energy-efficient cookstove program serving 100+ families with 60% fuel savings",
    image: "/image 3.jpg",
    category: "Energy Cooking",
    impact: "100+ Families",
    year: "2023",
    status: "Completed",
    location: "Mzuzu Urban & Peri-urban",
    duration: "4 months",
    images: ["/image 3.jpg", "/image 1.jpg", "/image 2.jpg"],
    objectives: [
      "Replace traditional cookstoves with efficient alternatives",
      "Reduce household fuel consumption by 50%+",
      "Improve indoor air quality and health outcomes",
      "Provide training on efficient cooking practices",
      "Create sustainable supply chains for cookstoves",
    ],
    achievements: [
      "Distributed 120 efficient cookstoves to families",
      "Achieved 60% average fuel savings per household",
      "Trained 200+ women in efficient cooking techniques",
      "Reduced indoor air pollution by 80%",
      "Established 3 local cookstove manufacturing units",
    ],
    beneficiaries: "600+ individuals across 120 families",
    totalBudget: "$45,000 USD",
    fundingSource: "UN Women & Local NGO Partnership",
    technicalSpecs: [
      "Improved biomass cookstoves with secondary combustion",
      "Thermal efficiency rating of 35%+",
      "Reduced particulate emissions by 80%",
      "Durable steel construction with ceramic lining",
      "Portable design for flexible use",
    ],
    challenges: [
      "Changing traditional cooking habits",
      "Initial resistance to new technology",
      "Training coordination with busy schedules",
      "Quality control for local manufacturing",
    ],
    solutions: [
      "Community demonstration programs",
      "Peer-to-peer learning networks",
      "Flexible training schedules",
      "Regular quality audits and feedback systems",
    ],
    futureExpansion:
      "Scaling program to reach 500+ additional families across 3 districts",
  },
};

import { use } from "react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project: projectSlug } = use(params);
  const project = projectsData[projectSlug];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white px-10">
      {/* Header */}
      <motion.header
        className="bg-white/95 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 lg:px-8">
          <div className="flex justify-between items-center">
            <Link
              href="/projects"
              className="flex items-center space-x-2 text-green-800 hover:text-gray-700"
            >
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Image */}
            <motion.div
              className="relative group mt-12"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={project.image}
                alt={project.title}
                width={800}
                height={900}
                className="rounded-lg shadow-xl object-cover w-full h-full"
              />
            </motion.div>

            {/* Right Column: Text Content */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 leading-tight">
                {project.title}
              </h1>
              <p className="text-lg text-gray-600 mb-8 text-justify">
                {project.description}
              </p>

              {/* Our Specialty Box */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Our Specialty
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <ul className="space-y-3 text-gray-700">
                      {project.achievements.slice(0, 3).map((ach, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative h-40 w-full">
                    <Image
                      src={project.images[1] || project.image}
                      alt="Specialty visual"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="rounded-md object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
