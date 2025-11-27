"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * Respects the prefers-reduced-motion media query for accessibility
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return;

    // Create media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns animation duration based on reduced motion preference
 * @param normalDuration - Duration in seconds when animations are enabled
 * @param reducedDuration - Duration in seconds when reduced motion is preferred (default: 0)
 */
export function useAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
}

/**
 * Returns animation config object for GSAP based on reduced motion preference
 */
export function useGsapConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    duration: prefersReducedMotion ? 0 : undefined,
    ease: prefersReducedMotion ? "none" : undefined,
    stagger: prefersReducedMotion ? 0 : undefined,
  };
}

export default useReducedMotion;
