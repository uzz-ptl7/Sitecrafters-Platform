import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
/* import Pricing from "@/components/Pricing"; */
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-black from-gray-900 via-gray-800 to-gray-700">
      <SEO
        title="SiteCrafters - Professional Web Development & Design Services | Custom Websites"
        description="Transform your digital presence with expert web development services. Custom websites, responsive design, SEO optimization, UI/UX design, and web maintenance. Fast, modern, and conversion-focused solutions."
        keywords="web development, website design, custom websites, responsive web design, UI/UX design, SEO optimization, web maintenance, landing pages, React development, modern websites, professional web developer"
        canonicalUrl="https://www.sitecraftersz.co/"
      />

      <Header />
      <Hero />
      <Services />
      <About />
      <Portfolio />
      {/* <Pricing setSelectedPlan={setSelectedPlan} /> */}
      <Testimonials />
      <FAQ />
      <Contact selectedPlan="" />
      <Footer />
    </div>
  );
};

export default Index;