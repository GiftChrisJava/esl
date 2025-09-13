"use client";

import {
  Globe,
  Handshake,
  Heart,
  Mail,
  Phone,
  Target,
  Users,
  Zap,
} from "lucide-react";

const PartnershipsPage = () => {
  // Partner logos data
  const partners = [
    {
      id: 1,
      name: "Greenheart Energy",
      logo: "/partners/greenheart.svg", // Placeholder - you can add actual logos
      description: "UK-based energy company",
      color: "bg-green-500",
    },
    {
      id: 2,
      name: "UNDP",
      logo: "/partners/undp.svg",
      description: "United Nations Development Programme",
      color: "bg-blue-500",
    },
    {
      id: 3,
      name: "World Bank",
      logo: "/partners/worldbank.svg",
      description: "International Financial Institution",
      color: "bg-indigo-500",
    },
    {
      id: 4,
      name: "USAID",
      logo: "/partners/usaid.svg",
      description: "US Agency for International Development",
      color: "bg-red-500",
    },
    {
      id: 5,
      name: "African Development Bank",
      logo: "/partners/afdb.svg",
      description: "Regional Development Bank",
      color: "bg-green-800",
    },
    {
      id: 6,
      name: "GIZ",
      logo: "/partners/giz.svg",
      description: "German Development Cooperation",
      color: "bg-orange-500",
    },
    {
      id: 7,
      name: "EU Energy Initiative",
      logo: "/partners/eu.svg",
      description: "European Union Energy Program",
      color: "bg-purple-500",
    },
    {
      id: 8,
      name: "Clean Energy Fund",
      logo: "/partners/cef.svg",
      description: "Renewable Energy Investment",
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white -mt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-18 lg:py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Would You Like To{" "}
                  <span className="text-gray-700">Partner</span> With Us?
                </h1>
                <p className="text-md lg:text-lg text-green-100 leading-relaxed">
                  We would like to partner with organizations in the energy and
                  environment sectors. For funded projects, we will not seek a
                  profit; however, we would want to cover costs associated with
                  the implementation of the projects.
                </p>
                <p className="text-sm text-green-100">
                  Help us save the lives of women and children by supporting our
                  energy efficient cooking initiative and environmentally
                  friendly solar power solutions.
                </p>
              </div>

              {/* Contact CTAs */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:energysolutions@esl.mw"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-800 font-semibold rounded-2xl hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email Us
                  </a>
                  <a
                    href="tel:+265995109444"
                    className="inline-flex items-center justify-center px-8 py-4 bg-green-900/50 text-white font-semibold rounded-2xl hover:bg-green-900/70 transition-all duration-300 border border-green-400/30"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    +265 995 109 444
                  </a>
                </div>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-green-400/30">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-green-200">Lives Impacted</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-green-200">Projects Completed</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold">5+</p>
                  <p className="text-sm text-green-200">Countries Served</p>
                </div>
              </div>
            </div>

            {/* Right: Partnership Icons */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Central hub */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <Handshake className="w-10 h-10 text-green-600" />
                </div>

                {/* Floating partnership icons */}
                <div className="absolute left-8 top-8 w-16 h-16 bg-green-800 rounded-2xl shadow-lg flex items-center justify-center animate-pulse">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="absolute right-8 top-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-pulse delay-100">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <div className="absolute left-8 bottom-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-pulse delay-200">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <div className="absolute right-8 bottom-8 w-16 h-16 bg-green-800 rounded-2xl shadow-lg flex items-center justify-center animate-pulse delay-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Partners Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Our Current Partners
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto mb-8"></div>
          </div>

          {/* Featured Partnership */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
                    <Handshake className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Strategic Partnership
                    </h3>
                    <p className="text-green-600 font-medium">
                      Greenheart Energy Solutions
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">
                  Energy Solutions Ltd has joined forces with Greenheart Energy,
                  a UK-based company, to establish Greenheart Energy Solutions
                  (GES) Malawi Ltd. Bringing together the extensive project
                  financing, management, and global sourcing expertise of
                  Greenheart Energy with the local insights and top-tier
                  technical proficiency of Energy Solutions Ltd.
                </p>

                <p className="text-gray-700 font-medium">
                  Greenheart Energy Solutions Ltd is uniquely positioned to
                  deliver exceptional service for large-scale energy projects
                  across continents.
                </p>

                <div className="flex items-center space-x-6 pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">£10M+</p>
                    <p className="text-sm text-gray-500">Project Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">2</p>
                    <p className="text-sm text-gray-500">Countries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">5+</p>
                    <p className="text-sm text-gray-500">Joint Projects</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-80 h-60 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="text-xl font-bold">Global Reach</h4>
                      <p className="text-green-100">UK + Malawi Expertise</p>
                    </div>
                  </div>
                  {/* Floating badges */}
                  <div className="absolute -top-4 -left-4 bg-green-800 rounded-xl px-4 py-2 shadow-lg">
                    <p className="text-sm font-bold text-white">UK Partner</p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-xl px-4 py-2 shadow-lg border border-gray-100">
                    <p className="text-sm font-bold text-gray-900">
                      Local Expertise
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partners Grid */}
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Our Partner Network
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We collaborate with leading organizations worldwide to deliver
              sustainable energy solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center space-y-4">
                  {/* Logo placeholder */}
                  <div
                    className={`w-16 h-16 ${partner.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Handshake className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Make an Impact Together?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join our mission to provide sustainable energy solutions across
            Africa and beyond
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:energysolutions@esl.mw"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-800 font-semibold rounded-2xl hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Start Partnership Discussion
            </a>
            <a
              href="tel:+265995109444"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-700 text-white font-semibold rounded-2xl hover:bg-green-800 transition-all duration-300 border border-green-400"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnershipsPage;
