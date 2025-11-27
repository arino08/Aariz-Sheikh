"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StaggeredGridProps {
  children: ReactNode;
  className?: string;
  /** Number of columns in the grid */
  columns?: number;
  /** Stagger delay between items in seconds */
  staggerDelay?: number;
  /** Animation duration for each item */
  duration?: number;
  /** Starting opacity */
  fromOpacity?: number;
  /** Starting Y position offset */
  fromY?: number;
  /** Starting X position offset */
  fromX?: number;
  /** Starting scale */
  fromScale?: number;
  /** Animation easing */
  ease?: string;
  /** Whether to animate from different directions based on position */
  directionalAnimation?: boolean;
  /** Trigger animation once or every time it enters viewport */
  triggerOnce?: boolean;
  /** Scroll trigger start position */
  triggerStart?: string;
  /** Additional delay before animation starts */
  delay?: number;
  /** Animation pattern: 'sequential', 'center-out', 'random', 'wave' */
  pattern?: "sequential" | "center-out" | "random" | "wave" | "diagonal";
}

export default function StaggeredGrid({
  children,
  className = "",
  columns = 3,
  staggerDelay = 0.08,
  duration = 0.6,
  fromOpacity = 0,
  fromY = 40,
  fromX = 0,
  fromScale = 0.95,
  ease = "power3.out",
  directionalAnimation = false,
  triggerOnce = true,
  triggerStart = "top 85%",
  delay = 0,
  pattern = "sequential",
}: StaggeredGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const items = container.children;
    const itemCount = items.length;

    if (itemCount === 0) return;

    // Set initial state for all items
    gsap.set(items, {
      opacity: fromOpacity,
      y: fromY,
      x: fromX,
      scale: fromScale,
    });

    // Calculate stagger order based on pattern
    const getStaggerOrder = (): number[] => {
      switch (pattern) {
        case "center-out": {
          // Animate from center outward
          const rows = Math.ceil(itemCount / columns);
          const centerRow = Math.floor(rows / 2);
          const centerCol = Math.floor(columns / 2);

          const itemsWithDistance = Array.from(
            { length: itemCount },
            (_, i) => {
              const row = Math.floor(i / columns);
              const col = i % columns;
              const distance = Math.sqrt(
                Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2),
              );
              return { index: i, distance };
            },
          );

          itemsWithDistance.sort((a, b) => a.distance - b.distance);
          return itemsWithDistance.map((item) => item.index);
        }

        case "random": {
          // Random order
          const indices = Array.from({ length: itemCount }, (_, i) => i);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          return indices;
        }

        case "wave": {
          // Wave pattern - animate diagonally
          const itemsWithWave = Array.from({ length: itemCount }, (_, i) => {
            const row = Math.floor(i / columns);
            const col = i % columns;
            return { index: i, wave: row + col };
          });
          itemsWithWave.sort((a, b) => a.wave - b.wave);
          return itemsWithWave.map((item) => item.index);
        }

        case "diagonal": {
          // Diagonal sweep
          const itemsWithDiag = Array.from({ length: itemCount }, (_, i) => {
            const row = Math.floor(i / columns);
            const col = i % columns;
            return { index: i, diag: row * 0.5 + col };
          });
          itemsWithDiag.sort((a, b) => a.diag - b.diag);
          return itemsWithDiag.map((item) => item.index);
        }

        case "sequential":
        default:
          return Array.from({ length: itemCount }, (_, i) => i);
      }
    };

    const staggerOrder = getStaggerOrder();

    // Create animation for each item based on stagger order
    const getDirectionalProps = (index: number) => {
      if (!directionalAnimation) return { x: fromX, y: fromY };

      const col = index % columns;
      const isLeft = col < columns / 2;
      const isRight = col >= columns / 2;

      return {
        x: isLeft ? -30 : isRight ? 30 : 0,
        y: fromY,
      };
    };

    // Apply directional animation if enabled
    if (directionalAnimation) {
      Array.from(items).forEach((item, index) => {
        const props = getDirectionalProps(index);
        gsap.set(item, { x: props.x, y: props.y });
      });
    }

    const animate = () => {
      if (hasAnimated.current && triggerOnce) return;
      hasAnimated.current = true;

      // Animate items in the calculated order
      staggerOrder.forEach((itemIndex, orderIndex) => {
        const item = items[itemIndex];
        if (!item) return;

        gsap.to(item, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration,
          delay: delay + orderIndex * staggerDelay,
          ease,
        });
      });
    };

    const reset = () => {
      if (triggerOnce) return;
      hasAnimated.current = false;

      Array.from(items).forEach((item, index) => {
        const props = directionalAnimation
          ? getDirectionalProps(index)
          : { x: fromX, y: fromY };

        gsap.set(item, {
          opacity: fromOpacity,
          y: props.y,
          x: props.x,
          scale: fromScale,
        });
      });
    };

    // Create scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: triggerStart,
      onEnter: animate,
      onLeaveBack: reset,
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [
    columns,
    staggerDelay,
    duration,
    fromOpacity,
    fromY,
    fromX,
    fromScale,
    ease,
    directionalAnimation,
    triggerOnce,
    triggerStart,
    delay,
    pattern,
  ]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Pre-styled grid item wrapper with hover effects
interface GridItemProps {
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
  glowColor?: string;
  tiltOnHover?: boolean;
}

export function GridItem({
  children,
  className = "",
  glowOnHover = true,
  glowColor = "var(--terminal-green)",
  tiltOnHover = true,
}: GridItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current || !tiltOnHover) return;

    const item = itemRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(item, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(item, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    item.addEventListener("mousemove", handleMouseMove);
    item.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      item.removeEventListener("mousemove", handleMouseMove);
      item.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [tiltOnHover]);

  return (
    <div
      ref={itemRef}
      className={`transform-gpu relative ${className}`}
      style={{
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        if (glowOnHover) {
          (e.currentTarget as HTMLElement).style.boxShadow =
            `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`;
        }
      }}
      onMouseLeave={(e) => {
        if (glowOnHover) {
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }
      }}
    >
      {children}
    </div>
  );
}
