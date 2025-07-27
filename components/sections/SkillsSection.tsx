"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
        name: string;
        category: "frontend" | "backend";
        icon: string; // SVG path or icon identifier
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

function SkillIcon({ skill, index }: { skill: Skill; index: number }) {
        const iconRef = useRef<HTMLDivElement>(null);
        const nameRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
                const icon = iconRef.current;
                const name = nameRef.current;

                if (icon && name) {
                        // Initial hidden state
                        gsap.set([icon, name], { opacity: 0, scale: 0.5 });

                        // Draw animation on scroll
                        ScrollTrigger.create({
                                trigger: icon,
                                start: "top 80%",
                                onEnter: () => {
                                        gsap.to(icon, {
                                                opacity: 1,
                                                scale: 1,
                                                duration: 0.6,
                                                delay: index * 0.1,
                                                ease: "back.out(1.7)",
                                        });

                                        gsap.to(name, {
                                                opacity: 1,
                                                duration: 0.3,
                                                delay: index * 0.1 + 0.3,
                                        });
                                },
                        });
                }
        }, [index]);

        const getIconSVG = (iconType: string) => {
                const iconClass = "w-12 h-12 stroke-current fill-none stroke-2";

                switch (iconType) {
                        case "react":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <path d="M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
                                                <path d="M12 2c1.5 0 3 .5 4 1.5L20 7l-4 3.5c-1 1-2.5 1.5-4 1.5s-3-.5-4-1.5L4 7l4-3.5C9 2.5 10.5 2 12 2z" />
                                                <path d="M12 22c-1.5 0-3-.5-4-1.5L4 17l4-3.5c1-1 2.5-1.5 4-1.5s3 .5 4 1.5L20 17l-4 3.5c-1 1-2.5 1.5-4 1.5z" />
                                        </svg>
                                );
                        case "nextjs":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="2"
                                                />
                                                <path d="M8 8h8v8H8z" />
                                                <path d="M12 8v8" />
                                                <path d="M8 12h8" />
                                        </svg>
                                );
                        case "typescript":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="2"
                                                />
                                                <path d="M8 8h8" />
                                                <path d="M8 12h4" />
                                                <path d="M8 16h2" />
                                                <path d="M16 12v4" />
                                        </svg>
                                );
                        case "tailwind":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <path d="M6 6l6 6-6 6" />
                                                <path d="M12 6l6 6-6 6" />
                                        </svg>
                                );
                        case "threejs":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <polygon points="12,2 2,7 12,12 22,7" />
                                                <polyline points="2,17 12,22 22,17" />
                                                <polyline points="2,12 12,17 22,12" />
                                        </svg>
                                );
                        case "gsap":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <path d="M3 12h18" />
                                                <path d="M3 6h18" />
                                                <path d="M3 18h18" />
                                                <circle cx="12" cy="12" r="2" />
                                        </svg>
                                );
                        case "nodejs":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <path d="M12 2v20" />
                                                <path d="M6 7l6-5 6 5v10l-6 5-6-5V7z" />
                                        </svg>
                                );
                        case "postgresql":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <rect
                                                        x="4"
                                                        y="6"
                                                        width="16"
                                                        height="12"
                                                        rx="2"
                                                />
                                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                <path d="M4 12h16" />
                                                <path d="M8 12v4" />
                                                <path d="M16 12v4" />
                                        </svg>
                                );
                        case "mongodb":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
                                                <path d="M12 22V2" />
                                        </svg>
                                );
                        case "docker":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <rect
                                                        x="4"
                                                        y="8"
                                                        width="4"
                                                        height="4"
                                                />
                                                <rect
                                                        x="8"
                                                        y="8"
                                                        width="4"
                                                        height="4"
                                                />
                                                <rect
                                                        x="12"
                                                        y="8"
                                                        width="4"
                                                        height="4"
                                                />
                                                <rect
                                                        x="16"
                                                        y="8"
                                                        width="4"
                                                        height="4"
                                                />
                                                <rect
                                                        x="8"
                                                        y="4"
                                                        width="4"
                                                        height="4"
                                                />
                                                <path d="M2 12h20" />
                                                <path d="M2 16h20" />
                                        </svg>
                                );
                        case "aws":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <path d="M3 12l9-9 9 9" />
                                                <path d="M5 12h14" />
                                                <path d="M12 3v9" />
                                                <path d="M7 18h10" />
                                        </svg>
                                );
                        case "graphql":
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                                                <circle cx="12" cy="12" r="2" />
                                                <path d="M12 2v20" />
                                                <path d="M2 8.5L22 15.5" />
                                                <path d="M2 15.5L22 8.5" />
                                        </svg>
                                );
                        default:
                                return (
                                        <svg
                                                className={iconClass}
                                                viewBox="0 0 24 24"
                                        >
                                                <rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="2"
                                                />
                                        </svg>
                                );
                }
        };

        return (
                <div className="group flex flex-col items-center p-6 rounded-lg border border-gray-800 hover:border-[var(--terminal-green)] transition-all duration-300 cursor-pointer">
                        <div
                                ref={iconRef}
                                className="text-[var(--terminal-green)] group-hover:text-white transition-colors duration-300 mb-4"
                        >
                                {getIconSVG(skill.icon)}
                        </div>

                        <div ref={nameRef} className="text-center">
                                <h4 className="font-mono text-lg font-semibold text-white mb-2">
                                        {skill.name}
                                </h4>
                                <p className="font-mono text-sm text-[var(--code-comment)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {skill.description}
                                </p>
                        </div>
                </div>
        );
}

