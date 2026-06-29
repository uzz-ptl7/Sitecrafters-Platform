import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
            question: "What is SiteCrafters?",
            answer:
                "SiteCrafters is a web agency that builds fully custom websites tailored to each client’s business needs."
        },
        {
            question: "Are your websites custom-built or template-based?",
            answer:
                "All websites are fully custom-built from scratch based on each client’s requirements and brand identity."
        },
        {
            question: "What services do you offer?",
            answer:
                "We provide custom website development, UI/UX design, and performance optimization for businesses."
        },
        {
            question: "How does the process work?",
            answer:
                "We start by understanding your needs, then design and develop your website step by step with regular updates."
        },
        {
            question: "Will I be able to track progress?",
            answer:
                "Yes. Each client has access to a secure workspace where they can follow progress and updates in one place."
        },
        {
            question: "Can I request changes during the project?",
            answer:
                "Yes. Feedback and revisions are included throughout the development process."
        },
        {
            question: "Is every project custom-built?",
            answer:
                "Yes. Every solution is designed and developed specifically for each client."
        },
        {
            question: "How long does a project take?",
            answer:
                "Timelines vary depending on project size and complexity."
        },
        {
            question: "Will my website work on mobile devices?",
            answer:
                "Yes. Every website is fully responsive across mobile, tablet, and desktop."
        },
        {
            question: "Do you improve existing websites?",
            answer:
                "Yes. We can redesign and optimize existing websites for better performance and design."
        },
        {
            question: "Who is SiteCrafters for?",
            answer:
                "It is built for businesses, startups, and professionals who want custom digital solutions."
        },
        {
            question: "How do I get started?",
            answer:
                "Contact us through the website form and we’ll guide you through the next steps."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section id="faq" className="py-20 px-4 bg-slate-900/30">
            <div className="container mx-auto max-w-6xl">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-4">
                        <HelpCircle className="w-10 h-10 text-cyan-500 mr-3" />
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Frequently Asked{" "}
                            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                                Questions
                            </span>
                        </h2>
                    </div>

                    <p className="text-slate-300 max-w-2xl mx-auto">
                        Clear answers about SiteCrafters services and process.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <Card
                                key={index}
                                onClick={() => toggleFAQ(index)}
                                className={`cursor-pointer transition-all duration-300 border-slate-700 bg-slate-800/40 hover:border-cyan-500/50 ${isOpen ? "ring-2 ring-cyan-500/40" : ""
                                    }`}
                            >
                                <CardContent className="p-6 flex flex-col">

                                    {/* QUESTION */}
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-white font-semibold text-base">
                                            {faq.question}
                                        </h3>

                                        {isOpen ? (
                                            <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                        )}
                                    </div>

                                    {/* ANSWER (NO LAYOUT PUSH) */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${isOpen ? "mt-4 max-h-48 opacity-100" : "max-h-0 opacity-0 mt-0"
                                            }`}
                                    >
                                        <div className="border-t border-slate-700 pt-4">
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        );
                    })}

                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-slate-300 mb-4">Still have questions?</p>

                    <a
                        href="#contact"
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
                    >
                        Contact Us
                    </a>
                </div>

            </div>
        </section>
    );
};

export default FAQ;