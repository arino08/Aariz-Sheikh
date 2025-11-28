"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VisitorCounter from "../ui/VisitorCounter";
import MagneticButton from "../ui/MagneticButton";
import {
  ParallaxBackground,
  FloatingElement,
  ParallaxLayer,
} from "../ui/ParallaxSection";
import StaggeredGrid, { GridItem } from "../ui/StaggeredGrid";
import AsciiArtHeading from "../ui/AsciiArtHeading";
import {
  EmailIcon,
  GitHubIcon,
  LinkedInIcon,
  TwitterIcon,
  RocketIcon,
  CoffeeIcon,
  TargetIcon,
} from "../ui/TerminalIcons";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    const content = contentRef.current;

    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
          },
        },
      );
    }

    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: content,
            start: "top 80%",
          },
        },
      );
    }
  }, []);

  // Triple-tap handler for mobile admin access
  const handleSecretTap = () => {
    const now = Date.now();
    const timeDiff = now - lastTapTime;

    if (timeDiff < 500) {
      const newTapCount = tapCount + 1;
      setTapCount(newTapCount);

      if (newTapCount === 2) {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 1000);
      }

      if (newTapCount === 3) {
        const win = window as Window & { openAdminTerminal?: () => void };
        if (typeof window !== "undefined" && win.openAdminTerminal) {
          win.openAdminTerminal();
        }
        setTapCount(0);
        setShowHint(false);
      }
    } else {
      setTapCount(1);
      setShowHint(false);
    }

    setLastTapTime(now);
  };

  const socialLinks = [
    {
      name: "Email",
      value: "arinopc22@gmail.com",
      href: "mailto:arinopc22@gmail.com",
      icon: EmailIcon,
      color: "var(--terminal-green)",
    },
    {
      name: "GitHub",
      value: "@arino08",
      href: "https://github.com/arino08",
      icon: GitHubIcon,
      color: "var(--terminal-purple)",
    },
    {
      name: "LinkedIn",
      value: "Aariz Sheikh",
      href: "https://www.linkedin.com/in/aariz-sheikh-384432307/",
      icon: LinkedInIcon,
      color: "var(--terminal-blue)",
    },
    {
      name: "Twitter",
      value: "@Sheikh12Ariz",
      href: "https://x.com/Sheikh12Ariz",
      icon: TwitterIcon,
      color: "var(--terminal-orange)",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
      id="contact"
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
            {"@"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute top-32 right-16 opacity-10"
          floatSpeed={0.4}
          rotateAmount={-8}
        >
          <div className="text-[var(--terminal-purple)] font-mono text-4xl">
            {"#"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute bottom-40 left-20 opacity-10"
          floatSpeed={0.3}
          rotateAmount={15}
        >
          <div className="text-[var(--terminal-blue)] font-mono text-4xl">
            {"</>"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute bottom-32 right-24 opacity-10"
          floatSpeed={0.45}
          rotateAmount={-10}
        >
          <div className="text-[var(--terminal-orange)] font-mono text-5xl">
            {"::"}
          </div>
        </FloatingElement>

        <FloatingElement
          className="absolute top-1/2 right-5 opacity-10"
          floatSpeed={0.5}
          rotateAmount={5}
        >
          <div className="text-[var(--terminal-green)] font-mono text-3xl">
            {"->"}
          </div>
        </FloatingElement>
      </div>

      {/* Background decoration blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-[var(--terminal-green)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-[var(--terminal-purple)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--terminal-blue)]/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-4xl w-full">
        {/* Header - Neon Flicker ASCII Art */}
        <div ref={headerRef} className="text-center mb-12">
          <div className="max-w-2xl mx-auto">
            <AsciiArtHeading
              variant="neonFlicker"
              subtitle="Ready to collaborate on something awesome?"
              color="var(--terminal-blue)"
              accentColor="var(--terminal-green)"
              scale="md"
              animate={true}
              animateOnScroll={true}
            >
              Contact
            </AsciiArtHeading>
          </div>
        </div>

        {/* Contact Card - Rust Style with Parallax */}
        <ParallaxLayer speed={0.1} direction="up">
          <div className="bg-[#161B22] border border-gray-800 rounded-xl overflow-hidden mb-12 hover:border-gray-700 transition-colors duration-300">
            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-[#21262D] px-4 py-3 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-[#ff5f56] rounded-full shadow-[0_0_6px_#ff5f56]" />
                  <div className="w-3 h-3 bg-[#ffbd2e] rounded-full shadow-[0_0_6px_#ffbd2e]" />
                  <div className="w-3 h-3 bg-[#27ca3f] rounded-full shadow-[0_0_6px_#27ca3f]" />
                </div>
                <span className="font-mono text-sm text-[var(--code-comment)] ml-4">
                  contact.rs
                </span>
              </div>
            </div>

            {/* Rust Code Content */}
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="text-[var(--code-comment)]">
                {"// Let's build something together"}
              </div>

              <div className="mt-4">
                <span className="text-[var(--code-keyword)]">pub struct</span>{" "}
                <span className="text-[var(--terminal-blue)]">Contact</span>{" "}
                <span className="text-white">{"{"}</span>
              </div>

              <div className="pl-4 space-y-3 mt-2">
                {socialLinks.map((link, index) => (
                  <div key={index} className="group">
                    <span className="text-[var(--terminal-purple)]">
                      {link.name.toLowerCase()}
                    </span>
                    <span className="text-white">:</span>{" "}
                    <a
                      href={link.href}
                      target={link.name !== "Email" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:translate-x-1"
                      style={{ color: link.color }}
                    >
                      <span className="group-hover:animate-bounce">
                        <link.icon size={18} color={link.color} glow={true} />
                      </span>
                      <span className="hover:underline underline-offset-4">
                        &quot;{link.value}&quot;
                      </span>
                    </a>
                    <span className="text-white">,</span>
                  </div>
                ))}

                <div className="pt-2">
                  <span className="text-[var(--terminal-purple)]">status</span>
                  <span className="text-white">:</span>{" "}
                  <span className="text-[var(--terminal-green)] inline-flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[var(--terminal-green)] rounded-full animate-pulse shadow-[0_0_8px_var(--terminal-green)]" />
                    Status::Available
                  </span>
                  <span className="text-white">,</span>
                </div>
              </div>

              <div className="mt-2">
                <span className="text-white">{"}"}</span>
              </div>

              <div className="mt-6 text-[var(--code-comment)] flex items-center gap-2">
                <span>{"// cargo run --release"}</span>
                <RocketIcon
                  size={16}
                  color="var(--terminal-green)"
                  glow={true}
                />
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Social Links Grid with Staggered Animation */}
        <StaggeredGrid
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          columns={4}
          staggerDelay={0.1}
          duration={0.5}
          fromY={40}
          fromScale={0.9}
          pattern="center-out"
          triggerStart="top 85%"
        >
          {socialLinks.map((link, index) => (
            <GridItem
              key={index}
              glowOnHover={true}
              glowColor={link.color}
              tiltOnHover={true}
              className="group"
            >
              <a
                href={link.href}
                target={link.name !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block bg-[#161B22] border border-gray-800 rounded-xl p-6 text-center hover:border-current transition-all duration-300"
                style={
                  {
                    "--hover-color": link.color,
                  } as React.CSSProperties
                }
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 group-hover:animate-bounce flex justify-center">
                  <link.icon size={36} color={link.color} glow={true} />
                </div>
                <div
                  className="font-mono text-sm font-semibold mb-1 transition-colors duration-300"
                  style={{ color: link.color }}
                >
                  {link.name}
                </div>
                <div className="font-mono text-xs text-[var(--code-comment)] group-hover:text-white transition-colors duration-300 truncate">
                  {link.value}
                </div>

                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${link.color}, transparent 70%)`,
                  }}
                />
              </a>
            </GridItem>
          ))}
        </StaggeredGrid>

        {/* CTA Buttons with Magnetic Effect */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <MagneticButton
            variant="primary"
            size="lg"
            onClick={() => {
              window.location.href =
                "mailto:arinopc22@gmail.com?subject=Let's work together";
            }}
            magneticStrength={0.35}
          >
            <EmailIcon size={18} color="currentColor" />
            <span>Send Email</span>
            <span>→</span>
          </MagneticButton>

          <MagneticButton
            href="https://github.com/arino08"
            variant="secondary"
            size="lg"
            magneticStrength={0.35}
            className="border-[var(--terminal-purple)] text-[var(--terminal-purple)] hover:bg-[var(--terminal-purple)] hover:text-[#0D1117]"
          >
            <GitHubIcon size={18} color="currentColor" />
            <span>View GitHub</span>
          </MagneticButton>
        </div>

        {/* Visitor Counter */}
        <div className="flex justify-center mb-12">
          <VisitorCounter />
        </div>

        {/* Footer */}
        <div className="relative border-t border-gray-800 pt-8">
          {/* Tap hint tooltip */}
          {showHint && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[var(--terminal-green)] text-[#0D1117] px-4 py-2 rounded-lg font-mono text-xs whitespace-nowrap animate-bounce shadow-[0_0_20px_var(--terminal-green)] flex items-center gap-1">
              One more tap!
              <TargetIcon size={14} color="#0D1117" />
            </div>
          )}

          <div className="font-mono text-xs text-[var(--code-comment)] text-center space-y-2">
            <div className="text-[var(--terminal-purple)] flex items-center justify-center gap-1">
              {"// Built with Next.js, Three.js, GSAP & lots of"}
              <CoffeeIcon
                size={14}
                color="var(--terminal-purple)"
                className="inline-block"
              />
            </div>
            <div
              className="cursor-pointer select-none hover:text-[var(--terminal-green)] transition-colors duration-300"
              onClick={handleSecretTap}
              onTouchEnd={handleSecretTap}
            >
              © {new Date().getFullYear()} Aariz Sheikh. All rights reserved.
            </div>
            <div className="text-[var(--terminal-green)]/50 mt-4 hover:text-[var(--terminal-green)] transition-colors duration-300">
              {'fn main() { println!("Thanks for visiting!"); }'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
