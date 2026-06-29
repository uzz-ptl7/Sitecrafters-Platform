import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import projectsData from "../assets/portfolio/projects.json";

import silvagymimage from "../assets/portfolio/silvagym.png";
import webwizardsimage from "../assets/portfolio/webwizards.png";
import sitecraftersimage from "../assets/portfolio/sitecrafters.png";
import exquisitekonnorimage from "../assets/portfolio/exquisitekonnor.png";
import carrentalimage from "../assets/portfolio/carrental.png";
import ecobazarimage from "../assets/portfolio/ecobazar.png";
import brohoodtraveltoursimage from "../assets/portfolio/brohoodtraveltours.png";
import gymimage from "../assets/portfolio/gym.png";
import hvacimage from "../assets/portfolio/hvac.png";
import multigymimage from "../assets/portfolio/multigym.png";
import personaltrainerimage from "../assets/portfolio/personaltrainer.png";
import pharmaimage from "../assets/portfolio/pharma.png";
import ptchatsystemimage from "../assets/portfolio/ptchatsystem.png";
import salonimage from "../assets/portfolio/salon.png";
import sportsacademyimage from "../assets/portfolio/sportsacademy.png";
import serenitymassagespaimage from "../assets/portfolio/spa.png";
import eliteinteriordesignersimage from "../assets/portfolio/intdesign.png";
import eventplannershubimage from "../assets/portfolio/evntplanner.png";
import auramjewelryimage from "../assets/portfolio/jewelry.png";
import dentistsclinicimage from "../assets/portfolio/dental.png";
import webofrestaurantimage from "../assets/portfolio/restaurant.png";
import realestateswebimage from "../assets/portfolio/realestate.png";
import generalcafeimage from "../assets/portfolio/cafe.png";
import generalsupermarketimage from "../assets/portfolio/supermarket.png";
import yogastudiosimage from "../assets/portfolio/yoga.png";
import plumbingtechnicianimage from "../assets/portfolio/plumbing.png";

const imageMap: Record<string, string> = {
  "silvagym.png": silvagymimage,
  "webwizards.png": webwizardsimage,
  "sitecrafters.png": sitecraftersimage,
  "exquisitekonnor.png": exquisitekonnorimage,
  "carrental.png": carrentalimage,
  "ecobazar.png": ecobazarimage,
  "brohoodtraveltours.png": brohoodtraveltoursimage,
  "gym.png": gymimage,
  "hvac.png": hvacimage,
  "multigym.png": multigymimage,
  "personaltrainer.png": personaltrainerimage,
  "pharma.png": pharmaimage,
  "ptchatsystem.png": ptchatsystemimage,
  "salon.png": salonimage,
  "sportsacademy.png": sportsacademyimage,
  "spa.png": serenitymassagespaimage,
  "intdesign.png": eliteinteriordesignersimage,
  "evntplanner.png": eventplannershubimage,
  "jewelry.png": auramjewelryimage,
  "dental.png": dentistsclinicimage,
  "restaurant.png": webofrestaurantimage,
  "realestate.png": realestateswebimage,
  "cafe.png": generalcafeimage,
  "supermarket.png": generalsupermarketimage,
  "yoga.png": yogastudiosimage,
  "plumbing.png": plumbingtechnicianimage,
};

const projects = projectsData.map((p) => ({
  ...p,
  image: imageMap[p.image],
}));

const selectedProjects = [
  projects.find((p) => p.title === "Brotherhood Travel Tours")!,
  projects.find((p) => p.title === "Personal Trainer")!,
  projects.find((p) => p.title === "Auram Jewelry")!,
];

const Portfolio = () => {
  const navigate = useNavigate();

  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="container mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-purple-400 bg-clip-text text-transparent">
              Work
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
            A selection of recent projects built with performance, design, and business goals in mind.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {selectedProjects.map((project, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700/50 overflow-hidden hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* HOVER OVERLAY FIXED */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex justify-center"
                  >
                    <Button
                      size="sm"
                      className="
                        bg-gradient-to-r from-cyan-500 to-purple-500
                        text-white
                        hover:from-purple-500 hover:to-cyan-500
                        hover:text-white
                        opacity-100
                        font-medium
                        shadow-lg
                      "
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Live
                    </Button>
                  </a>

                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>

                <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Button
            size="lg"
            className="
              w-full md:w-auto
              px-10
              bg-gradient-to-r from-purple-500 to-cyan-500
              text-white
              hover:from-cyan-500 hover:to-purple-500
              hover:text-white
              transition-all
              duration-300
            "
            onClick={() => {
              navigate("/portfolio");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            View Full Portfolio
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;