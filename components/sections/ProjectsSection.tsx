"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase, type Project } from "@/lib/supabase";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (card && image && content) {
      // Create compilation animation timeline
      const compilationTl = gsap.timeline({ paused: true });

      // Initial state
      gsap.set([image, content], { opacity: 0 });
      gsap.set(image, { scale: 0.8, y: 50 });
      gsap.set(content, { y: 30 });

      compilationTl
        .to(image, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        })
        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // Trigger animation on scroll
      ScrollTrigger.create({
        trigger: card,
        start: "left 80%",
        onEnter: () => compilationTl.play(),
        onLeave: () => compilationTl.reverse(),
        onEnterBack: () => compilationTl.play(),
        onLeaveBack: () => compilationTl.reverse(),
      });
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-[85vw] sm:w-[75vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] mx-2 sm:mx-4 project-card"
    >
      <div className="h-[70vh] sm:h-[80vh] lg:h-[85vh] bg-[#161B22] border border-gray-800 rounded-lg overflow-hidden flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between bg-[#21262D] px-4 py-3 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-mono text-sm text-[var(--code-comment)] ml-4">
              {project.title.toLowerCase().replace(/\s+/g, '-')}.tsx
            </span>
          </div>
          <div className="font-mono text-xs text-[var(--code-comment)]">
            {project.featured && "⭐ Featured"}
          </div>
        </div>

        <div className="flex-1 p-3 sm:p-4 lg:p-6 flex flex-col min-h-0">
          {/* Project Image/Demo */}
          <div
            ref={imageRef}
            className="mb-3 sm:mb-4 lg:mb-6 flex-shrink-0"
          >
            <div className="aspect-video bg-gradient-to-br from-[var(--terminal-purple)] to-[var(--terminal-blue)] rounded-lg flex items-center justify-center overflow-hidden relative">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 85vw, (max-width: 1024px) 75vw, 50vw"
                  unoptimized={project.image_url.includes('supabase.co')}
                />
              ) : (
                <div className="text-white text-2xl sm:text-4xl">
                  🚀
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div
            ref={contentRef}
            className="flex-1 space-y-2 sm:space-y-3 lg:space-y-4 flex flex-col min-h-0"
          >
            <div className="flex-shrink-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">
                {project.title}
              </h3>
              <p className="text-[var(--code-comment)] text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                {project.short_description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex-shrink-0">
              <h4 className="font-mono text-xs sm:text-sm text-[var(--terminal-green)] mb-1 sm:mb-2">
                Tech Stack:
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {project.tech_stack.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="font-mono text-xs bg-[var(--terminal-purple)]/20 text-[var(--terminal-purple)] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-[var(--terminal-purple)]/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3 lg:pt-4 flex-shrink-0 mt-2">
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs sm:text-sm bg-[var(--terminal-green)] text-[#0D1117] px-3 sm:px-4 py-2 rounded hover:bg-[var(--terminal-green)]/80 transition-colors text-center font-medium"
                >
                  <span className="hidden sm:inline">$ view --live</span>
                  <span className="sm:hidden">🚀 Live Demo</span>
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs sm:text-sm border border-[var(--terminal-blue)] text-[var(--terminal-blue)] px-3 sm:px-4 py-2 rounded hover:bg-[var(--terminal-blue)] hover:text-[#0D1117] transition-all text-center font-medium"
                >
                  <span className="hidden sm:inline">$ git clone</span>
                  <span className="sm:hidden">📂 View Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from Supabase
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
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (section && container && projects.length > 0) {
      // Horizontal scroll animation
      const scrollWidth = container.scrollWidth - window.innerWidth;

      gsap.to(container, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      id="projects"
    >
      {/* Section Header */}
      <div className="text-center py-20 px-4">
        <h2 className="font-mono text-[var(--code-comment)] text-lg mb-2">
          {/* The Repositories */}
        </h2>
        <h3 className="text-4xl md:text-6xl font-bold">
          <span className="text-[var(--terminal-green)]">Featured</span>{" "}
          <span className="text-[var(--terminal-orange)]">Projects</span>
        </h3>
        <p className="font-mono text-sm text-[var(--code-comment)] mt-2">
          {isLoading ? "Loading projects..." : `Scroll horizontally to explore ${projects.length} projects`}
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="flex items-center h-screen px-4 mt-[-6rem]"
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-[var(--terminal-green)] font-mono animate-pulse">
              Loading projects...
            </div>
          </div>
        ) : projects.length > 0 ? (
          <>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
            {/* End spacer */}
            <div className="flex-shrink-0 w-20"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-[var(--terminal-orange)] font-mono text-xl mb-4">
                No projects yet
              </div>
              <p className="text-[var(--code-comment)] font-mono text-sm">
                Press <kbd className="px-2 py-1 bg-gray-800 rounded">Ctrl+K</kbd> to add projects
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
