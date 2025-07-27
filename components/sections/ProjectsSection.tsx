"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
        id: string;
        title: string;
        description: string;
        techStack: string[];
        liveUrl?: string;
        codeUrl: string;
        apiDocsUrl?: string;
        image: string;
        codeSnippet: string;
}

const projects: Project[] = [
        {
                id: "project-1",
                title: "TeamSyncV2",
                description:
                        "A collaborative platform for real-time document editing, task management, whiteboarding, and team communication, powered by a fully-featured Convex backend.",
                techStack: [
                        "Next.js",
                        "React",
                        "Convex",
                        "Clerk",
                        "Tailwind CSS",
                        "Liveblocks",
                ],
                liveUrl: "#", // Replace with your live URL
                codeUrl: "https://github.com/arino08/TeamSyncV2",
                image: "https://placehold.co/600x400/0D1117/FFFFFF?text=TeamSyncV2",
                codeSnippet: `// convex/documents.ts - Real-time document creation
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});`,
        },
        {
                id: "project-2",
                title: "Graylour",
                description:
                        "A sleek web app that converts grayscale images to vibrant colors using advance AI techniques adn authentication giving storage solutions, with high privacy as data is stored locally, therefore no data is sent to the server",
                techStack: [
                        "Next.js",
                        "React",
                        "Tailwind CSS",
                        "Replicate",
                ],
                liveUrl: "https://graylour.vercel.app", // Replace with your live URL
                codeUrl: "https://github.com/arino08/Graylour",
                image: "https://placehold.co/600x400/0D1117/FFFFFF?text=Graylour",
                codeSnippet: `// app/api/checkout/route.ts - Stripe Checkout Session
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const cartDetails = await request.json();
  const lineItems = validateCartItems(cartDetails); // Assume validation

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:3000/stripe/success",
    cancel_url: "http://localhost:3000/stripe/error",
    line_items: lineItems,
    mode: "payment",
    billing_address_collection: "required",
  });

  return NextResponse.json({ session });
}`,
        },
        {
                id: "project-3",
                title: "Arzion Lore",
                description:
                        "An immersive, animation-rich website to explore the lore of the Arzion universe, built with focus on fluid user experience and letting user write their imaginations with extensive features provided by markdown emulation and live view count.",
                techStack: [
                        "Next.js",
                        "React",
                        "Framer Motion",
                        "Tailwind CSS",
                ],
                liveUrl: "https://arzion-lore.vercel.app", // Replace with your live URL
                codeUrl: "https://github.com/arino08/Arzion-Lore",
                image: "https://placehold.co/600x400/0D1117/FFFFFF?text=Arzion+Lore",
                codeSnippet: `// components/AnimatedPage.tsx - Page transition animations
import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);`,
        },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
        const cardRef = useRef<HTMLDivElement>(null);
        const codeRef = useRef<HTMLDivElement>(null);
        const imageRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
                const card = cardRef.current;
                const code = codeRef.current;
                const image = imageRef.current;
                const content = contentRef.current;

                if (card && code && image && content) {
                        // Create compilation animation timeline
                        const compilationTl = gsap.timeline({ paused: true });

                        // Initial state
                        gsap.set([code, image, content], { opacity: 0 });
                        gsap.set(code, { scale: 0.8, rotationY: -15 });
                        gsap.set(image, { scale: 0.8, y: 50 });
                        gsap.set(content, { y: 30 });

                        // Check if mobile (screen width < 1024px)
                        const isMobile = window.innerWidth < 1024;

                        if (isMobile) {
                                // Mobile: Skip code animation, show image and content directly
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
                        } else {
                                // Desktop: Full compilation sequence
                                compilationTl
                                        .to(code, {
                                                opacity: 1,
                                                scale: 1,
                                                rotationY: 0,
                                                duration: 0.8,
                                                ease: "power2.out",
                                        })
                                        .to(
                                                code,
                                                {
                                                        opacity: 0.3,
                                                        duration: 0.3,
                                                },
                                                "+=0.5"
                                        )
                                        .to(
                                                image,
                                                {
                                                        opacity: 1,
                                                        scale: 1,
                                                        y: 0,
                                                        duration: 0.6,
                                                        ease: "back.out(1.7)",
                                                },
                                                "-=0.1"
                                        )
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
                        }

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
                        className="flex-shrink-0 w-[85vw] sm:w-[75vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] mx-2 sm:mx-4"
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
                                                        {project.id}.tsx
                                                </span>
                                        </div>
                                        <div className="font-mono text-xs text-[var(--code-comment)]">
                                                Building...
                                        </div>
                                </div>

                                <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                                        {/* Added min-h-0 for flexbox */}
                                        {/* Code Section - Hidden on mobile */}
                                        <div className="hidden lg:flex flex-1 p-6 relative overflow-hidden">
                                                <div
                                                        ref={codeRef}
                                                        className="h-full"
                                                >
                                                        <h3 className="font-mono text-sm text-[var(--code-comment)] mb-4">
                                                                {/* Project compilation */}
                                                        </h3>
                                                        <pre className="font-mono text-xs leading-relaxed text-gray-300 overflow-auto h-full">
                                                                <code>
                                                                        {
                                                                                project.codeSnippet
                                                                        }
                                                                </code>
                                                        </pre>
                                                </div>

                                                {/* Compilation overlay */}
                                                <div className="absolute inset-0 pointer-events-none">
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--terminal-green)] to-transparent opacity-0 animate-pulse"></div>
                                                </div>
                                        </div>

                                        {/* Project Showcase - Full width on mobile */}
                                        <div className="flex-1 lg:flex-1 p-3 sm:p-4 lg:p-6 flex flex-col min-h-0">
                                                {/* Project Image/Demo */}
                                                <div
                                                        ref={imageRef}
                                                        className="mb-3 sm:mb-4 lg:mb-6 flex-shrink-0"
                                                >
                                                        <div className="aspect-video bg-gradient-to-br from-[var(--terminal-purple)] to-[var(--terminal-blue)] rounded-lg flex items-center justify-center overflow-hidden">
                                                                {/* Use actual project image if available */}
                                                                {project.image ? (
                                                                        <div
                                                                                style={{
                                                                                        backgroundImage: `url(${project.image})`,
                                                                                        backgroundSize:
                                                                                                "cover",
                                                                                        backgroundPosition:
                                                                                                "center",
                                                                                }}
                                                                                className="w-full h-full rounded-lg"
                                                                                role="img"
                                                                                aria-label={
                                                                                        project.title
                                                                                }
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
                                                                        {
                                                                                project.title
                                                                        }
                                                                </h3>
                                                                <p className="text-[var(--code-comment)] text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                                                                        {
                                                                                project.description
                                                                        }
                                                                </p>
                                                        </div>

                                                        {/* Tech Stack */}
                                                        <div className="flex-shrink-0">
                                                                <h4 className="font-mono text-xs sm:text-sm text-[var(--terminal-green)] mb-1 sm:mb-2">
                                                                        Tech
                                                                        Stack:
                                                                </h4>
                                                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                                                        {project.techStack.map(
                                                                                (
                                                                                        tech,
                                                                                        techIndex
                                                                                ) => (
                                                                                        <span
                                                                                                key={
                                                                                                        techIndex
                                                                                                }
                                                                                                className="font-mono text-xs bg-[var(--terminal-purple)]/20 text-[var(--terminal-purple)] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-[var(--terminal-purple)]/30"
                                                                                        >
                                                                                                {
                                                                                                        tech
                                                                                                }
                                                                                        </span>
                                                                                )
                                                                        )}
                                                                </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3 lg:pt-4 flex-shrink-0 mt-2">
                                                                {project.liveUrl && (
                                                                        <a
                                                                                href={
                                                                                        project.liveUrl
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="font-mono text-xs sm:text-sm bg-[var(--terminal-green)] text-[#0D1117] px-3 sm:px-4 py-2 rounded hover:bg-[var(--terminal-green)]/80 transition-colors text-center font-medium"
                                                                        >
                                                                                <span className="hidden sm:inline">
                                                                                        $
                                                                                        view
                                                                                        --live
                                                                                </span>
                                                                                <span className="sm:hidden">
                                                                                        🚀
                                                                                        Live
                                                                                        Demo
                                                                                </span>
                                                                        </a>
                                                                )}

                                                                <a
                                                                        href={
                                                                                project.codeUrl
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="font-mono text-xs sm:text-sm border border-[var(--terminal-blue)] text-[var(--terminal-blue)] px-3 sm:px-4 py-2 rounded hover:bg-[var(--terminal-blue)] hover:text-[#0D1117] transition-all text-center font-medium"
                                                                >
                                                                        <span className="hidden sm:inline">
                                                                                $
                                                                                git
                                                                                clone
                                                                        </span>
                                                                        <span className="sm:hidden">
                                                                                📂
                                                                                View
                                                                                Code
                                                                        </span>
                                                                </a>

                                                                {project.apiDocsUrl && (
                                                                        <a
                                                                                href={
                                                                                        project.apiDocsUrl
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="font-mono text-xs sm:text-sm border border-[var(--terminal-orange)] text-[var(--terminal-orange)] px-3 sm:px-4 py-2 rounded hover:bg-[var(--terminal-orange)] hover:text-[#0D1117] transition-all text-center font-medium"
                                                                        >
                                                                                <span className="hidden sm:inline">
                                                                                        $
                                                                                        docs
                                                                                        --api
                                                                                </span>
                                                                                <span className="sm:hidden">
                                                                                        📖
                                                                                        API
                                                                                        Docs
                                                                                </span>
                                                                        </a>
                                                                )}
                                                        </div>
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

        useEffect(() => {
                const section = sectionRef.current;
                const container = containerRef.current;

                if (section && container) {
                        // Horizontal scroll animation
                        const scrollWidth =
                                container.scrollWidth - window.innerWidth;

                        gsap.to(container, {
                                x: -scrollWidth,
                                ease: "none",
                                scrollTrigger: {
                                        trigger: section,
                                        start: "top top", // Start when section top hits viewport center
                                        end: () => `+=${scrollWidth}`,
                                        scrub: 1,
                                        pin: true,
                                        anticipatePin: 1,
                                },
                        });
                }
        }, []);

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
                                        <span className="text-[var(--terminal-green)]">
                                                Featured
                                        </span>{" "}
                                        <span className="text-[var(--terminal-orange)]">
                                                Projects
                                        </span>
                                </h3>
                                <p className="font-mono text-sm text-[var(--code-comment)] mt-2">
                                        Scroll horizontally to explore projects
                                </p>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div
                                ref={containerRef}
                                className="flex items-center h-screen px-4 mt-[-6rem]"
                        >
                                {projects.map((project, index) => (
                                        <ProjectCard
                                                key={project.id}
                                                project={project}
                                                index={index}
                                        />
                                ))}

                                {/* End spacer */}
                                <div className="flex-shrink-0 w-20"></div>
                        </div>
                </section>
        );
}
