"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
        const sectionRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const backgroundRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
                const section = sectionRef.current;
                const content = contentRef.current;
                const background = backgroundRef.current;

                if (section && content && background) {
                        // Background scrolling code animation
                        gsap.to(background, {
                                y: -50,
                                ease: "none",
                                scrollTrigger: {
                                        trigger: section,
                                        start: "top bottom",
                                        end: "bottom top",
                                        scrub: true,
                                },
                        });

                        // Content fade in animation
                        ScrollTrigger.create({
                                trigger: section,
                                start: "top 80%",
                                onEnter: () => {
                                        gsap.fromTo(
                                                content,
                                                { opacity: 0, y: 50 },
                                                {
                                                        opacity: 1,
                                                        y: 0,
                                                        duration: 1,
                                                        ease: "power3.out",
                                                }
                                        );
                                },
                        });
                }
        }, []);

        const contactInfo = {
                email: "arinopc22@gmail.com",
                github: "https://github.com/arino08",
                linkedin: "https://www.linkedin.com/in/aariz-sheikh-384432307/",
                twitter: "https://x.com/Sheikh12Ariz",
        };

        return (
                <section
                        ref={sectionRef}
                        className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
                        id="contact"
                >
                        {/* Scrolling Code Background */}
                        <div
                                ref={backgroundRef}
                                className="absolute inset-0 opacity-5 pointer-events-none"
                        >
                                <div className="font-mono text-xs leading-relaxed whitespace-pre transform rotate-12 scale-150">
                                        {Array.from({ length: 50 }, (_, i) => (
                                                <div key={i} className="mb-2">
                                                        {`const developer = {
  name: "Aariz Sheikh",
  skills: ["React", "Node.js", "TypeScript"],
  passion: "Building amazing experiences",
  availability: "Open to opportunities"
};

async function connectWithDeveloper() {
  try {
    const response = await fetch('/api/contact');
    const connection = await response.json();
    return connection.success;
  } catch (error) {
    console.log('Let\\'s connect anyway!');
  }
}`}
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* Content */}
                        <div
                                ref={contentRef}
                                className="relative z-10 max-w-4xl w-full text-center"
                        >
                                {/* Header */}
                                <div className="mb-12">
                                        <h2 className="font-mono text-[var(--code-comment)] text-lg mb-2">
                                                {/* get_in_touch() */}
                                        </h2>
                                        <h3 className="text-4xl md:text-6xl font-bold mb-6">
                                                <span className="text-[var(--terminal-green)]">
                                                        Let&apos;s
                                                </span>{" "}
                                                <span className="text-[var(--terminal-blue)]">
                                                        Connect
                                                </span>
                                        </h3>
                                        <p className="text-[var(--code-comment)] max-w-2xl mx-auto leading-relaxed">
                                                Ready to bring your ideas to
                                                life? I&apos;m always excited to
                                                collaborate on innovative
                                                projects and discuss new
                                                opportunities.
                                        </p>
                                </div>

                                {/* Contact Information as Code */}
                                <div className="bg-[#161B22] border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
                                        {/* Terminal Header */}
                                        <div className="flex items-center justify-between bg-[#21262D] -m-8 mb-6 px-6 py-3 rounded-t-lg border-b border-gray-700">
                                                <div className="flex items-center space-x-2">
                                                        <div className="flex space-x-2">
                                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        </div>
                                                        <span className="font-mono text-sm text-[var(--code-comment)] ml-4">
                                                                contact.js
                                                        </span>
                                                </div>
                                        </div>

                                        {/* Contact Code */}
                                        <div className="font-mono text-left space-y-2">
                                                <div>
                                                        <span className="text-[var(--code-keyword)]">
                                                                const
                                                        </span>{" "}
                                                        <span className="text-[var(--terminal-blue)]">
                                                                contact
                                                        </span>{" "}
                                                        <span className="text-white">
                                                                =
                                                        </span>{" "}
                                                        <span className="text-white">
                                                                {"{"}
                                                        </span>
                                                </div>

                                                <div className="pl-4 space-y-2">
                                                        <div className="group cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors">
                                                                <span className="text-[var(--code-string)]">
                                                                        &quot;email&quot;
                                                                </span>
                                                                <span className="text-white">
                                                                        :
                                                                </span>{" "}
                                                                <a
                                                                        href={`mailto:${contactInfo.email}`}
                                                                        className="text-[var(--terminal-green)] hover:underline"
                                                                >
                                                                        &quot;
                                                                        {
                                                                                contactInfo.email
                                                                        }
                                                                        &quot;
                                                                </a>
                                                                <span className="text-white">
                                                                        ,
                                                                </span>
                                                        </div>

                                                        <div className="group cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors">
                                                                <span className="text-[var(--code-string)]">
                                                                        &quot;github&quot;
                                                                </span>
                                                                <span className="text-white">
                                                                        :
                                                                </span>{" "}
                                                                <a
                                                                        href={
                                                                                contactInfo.github
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-[var(--terminal-green)] hover:underline"
                                                                >
                                                                        &quot;
                                                                        {
                                                                                contactInfo.github
                                                                        }
                                                                        &quot;
                                                                </a>
                                                                <span className="text-white">
                                                                        ,
                                                                </span>
                                                        </div>

                                                        <div className="group cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors">
                                                                <span className="text-[var(--code-string)]">
                                                                        &quot;linkedin&quot;
                                                                </span>
                                                                <span className="text-white">
                                                                        :
                                                                </span>{" "}
                                                                <a
                                                                        href={
                                                                                contactInfo.linkedin
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-[var(--terminal-green)] hover:underline"
                                                                >
                                                                        &quot;
                                                                        {
                                                                                contactInfo.linkedin
                                                                        }
                                                                        &quot;
                                                                </a>
                                                                <span className="text-white">
                                                                        ,
                                                                </span>
                                                        </div>

                                                        <div className="group cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors">
                                                                <span className="text-[var(--code-string)]">
                                                                        &quot;twitter&quot;
                                                                </span>
                                                                <span className="text-white">
                                                                        :
                                                                </span>{" "}
                                                                <a
                                                                        href={
                                                                                contactInfo.twitter
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-[var(--terminal-green)] hover:underline"
                                                                >
                                                                        &quot;
                                                                        {
                                                                                contactInfo.twitter
                                                                        }
                                                                        &quot;
                                                                </a>
                                                        </div>

                                                        <div className="pt-2">
                                                                <span className="text-[var(--code-string)]">
                                                                        &quot;status&quot;
                                                                </span>
                                                                <span className="text-white">
                                                                        :
                                                                </span>{" "}
                                                                <span className="text-[var(--terminal-green)]">
                                                                        &quot;Available
                                                                        for new
                                                                        projects&quot;
                                                                </span>
                                                        </div>
                                                </div>

                                                <div>
                                                        <span className="text-white">
                                                                {"};"}
                                                        </span>
                                                </div>
                                        </div>
                                </div>

                                {/* Call to Action */}
                                <div className="mt-12 space-y-6">
                                        <div className="font-mono text-sm text-[var(--code-comment)]">
                                                <span className="text-[var(--code-keyword)]">
                                                        {/* // */}{" "}
                                                </span>
                                                Ready to start a conversation?
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <a
                                                        href={`mailto:${contactInfo.email}?subject=Let&apos;s work together`}
                                                        className="group font-mono bg-[var(--terminal-green)] text-[#0D1117] px-8 py-4 rounded-lg hover:bg-[var(--terminal-green)]/80 transition-all duration-300 transform hover:scale-105"
                                                >
                                                        <span className="group-hover:hidden">
                                                                {"> "}
                                                        </span>
                                                        <span className="hidden group-hover:inline">
                                                                {"$ "}
                                                        </span>
                                                        Send Email
                                                </a>

                                                <a
                                                        href={
                                                                contactInfo.github
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group font-mono border border-[var(--terminal-blue)] text-[var(--terminal-blue)] px-8 py-4 rounded-lg hover:bg-[var(--terminal-blue)] hover:text-[#0D1117] transition-all duration-300"
                                                >
                                                        <span className="group-hover:hidden">
                                                                {"> "}
                                                        </span>
                                                        <span className="hidden group-hover:inline">
                                                                {"$ "}
                                                        </span>
                                                        View GitHub
                                                </a>
                                        </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-20 pt-8 border-t border-gray-800">
                                        <div className="font-mono text-xs text-[var(--code-comment)]">
                                                <div className="mb-2">
                                                        <span className="text-[var(--code-keyword)]">
                                                                {/* /** */}
                                                        </span>
                                                </div>
                                                <div className="mb-2">
                                                        <span className="text-[var(--code-comment)]">
                                                                {" "}
                                                                * Built with
                                                                Next.js,
                                                                Three.js, GSAP,
                                                                and lots of ☕
                                                        </span>
                                                </div>
                                                <div className="mb-2">
                                                        <span className="text-[var(--code-comment)]">
                                                                {" "}
                                                                * © 2025 Aariz Sheikh. All rights
                                                                reserved.
                                                        </span>
                                                </div>
                                                <div>
                                                        <span className="text-[var(--code-keyword)]">
                                                                */
                                                        </span>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </section>
        );
}
