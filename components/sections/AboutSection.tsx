"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
        const sectionRef = useRef<HTMLDivElement>(null);
        const imageRef = useRef<HTMLDivElement>(null);
        const textRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
                const section = sectionRef.current;
                const image = imageRef.current;
                const text = textRef.current;

                if (section && image && text) {
                        // Animation timeline
                        const tl = gsap.timeline({
                                scrollTrigger: {
                                        trigger: section,
                                        start: "top 80%",
                                        end: "bottom 20%",
                                        toggleActions: "play none none reverse",
                                },
                        });

                        // Animate image from left
                        tl.fromTo(
                                image,
                                { x: -100, opacity: 0 },
                                {
                                        x: 0,
                                        opacity: 1,
                                        duration: 1,
                                        ease: "power3.out",
                                }
                        );

                        // Animate text from right
                        tl.fromTo(
                                text,
                                { x: 100, opacity: 0 },
                                {
                                        x: 0,
                                        opacity: 1,
                                        duration: 1,
                                        ease: "power3.out",
                                },
                                "-=0.5"
                        );
                }

                return () => {
                        ScrollTrigger.getAll().forEach((trigger) =>
                                trigger.kill()
                        );
                };
        }, []);

        return (
                <section
                        ref={sectionRef}
                        className="min-h-screen flex items-center justify-center px-4 py-20"
                        id="about"
                >
                        <div className="max-w-6xl w-full">
                                {/* Section Header */}
                                <div className="text-center mb-16">
                                        <h2 className="font-mono text-[var(--code-comment)] text-lg mb-2">
                                                {/* The Commit Log */}
                                        </h2>
                                        <h3 className="text-4xl md:text-6xl font-bold">
                                                <span className="text-[var(--terminal-green)]">
                                                        About
                                                </span>{" "}
                                                <span className="text-[var(--terminal-orange)]">
                                                        Developer
                                                </span>
                                        </h3>
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                                        {/* Left Column - Image */}
                                        <div
                                                ref={imageRef}
                                                className="relative"
                                        >
                                                <div className="relative w-full max-w-md mx-auto lg:mx-0">
                                                        {/* Profile image */}
                                                        <div className="aspect-square bg-gradient-to-br from-[var(--terminal-purple)] to-[var(--terminal-blue)] rounded-lg p-1">
                                                                <div className="w-full h-full bg-[#0D1117] rounded-lg overflow-hidden relative">
                                                                        <Image
                                                                                src="/assets/devpfp.jpg"
                                                                                alt="Aariz Sheikh - Developer"
                                                                                fill
                                                                                className="object-cover"
                                                                                priority
                                                                        />
                                                                </div>
                                                        </div>

                                                        {/* Terminal-style border */}
                                                        <div className="absolute -inset-2 border border-[var(--terminal-green)] opacity-30 rounded-lg"></div>

                                                        {/* Floating elements */}
                                                        <div className="absolute -top-4 -right-4 font-mono text-xs text-[var(--code-comment)] bg-[#0D1117] px-2 py-1 border border-[var(--terminal-purple)] rounded">
                                                                devpfp.jpg
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Right Column - Code-style Bio */}
                                        <div
                                                ref={textRef}
                                                className="space-y-6"
                                        >
                                                <div className="font-mono text-sm md:text-base leading-relaxed">
                                                        <div className="text-[var(--code-keyword)]">
                                                                {/* /** */}
                                                        </div>
                                                        <div className="text-[var(--code-comment)] pl-2">
                                                                * Full-Stack
                                                                Developer with a
                                                                passion for
                                                                creating
                                                        </div>
                                                        <div className="text-[var(--code-comment)] pl-2">
                                                                * innovative
                                                                digital
                                                                experiences.
                                                                Specializing in
                                                        </div>
                                                        <div className="text-[var(--code-comment)] pl-2">
                                                                * modern web
                                                                technologies and
                                                                clean code
                                                                architecture.
                                                        </div>
                                                        <div className="text-[var(--code-keyword)]">
                                                                */
                                                        </div>

                                                        <div className="mt-6">
                                                                <div className="text-[var(--code-keyword)]">
                                                                        const
                                                                </div>{" "}
                                                                <span className="text-[var(--terminal-blue)]">
                                                                        developer
                                                                </span>{" "}
                                                                <span className="text-white">
                                                                        =
                                                                </span>{" "}
                                                                <span className="text-white">
                                                                        {"{"}
                                                                </span>
                                                        </div>

                                                        <div className="pl-4 space-y-2 mt-2">
                                                                <div>
                                                                        <span className="text-[var(--code-string)]">
                                                                                &quot;name&quot;
                                                                        </span>
                                                                        <span className="text-white">
                                                                                :
                                                                        </span>{" "}
                                                                        <span className="text-[var(--terminal-green)]">
                                                                                &quot;Aariz
                                                                                Sheikh&quot;
                                                                        </span>
                                                                        <span className="text-white">
                                                                                ,
                                                                        </span>
                                                                </div>
                                                                <div>
                                                                        <span className="text-[var(--code-string)]">
                                                                                &quot;role&quot;
                                                                        </span>
                                                                        <span className="text-white">
                                                                                :
                                                                        </span>{" "}
                                                                        <span className="text-[var(--terminal-green)]">
                                                                                &quot;Full-Stack
                                                                                Developer&quot;
                                                                        </span>
                                                                        <span className="text-white">
                                                                                ,
                                                                        </span>
                                                                </div>
                                                                <div>
                                                                        <span className="text-[var(--code-string)]">
                                                                                &quot;location&quot;
                                                                        </span>
                                                                        <span className="text-white">
                                                                                :
                                                                        </span>{" "}
                                                                        <span className="text-[var(--terminal-green)]">
                                                                                &quot;Mumbai&quot;
                                                                        </span>
                                                                        <span className="text-white">
                                                                                ,
                                                                        </span>
                                                                </div>
                                                                <div>
                                                                        <span className="text-[var(--code-string)]">
                                                                                &quot;passion&quot;
                                                                        </span>
                                                                        <span className="text-white">
                                                                                :
                                                                        </span>{" "}
                                                                        <span className="text-white">
                                                                                [
                                                                        </span>
                                                                </div>
                                                                <div className="pl-4">
                                                                        <div>
                                                                                <span className="text-[var(--terminal-green)]">
                                                                                        &quot;Building
                                                                                        scalable
                                                                                        applications&quot;
                                                                                </span>
                                                                                <span className="text-white">
                                                                                        ,
                                                                                </span>
                                                                        </div>
                                                                        <div>
                                                                                <span className="text-[var(--terminal-green)]">
                                                                                        &quot;Learning
                                                                                        new
                                                                                        technologies&quot;
                                                                                </span>
                                                                                <span className="text-white">
                                                                                        ,
                                                                                </span>
                                                                        </div>
                                                                        <div>
                                                                                <span className="text-[var(--terminal-green)]">
                                                                                        &quot;Problem
                                                                                        solving&quot;
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                                <div>
                                                                        <span className="text-white">
                                                                                ],
                                                                        </span>
                                                                </div>
                                                                <div>
                                                                        <span className="text-[var(--code-string)]">
                                                                                &quot;currentFocus&quot;
                                                                        </span>
                                                                        <span className="text-white">
                                                                                :
                                                                        </span>{" "}
                                                                        <span className="text-[var(--terminal-green)]">
                                                                                &quot;React,
                                                                                Next.js,
                                                                                Node.js,
                                                                                GenAI&quot;
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        <div className="mt-2">
                                                                <span className="text-white">
                                                                        {"};"}
                                                                </span>
                                                        </div>
                                                </div>

                                                {/* Call to action */}
                                                <div className="pt-6">
                                                        <button className="group font-mono text-sm bg-transparent border border-[var(--terminal-green)] text-[var(--terminal-green)] px-6 py-3 rounded hover:bg-[var(--terminal-green)] hover:text-[#0D1117] transition-all duration-300">
                                                                <span className="group-hover:hidden">
                                                                        {"> "}
                                                                </span>
                                                                <span className="hidden group-hover:inline">
                                                                        {"$ "}
                                                                </span>
                                                                View Resume
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </section>
        );
}
