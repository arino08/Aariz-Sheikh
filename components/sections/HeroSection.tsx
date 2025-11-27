"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import MatrixRain, { MatrixRainCSS } from "../3d/MatrixRain";
import AnimatedAvatar from "../ui/AnimatedAvatar";
import HeroAvatar from "../ui/HeroAvatar";
import MagneticButton from "../ui/MagneticButton";
import MagneticAsciiName from "../ui/MagneticAsciiName";
import {
  ParallaxLayer,
  ParallaxBackground,
  FloatingElement,
} from "../ui/ParallaxSection";
import { usePerformance } from "../ui/PerformanceProvider";

// Large ASCII art name
const ASCII_NAME_LARGE = `
 █████╗  █████╗ ██████╗ ██╗███████╗
██╔══██╗██╔══██╗██╔══██╗██║╚══███╔╝
███████║███████║██████╔╝██║  ███╔╝
██╔══██║██╔══██║██╔══██╗██║ ███╔╝
██║  ██║██║  ██║██║  ██║██║███████╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
`;

const ASCII_NAME_SMALL = `
┏━┓┏━┓┳━┓┳┓┳━┓
┣━┫┣━┫┣┳┛┃┃┏━┛
┛ ┗┛ ┗┛┗━┛┗┗━━
`;

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Check if mobile for responsive sizing
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get performance settings
  const { settings } = usePerformance();

  // Typewriter state
  const [line1Text, setLine1Text] = useState("");
  const [line2Text, setLine2Text] = useState("");
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const line1Full = "Building performant web experiences";
  const line2Full = "Rust enthusiast & 3rd year IT student";

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    // Skip animation in potato mode
    if (!settings.enableAnimations) {
      setLine1Text(line1Full);
      setLine2Text(line2Full);
      setShowCursor1(false);
      setShowCursor2(true);
      return;
    }

    const scrambleChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

    const startDelay = 1000;
    const typeSpeed = 40;

    const typeWithScramble = (
      text: string,
      currentIndex: number,
      setText: (text: string) => void,
      onComplete: () => void,
    ) => {
      if (currentIndex >= text.length) {
        onComplete();
        return;
      }

      let scrambleCount = 0;
      const maxScrambles = 2;

      const scrambleInterval = setInterval(() => {
        if (scrambleCount < maxScrambles) {
          const scrambledChar =
            scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          setText(text.slice(0, currentIndex) + scrambledChar);
          scrambleCount++;
        } else {
          clearInterval(scrambleInterval);
          setText(text.slice(0, currentIndex + 1));

          // Variable speed with punctuation pauses
          const char = text[currentIndex];
          const punctuationDelay =
            char === "." ||
            char === "," ||
            char === "!" ||
            char === "?" ||
            char === "&"
              ? typeSpeed * 2
              : 0;
          const variableSpeed =
            typeSpeed + (Math.random() - 0.5) * (typeSpeed * 0.5);

          setTimeout(() => {
            typeWithScramble(text, currentIndex + 1, setText, onComplete);
          }, variableSpeed + punctuationDelay);
        }
      }, typeSpeed / 3);
    };

    const startTyping = () => {
      // Type line 1
      typeWithScramble(line1Full, 0, setLine1Text, () => {
        // Line 1 complete, switch to line 2
        setShowCursor1(false);
        setShowCursor2(true);

        setTimeout(() => {
          typeWithScramble(line2Full, 0, setLine2Text, () => {
            // All done
          });
        }, 300);
      });
    };

    const timer = setTimeout(startTyping, startDelay);
    return () => clearTimeout(timer);
  }, [settings.enableAnimations]);

  useEffect(() => {
    const content = contentRef.current;
    const avatar = avatarRef.current;
    const text = textRef.current;

    if (content && avatar && text) {
      if (settings.enableAnimations) {
        // Staggered entrance animation
        const tl = gsap.timeline({ delay: 0.3 });

        tl.fromTo(
          avatar,
          { opacity: 0, scale: 0.8, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
        ).fromTo(
          text,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6",
        );
      } else {
        // No animations - ensure elements are immediately visible
        gsap.set(avatar, { opacity: 1, scale: 1, y: 0 });
        gsap.set(text, { opacity: 1, y: 0 });
      }
    }
  }, [settings.enableAnimations]);

  const Cursor = ({
    show,
    color = "var(--terminal-green)",
  }: {
    show: boolean;
    color?: string;
  }) => {
    if (!show) return null;
    return (
      <span
        className="inline-block w-[2px] h-[1em] ml-0.5 align-middle"
        style={{
          backgroundColor: color,
          opacity: cursorVisible ? 1 : 0,
          boxShadow:
            cursorVisible && settings.enableGlow
              ? `0 0 8px ${color}, 0 0 12px ${color}`
              : "none",
          transition: "opacity 0.1s",
        }}
        aria-hidden="true"
      />
    );
  };

  // Determine what to render based on performance settings
  const renderBackground = () => {
    if (!settings.enable3DCanvas) {
      // Fallback to CSS-based background
      return (
        <div className="absolute inset-0 z-0">
          <MatrixRainCSS opacity={0.3} />
          {/* Static stars fallback */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(2px 2px at 20% 30%, white, transparent),
                radial-gradient(2px 2px at 40% 70%, white, transparent),
                radial-gradient(1px 1px at 90% 40%, white, transparent),
                radial-gradient(2px 2px at 60% 80%, white, transparent),
                radial-gradient(1px 1px at 30% 10%, white, transparent),
                radial-gradient(2px 2px at 70% 60%, white, transparent),
                radial-gradient(1px 1px at 80% 20%, white, transparent),
                radial-gradient(2px 2px at 10% 60%, white, transparent)
              `,
              opacity: 0.5,
            }}
          />
        </div>
      );
    }

    return (
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
          }}
          className="w-full h-full"
          dpr={settings.canvasQuality}
          frameloop={settings.enableAnimations ? "always" : "demand"}
        >
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.3} />

          {/* Matrix rain effect - conditional based on settings */}
          {settings.enableMatrixRain && (
            <MatrixRain
              particleCount={settings.particleCount}
              enabled={settings.enableMatrixRain}
              quality={settings.canvasQuality}
            />
          )}

          {/* Stars background - reduced count based on settings */}
          {settings.enableParticles && (
            <Stars
              radius={100}
              depth={50}
              count={Math.floor(2000 * settings.canvasQuality)}
              factor={4}
              saturation={0}
              fade
              speed={settings.enableAnimations ? 1 : 0}
            />
          )}

          {/* Enable mouse interaction */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={settings.enableAnimations}
            autoRotate={settings.enableAnimations}
            autoRotateSpeed={0.5}
            rotateSpeed={0.1}
          />
        </Canvas>
      </div>
    );
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* 3D Background or CSS Fallback */}
      {renderBackground()}

      {/* Parallax Background Layers - conditional */}
      {settings.enableParallax && (
        <>
          <ParallaxBackground variant="dots" speed={0.15} opacity={0.04} />
          <ParallaxBackground variant="grid" speed={0.25} opacity={0.02} />
        </>
      )}

      {/* Floating decorative elements with parallax - conditional */}
      {settings.enableFloatingElements && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top left decoration */}
          <FloatingElement
            className="absolute top-20 left-10 opacity-20"
            floatSpeed={0.4}
            rotateAmount={15}
          >
            <div className="text-[var(--terminal-green)] font-mono text-6xl">
              {"{"}
            </div>
          </FloatingElement>

          {/* Top right decoration */}
          <FloatingElement
            className="absolute top-32 right-20 opacity-15"
            floatSpeed={0.3}
            rotateAmount={-10}
          >
            <div className="text-[var(--terminal-purple)] font-mono text-4xl">
              {"</>"}
            </div>
          </FloatingElement>

          {/* Bottom left decoration */}
          <FloatingElement
            className="absolute bottom-40 left-20 opacity-15"
            floatSpeed={0.5}
            rotateAmount={20}
          >
            <div className="text-[var(--terminal-blue)] font-mono text-5xl">
              {"fn()"}
            </div>
          </FloatingElement>

          {/* Bottom right decoration */}
          <FloatingElement
            className="absolute bottom-32 right-10 opacity-20"
            floatSpeed={0.35}
            rotateAmount={-15}
          >
            <div className="text-[var(--terminal-orange)] font-mono text-6xl">
              {"}"}
            </div>
          </FloatingElement>
        </div>
      )}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content Overlay */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 py-20 max-w-7xl mx-auto w-full"
      >
        {/* TUI Avatar with Parallax - Responsive sizing */}
        {settings.enableParallax ? (
          <ParallaxLayer speed={0.2} direction="up" className="flex-shrink-0">
            <div ref={avatarRef}>
              <HeroAvatar
                src="/assets/devpfp.jpg"
                size={isMobile ? 220 : 360}
                enableMorph={settings.enableAnimations}
                autoPlay={true}
                autoPlayDelay={1.5}
              />
            </div>
          </ParallaxLayer>
        ) : (
          <div ref={avatarRef} className="flex-shrink-0">
            <HeroAvatar
              src="/assets/devpfp.jpg"
              size={isMobile ? 220 : 360}
              enableMorph={settings.enableAnimations}
              autoPlay={true}
              autoPlayDelay={1.5}
            />
          </div>
        )}

        {/* Text Content with Parallax */}
        {settings.enableParallax ? (
          <ParallaxLayer speed={0.1} direction="up">
            <div ref={textRef} className="text-center lg:text-left max-w-xl">
              {renderTextContent()}
            </div>
          </ParallaxLayer>
        ) : (
          <div ref={textRef} className="text-center lg:text-left max-w-xl">
            {renderTextContent()}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-[var(--code-comment)]">
          scroll to explore
        </span>
        <div className="w-6 h-10 border-2 border-[var(--terminal-green)]/50 rounded-full flex justify-center p-2">
          <div
            className={`w-1 h-2 bg-[var(--terminal-green)] rounded-full ${settings.enableAnimations ? "animate-bounce" : ""}`}
          />
        </div>
      </div>

      {/* Gradient text animation - only if animations enabled */}
      {settings.enableAnimations && (
        <style jsx>{`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient {
            animation: gradient 3s ease infinite;
          }
          @keyframes glow-pulse {
            0%,
            100% {
              filter: drop-shadow(0 0 3px rgba(0, 255, 136, 0.3));
            }
            50% {
              filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.5))
                drop-shadow(0 0 15px rgba(0, 255, 136, 0.2));
            }
          }
        `}</style>
      )}
    </section>
  );

  // Helper function to render text content (extracted to avoid duplication)
  function renderTextContent() {
    return (
      <>
        {/* Greeting */}
        <div className="font-mono text-xs sm:text-sm md:text-base text-[var(--terminal-green)] mb-3 sm:mb-4 flex items-center justify-center lg:justify-start gap-2">
          <span
            className={`inline-block w-3 h-3 bg-[var(--terminal-green)] rounded-full ${settings.enableAnimations ? "animate-pulse" : ""}`}
            style={{
              boxShadow: settings.enableGlow
                ? "0 0 10px var(--terminal-green)"
                : "none",
            }}
          />
          <span>Available for opportunities</span>
        </div>

        {/* ASCII Art Name - Magnetic & Glitchy */}
        <div className="mb-4 sm:mb-6 flex justify-center lg:justify-start overflow-x-auto max-w-full">
          <MagneticAsciiName
            color="var(--terminal-green)"
            glowColor="var(--terminal-green)"
            enableGlow={settings.enableGlow}
            enableMagnetic={settings.enableAnimations}
            enableGlitch={settings.enableAnimations}
            magneticStrength={0.4}
            glitchIntensity="medium"
          />
        </div>

        {/* Screen reader only title */}
        <h1 className="sr-only">Aariz Sheikh - Full-Stack Developer</h1>

        {/* Role */}
        <div className="font-mono text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6 flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
          <span className="text-[var(--terminal-orange)]">&lt;</span>
          <span>Full-Stack Developer</span>
          <span className="text-[var(--terminal-orange)]">/&gt;</span>
        </div>

        {/* Description in code style with Typewriter effect */}
        <div className="font-mono text-xs sm:text-sm md:text-base text-[var(--code-comment)] mb-6 sm:mb-8 space-y-1">
          <p className="flex items-start justify-center lg:justify-start">
            <span className="text-[var(--terminal-purple)] mr-1">{"// "}</span>
            <span className="whitespace-pre-wrap">{line1Text}</span>
            <Cursor show={showCursor1} />
          </p>
          <p className="flex items-start justify-center lg:justify-start">
            <span className="text-[var(--terminal-purple)] mr-1">{"// "}</span>
            <span className="whitespace-pre-wrap">{line2Text}</span>
            <Cursor show={showCursor2} color="var(--terminal-purple)" />
          </p>
        </div>

        {/* CTA Buttons with Magnetic Effect */}
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
          <MagneticButton
            variant="primary"
            size="md"
            onClick={() => {
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            magneticStrength={settings.enableAnimations ? 0.3 : 0}
          >
            <span>View Projects</span>
            <span>→</span>
          </MagneticButton>
          <MagneticButton
            variant="secondary"
            size="md"
            onClick={() => {
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            magneticStrength={settings.enableAnimations ? 0.3 : 0}
          >
            Get In Touch
          </MagneticButton>
        </div>

        {/* Tech stack pills */}
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start">
          {["React", "Next.js", "Rust", "TypeScript", "Node.js"].map(
            (tech, index) => (
              <span
                key={tech}
                className="font-mono text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full border border-gray-700 text-gray-400 hover:border-[var(--terminal-green)]/50 hover:text-[var(--terminal-green)] transition-all duration-300 cursor-default"
                style={{
                  animationDelay: settings.enableAnimations
                    ? `${index * 0.1}s`
                    : "0s",
                }}
              >
                {tech}
              </span>
            ),
          )}
        </div>
      </>
    );
  }
}
