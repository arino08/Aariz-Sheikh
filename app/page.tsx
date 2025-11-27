"use client";

import Navigation from "@/components/ui/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import AsciiDivider from "@/components/ui/AsciiDivider";
import SpriteGuide from "@/components/ui/SpriteGuide";
import { useEffect, useState } from "react";

export default function Home() {
  const [guideEnabled, setGuideEnabled] = useState(true);

  // Keyboard shortcut to toggle guide (G key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "g" || e.key === "G") {
        // Don't toggle if user is typing in an input
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        ) {
          return;
        }
        setGuideEnabled((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <Navigation />

      <main>
        <div id="hero">
          <HeroSection />
        </div>

        {/* ASCII Divider - Circuit pattern */}
        <AsciiDivider
          pattern="circuit"
          animated={true}
          height="md"
          glowEffect={true}
          speed="slow"
        />

        <div id="about">
          <AboutSection />
        </div>

        {/* ASCII Divider - Binary pattern */}
        <AsciiDivider
          pattern="binary"
          animated={true}
          height="sm"
          color="var(--terminal-purple)"
          speed="normal"
        />

        <div id="skills">
          <SkillsSection />
        </div>

        {/* ASCII Divider - Code pattern */}
        <AsciiDivider
          pattern="code"
          animated={false}
          height="md"
          color="var(--terminal-blue)"
          glowEffect={true}
        />

        <div id="projects">
          <ProjectsSection />
        </div>

        {/* ASCII Divider - Wave pattern */}
        <AsciiDivider
          pattern="wave"
          animated={true}
          height="sm"
          color="var(--terminal-orange)"
          speed="fast"
        />

        <div id="contact">
          <ContactSection />
        </div>
      </main>

      {/* Interactive Sprite Guide Companion */}
      <SpriteGuide enabled={guideEnabled} position="right" size={120} />
    </div>
  );
}
