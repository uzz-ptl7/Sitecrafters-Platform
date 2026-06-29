import { useEffect, useState } from "react";
import {
  Users,
  LayoutDashboard,
  FolderKanban,
  Activity,
} from "lucide-react";

const SystemMetric = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let v = 0;
    const target = 96;

    const interval = setInterval(() => {
      v += 2;

      if (v >= target) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(v);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-4 rounded-lg bg-slate-800/40 border border-slate-700">
      <div className="text-2xl font-bold text-cyan-400 mb-2">{value}%</div>
      <div className="text-slate-300 text-sm">Workflow Efficiency</div>
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 px-4 bg-slate-900/40">
      <div className="container mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              SITECRAFTERS Platform
            </span>
          </h2>

          <p className="text-lg text-slate-300 leading-relaxed">
            A structured web agency workflow that connects client projects,
            updates, and delivery into one organized digital experience.
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">

          <SystemMetric />

          <div className="text-center p-4 rounded-lg bg-slate-800/40 border border-slate-700">
            <div className="text-2xl font-bold text-purple-400 mb-2">Custom</div>
            <div className="text-slate-300 text-sm">Website Builds</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-800/40 border border-slate-700">
            <div className="text-2xl font-bold text-green-400 mb-2">Live</div>
            <div className="text-slate-300 text-sm">Project Updates</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-800/40 border border-slate-700">
            <div className="text-2xl font-bold text-yellow-400 mb-2">Secure</div>
            <div className="text-slate-300 text-sm">Client Access</div>
          </div>

        </div>

        {/* MODULES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex gap-4 p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <LayoutDashboard className="w-10 h-10 text-cyan-400" />
            <div>
              <h3 className="text-white font-semibold text-lg">
                Project Overview
              </h3>
              <p className="text-slate-300 text-sm">
                A structured view of ongoing work, progress, and development stages.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Users className="w-10 h-10 text-purple-400" />
            <div>
              <h3 className="text-white font-semibold text-lg">
                Client Workspace
              </h3>
              <p className="text-slate-300 text-sm">
                Each client has a dedicated space to follow their project journey.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <FolderKanban className="w-10 h-10 text-green-400" />
            <div>
              <h3 className="text-white font-semibold text-lg">
                Structured Delivery
              </h3>
              <p className="text-slate-300 text-sm">
                Work is organized into clear phases for smooth and predictable delivery.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Activity className="w-10 h-10 text-yellow-400" />
            <div>
              <h3 className="text-white font-semibold text-lg">
                Live Updates
              </h3>
              <p className="text-slate-300 text-sm">
                Clients stay informed with ongoing progress updates during development.
              </p>
            </div>
          </div>

        </div>

        {/* VALUE */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Why SITECRAFTERS exists
          </h3>

          <p className="text-slate-300 leading-relaxed">
            Most web projects fail because communication and structure are unclear.
            SITECRAFTERS solves this by giving every client a clear, organized,
            and transparent development experience from start to finish.
          </p>
        </div>

      </div>
    </section>
  );
};

export default About;