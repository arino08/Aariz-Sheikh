"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase, type Project } from "@/lib/supabase";
import Image from "next/image";
import { ParallaxBackground, FloatingElement } from "../ui/ParallaxSection";
import TextReveal from "../ui/TextReveal";
import AsciiArtHeading from "../ui/AsciiArtHeading";
import { LightningIcon, RocketIcon, FolderIcon } from "../ui/TerminalIcons";

gsap.registerPlugin(ScrollTrigger);

// Hook to check if mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    // Add subtle hover tilt effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[45vw] md:mx-4 transform-gpu"
      style={{
        animationDelay: `${index * 0.1}s`,
        scrollSnapAlign: "center",
      }}
    >
      <div className="h-full bg-[#161B22] border border-gray-800 hover:border-[var(--terminal-green)]/30 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,136,0.1)]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between bg-[#21262D] px-4 py-3 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[#ff5f56] rounded-full shadow-[0_0_6px_#ff5f56]"></div>
              <div className="w-3 h-3 bg-[#ffbd2e] rounded-full shadow-[0_0_6px_#ffbd2e]"></div>
              <div className="w-3 h-3 bg-[#27ca3f] rounded-full shadow-[0_0_6px_#27ca3f]"></div>
            </div>
            <span className="font-mono text-sm text-[var(--code-comment)] ml-4">
              {project.title.toLowerCase().replace(/\s+/g, "-")}.tsx
            </span>
          </div>
          {project.featured && (
            <div className="flex items-center gap-2 bg-[var(--terminal-orange)]/20 px-3 py-1 rounded-full border border-[var(--terminal-orange)]/30">
              <span className="text-[var(--terminal-orange)]">⭐</span>
              <span className="font-mono text-xs text-[var(--terminal-orange)] font-medium">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Project Image */}
          <div className="lg:w-1/2 relative">
            <div className="aspect-video lg:aspect-[4/3] bg-gradient-to-br from-[var(--terminal-purple)]/10 to-[var(--terminal-blue)]/10 flex items-center justify-center overflow-hidden relative">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  unoptimized={project.image_url.includes("supabase.co")}
                />
              ) : (
                <div className="text-white">
                  <RocketIcon size={64} color="var(--terminal-green)" />
                </div>
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#161B22]"></div>
            </div>
          </div>

          {/* Project Details */}
          <div className="lg:w-1/2 p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title and Description */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                  {project.title}
                </h3>
                <p className="text-[var(--code-comment)] text-sm leading-relaxed line-clamp-3">
                  {project.short_description}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="font-mono text-xs text-[var(--terminal-green)] mb-2 flex items-center gap-2">
                  <LightningIcon size={14} color="var(--terminal-green)" /> Tech
                  Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 5).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="font-mono text-xs bg-[var(--terminal-purple)]/10 text-[var(--terminal-purple)] px-2 py-1 rounded-full border border-[var(--terminal-purple)]/30"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 5 && (
                    <span className="font-mono text-xs text-[var(--code-comment)]">
                      +{project.tech_stack.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-800/50">
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[80px] font-mono text-xs bg-[var(--terminal-green)] text-[#0D1117] px-3 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all duration-300 text-center font-semibold flex items-center justify-center gap-1"
                >
                  <RocketIcon size={14} color="#0D1117" />
                  <span>Demo</span>
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[80px] font-mono text-xs border border-[var(--terminal-blue)] text-[var(--terminal-blue)] px-3 py-2 rounded-lg hover:bg-[var(--terminal-blue)] hover:text-[#0D1117] transition-all duration-300 text-center font-semibold flex items-center justify-center gap-1 group"
                >
                  <FolderIcon size={14} color="currentColor" />
                  <span>Code</span>
                </a>
              )}

              <a
                href={`/docs/${project.id}`}
                className="flex-1 min-w-[80px] font-mono text-xs border border-[var(--terminal-purple)] text-[var(--terminal-purple)] px-3 py-2 rounded-lg hover:bg-[var(--terminal-purple)] hover:text-[#0D1117] transition-all duration-300 text-center font-semibold flex items-center justify-center gap-1"
              >
                <span>📖</span>
                <span>Docs</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "active")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error loading projects:", error);
    } else {
      const sortedProjects = (data || []).sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      setProjects(sortedProjects);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (!section || !scrollContainer || projects.length === 0) return;

    // On mobile, don't use scroll-triggered animation - use native horizontal scroll
    if (isMobile) {
      // Reset any existing transforms
      gsap.set(scrollContainer, { x: 0 });
      return;
    }

    // Clear existing ScrollTriggers for this section
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === section) {
        trigger.kill();
      }
    });

    // Small delay to ensure DOM is ready (Desktop only)
    const timer = setTimeout(() => {
      const containerWidth = scrollContainer.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollAmount = containerWidth - viewportWidth;

      if (scrollAmount > 0) {
        gsap.to(scrollContainer, {
          x: -scrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80px", // Start when top of section hits 80px from top (after navbar)
            end: () => `+=${scrollAmount}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [projects, isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0D1117] min-h-screen overflow-hidden"
      id="projects"
    >
      {/* Parallax Background Elements */}
      <ParallaxBackground variant="dots" speed={0.1} opacity={0.03} />
      <ParallaxBackground variant="grid" speed={0.2} opacity={0.02} />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingElement
          className="absolute top-32 left-10 opacity-10"
          floatSpeed={0.3}
          rotateAmount={10}
        >
          <div className="text-[var(--terminal-green)] font-mono text-5xl">
            {"["}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute top-40 right-16 opacity-10"
          floatSpeed={0.4}
          rotateAmount={-15}
        >
          <div className="text-[var(--terminal-orange)] font-mono text-4xl">
            {"=>"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute bottom-40 left-20 opacity-10"
          floatSpeed={0.35}
          rotateAmount={5}
        >
          <div className="text-[var(--terminal-purple)] font-mono text-4xl">
            {"()"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute bottom-32 right-10 opacity-10"
          floatSpeed={0.45}
          rotateAmount={-10}
        >
          <div className="text-[var(--terminal-green)] font-mono text-5xl">
            {"]"}
          </div>
        </FloatingElement>
      </div>

      {/* Section Header - Hologram Project ASCII Art */}
      <div className="relative z-10 pt-24 pb-8 px-4 text-center">
        <div className="max-w-2xl mx-auto mb-3">
          <AsciiArtHeading
            variant="hologramProject"
            subtitle="Active services running in production"
            color="var(--terminal-green)"
            accentColor="var(--terminal-orange)"
            scale="md"
            animate={true}
            animateOnScroll={true}
          >
            Projects
          </AsciiArtHeading>
        </div>
        <div className="font-mono text-sm text-[var(--code-comment)]">
          {isLoading ? (
            "Loading projects..."
          ) : (
            <TextReveal
              animation="typing"
              speed={30}
              delay={700}
              showCursor={true}
              cursorColor="var(--terminal-green)"
            >
              {`Scroll to explore ${projects.length} projects`}
            </TextReveal>
          )}
        </div>
        {/* Scroll hint */}
        <div className="flex items-center justify-center gap-3 mt-4 text-[var(--terminal-green)]/60">
          <span className="font-mono text-xs">◀</span>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[var(--terminal-green)]/50 to-transparent rounded-full" />
          <span className="font-mono text-xs">▶</span>
        </div>
        {isMobile && (
          <p className="font-mono text-xs text-[var(--terminal-green)]/50 mt-2">
            Swipe to browse projects →
          </p>
        )}
      </div>

      {/* Horizontal Scroll Container */}
      <div
        className={`relative z-10 pb-12 ${
          isMobile
            ? "overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[var(--terminal-green)]/50 scrollbar-track-transparent"
            : "flex items-center overflow-hidden"
        }`}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: isMobile ? "x mandatory" : "none",
        }}
      >
        <div
          ref={scrollContainerRef}
          className={`flex items-stretch ${isMobile ? "px-4 gap-4" : "pl-[5vw]"}`}
          style={{ paddingRight: isMobile ? "1rem" : "30vw" }}
        >
          {isLoading ? (
            <div className="w-screen flex items-center justify-center min-h-[400px]">
              <div className="text-[var(--terminal-green)] font-mono animate-pulse flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--terminal-green)] rounded-full animate-bounce" />
                <span>Loading projects...</span>
                <div
                  className="w-2 h-2 bg-[var(--terminal-green)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          ) : projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))
          ) : (
            <div className="w-screen flex items-center justify-center min-h-[400px]">
              <div className="text-center px-4">
                <div className="text-6xl mb-4">🚧</div>
                <div className="text-[var(--terminal-orange)] font-mono text-xl mb-2">
                  No projects yet
                </div>
                <p className="text-[var(--code-comment)] font-mono text-sm">
                  Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress dots with glow */}
      {projects.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#161B22]/80 backdrop-blur-sm border border-gray-800">
            {projects.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-[var(--terminal-green)]/40 hover:bg-[var(--terminal-green)] hover:shadow-[0_0_10px_var(--terminal-green)] transition-all duration-300 cursor-pointer"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
