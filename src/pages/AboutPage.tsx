import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// keep direct import (no structural change to About)
import About from "@/components/About";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 flex flex-col">

            <SEO
                title="About SiteCrafters | Professional Web Development Agency"
                description="Meet the team behind SiteCrafters. We're passionate about creating exceptional web experiences with modern technologies and user-centered design principles."
                keywords="about sitecrafters, web development agency, professional web developers, web design team"
                canonicalUrl="https://www.sitecraftersz.co/about"
            />

            {/* HEADER (fixed, avoids layout shift) */}
            <Header />

            {/* MAIN CONTENT */}
            <main className="flex-1 pt-20">
                <About />
            </main>

            {/* FOOTER */}
            <Footer />

        </div>
    );
};

export default AboutPage;