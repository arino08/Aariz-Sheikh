"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  cursorColor?: string;
  showCursor?: boolean;
  cursorBlinkSpeed?: number;
  onComplete?: () => void;
  triggerOnce?: boolean;
  tag?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "div";
  scrambleOnType?: boolean;
  /** If true, starts typing immediately without waiting for scroll trigger */
  immediate?: boolean;
}

// Random characters for scramble effect - defined outside component to avoid re-creation
const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

export default function TypewriterText({
  text,
  className = "",
  speed = 50,
  startDelay = 0,
  cursorColor = "var(--terminal-green)",
  showCursor = true,
  cursorBlinkSpeed = 530,
  onComplete,
  triggerOnce = true,
  tag: Tag = "span",
  scrambleOnType = false,
  immediate = false,
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const hasTriggeredRef = useRef(false);

  // Track mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor) return;

    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, cursorBlinkSpeed);

    return () => clearInterval(blinkInterval);
  }, [showCursor, cursorBlinkSpeed]);

  // Type text function
  const typeText = useCallback(() => {
    // Prevent multiple triggers
    if (hasTriggeredRef.current && triggerOnce) return;
    hasTriggeredRef.current = true;

    setIsTyping(true);
    setDisplayText("");
    setIsComplete(false);

    let currentIndex = 0;
    let scrambleIterations = 0;
    const maxScrambleIterations = 3;

    const typeNextChar = () => {
      if (currentIndex >= text.length) {
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
        return;
      }

      if (scrambleOnType && scrambleIterations < maxScrambleIterations) {
        // Show scrambled character first
        const scrambledChar =
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        setDisplayText(text.slice(0, currentIndex) + scrambledChar);
        scrambleIterations++;

        typingRef.current = setTimeout(typeNextChar, speed / 3);
      } else {
        // Show actual character
        const char = text[currentIndex];
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        scrambleIterations = 0;

        // Variable speed for more natural typing
        const variableSpeed = speed + (Math.random() - 0.5) * (speed * 0.5);

        // Pause slightly longer on punctuation
        const punctuationDelay =
          char === "." || char === "," || char === "!" || char === "?"
            ? speed * 2
            : 0;

        typingRef.current = setTimeout(
          typeNextChar,
          variableSpeed + punctuationDelay,
        );
      }
    };

    // Start typing after delay
    typingRef.current = setTimeout(typeNextChar, startDelay);
  }, [text, speed, startDelay, onComplete, triggerOnce, scrambleOnType]);

  // Reset function for re-triggering
  const reset = useCallback(() => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    setDisplayText("");
    setIsTyping(false);
    setIsComplete(false);
    hasTriggeredRef.current = false;
  }, []);

  // Check if element is at least partially visible
  const isElementVisible = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    // Element is considered visible if its top is within the viewport
    return rect.top < windowHeight * 0.85 && rect.bottom > 0;
  }, []);

  // Handle immediate mode or setup scroll trigger
  useEffect(() => {
    // Wait for component to be mounted
    if (!isMounted) return;
    if (!containerRef.current) return;

    // Cleanup function
    const cleanup = () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      if (typingRef.current) {
        clearTimeout(typingRef.current);
        typingRef.current = null;
      }
    };

    // Immediate mode - start right away after a small delay for hydration
    if (immediate) {
      const immediateTimer = setTimeout(() => {
        if (!hasTriggeredRef.current) {
          typeText();
        }
      }, 50);

      return () => {
        clearTimeout(immediateTimer);
        cleanup();
      };
    }

    // Check if element is already visible on mount
    const checkInitialVisibility = () => {
      if (containerRef.current && isElementVisible(containerRef.current)) {
        if (!hasTriggeredRef.current) {
          typeText();
        }
      }
    };

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(checkInitialVisibility, 150);

    // Setup scroll trigger for elements not yet visible
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: () => {
        if (!hasTriggeredRef.current) {
          typeText();
        }
      },
      onLeaveBack: () => {
        if (!triggerOnce) {
          reset();
        }
      },
    });

    return () => {
      clearTimeout(initTimer);
      cleanup();
    };
  }, [typeText, reset, triggerOnce, immediate, isElementVisible, isMounted]);

  return (
    <div ref={containerRef} className={`inline ${className}`}>
      <Tag className="inline">
        {/* Rendered text */}
        <span className="whitespace-pre-wrap">{displayText}</span>

        {/* Cursor */}
        {showCursor && (
          <span
            className={`inline-block w-[2px] h-[1em] ml-0.5 align-middle transition-opacity duration-100 ${
              isComplete && !isTyping ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: cursorColor,
              opacity: cursorVisible ? 1 : 0,
              boxShadow: cursorVisible
                ? `0 0 8px ${cursorColor}, 0 0 12px ${cursorColor}`
                : "none",
            }}
            aria-hidden="true"
          />
        )}

        {/* Screen reader text */}
        <span className="sr-only">{text}</span>
      </Tag>

      {/* Typing indicator for accessibility */}
      {isTyping && (
        <span className="sr-only" aria-live="polite">
          Typing in progress...
        </span>
      )}
    </div>
  );
}

// Compound component for multiple lines
interface TypewriterLinesProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  speed?: number;
  lineDelay?: number;
  showCursor?: boolean;
  tag?: "p" | "span" | "div";
  immediate?: boolean;
}

export function TypewriterLines({
  lines,
  className = "",
  lineClassName = "",
  speed = 50,
  lineDelay = 500,
  showCursor = true,
  tag = "div",
  immediate = false,
}: TypewriterLinesProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  const handleLineComplete = useCallback(() => {
    setCompletedLines((prev) => [...prev, lines[currentLine]]);

    setTimeout(() => {
      if (currentLine < lines.length - 1) {
        setCurrentLine((prev) => prev + 1);
      }
    }, lineDelay);
  }, [currentLine, lines, lineDelay]);

  return (
    <div className={className}>
      {/* Already typed lines */}
      {completedLines.map((line, index) => (
        <div key={index} className={lineClassName}>
          {line}
        </div>
      ))}

      {/* Currently typing line */}
      {currentLine < lines.length &&
        !completedLines.includes(lines[currentLine]) && (
          <TypewriterText
            text={lines[currentLine]}
            className={lineClassName}
            speed={speed}
            showCursor={showCursor && currentLine === lines.length - 1}
            onComplete={handleLineComplete}
            tag={tag}
            triggerOnce={true}
            immediate={immediate}
          />
        )}
    </div>
  );
}
