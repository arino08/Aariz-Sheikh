"use client";

import { useEffect, useState } from "react";

export default function Navigation() {
        const [activeSection, setActiveSection] = useState("hero");
        const [isScrolled, setIsScrolled] = useState(false);
        const [scrollProgress, setScrollProgress] = useState(0);

        const sections = [
                { id: "hero", label: "Terminal" },
                { id: "about", label: "About" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Projects" },
                { id: "contact", label: "Contact" },
        ];

        useEffect(() => {
                const handleScroll = () => {
                        const scrollPosition = window.scrollY;
                        setIsScrolled(scrollPosition > 100);

                        // Calculate scroll progress
                        const docHeight =
                                document.documentElement.scrollHeight -
                                window.innerHeight;
                        const progress =
                                docHeight > 0
                                        ? Math.min(
                                                  100,
                                                  (scrollPosition / docHeight) *
                                                          100
                                          )
                                        : 0;
                        setScrollProgress(progress);

                        // Determine active section
                        const sectionElements = sections.map((section) => ({
                                id: section.id,
                                element: document.getElementById(section.id),
                                offset: 0,
                        }));

                        for (let i = sectionElements.length - 1; i >= 0; i--) {
                                const section = sectionElements[i];
                                if (section.element) {
                                        const rect =
                                                section.element.getBoundingClientRect();
                                        if (
                                                rect.top <=
                                                window.innerHeight / 2
                                        ) {
                                                setActiveSection(section.id);
                                                break;
                                        }
                                }
                        }
                };

                // Only add event listener on client side
                if (typeof window !== "undefined") {
                        window.addEventListener("scroll", handleScroll);
                        handleScroll(); // Call once to set initial state
                }

                return () => {
                        if (typeof window !== "undefined") {
                                window.removeEventListener(
                                        "scroll",
                                        handleScroll
                                );
                        }
                };
        }, []);

        const scrollToSection = (sectionId: string) => {
                if (typeof window !== "undefined") {
                        const element = document.getElementById(sectionId);
                        if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                        }
                }
        };

        return (
                <nav
                        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                                isScrolled
                                        ? "bg-[#0D1117]/90 backdrop-blur-md border-b border-gray-800"
                                        : "bg-transparent"
                        }`}
                >
                        <div className="max-w-6xl mx-auto px-4 py-4">
                                <div className="flex items-center justify-between">
                                        {/* Logo */}
                                        <div
                                                onClick={() =>
                                                        scrollToSection("hero")
                                                }
                                                className="font-mono text-lg font-bold text-[var(--terminal-green)] cursor-pointer hover:text-[var(--terminal-blue)] transition-colors"
                                        >
                                                {"<Aariz-Sheikh/>"}
                                        </div>

                                        {/* Navigation Links */}
                                        <div className="hidden md:flex items-center space-x-8">
                                                {sections.map((section) => (
                                                        <button
                                                                key={section.id}
                                                                onClick={() =>
                                                                        scrollToSection(
                                                                                section.id
                                                                        )
                                                                }
                                                                className={`font-mono text-sm transition-colors duration-300 hover:text-[var(--terminal-green)] ${
                                                                        activeSection ===
                                                                        section.id
                                                                                ? "text-[var(--terminal-green)]"
                                                                                : "text-[var(--code-comment)]"
                                                                }`}
                                                        >
                                                                {section.label}
                                                        </button>
                                                ))}
                                        </div>

                                        {/* Mobile Menu Button */}
                                        <button className="md:hidden text-[var(--terminal-green)] hover:text-[var(--terminal-blue)] transition-colors">
                                                <svg
                                                        className="w-6 h-6"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                >
                                                        <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 6h16M4 12h16M4 18h16"
                                                        />
                                                </svg>
                                        </button>
                                </div>
                        </div>

                        {/* Progress Bar */}
                        <div
                                className="absolute bottom-0 left-0 h-[1px] bg-[var(--terminal-green)] transition-all duration-300 ease-out"
                                style={{
                                        width: `${scrollProgress}%`,
                                }}
                        />
                </nav>
        );
}
