"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StaggeredGrid, { GridItem } from "../ui/StaggeredGrid";
import { ParallaxBackground, FloatingElement } from "../ui/ParallaxSection";
import AsciiArtHeading from "../ui/AsciiArtHeading";

gsap.registerPlugin(ScrollTrigger);

// Hook to check performance settings
function usePerformanceSettings() {
  const [settings, setSettings] = useState({
    enableAnimations: true,
    enableParallax: true,
    enableGlow: true,
    enableFloatingElements: true,
    level: "high" as string,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSettings = () => {
      try {
        const savedSettings = localStorage.getItem(
          "portfolio-performance-settings",
        );
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({
            enableAnimations: parsed.enableAnimations !== false,
            enableParallax: parsed.enableParallax !== false,
            enableGlow: parsed.enableGlow !== false,
            enableFloatingElements: parsed.enableFloatingElements !== false,
            level: parsed.level || "high",
          });
        }
      } catch {
        // Use defaults
      }
    };

    checkSettings();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio-performance-settings") {
        checkSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return settings;
}

interface Skill {
  name: string;
  category: "frontend" | "backend";
  icon: string;
  description: string;
}

const skills: Skill[] = [
  // Frontend Skills
  {
    name: "React",
    category: "frontend",
    icon: "react",
    description: "Component-based UI library",
  },
  {
    name: "Next.js",
    category: "frontend",
    icon: "nextjs",
    description: "Full-stack React framework",
  },
  {
    name: "TypeScript",
    category: "frontend",
    icon: "typescript",
    description: "Typed JavaScript",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    icon: "tailwind",
    description: "Utility-first CSS framework",
  },
  {
    name: "Three.js",
    category: "frontend",
    icon: "threejs",
    description: "3D graphics library",
  },
  {
    name: "GSAP",
    category: "frontend",
    icon: "gsap",
    description: "Animation library",
  },

  // Backend Skills
  {
    name: "Rust",
    category: "backend",
    icon: "rust",
    description: "Systems programming language",
  },
  {
    name: "Node.js",
    category: "backend",
    icon: "nodejs",
    description: "JavaScript runtime",
  },
  {
    name: "PostgreSQL",
    category: "backend",
    icon: "postgresql",
    description: "Relational database",
  },
  {
    name: "MongoDB",
    category: "backend",
    icon: "mongodb",
    description: "NoSQL database",
  },
  {
    name: "Docker",
    category: "backend",
    icon: "docker",
    description: "Containerization platform",
  },
  {
    name: "AWS",
    category: "backend",
    icon: "aws",
    description: "Cloud services",
  },
  {
    name: "GraphQL",
    category: "backend",
    icon: "graphql",
    description: "Query language for APIs",
  },
];

function SkillCard({ skill }: { skill: Skill }) {
  const getIconSVG = (iconType: string) => {
    const iconClass = "w-12 h-12 stroke-current fill-none stroke-2";

    switch (iconType) {
      case "react":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <path d="M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
            <path d="M12 2c1.5 0 3 .5 4 1.5L20 7l-4 3.5c-1 1-2.5 1.5-4 1.5s-3-.5-4-1.5L4 7l4-3.5C9 2.5 10.5 2 12 2z" />
            <path d="M12 22c-1.5 0-3-.5-4-1.5L4 17l4-3.5c1-1 2.5-1.5 4-1.5s3 .5 4 1.5L20 17l-4 3.5c-1 1-2.5 1.5-4 1.5z" />
          </svg>
        );
      case "nextjs":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M8 8h8v8H8z" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        );
      case "typescript":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M8 8h8" />
            <path d="M8 12h4" />
            <path d="M8 16h2" />
            <path d="M16 12v4" />
          </svg>
        );
      case "tailwind":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <path d="M6 6l6 6-6 6" />
            <path d="M12 6l6 6-6 6" />
          </svg>
        );
      case "threejs":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <polygon points="12,2 2,7 12,12 22,7" />
            <polyline points="2,17 12,22 22,17" />
            <polyline points="2,12 12,17 22,12" />
          </svg>
        );
      case "gsap":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case "rust":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v2" />
            <path d="M12 19v2" />
            <path d="M3 12h2" />
            <path d="M19 12h2" />
            <path d="M5.6 5.6l1.4 1.4" />
            <path d="M17 17l1.4 1.4" />
            <path d="M5.6 18.4l1.4-1.4" />
            <path d="M17 7l1.4-1.4" />
            <path d="M8 12h3l2 3" />
            <path d="M13 9h2v6" />
          </svg>
        );
      case "nodejs":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <path d="M12 2v20" />
            <path d="M6 7l6-5 6 5v10l-6 5-6-5V7z" />
          </svg>
        );
      case "postgresql":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <rect x="4" y="6" width="16" height="12" rx="2" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M4 12h16" />
            <path d="M8 12v4" />
            <path d="M16 12v4" />
          </svg>
        );
      case "mongodb":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            <path d="M12 22V2" />
          </svg>
        );
      case "docker":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <rect x="4" y="8" width="4" height="4" />
            <rect x="8" y="8" width="4" height="4" />
            <rect x="12" y="8" width="4" height="4" />
            <rect x="16" y="8" width="4" height="4" />
            <rect x="8" y="4" width="4" height="4" />
            <path d="M2 12h20" />
            <path d="M2 16h20" />
          </svg>
        );
      case "aws":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <path d="M3 12l9-9 9 9" />
            <path d="M5 12h14" />
            <path d="M12 3v9" />
            <path d="M7 18h10" />
          </svg>
        );
      case "graphql":
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M12 2v20" />
            <path d="M2 8.5L22 15.5" />
            <path d="M2 15.5L22 8.5" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        );
    }
  };

  const categoryColor =
    skill.category === "frontend"
      ? "var(--terminal-green)"
      : "var(--terminal-orange)";

  return (
    <GridItem
      glowOnHover={true}
      glowColor={categoryColor}
      tiltOnHover={true}
      className="group flex flex-col items-center p-6 rounded-lg border border-gray-800 hover:border-current transition-all duration-300 cursor-pointer bg-[#0D1117]/50 backdrop-blur-sm"
    >
      <div
        className="transition-colors duration-300 mb-4"
        style={{ color: categoryColor }}
      >
        {getIconSVG(skill.icon)}
      </div>

      <div className="text-center">
        <h4 className="font-mono text-lg font-semibold text-white mb-2 group-hover:text-current transition-colors duration-300">
          {skill.name}
        </h4>
        <p className="font-mono text-sm text-[var(--code-comment)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-y-0 translate-y-2">
          {skill.description}
        </p>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${categoryColor}, transparent 70%)`,
        }}
      />
    </GridItem>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const performanceSettings = usePerformanceSettings();
  const animationsEnabled = performanceSettings.enableAnimations;
  const parallaxEnabled = performanceSettings.enableParallax;
  const floatingEnabled = performanceSettings.enableFloatingElements;

  const frontendSkills = skills.filter(
    (skill) => skill.category === "frontend",
  );
  const backendSkills = skills.filter((skill) => skill.category === "backend");

  // Animate header on scroll
  useEffect(() => {
    if (!headerRef.current) return;

    if (animationsEnabled) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        },
      );
    } else {
      // No animations - ensure header is immediately visible
      gsap.set(headerRef.current, { opacity: 1, y: 0 });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animationsEnabled]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
      id="skills"
    >
      {/* Parallax Background Elements - conditional */}
      {parallaxEnabled && (
        <>
          <ParallaxBackground variant="dots" speed={0.15} opacity={0.03} />
          <ParallaxBackground variant="grid" speed={0.25} opacity={0.02} />
        </>
      )}

      {/* Floating decorative code elements - conditional */}
      {floatingEnabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingElement
            className="absolute top-20 left-10 opacity-10"
            floatSpeed={0.3}
            rotateAmount={10}
          >
            <div className="text-[var(--terminal-green)] font-mono text-4xl">
              {"<skills>"}
            </div>
          </FloatingElement>

          <FloatingElement
            className="absolute bottom-20 right-10 opacity-10"
            floatSpeed={0.4}
            rotateAmount={-10}
          >
            <div className="text-[var(--terminal-green)] font-mono text-4xl">
              {"</skills>"}
            </div>
          </FloatingElement>

          <FloatingElement
            className="absolute top-1/3 right-20 opacity-10"
            floatSpeed={0.35}
            rotateAmount={15}
          >
            <div className="text-[var(--terminal-purple)] font-mono text-3xl">
              {"impl"}
            </div>
          </FloatingElement>

          <FloatingElement
            className="absolute bottom-1/3 left-20 opacity-10"
            floatSpeed={0.45}
            rotateAmount={-5}
          >
            <div className="text-[var(--terminal-orange)] font-mono text-3xl">
              {"async"}
            </div>
          </FloatingElement>
        </div>
      )}

      <div className="relative z-10 max-w-6xl w-full">
        {/* Section Header - Wave Propagate ASCII Art */}
        <div ref={headerRef} className="text-center mb-16">
          <AsciiArtHeading
            variant="wavePropagate"
            subtitle="The tech stack powering my projects"
            color="var(--terminal-purple)"
            accentColor="var(--terminal-blue)"
            scale="md"
            animate={true}
            animateOnScroll={true}
          >
            Skills
          </AsciiArtHeading>
        </div>

        {/* Skills Grid */}
        <div className="space-y-16">
          {/* Frontend Section */}
          <div>
            <h4 className="font-mono text-xl text-[var(--terminal-green)] mb-8 flex items-center">
              <span className="text-[var(--code-comment)] mr-2">{"// "}</span>
              Frontend
              <span className="ml-4 h-px flex-1 bg-gradient-to-r from-[var(--terminal-green)]/50 to-transparent" />
            </h4>
            <StaggeredGrid
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              columns={6}
              staggerDelay={0.08}
              duration={0.6}
              fromY={40}
              fromScale={0.9}
              pattern="wave"
              triggerStart="top 85%"
            >
              {frontendSkills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </StaggeredGrid>
          </div>

          {/* Backend Section */}
          <div>
            <h4 className="font-mono text-xl text-[var(--terminal-orange)] mb-8 flex items-center">
              <span className="text-[var(--code-comment)] mr-2">{"// "}</span>
              Backend & Infrastructure
              <span className="ml-4 h-px flex-1 bg-gradient-to-r from-[var(--terminal-orange)]/50 to-transparent" />
            </h4>
            <StaggeredGrid
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
              columns={7}
              staggerDelay={0.08}
              duration={0.6}
              fromY={40}
              fromScale={0.9}
              pattern="center-out"
              delay={0.2}
              triggerStart="top 85%"
            >
              {backendSkills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </StaggeredGrid>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <div className="font-mono text-sm text-[var(--code-comment)] max-w-2xl mx-auto p-4 rounded-lg border border-gray-800 bg-[#0D1117]/50 backdrop-blur-sm">
            <span className="text-[var(--code-keyword)]">const</span>{" "}
            <span className="text-[var(--terminal-blue)]">
              continuousLearning
            </span>{" "}
            <span className="text-white">=</span>{" "}
            <span className="text-[var(--terminal-green)]">true</span>
            <span className="text-white">;</span>
            <br />
            <span className="text-[var(--code-comment)]">
              {"// Always exploring new technologies and best practices"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
