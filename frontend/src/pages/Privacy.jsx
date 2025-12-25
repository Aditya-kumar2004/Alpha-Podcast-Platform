import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Shield, ChevronRight, Lock, Eye, Server } from "lucide-react";

const Privacy = () => {
    const [activeSection, setActiveSection] = useState("intro");

    // Handle scroll spy to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = ["intro", "info-collect", "data-usage", "sharing", "security", "rights", "changes", "contact"];
            const scrollPosition = window.scrollY + 200; // Look ahead margin

            // Find the section currently in view
            let currentSection = sections[0];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop } = element;
                    if (scrollPosition >= offsetTop) {
                        currentSection = section;
                    }
                }
            }
            setActiveSection(currentSection);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 180; // Navbar + Sticky Header + minimal buffer
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveSection(id);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#202124] text-[#3c4043] dark:text-[#bdc1c6] font-sans">

                {/* Top Header Bar */}
                <div className="bg-white dark:bg-[#202124] border-b border-gray-200 dark:border-white/10 sticky top-16 z-30">
                    <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">Privacy & Terms</h1>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Effective Dec 16, 2024</span>
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-16 relative">

                    {/* Sidebar Navigation */}
                    <aside className="lg:w-72 flex-shrink-0 hidden lg:block h-[calc(100vh-8rem)] sticky top-32">
                        <nav className="space-y-1">
                            {[
                                { id: "intro", label: "Introduction" },
                                { id: "info-collect", label: "Information We Collect" },
                                { id: "data-usage", label: "Why We Collect Data" },
                                { id: "sharing", label: "Sharing Your Info" },
                                { id: "security", label: "Security Measures" },
                                { id: "rights", label: "Your Controls" },
                                { id: "changes", label: "Policy Changes" },
                                { id: "contact", label: "Contact Us" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full text-left px-4 py-2 rounded-r-full text-sm font-medium transition-colors border-l-4 ${activeSection === item.id
                                        ? "border-blue-600 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "border-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 max-w-3xl">

                        <section id="intro" className="mb-16 scroll-mt-32">
                            <h1 className="text-4xl md:text-5xl font-normal text-gray-900 dark:text-gray-100 mb-8 tracking-tight">
                                Privacy Policy
                            </h1>
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
                                When you use our services, you’re trusting us with your information. We understand this is a big responsibility and work hard to protect your information and put you in control.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your information.
                            </p>
                        </section>

                        <section id="info-collect" className="mb-16 scroll-mt-32">
                            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                                Information ALPHA Collects
                            </h2>
                            <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                                We collect information to provide better services to all our users — from figuring out basic stuff like which language you speak, to more complex things like which podcasts you’ll find most useful.
                            </p>

                            <div className="bg-white dark:bg-[#303134] rounded-xl border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                                <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-4">Things you create or provide to us</h3>
                                <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                                    <li className="flex gap-3">
                                        <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span>Account information (Name, Email, Password) when you sign up.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span>Profile pictures and channel descriptions you upload.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span>Audio and video content you create and upload using our studio tools.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section id="data-usage" className="mb-16 scroll-mt-32">
                            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
                                Why We Collect Data
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-2">Maintain & Improve Services</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">We use data to ensure our services are working as intended, such as tracking outages or troubleshooting issues requiring your feedback.</p>
                                </div>
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-2">Personalized Recommendations</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">We use your listening history to recommend new podcasts and episodes we think you will love.</p>
                                </div>
                            </div>
                        </section>

                        <section id="sharing" className="mb-16 scroll-mt-32">
                            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                                Sharing Your Information
                            </h2>
                            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                We do not share your personal information with companies, organizations, or individuals outside of ALPHA except in the following cases:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                                <li><strong>With your consent:</strong> We’ll share personal information outside of ALPHA when we have your consent.</li>
                                <li><strong>For legal reasons:</strong> We will share personal information if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process, or enforceable governmental request.</li>
                            </ul>
                        </section>

                        <section id="security" className="mb-16 scroll-mt-32">
                            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">4</span>
                                We Secure Your Information
                            </h2>
                            <div className="flex gap-6 items-start p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#303134]">
                                <Lock className="w-10 h-10 text-green-500 shrink-0" />
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-3">All ALPHA services are built with strong security features that continuously protect your information. The insights we gain from maintaining our services help us detect and automatically block security threats from reaching you.</p>
                                    <p className="text-gray-600 dark:text-gray-300">We use <strong>Encryption</strong> to keep your data private while in transit.</p>
                                </div>
                            </div>
                        </section>

                        <section id="rights" className="mb-16 scroll-mt-32">
                            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">5</span>
                                Your Controls
                            </h2>
                            <p className="mb-6 text-gray-600 dark:text-gray-300">You have choices regarding the information we collect and how it's used.</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-1 group-hover:underline">Access Your Data</h4>
                                    <p className="text-sm text-gray-500">View what data we hold about you.</p>
                                </div>
                                <div className="p-5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-1 group-hover:underline">Delete Your Account</h4>
                                    <p className="text-sm text-gray-500">Permanently remove all your info.</p>
                                </div>
                            </div>
                        </section>

                        <section id="changes" className="mb-16 scroll-mt-32">
                            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">6</span>
                                Policy Changes
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                            </p>
                        </section>

                        <section id="contact" className="mb-16 scroll-mt-32">
                            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">7</span>
                                Contact Us
                            </h2>
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#303134] border border-gray-200 dark:border-white/10 text-center shadow-sm">
                                <h3 className="font-medium text-xl text-gray-900 dark:text-gray-100 mb-3">Still have questions?</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                                    If you have any specific questions about our Privacy Policy or how we handle your data, please don't hesitate to reach out.
                                </p>
                                <a
                                    href="mailto:adityakuma876@gmail.com?subject=Privacy%20Policy%20Question"
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Send Email
                                </a>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default Privacy;
