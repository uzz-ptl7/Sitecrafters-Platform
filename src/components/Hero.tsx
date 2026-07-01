import { ArrowDown, ArrowRight, Code, Palette, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import instagramicon from "../assets/socialmedia/instagram.png";
import gmailicon from "../assets/socialmedia/gmail.png";
import whatsappicon from "../assets/socialmedia/whatsapp.png";
import mylogo from "../assets/siteCraftersLogo.png";

const highlights = [
  {
    icon: Code,
    title: "Built for Your Business",
    text: "Every website is designed around your goals, not generic templates.",
  },
  {
    icon: Palette,
    title: "Clean Design System",
    text: "Modern layouts with strong branding and visual clarity.",
  },
  {
    icon: Rocket,
    title: "Ready to Launch",
    text: "Optimized for speed, mobile, and real-world performance.",
  },
];

const Hero = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartProject = () => {
    navigate("/auth/signup");
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden px-4 py-20 sm:py-24 lg:pt-28 lg:pb-16"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src={mylogo}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center scale-110 opacity-10 blur-sm"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_40%),radial-gradient(circle_at_20%_20%,_rgba(168,85,247,0.22),_transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.55)_0%,rgba(2,6,23,0.88)_60%,rgba(2,6,23,0.98)_100%)]" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">

          {/* LEFT CONTENT */}
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">

            {/* TAG */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-950/50 px-4 py-2 text-xs text-cyan-100 backdrop-blur-md sm:text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
              Custom websites designed and built for real business growth
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-black leading-[0.92] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">We build websites</span>
              <span className="block bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
                that make your brand stand out
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl lg:mx-0">
              We design and develop modern websites that look sharp, load fast,
              and help turn visitors into real customers.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">

              {/* Primary CTA - 65% */}
              <Button
                onClick={handleStartProject}
                size="lg"
                className="group w-full sm:w-[60%] border-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 px-6 py-3 text-base text-white duration-500 hover:from-cyan-300 hover:to-purple-400 hover:text-black sm:text-lg"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2 sm:h-5 sm:w-5" />
              </Button>

              {/* Secondary CTA - 35% */}
              <Button
                variant="outline"
                size="lg"
                className="group w-full sm:w-[40%] border border-white/10 bg-white/5 px-6 py-3 text-base text-white backdrop-blur-md duration-500 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white sm:text-lg"
                onClick={() =>
                  document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Portfolio
                <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1 sm:h-5 sm:w-5" />
              </Button>

            </div>

            {/* TAGS */}
            <div className="mt-7 flex flex-wrap justify-center gap-2 sm:gap-3 lg:justify-start">
              {["Responsive", "SEO Ready", "Fast Loading", "Modern UI"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* HIGHLIGHTS */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 backdrop-blur-xl sm:p-5"
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <h3 className="text-sm font-semibold text-white sm:text-base">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-300 sm:text-sm">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* SOCIALS */}
            <div className="mt-8 flex flex-col items-center gap-3 text-slate-300 sm:flex-row lg:justify-start">
              <span className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Connect
              </span>

              <div className="flex items-center gap-3">

                <a
                  href="https://wa.me/250789599719"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="rounded-full border border-white/10 bg-white/5 p-3 hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  <img src={whatsappicon} alt="WhatsApp" className="h-5 w-5" />
                </a>

                <a
                  href="https://www.instagram.com/sitecraftersz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full border border-white/10 bg-white/5 p-3 hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  <img src={instagramicon} alt="Instagram" className="h-5 w-5" />
                </a>

                <a
                  href="mailto:sitecraftersltd@gmail.com"
                  aria-label="Email"
                  className="rounded-full border border-white/10 bg-white/5 p-3 hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  <img src={gmailicon} alt="Email" className="h-5 w-5" />
                </a>

              </div>
            </div>

          </div>

          {/* RIGHT VISUAL */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">

              <img
                src={mylogo}
                alt="SiteCrafters preview"
                className="h-72 w-full rounded-xl object-cover sm:h-96 md:h-[420px]"
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase text-cyan-200/70">Design</p>
                  <p className="mt-1 text-sm text-white">
                    Clean and conversion-focused layouts
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase text-purple-200/70">Build</p>
                  <p className="mt-1 text-sm text-white">
                    Fast and modern frontend development
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;