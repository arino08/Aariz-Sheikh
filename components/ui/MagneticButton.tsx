"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import useTerminalSounds from "@/hooks/useTerminalSounds";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  magneticStrength?: number;
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  magneticStrength = 0.4,
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const glitchRef = useRef<HTMLSpanElement>(null);
  const boundingRef = useRef<DOMRect | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState<string>("");

  // Terminal sounds
  const { playClick, playGlitch, playWhoosh } = useTerminalSounds();

  // Random characters for glitch effect
  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789";

  // Get button bounding rect on mount and resize
  useEffect(() => {
    const updateBounds = () => {
      if (buttonRef.current) {
        boundingRef.current = buttonRef.current.getBoundingClientRect();
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
    };
  }, []);

  // Glitch text effect
  const triggerGlitch = useCallback(() => {
    if (disabled) return;

    setIsGlitching(true);

    // Get text content
    const textContent =
      contentRef.current?.textContent || String(children) || "";
    let iterations = 0;
    const maxIterations = 10;

    const glitchInterval = setInterval(() => {
      const glitched = textContent
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (iterations / maxIterations > index / textContent.length) {
            return char;
          }
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join("");

      setGlitchText(glitched);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(glitchInterval);
        setGlitchText("");
        setIsGlitching(false);
      }
    }, 30);
  }, [children, disabled, glitchChars]);

  // Mouse move handler for magnetic effect
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!buttonRef.current || !boundingRef.current || disabled) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = boundingRef.current;

      // Calculate center of button
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Calculate distance from center
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      // Apply magnetic pull
      const pullX = deltaX * magneticStrength;
      const pullY = deltaY * magneticStrength;

      gsap.to(buttonRef.current, {
        x: pullX,
        y: pullY,
        duration: 0.3,
        ease: "power2.out",
      });

      // Content moves slightly more for depth effect
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          x: pullX * 0.2,
          y: pullY * 0.2,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    [magneticStrength, disabled],
  );

  // Mouse enter handler
  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    setIsHovered(true);
    boundingRef.current = buttonRef.current?.getBoundingClientRect() || null;

    // Play hover sound
    playWhoosh({ volume: 0.04, duration: 0.15 });

    // Scale up slightly
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });

    // Trigger glitch on enter
    triggerGlitch();
  }, [disabled, triggerGlitch, playWhoosh]);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);

    // Reset position with elastic bounce
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    }
  }, []);

  // Click handler
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      // Play click sound with glitch
      playClick({ volume: 0.08 });
      playGlitch({ volume: 0.05, duration: 0.1 });

      // Trigger glitch on click
      triggerGlitch();

      // Click animation
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(buttonRef.current, {
            scale: isHovered ? 1.05 : 1,
            duration: 0.2,
            ease: "power2.out",
          });
        },
      });

      onClick?.();
    },
    [disabled, onClick, isHovered, triggerGlitch, playClick, playGlitch],
  );

  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  // Variant classes
  const variantClasses = {
    primary: `
      bg-[var(--terminal-green)] text-[#0D1117] font-semibold
      hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]
      border-2 border-transparent
    `,
    secondary: `
      bg-transparent text-[var(--terminal-green)] font-semibold
      border-2 border-[var(--terminal-green)]/50
      hover:border-[var(--terminal-green)]
      hover:bg-[var(--terminal-green)]/10
      hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]
    `,
    ghost: `
      bg-transparent text-[var(--terminal-green)] font-medium
      border-2 border-transparent
      hover:bg-[var(--terminal-green)]/5
    `,
  };

  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    font-mono rounded-lg overflow-hidden
    transition-colors duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  // Render content with glitch effect
  const renderContent = () => (
    <>
      {/* Main content */}
      <span
        ref={contentRef}
        className={`relative z-10 flex items-center gap-2 transition-opacity duration-100 ${
          isGlitching ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </span>

      {/* Glitch overlay */}
      {isGlitching && (
        <span
          ref={glitchRef}
          className="absolute inset-0 flex items-center justify-center z-20"
          aria-hidden="true"
        >
          {/* Glitch layer 1 - red shift */}
          <span
            className="absolute text-[var(--terminal-blue)]"
            style={{
              transform: "translate(-2px, 1px)",
              clipPath: "inset(0 0 50% 0)",
            }}
          >
            {glitchText}
          </span>

          {/* Glitch layer 2 - cyan shift */}
          <span
            className="absolute text-[var(--terminal-purple)]"
            style={{
              transform: "translate(2px, -1px)",
              clipPath: "inset(50% 0 0 0)",
            }}
          >
            {glitchText}
          </span>

          {/* Main glitch text */}
          <span className="relative text-current">{glitchText}</span>
        </span>
      )}

      {/* Hover glow effect */}
      <span
        className={`absolute inset-0 transition-opacity duration-300 ${
          isHovered && variant === "primary" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Scanline effect on hover */}
      {isHovered && (
        <span
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
            }}
          />
        </span>
      )}

      {/* Border glow animation */}
      {isHovered && (
        <span
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: `
              inset 0 0 20px rgba(0,255,136,0.1),
              0 0 20px rgba(0,255,136,0.2)
            `,
            animation: "borderPulse 1.5s ease-in-out infinite",
          }}
        />
      )}

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes borderPulse {
          0%,
          100% {
            box-shadow:
              inset 0 0 20px rgba(0, 255, 136, 0.1),
              0 0 20px rgba(0, 255, 136, 0.2);
          }
          50% {
            box-shadow:
              inset 0 0 30px rgba(0, 255, 136, 0.2),
              0 0 30px rgba(0, 255, 136, 0.4);
          }
        }
      `}</style>
    </>
  );

  // Render as anchor or button
  if (href && !disabled) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        data-magnetic="true"
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={baseClasses}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      data-magnetic="true"
    >
      {renderContent()}
    </button>
  );
}
