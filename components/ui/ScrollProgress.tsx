"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollProgressProps {
  position?: "top" | "bottom";
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  glowEffect?: boolean;
  className?: string;
}

export default function ScrollProgress({
  position = "top",
  height = 3,
  color = "var(--terminal-green)",
  backgroundColor = "transparent",
  showPercentage = false,
  glowEffect = true,
  className = "",
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show progress bar after initial scroll
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setProgress(Math.min(100, Math.max(0, scrollPercent)));
      setIsVisible(scrollTop > 100);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div
        className={`fixed left-0 right-0 z-[100] transition-opacity duration-300 ${
          position === "top" ? "top-0" : "bottom-0"
        } ${isVisible ? "opacity-100" : "opacity-0"} ${className}`}
        style={{
          height: `${height}px`,
          backgroundColor,
        }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      >
        <div
          className="h-full transition-all duration-75 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
            boxShadow: glowEffect
              ? `0 0 10px ${color}, 0 0 20px ${color}50, 0 0 30px ${color}30`
              : "none",
          }}
        />
      </div>

      {/* Percentage Indicator */}
      {showPercentage && isVisible && (
        <div
          className={`fixed right-4 z-[100] font-mono text-xs transition-all duration-300 ${
            position === "top" ? "top-4" : "bottom-4"
          }`}
          style={{ color }}
        >
          <div
            className="px-2 py-1 rounded bg-[#0D1117]/80 backdrop-blur-sm border border-gray-800"
            style={{
              boxShadow: glowEffect ? `0 0 10px ${color}30` : "none",
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </>
  );
}

// Vertical scroll progress (for sidebar-style)
interface VerticalScrollProgressProps {
  position?: "left" | "right";
  width?: number;
  color?: string;
  showSections?: boolean;
  sections?: string[];
}

export function VerticalScrollProgress({
  position = "right",
  width = 3,
  color = "var(--terminal-green)",
  showSections = false,
  sections = [],
}: VerticalScrollProgressProps) {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setProgress(Math.min(100, Math.max(0, scrollPercent)));
      setIsVisible(scrollTop > 100);

      // Calculate active section
      if (sections.length > 0) {
        const sectionIndex = Math.floor(
          (scrollPercent / 100) * sections.length,
        );
        setActiveSection(Math.min(sections.length - 1, sectionIndex));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections.length]);

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-[100] transition-opacity duration-300 ${
        position === "right" ? "right-4" : "left-4"
      } ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Progress track */}
        <div
          className="relative rounded-full bg-gray-800/50 overflow-hidden"
          style={{ width: `${width}px`, height: "100px" }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-150"
            style={{
              height: `${progress}%`,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        </div>

        {/* Section dots */}
        {showSections && sections.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {sections.map((section, index) => (
              <button
                key={section}
                onClick={() => {
                  const element = document.getElementById(section);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeSection
                    ? "scale-150"
                    : "opacity-50 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: index === activeSection ? color : "gray",
                  boxShadow:
                    index === activeSection ? `0 0 8px ${color}` : "none",
                }}
                aria-label={`Go to ${section} section`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Circular progress indicator
interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function CircularProgress({
  size = 50,
  strokeWidth = 3,
  color = "var(--terminal-green)",
  showPercentage = true,
  position = "bottom-right",
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setProgress(Math.min(100, Math.max(0, scrollPercent)));
      setIsVisible(scrollTop > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-20 right-6",
    "top-left": "top-20 left-6",
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed z-[100] transition-all duration-300 cursor-pointer hover:scale-110 ${
        positionClasses[position]
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      style={{
        filter: `drop-shadow(0 0 10px ${color}50)`,
      }}
      aria-label="Scroll to top"
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#0D1117"
          stroke="gray"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>

      {/* Center content */}
      <div
        className="absolute inset-0 flex items-center justify-center font-mono"
        style={{ color }}
      >
        {showPercentage ? (
          <span className="text-xs font-bold">{Math.round(progress)}%</span>
        ) : (
          <span className="text-lg">↑</span>
        )}
      </div>
    </button>
  );
}
