"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: ReactNode;
  /** Enable or disable smooth scrolling */
  enabled?: boolean;
  /** Scroll lerp (smoothness) - lower = smoother, 0.1 is very smooth */
  lerp?: number;
  /** Duration of scroll animation */
  duration?: number;
  /** Easing function */
  easing?: (t: number) => number;
  /** Scroll direction */
  orientation?: "vertical" | "horizontal";
  /** Gesture orientation for touch devices */
  gestureOrientation?: "vertical" | "horizontal" | "both";
  /** Multiplier for scroll speed */
  smoothWheel?: boolean;
  /** Touch multiplier */
  touchMultiplier?: number;
  /** Infinite scroll */
  infinite?: boolean;
  /** Class name for wrapper */
  className?: string;
}

// Default easing function
const defaultEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export default function SmoothScroll({
  children,
  enabled = true,
  lerp = 0.1,
  duration = 1.2,
  easing = defaultEasing,
  orientation = "vertical",
  gestureOrientation = "vertical",
  smoothWheel = true,
  touchMultiplier = 2,
  infinite = false,
  className = "",
}: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [performanceEnabled, setPerformanceEnabled] = useState(true);

  // Check localStorage for performance settings
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPerformanceSettings = () => {
      try {
        const savedSettings = localStorage.getItem(
          "portfolio-performance-settings",
        );
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setPerformanceEnabled(parsed.enableSmoothScroll !== false);
        }
      } catch {
        // Invalid JSON or no settings, use default
      }
    };

    checkPerformanceSettings();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio-performance-settings") {
        checkPerformanceSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!enabled || prefersReducedMotion || !performanceEnabled) {
      return;
    }

    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      lerp,
      duration,
      easing,
      orientation,
      gestureOrientation,
      smoothWheel,
      touchMultiplier,
      infinite,
      syncTouch: false, // Disable sync touch for better mobile performance
      autoRaf: false, // We'll handle RAF ourselves for better control
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger with throttling
    let lastScrollUpdate = 0;
    const scrollThrottle = 16; // ~60fps max

    lenis.on("scroll", () => {
      const now = performance.now();
      if (now - lastScrollUpdate >= scrollThrottle) {
        lastScrollUpdate = now;
        ScrollTrigger.update();
      }
    });

    // RAF callback for Lenis
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Add Lenis to GSAP ticker
    gsap.ticker.add(rafCallback);

    // Disable GSAP's default lag smoothing
    gsap.ticker.lagSmoothing(0);

    // Pause Lenis when tab is not visible for performance
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href !== "#") {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement as HTMLElement, {
              offset: -80, // Account for fixed header
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Expose lenis to window for external access (useful for command palette)
    (window as Window & { lenis?: Lenis }).lenis = lenis;

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [
    enabled,
    performanceEnabled,
    lerp,
    duration,
    easing,
    orientation,
    gestureOrientation,
    smoothWheel,
    touchMultiplier,
    infinite,
  ]);

  return <div className={className}>{children}</div>;
}

// Hook to access Lenis instance
export function useLenis() {
  const getLenis = (): Lenis | null => {
    if (typeof window !== "undefined") {
      return (window as Window & { lenis?: Lenis }).lenis || null;
    }
    return null;
  };

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
    },
  ) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, options);
    } else {
      // Fallback for when Lenis is not available
      if (typeof target === "string") {
        const element = document.querySelector(target);
        element?.scrollIntoView({ behavior: "smooth" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const stop = () => {
    const lenis = getLenis();
    lenis?.stop();
  };

  const start = () => {
    const lenis = getLenis();
    lenis?.start();
  };

  return {
    getLenis,
    scrollTo,
    stop,
    start,
  };
}

// Scroll to section utility
export function scrollToSection(sectionId: string, offset = -80) {
  const lenis = (window as Window & { lenis?: Lenis }).lenis;
  const element = document.getElementById(sectionId);

  if (element) {
    if (lenis) {
      lenis.scrollTo(element, { offset, duration: 1.5 });
    } else {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
}
