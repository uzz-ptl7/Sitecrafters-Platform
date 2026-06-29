import {
  Code,
  Palette,
  Search,
  Settings,
  FileText,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Custom Web Development",
      description:
        "We build fast, scalable websites tailored specifically to your business needs — no templates, fully custom architecture.",
      features: [
        "Responsive Interfaces",
        "Performance First Build",
        "SEO Optimized Structure",
        "Cross Device Compatibility",
      ],
    },
    {
      icon: Settings,
      title: "Website Maintenance",
      description:
        "Continuous updates, monitoring, and improvements to keep your website secure, stable, and up to date.",
      features: [
        "Security Enhancements",
        "Performance Monitoring",
        "Content Updates",
        "Bug Resolution",
      ],
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description:
        "Clean, modern interfaces designed to improve engagement and deliver smooth user experiences.",
      features: [
        "User Flow Design",
        "Wireframes & Prototypes",
        "Visual Systems",
        "Conversion-focused Design",
      ],
    },
    {
      icon: Search,
      title: "Search Optimization",
      description:
        "Improve visibility across search engines through structured, optimized, and performance-driven builds.",
      features: [
        "Keyword Structuring",
        "On-page Optimization",
        "Technical Improvements",
        "Content Alignment",
      ],
    },
    {
      icon: FileText,
      title: "Landing Page Design",
      description:
        "High-impact landing pages designed to capture attention and convert visitors into clients.",
      features: [
        "Single Purpose Layout",
        "Conversion Optimization",
        "Fast Load Speed",
        "Mobile Friendly Design",
      ],
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description:
        "We improve loading speed, reduce resource usage, and optimize your site for a smooth experience.",
      features: [
        "Speed Audits",
        "Asset Optimization",
        "Code Refinement",
        "Lazy Loading Techniques",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-purple-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            We design and build digital solutions focused on performance, clarity, and long-term business growth.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Card
                key={index}
                className="
                  bg-slate-800/50
                  border-slate-700/50
                  transition-all duration-300
                  hover:bg-slate-800/70
                  hover:-translate-y-1
                  hover:border-cyan-500/30
                "
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <CardTitle className="text-white text-xl">
                    {service.title}
                  </CardTitle>

                  <CardDescription className="text-slate-300">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="text-slate-400 flex items-center text-sm"
                      >
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Services;