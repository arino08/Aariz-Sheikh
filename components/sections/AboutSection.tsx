"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  ParallaxBackground,
  FloatingElement,
  ParallaxLayer,
} from "../ui/ParallaxSection";
import StaggeredGrid, { GridItem } from "../ui/StaggeredGrid";
import AsciiArtHeading from "../ui/AsciiArtHeading";

gsap.registerPlugin(ScrollTrigger);

// Hook to check performance settings
function usePerformanceSettings() {
  const [settings, setSettings] = useState({
    enableAnimations: true,
    enableParallax: true,
    enableGlow: true,
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

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const performanceSettings = usePerformanceSettings();
  const animationsEnabled = performanceSettings.enableAnimations;
  const parallaxEnabled = performanceSettings.enableParallax;

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    const header = headerRef.current;

    if (section && image && text && header) {
      if (animationsEnabled) {
        // Animate header
        gsap.fromTo(
          header,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          },
        );

        // Animate image with a smooth reveal
        gsap.fromTo(
          image,
          { x: -80, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
          },
        );

        // Animate text content
        gsap.fromTo(
          text,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
          },
        );
      } else {
        // No animations - ensure elements are immediately visible
        gsap.set(header, { opacity: 1, y: 0 });
        gsap.set(image, { opacity: 1, x: 0, scale: 1 });
        gsap.set(text, { opacity: 1, x: 0 });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animationsEnabled]);

  const stats = [
    { label: "Projects", value: "10+", icon: "📁" },
    { label: "Technologies", value: "15+", icon: "⚡" },
    { label: "Year", value: "3rd", icon: "🎓" },
    { label: "Coffees", value: "∞", icon: "☕" },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden"
      id="about"
    >
      {/* Parallax Background Elements */}
      <ParallaxBackground variant="dots" speed={0.15} opacity={0.03} />
      <ParallaxBackground variant="grid" speed={0.25} opacity={0.02} />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingElement
          className="absolute top-20 left-10 opacity-10"
          floatSpeed={0.35}
          rotateAmount={12}
        >
          <div className="text-[var(--terminal-green)] font-mono text-5xl">
            {"struct"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute top-32 right-16 opacity-10"
          floatSpeed={0.4}
          rotateAmount={-8}
        >
          <div className="text-[var(--terminal-purple)] font-mono text-4xl">
            {"impl"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute bottom-40 left-20 opacity-10"
          floatSpeed={0.3}
          rotateAmount={15}
        >
          <div className="text-[var(--terminal-blue)] font-mono text-4xl">
            {"pub"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute bottom-32 right-24 opacity-10"
          floatSpeed={0.45}
          rotateAmount={-10}
        >
          <div className="text-[var(--terminal-orange)] font-mono text-5xl">
            {"{}"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute top-1/2 left-5 opacity-10"
          floatSpeed={0.5}
          rotateAmount={5}
        >
          <div className="text-[var(--terminal-green)] font-mono text-3xl">
            {"::"}
          </div>
        </FloatingElement>
      </div>

      {/* Background decoration blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[var(--terminal-green)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[var(--terminal-purple)]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--terminal-blue)]/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Section Header - Matrix Rain ASCII Art */}
        <div ref={headerRef} className="text-center mb-16">
          <AsciiArtHeading
            variant="matrixRain"
            subtitle="get to know me"
            color="var(--terminal-green)"
            accentColor="var(--terminal-cyan)"
            scale="md"
            animate={true}
            animateOnScroll={true}
          >
            About
          </AsciiArtHeading>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image with Parallax */}
          <ParallaxLayer speed={0.15} direction="up">
            <div ref={imageRef} className="relative group">
              <div className="relative w-full max-w-md mx-auto lg:mx-0">
                {/* Animated border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--terminal-green)] via-[var(--terminal-blue)] to-[var(--terminal-purple)] rounded-xl opacity-50 blur group-hover:opacity-75 transition-opacity duration-500" />

                {/* Profile image container */}
                <div className="relative aspect-square bg-[#0D1117] rounded-xl overflow-hidden border border-gray-800">
                  <Image
                    src="/assets/devpfp.jpg"
                    alt="Aariz Sheikh - Developer"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent opacity-60" />

                  {/* Terminal overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 font-mono text-xs">
                    <div className="flex items-center gap-2 text-[var(--terminal-green)]">
                      <span className="w-2 h-2 bg-[var(--terminal-green)] rounded-full animate-pulse" />
                      <span>available for opportunities</span>
                    </div>
                  </div>

                  {/* Scanline effect */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                    }}
                  />
                </div>

                {/* Floating file tag */}
                <div className="absolute -top-3 -right-3 font-mono text-xs text-[var(--code-comment)] bg-[#161B22] px-3 py-1.5 border border-[var(--terminal-purple)]/50 rounded-lg shadow-lg hover:border-[var(--terminal-purple)] transition-colors duration-300">
                  <span className="text-[var(--terminal-purple)]">📄</span>{" "}
                  developer.jpg
                </div>

                {/* Location tag */}
                <div className="absolute -bottom-3 -left-3 font-mono text-xs text-[var(--code-comment)] bg-[#161B22] px-3 py-1.5 border border-[var(--terminal-blue)]/50 rounded-lg shadow-lg hover:border-[var(--terminal-blue)] transition-colors duration-300">
                  <span className="text-[var(--terminal-blue)]">📍</span>{" "}
                  Mumbai, India
                </div>
              </div>
            </div>
          </ParallaxLayer>

          {/* Right Column - Code-style Bio with Parallax */}
          <ParallaxLayer speed={0.1} direction="up">
            <div ref={textRef} className="space-y-6">
              {/* Code block */}
              <div className="bg-[#161B22] rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors duration-300">
                {/* Code header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#21262D] border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27ca3f] shadow-[0_0_6px_#27ca3f]" />
                  </div>
                  <span className="font-mono text-xs text-[var(--code-comment)] ml-2">
                    about.rs
                  </span>
                </div>

                {/* Code content */}
                <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto">
                  <div className="text-[var(--code-comment)]">
                    {"// Who am I?"}
                  </div>

                  <div className="mt-3">
                    <span className="text-[var(--code-keyword)]">
                      pub struct
                    </span>{" "}
                    <span className="text-[var(--terminal-blue)]">
                      Developer
                    </span>{" "}
                    <span className="text-white">{"{"}</span>
                  </div>

                  <div className="pl-4 space-y-1 mt-1">
                    <div>
                      <span className="text-[var(--terminal-purple)]">
                        name
                      </span>
                      <span className="text-white">:</span>{" "}
                      <span className="text-[var(--terminal-green)]">
                        &quot;Aariz Sheikh&quot;
                      </span>
                      <span className="text-white">,</span>
                    </div>
                    <div>
                      <span className="text-[var(--terminal-purple)]">
                        role
                      </span>
                      <span className="text-white">:</span>{" "}
                      <span className="text-[var(--terminal-green)]">
                        &quot;Full-Stack Developer&quot;
                      </span>
                      <span className="text-white">,</span>
                    </div>
                    <div>
                      <span className="text-[var(--terminal-purple)]">
                        education
                      </span>
                      <span className="text-white">:</span>{" "}
                      <span className="text-[var(--terminal-green)]">
                        &quot;3rd Year IT Student&quot;
                      </span>
                      <span className="text-white">,</span>
                    </div>
                    <div>
                      <span className="text-[var(--terminal-purple)]">
                        passions
                      </span>
                      <span className="text-white">:</span>{" "}
                      <span className="text-[var(--terminal-blue)]">vec!</span>
                      <span className="text-white">[</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[var(--terminal-green)]">
                        &quot;Building scalable apps&quot;
                      </span>
                      <span className="text-white">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[var(--terminal-green)]">
                        &quot;Systems programming&quot;
                      </span>
                      <span className="text-white">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[var(--terminal-green)]">
                        &quot;Clean architecture&quot;
                      </span>
                      <span className="text-white">,</span>
                    </div>
                    <div>
                      <span className="text-white">],</span>
                    </div>
                    <div>
                      <span className="text-[var(--terminal-purple)]">
                        current_focus
                      </span>
                      <span className="text-white">:</span>{" "}
                      <span className="text-[var(--terminal-blue)]">vec!</span>
                      <span className="text-white">[</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[var(--terminal-green)]">
                        &quot;Rust&quot;
                      </span>
                      <span className="text-white">,</span>{" "}
                      <span className="text-[var(--terminal-green)]">
                        &quot;Next.js&quot;
                      </span>
                      <span className="text-white">,</span>{" "}
                      <span className="text-[var(--terminal-green)]">
                        &quot;GenAI&quot;
                      </span>
                    </div>
                    <div>
                      <span className="text-white">],</span>
                    </div>
                  </div>

                  <div className="mt-1">
                    <span className="text-white">{"}"}</span>
                  </div>

                  <div className="mt-4 text-[var(--code-comment)]">
                    {"// Always learning, always building 🚀"}
                  </div>
                </div>
              </div>

              {/* Stats Grid with Staggered Animation */}
              <StaggeredGrid
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                columns={4}
                staggerDelay={0.1}
                duration={0.5}
                fromY={30}
                fromScale={0.9}
                pattern="wave"
                triggerStart="top 85%"
              >
                {stats.map((stat, index) => (
                  <GridItem
                    key={index}
                    glowOnHover={true}
                    glowColor={
                      index === 0
                        ? "var(--terminal-green)"
                        : index === 1
                          ? "var(--terminal-blue)"
                          : index === 2
                            ? "var(--terminal-purple)"
                            : "var(--terminal-orange)"
                    }
                    tiltOnHover={true}
                    className="bg-[#161B22] border border-gray-800 rounded-lg p-4 text-center hover:border-current transition-all duration-300 group"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div
                      className="font-mono text-xl font-bold"
                      style={{
                        color:
                          index === 0
                            ? "var(--terminal-green)"
                            : index === 1
                              ? "var(--terminal-blue)"
                              : index === 2
                                ? "var(--terminal-purple)"
                                : "var(--terminal-orange)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="font-mono text-xs text-[var(--code-comment)]">
                      {stat.label}
                    </div>
                  </GridItem>
                ))}
              </StaggeredGrid>
            </div>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
}
