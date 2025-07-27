"use client";

import Navigation from "@/components/ui/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
        return (
                <div className="min-h-screen bg-[#0D1117] text-white">
                        <Navigation />

                        <main>
                                <div id="hero">
                                        <HeroSection />
                                </div>

                                <div id="about">
                                        <AboutSection />
                                </div>

                                <div id="skills">
                                        <SkillsSection />
                                </div>

                                <div id="projects">
                                        <ProjectsSection />
                                </div>

                                <div id="contact">
                                        <ContactSection />
                                </div>
                        </main>
                </div>
        );
}