export default function SkillsSection() {
        const sectionRef = useRef<HTMLDivElement>(null);

        const frontendSkills = skills.filter(
                (skill) => skill.category === "frontend"
        );
        const backendSkills = skills.filter(
                (skill) => skill.category === "backend"
        );

        return (
                <section
                        ref={sectionRef}
                        className="min-h-screen flex items-center justify-center px-4 py-20"
                        id="skills"
                >
                        <div className="max-w-6xl w-full">
                                {/* Section Header */}
                                <div className="text-center mb-16">
                                        <h2 className="font-mono text-[var(--code-comment)] text-lg mb-2">
                                                // The Tech Stack
                                        </h2>
                                        <h3 className="text-4xl md:text-6xl font-bold">
                                                <span className="text-[var(--terminal-purple)]">
                                                        Skills
                                                </span>{" "}
                                                <span className="text-[var(--terminal-orange)]">
                                                        &
                                                </span>{" "}
                                                <span className="text-[var(--terminal-blue)]">
                                                        Technologies
                                                </span>
                                        </h3>
                                </div>

                                {/* Skills Grid */}
                                <div className="space-y-12">
                                        {/* Frontend Section */}
                                        <div>
                                                <h4 className="font-mono text-xl text-[var(--terminal-green)] mb-6 flex items-center">
                                                        <span className="text-[var(--code-comment)]">
                                                                {"// "}
                                                        </span>
                                                        Frontend
                                                </h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                        {frontendSkills.map(
                                                                (
                                                                        skill,
                                                                        index
                                                                ) => (
                                                                        <SkillIcon
                                                                                key={
                                                                                        skill.name
                                                                                }
                                                                                skill={
                                                                                        skill
                                                                                }
                                                                                index={
                                                                                        index
                                                                                }
                                                                        />
                                                                )
                                                        )}
                                                </div>
                                        </div>

                                        {/* Backend Section */}
                                        <div>
                                                <h4 className="font-mono text-xl text-[var(--terminal-orange)] mb-6 flex items-center">
                                                        <span className="text-[var(--code-comment)]">
                                                                {"// "}
                                                        </span>
                                                        Backend & Infrastructure
                                                </h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                        {backendSkills.map(
                                                                (
                                                                        skill,
                                                                        index
                                                                ) => (
                                                                        <SkillIcon
                                                                                key={
                                                                                        skill.name
                                                                                }
                                                                                skill={
                                                                                        skill
                                                                                }
                                                                                index={
                                                                                        index +
                                                                                        frontendSkills.length
                                                                                }
                                                                        />
                                                                )
                                                        )}
                                                </div>
                                        </div>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-16 text-center">
                                        <div className="font-mono text-sm text-[var(--code-comment)] max-w-2xl mx-auto">
                                                <span className="text-[var(--code-keyword)]">
                                                        const
                                                </span>{" "}
                                                <span className="text-[var(--terminal-blue)]">
                                                        continuousLearning
                                                </span>{" "}
                                                <span className="text-white">
                                                        =
                                                </span>{" "}
                                                <span className="text-[var(--terminal-green)]">
                                                        true
                                                </span>
                                                <span className="text-white">
                                                        ;
                                                </span>
                                                <br />
                                                <span className="text-[var(--code-comment)]">
                                                        // Always exploring new
                                                        technologies and best
                                                        practices
                                                </span>
                                        </div>
                                </div>
                        </div>
                </section>
        );
}
