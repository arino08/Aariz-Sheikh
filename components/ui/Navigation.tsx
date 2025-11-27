"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { gsap } from "gsap";
import TerminalMenu from "./TerminalMenu";
import { scrollToSection } from "./SmoothScroll";

interface NavigationProps {
  /** When true, render a compact/ui-friendly version (only terminal menu button). */
  compact?: boolean;
}

export default function Navigation({ compact = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<(HTMLButtonElement | null)[]>([]);

  const sections = useMemo(
    () => [
      { id: "hero", label: "Home", icon: "⌂" },
      { id: "about", label: "About", icon: "◈" },
      { id: "skills", label: "Skills", icon: "⚡" },
      { id: "projects", label: "Projects", icon: "◧" },
      { id: "contact", label: "Contact", icon: "✉" },
    ],
    [],
  );

  // Update active indicator position
  useEffect(() => {
    const activeIndex = sections.findIndex((s) => s.id === activeSection);
    const activeLink = navLinksRef.current[activeIndex];
    const indicator = indicatorRef.current;

    if (activeLink && indicator) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = navRef.current?.getBoundingClientRect();

      if (navRect) {
        gsap.to(indicator, {
          x: linkRect.left - navRect.left + linkRect.width / 2 - 4,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, [activeSection, sections]);

  useEffect(() => {
    if (compact) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(100, (scrollPosition / docHeight) * 100) : 0;
      setScrollProgress(progress);

      // Find active section
      const sectionElements = sections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [sections, compact]);

  // Nav entrance animation
  useEffect(() => {
    if (!navRef.current || compact) return;

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      },
    );
  }, [compact]);

  const handleScrollToSection = (sectionId: string) => {
    scrollToSection(sectionId, -80);
    setActiveSection(sectionId);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (sectionId: string) => {
    if (typeof window !== "undefined") {
      const isHomePage = window.location.pathname === "/";

      if (isHomePage) {
        handleScrollToSection(sectionId);
      } else {
        window.location.href = `/#${sectionId}`;
      }
    }
    setIsMenuOpen(false);
  };

  if (compact) {
    return (
      <>
        <TerminalMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={handleNavigation}
        />
        <button
          onClick={handleMenuToggle}
          className="text-[var(--terminal-green)] hover:text-[var(--terminal-blue)] transition-all p-2 border border-[var(--terminal-green)]/30 rounded hover:border-[var(--terminal-blue)] hover:shadow-[0_0_10px_rgba(0,255,136,0.18)] active:scale-95"
          aria-label="Open Terminal Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </>
    );
  }

  return (
    <>
      <TerminalMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigation}
      />
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0D1117]/95 backdrop-blur-lg border-b border-gray-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-gradient-to-b from-[#0D1117]/80 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <button
              onClick={() => handleScrollToSection("hero")}
              className="group font-mono text-lg font-bold cursor-pointer relative overflow-hidden"
            >
              <span className="relative z-10 bg-gradient-to-r from-[var(--terminal-green)] to-[var(--terminal-blue)] bg-clip-text text-transparent group-hover:from-[var(--terminal-blue)] group-hover:to-[var(--terminal-purple)] transition-all duration-500">
                {"<Aariz/>"}
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--terminal-green)] to-[var(--terminal-blue)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>

            {/* Desktop: Navigation Links */}
            <div className="hidden md:flex items-center gap-1 relative">
              {/* Active indicator dot */}
              <div
                ref={indicatorRef}
                className="absolute -bottom-1 w-2 h-2 rounded-full bg-[var(--terminal-green)] opacity-0 shadow-[0_0_10px_var(--terminal-green)]"
                style={{ transform: "translateX(-50%)" }}
              />

              {/* Nav Links */}
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  ref={(el) => {
                    navLinksRef.current[index] = el;
                  }}
                  onClick={() => handleScrollToSection(section.id)}
                  className={`group relative font-mono text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? "text-[var(--terminal-green)]"
                      : "text-[var(--code-comment)] hover:text-white"
                  }`}
                >
                  {/* Hover background */}
                  <span
                    className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      activeSection === section.id
                        ? "bg-[var(--terminal-green)]/10"
                        : "bg-transparent group-hover:bg-white/5"
                    }`}
                  />

                  {/* Icon + Label */}
                  <span className="relative flex items-center gap-2">
                    <span
                      className={`transition-all duration-300 text-xs ${
                        activeSection === section.id
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-75 group-hover:opacity-70 group-hover:scale-100"
                      }`}
                    >
                      {section.icon}
                    </span>
                    <span>{section.label}</span>
                  </span>

                  {/* Active glow effect */}
                  {activeSection === section.id && (
                    <span className="absolute inset-0 rounded-lg bg-[var(--terminal-green)]/5 animate-pulse" />
                  )}
                </button>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-gray-700 mx-2" />

              {/* Resume Button */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-lg overflow-hidden transition-all duration-300"
              >
                {/* Animated background */}
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--terminal-green)] to-[var(--terminal-blue)] opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--terminal-blue)] to-[var(--terminal-purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <span className="relative z-10 flex items-center gap-2 text-[#0D1117] font-semibold">
                  <svg
                    className="w-4 h-4 group-hover:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Resume
                </span>
              </a>

              {/* Terminal Menu Button */}
              <button
                onClick={handleMenuToggle}
                className="group relative p-2 rounded-lg overflow-hidden transition-all duration-300 border border-[var(--terminal-green)]/30 hover:border-[var(--terminal-green)]"
                title="Open Terminal (Ctrl+Space)"
              >
                {/* Glow effect */}
                <span className="absolute inset-0 bg-[var(--terminal-green)]/0 group-hover:bg-[var(--terminal-green)]/10 transition-all duration-300" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(0,255,136,0.2)]" />

                <svg
                  className="relative w-5 h-5 text-[var(--terminal-green)] group-hover:text-[var(--terminal-blue)] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile: Resume + Terminal Button */}
            <div className="md:hidden flex items-center gap-2">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-mono text-xs bg-gradient-to-r from-[var(--terminal-green)] to-[var(--terminal-blue)] text-[#0D1117] px-3 py-2 rounded-lg font-semibold"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                CV
              </a>
              <button
                onClick={handleMenuToggle}
                className="relative p-2 border border-[var(--terminal-green)]/30 rounded-lg text-[var(--terminal-green)] active:scale-95 transition-all"
                title="Open Terminal Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-800/50">
          <div
            className="h-full transition-all duration-150 ease-out relative"
            style={{
              width: `${scrollProgress}%`,
              background:
                "linear-gradient(90deg, var(--terminal-green), var(--terminal-blue), var(--terminal-purple))",
            }}
          >
            {/* Glow effect at the end */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full blur-sm"
              style={{
                background: "var(--terminal-green)",
                opacity: scrollProgress > 0 ? 0.8 : 0,
              }}
            />
          </div>
        </div>

        {/* Mobile bottom nav (optional - shows on small screens when scrolled) */}
        {isScrolled && (
          <div className="md:hidden fixed bottom-4 left-4 right-4 bg-[#161B22]/95 backdrop-blur-lg rounded-2xl border border-gray-800 p-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleScrollToSection(section.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? "text-[var(--terminal-green)] bg-[var(--terminal-green)]/10"
                      : "text-[var(--code-comment)]"
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="text-[10px] font-mono">{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
