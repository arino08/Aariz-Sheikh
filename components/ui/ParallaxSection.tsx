"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hook to check if parallax is enabled from performance settings
function useParallaxEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSettings = () => {
      try {
        const savedSettings = localStorage.getItem(
          "portfolio-performance-settings",
        );
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setEnabled(parsed.enableParallax !== false);
        }
      } catch {
        // Invalid JSON or no settings, use default
      }
    };

    checkSettings();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio-performance-settings") {
        checkSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return enabled;
}

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  offset?: number;
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

// Individual parallax layer component
export function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
  direction = "up",
  offset = 0,
}: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const parallaxEnabled = useParallaxEnabled();

  useEffect(() => {
    if (!layerRef.current || !parallaxEnabled) return;

    const element = layerRef.current;

    // Calculate movement based on direction
    const getMovement = () => {
      const baseMove = 100 * speed;
      switch (direction) {
        case "up":
          return { y: baseMove, x: 0 };
        case "down":
          return { y: -baseMove, x: 0 };
        case "left":
          return { x: baseMove, y: 0 };
        case "right":
          return { x: -baseMove, y: 0 };
        default:
          return { y: baseMove, x: 0 };
      }
    };

    const movement = getMovement();

    gsap.fromTo(
      element,
      {
        y:
          direction === "up" || direction === "down"
            ? -movement.y + offset
            : offset,
        x:
          direction === "left" || direction === "right"
            ? -movement.x + offset
            : offset,
      },
      {
        y:
          direction === "up" || direction === "down"
            ? movement.y + offset
            : offset,
        x:
          direction === "left" || direction === "right"
            ? movement.x + offset
            : offset,
        ease: "none",
        scrollTrigger: {
          trigger: element.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element.parentElement) {
          trigger.kill();
        }
      });
    };
  }, [speed, direction, offset, parallaxEnabled]);

  return (
    <div ref={layerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

// Container for parallax sections
export function ParallaxSection({
  children,
  className = "",
  intensity = "medium",
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      data-parallax-intensity={intensity}
    >
      {children}
    </div>
  );
}

// Floating elements with parallax
interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  floatSpeed?: number;
  rotateAmount?: number;
  scaleRange?: [number, number];
}

export function FloatingElement({
  children,
  className = "",
  floatSpeed = 0.3,
  rotateAmount = 0,
  scaleRange,
}: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const parallaxEnabled = useParallaxEnabled();

  useEffect(() => {
    if (!elementRef.current || !parallaxEnabled) return;

    const element = elementRef.current;

    const animation: gsap.TweenVars = {
      y: 50 * floatSpeed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    };

    if (rotateAmount !== 0) {
      animation.rotation = rotateAmount;
    }

    if (scaleRange) {
      animation.scale = scaleRange[1];
      gsap.set(element, { scale: scaleRange[0] });
    }

    gsap.to(element, animation);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [floatSpeed, rotateAmount, scaleRange, parallaxEnabled]);

  return (
    <div ref={elementRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

// Background parallax decorations
interface ParallaxBackgroundProps {
  variant?: "dots" | "grid" | "lines" | "particles";
  color?: string;
  opacity?: number;
  speed?: number;
  className?: string;
}

export function ParallaxBackground({
  variant = "dots",
  color = "var(--terminal-green)",
  opacity = 0.1,
  speed = 0.2,
  className = "",
}: ParallaxBackgroundProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const parallaxEnabled = useParallaxEnabled();

  useEffect(() => {
    if (!bgRef.current || !parallaxEnabled) return;

    const element = bgRef.current;

    gsap.to(element, {
      y: 100 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element.parentElement) {
          trigger.kill();
        }
      });
    };
  }, [speed, parallaxEnabled]);

  const getBackgroundStyle = () => {
    switch (variant) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        };
      case "grid":
        return {
          backgroundImage: `
            linear-gradient(${color}20 1px, transparent 1px),
            linear-gradient(90deg, ${color}20 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        };
      case "lines":
        return {
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            ${color}15 50px,
            ${color}15 51px
          )`,
        };
      case "particles":
        return {
          backgroundImage: `
            radial-gradient(${color} 1px, transparent 1px),
            radial-gradient(${color}80 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px, 80px 80px",
          backgroundPosition: "0 0, 20px 20px",
        };
      default:
        return {};
    }
  };

  return (
    <div
      ref={bgRef}
      className={`absolute inset-0 pointer-events-none will-change-transform ${className}`}
      style={{
        ...getBackgroundStyle(),
        opacity,
      }}
      aria-hidden="true"
    />
  );
}

// Depth layers wrapper - creates automatic depth effect
interface DepthLayersProps {
  children: ReactNode;
  className?: string;
  layers?: number;
}

export function DepthLayers({ children, className = "" }: DepthLayersProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Background layer - slowest */}
      <ParallaxBackground variant="dots" speed={0.1} opacity={0.05} />

      {/* Mid layer - medium speed */}
      <ParallaxBackground variant="grid" speed={0.3} opacity={0.03} />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default ParallaxSection;
