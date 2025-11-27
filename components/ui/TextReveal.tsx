"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hook to check if animations are enabled
function useAnimationsEnabled() {
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
          setEnabled(parsed.enableAnimations !== false);
        }
      } catch {
        // Use default
      }
    };

    checkSettings();

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

interface TextRevealProps {
  children: string;
  className?: string;
  /** Animation type - all terminal/TUI themed */
  animation?:
    | "typing"
    | "glitch"
    | "scanline"
    | "decrypt"
    | "terminal"
    | "matrix"
    | "blink-in";
  /** Typing speed in ms per character */
  speed?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Trigger animation on scroll or immediately */
  trigger?: "scroll" | "immediate";
  /** ScrollTrigger start position */
  triggerStart?: string;
  /** Only animate once */
  once?: boolean;
  /** HTML tag to use */
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  /** Show cursor after text */
  showCursor?: boolean;
  /** Cursor color */
  cursorColor?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Glitch intensity for glitch animation */
  glitchIntensity?: "low" | "medium" | "high";
}

// Terminal characters for various effects
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`";
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
const DECRYPT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

export default function TextReveal({
  children,
  className = "",
  animation = "typing",
  speed = 50,
  delay = 0,
  trigger = "scroll",
  triggerStart = "top 85%",
  once = true,
  tag: Tag = "div",
  showCursor = true,
  cursorColor = "var(--terminal-green)",
  onComplete,
  glitchIntensity = "medium",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasAnimated = useRef(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Check if animations are enabled (potato mode check)
  const animationsEnabled = useAnimationsEnabled();

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor) return;
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [showCursor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // Animation functions
  const animateTyping = () => {
    const text = children;
    let index = 0;
    setIsAnimating(true);
    setDisplayText("");

    const type = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
        // Variable speed for more natural typing
        const variance = Math.random() * speed * 0.5;
        const char = text[index - 1];
        // Pause on punctuation
        const punctuationDelay = ".!?,;:".includes(char) ? speed * 3 : 0;
        animationRef.current = setTimeout(
          type,
          speed + variance + punctuationDelay,
        );
      } else {
        setIsAnimating(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationRef.current = setTimeout(type, delay);
  };

  const animateGlitch = () => {
    const text = children;
    const iterations =
      glitchIntensity === "low" ? 2 : glitchIntensity === "high" ? 6 : 4;
    let currentIteration = 0;
    setIsAnimating(true);

    const glitch = () => {
      if (currentIteration < iterations) {
        // Create glitched version
        const glitched = text
          .split("")
          .map((char) => {
            if (char === " ") return " ";
            return Math.random() > 0.5
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : char;
          })
          .join("");
        setDisplayText(glitched);
        currentIteration++;
        animationRef.current = setTimeout(glitch, 80);
      } else {
        // Final reveal with scanline effect
        setDisplayText(text);
        setIsAnimating(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationRef.current = setTimeout(glitch, delay);
  };

  const animateScanline = () => {
    const text = children;
    let index = 0;
    setIsAnimating(true);
    setDisplayText("");

    const scan = () => {
      if (index <= text.length) {
        // Show text up to current position with a "scanning" character at the end
        const revealed = text.slice(0, index);
        const scanChar = index < text.length ? "▌" : "";
        setDisplayText(revealed + scanChar);
        index++;
        animationRef.current = setTimeout(scan, speed / 2);
      } else {
        setDisplayText(text);
        setIsAnimating(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationRef.current = setTimeout(scan, delay);
  };

  const animateDecrypt = () => {
    const text = children;
    const revealed = new Array(text.length).fill(false);
    let revealedCount = 0;
    setIsAnimating(true);

    const decrypt = () => {
      if (revealedCount < text.length) {
        // Build current display
        const display = text
          .split("")
          .map((char, i) => {
            if (revealed[i] || char === " ") return char;
            return DECRYPT_CHARS[
              Math.floor(Math.random() * DECRYPT_CHARS.length)
            ];
          })
          .join("");
        setDisplayText(display);

        // Randomly reveal a character
        if (Math.random() > 0.7) {
          const unrevealedIndices = revealed
            .map((r, i) => (!r && text[i] !== " " ? i : -1))
            .filter((i) => i !== -1);
          if (unrevealedIndices.length > 0) {
            const indexToReveal =
              unrevealedIndices[
                Math.floor(Math.random() * unrevealedIndices.length)
              ];
            revealed[indexToReveal] = true;
            revealedCount++;
          }
        }

        animationRef.current = setTimeout(decrypt, speed);
      } else {
        setDisplayText(text);
        setIsAnimating(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationRef.current = setTimeout(decrypt, delay);
  };

  const animateTerminal = () => {
    const text = children;
    let index = 0;
    setIsAnimating(true);
    setDisplayText("");

    const type = () => {
      if (index < text.length) {
        // Occasionally show a "processing" state
        if (Math.random() > 0.9 && index > 0) {
          const current = text.slice(0, index);
          setDisplayText(current + "█");
          animationRef.current = setTimeout(() => {
            setDisplayText(current);
            animationRef.current = setTimeout(type, speed / 2);
          }, 100);
        } else {
          setDisplayText(text.slice(0, index + 1));
          index++;
          animationRef.current = setTimeout(type, speed);
        }
      } else {
        setIsAnimating(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationRef.current = setTimeout(type, delay);
  };

  const animateMatrix = () => {
    const text = children;
    const positions = new Array(text.length).fill(0);
    let complete = 0;
    setIsAnimating(true);

    const rain = () => {
      if (complete < text.length) {
        const display = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (positions[i] >= 5) {
              if (positions[i] === 5) complete++;
              positions[i]++;
              return char;
            }
            positions[i] += Math.random() > 0.7 ? 1 : 0;
            return MATRIX_CHARS[
              Math.floor(Math.random() * MATRIX_CHARS.length)
            ];
          })
          .join("");
        setDisplayText(display);
        animationRef.current = setTimeout(rain, speed);
      } else {
        setDisplayText(text);
        setIsAnimating(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationRef.current = setTimeout(rain, delay);
  };

  const animateBlinkIn = () => {
    const text = children;
    let visible = false;
    let blinks = 0;
    const maxBlinks = 4;
    setIsAnimating(true);

    const blink = () => {
      if (blinks < maxBlinks) {
        visible = !visible;
        setDisplayText(visible ? text : "");
        blinks++;
        animationRef.current = setTimeout(blink, 100);
      } else {
        setDisplayText(text);
        setIsAnimating(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationRef.current = setTimeout(blink, delay);
  };

  // Main animation trigger
  const startAnimation = () => {
    if (hasAnimated.current && once) return;
    hasAnimated.current = true;

    switch (animation) {
      case "typing":
        animateTyping();
        break;
      case "glitch":
        animateGlitch();
        break;
      case "scanline":
        animateScanline();
        break;
      case "decrypt":
        animateDecrypt();
        break;
      case "terminal":
        animateTerminal();
        break;
      case "matrix":
        animateMatrix();
        break;
      case "blink-in":
        animateBlinkIn();
        break;
      default:
        animateTyping();
    }
  };

  const resetAnimation = () => {
    if (once) return;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    hasAnimated.current = false;
    setDisplayText("");
    setIsAnimating(false);
    setIsComplete(false);
  };

  // Setup trigger
  useEffect(() => {
    if (!containerRef.current) return;

    // If animations are disabled (potato mode), show text immediately
    if (!animationsEnabled) {
      setDisplayText(children);
      setIsComplete(true);
      setIsAnimating(false);
      return;
    }

    if (trigger === "immediate") {
      const timer = setTimeout(startAnimation, 100);
      return () => clearTimeout(timer);
    }

    // Scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: triggerStart,
      onEnter: startAnimation,
      onLeaveBack: resetAnimation,
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [trigger, triggerStart, once, animationsEnabled, children]);

  // Determine cursor style
  const getCursorStyle = () => {
    if (!showCursor) return null;
    if (isComplete && !isAnimating) {
      return (
        <span
          className="inline-block w-[0.5em] h-[1.1em] ml-[2px] align-middle"
          style={{
            backgroundColor: cursorColor,
            opacity: cursorVisible ? 1 : 0,
            transition: "opacity 0.1s",
            boxShadow: cursorVisible ? `0 0 8px ${cursorColor}` : "none",
          }}
        />
      );
    }
    if (isAnimating && animation === "typing") {
      return (
        <span
          className="inline-block w-[0.5em] h-[1.1em] ml-[2px] align-middle"
          style={{
            backgroundColor: cursorColor,
            boxShadow: `0 0 8px ${cursorColor}`,
          }}
        />
      );
    }
    return null;
  };

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`inline-block font-mono ${className}`}
    >
      <span className="whitespace-pre-wrap">{displayText}</span>
      {getCursorStyle()}
      {/* Screen reader text */}
      <span className="sr-only">{children}</span>
    </Tag>
  );
}

// Preset components for common use cases
interface PresetProps extends Omit<TextRevealProps, "animation" | "children"> {
  children: string;
}

export function TerminalText({ children, ...props }: PresetProps) {
  return (
    <TextReveal animation="terminal" speed={40} {...props}>
      {children}
    </TextReveal>
  );
}

export function GlitchText({
  children,
  glitchIntensity = "medium",
  ...props
}: PresetProps & { glitchIntensity?: "low" | "medium" | "high" }) {
  return (
    <TextReveal
      animation="glitch"
      glitchIntensity={glitchIntensity}
      showCursor={false}
      {...props}
    >
      {children}
    </TextReveal>
  );
}

export function DecryptText({ children, ...props }: PresetProps) {
  return (
    <TextReveal animation="decrypt" speed={60} showCursor={false} {...props}>
      {children}
    </TextReveal>
  );
}

export function MatrixText({ children, ...props }: PresetProps) {
  return (
    <TextReveal animation="matrix" speed={80} showCursor={false} {...props}>
      {children}
    </TextReveal>
  );
}

export function ScanlineText({ children, ...props }: PresetProps) {
  return (
    <TextReveal animation="scanline" speed={30} showCursor={false} {...props}>
      {children}
    </TextReveal>
  );
}

// Command prompt style text
interface CommandPromptProps {
  command: string;
  output?: string;
  prompt?: string;
  className?: string;
  delay?: number;
  onComplete?: () => void;
}

export function CommandPrompt({
  command,
  output,
  prompt = "❯",
  className = "",
  delay = 0,
  onComplete,
}: CommandPromptProps) {
  const [showOutput, setShowOutput] = useState(false);

  return (
    <div className={`font-mono ${className}`}>
      <div className="flex items-start gap-2">
        <span className="text-[var(--terminal-green)]">{prompt}</span>
        <TextReveal
          animation="typing"
          speed={50}
          delay={delay}
          showCursor={!output}
          onComplete={() => {
            if (output) {
              setTimeout(() => setShowOutput(true), 300);
            }
            onComplete?.();
          }}
        >
          {command}
        </TextReveal>
      </div>
      {showOutput && output && (
        <div className="mt-1 text-[var(--code-comment)] pl-6">
          <TextReveal animation="terminal" speed={20} showCursor={false}>
            {output}
          </TextReveal>
        </div>
      )}
    </div>
  );
}

// Boot sequence style multi-line text
interface BootSequenceTextProps {
  lines: { text: string; status?: "ok" | "fail" | "warn" | "info" }[];
  className?: string;
  lineDelay?: number;
  onComplete?: () => void;
}

export function BootSequenceText({
  lines,
  className = "",
  lineDelay = 500,
  onComplete,
}: BootSequenceTextProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<number[]>([]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ok":
        return "text-[var(--terminal-green)]";
      case "fail":
        return "text-red-500";
      case "warn":
        return "text-[var(--terminal-orange)]";
      case "info":
        return "text-[var(--terminal-blue)]";
      default:
        return "text-[var(--code-comment)]";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "ok":
        return "[ OK ]";
      case "fail":
        return "[FAIL]";
      case "warn":
        return "[WARN]";
      case "info":
        return "[INFO]";
      default:
        return "";
    }
  };

  return (
    <div className={`font-mono text-sm space-y-1 ${className}`}>
      {lines.map((line, index) => (
        <div
          key={index}
          className={`flex items-center justify-between gap-4 transition-opacity duration-300 ${
            index <= currentLine ? "opacity-100" : "opacity-0"
          }`}
        >
          {index === currentLine && !completedLines.includes(index) ? (
            <TextReveal
              animation="terminal"
              speed={30}
              trigger="immediate"
              showCursor={false}
              onComplete={() => {
                setCompletedLines((prev) => [...prev, index]);
                setTimeout(() => {
                  if (index < lines.length - 1) {
                    setCurrentLine(index + 1);
                  } else {
                    onComplete?.();
                  }
                }, lineDelay);
              }}
            >
              {line.text}
            </TextReveal>
          ) : (
            <span className="text-[var(--code-comment)]">{line.text}</span>
          )}
          {completedLines.includes(index) && line.status && (
            <span className={getStatusColor(line.status)}>
              {getStatusText(line.status)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
