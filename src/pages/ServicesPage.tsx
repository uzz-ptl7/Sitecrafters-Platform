import Header from "@/components/Header";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const ServicesPage = () => {
    return (
        <div className="min-h-screen bg-black from-gray-900 via-gray-800 to-gray-700">
            <SEO
                title="Web Development Services | Custom Website Solutions - SiteCrafters"
                description="Comprehensive web development services including custom websites, responsive design, SEO optimization, UI/UX design, and ongoing maintenance. Expert solutions for your digital needs."
                keywords="web development services, custom website development, responsive web design, UI/UX design services, SEO optimization, web maintenance services"
                canonicalUrl="https://www.sitecraftersz.co/services"
            />
            <Header />
            <div className="pt-20">
                <Services />
            </div>
            <Footer />
        </div>
    );
};

export default ServicesPage;