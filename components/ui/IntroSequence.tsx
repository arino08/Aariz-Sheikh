"use client";

import { useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import AsciiAvatarIntro from "./AsciiAvatarIntro";

interface IntroSequenceProps {
  children: React.ReactNode;
  skipIntro?: boolean;
  storageKey?: string;
}

export default function IntroSequence({
  children,
  skipIntro = false,
  storageKey = "portfolio-intro-seen",
}: IntroSequenceProps) {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if intro should be shown
  useEffect(() => {
    setIsClient(true);

    if (skipIntro) {
      setIntroComplete(true);
      return;
    }

    // Check if user has seen intro in this session
    try {
      const hasSeenIntro = sessionStorage.getItem(storageKey);
      if (hasSeenIntro) {
        setIntroComplete(true);
      } else {
        setShowIntro(true);
      }
    } catch {
      // If sessionStorage is not available, show intro
      setShowIntro(true);
    }
  }, [skipIntro, storageKey]);

  const handleIntroComplete = useCallback(() => {
    // Mark intro as seen for this session
    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {
      // Ignore storage errors
    }

    // Animate main content in
    setShowIntro(false);

    // Small delay before showing main content for smooth transition
    setTimeout(() => {
      setIntroComplete(true);

      // Animate the main content entrance
      gsap.fromTo(
        "[data-main-content]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }, 100);
  }, [storageKey]);

  // Don't render anything on server
  if (!isClient) {
    return null;
  }

  // If intro is complete, just show children
  if (introComplete && !showIntro) {
    return (
      <div data-main-content style={{ opacity: 1 }}>
        {children}
      </div>
    );
  }

  // Show intro
  if (showIntro) {
    return (
      <>
        <AsciiAvatarIntro
          onComplete={handleIntroComplete}
          onSkip={handleIntroComplete}
        />
        {/* Preload children in background (hidden) for faster transition */}
        <div
          style={{
            position: "absolute",
            visibility: "hidden",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          {children}
        </div>
      </>
    );
  }

  // Loading state
  return (
    <div className="fixed inset-0 bg-[#0D1117] flex items-center justify-center">
      <div className="font-mono text-[var(--terminal-green)] animate-pulse">
        Loading...
      </div>
    </div>
  );
}

// Hook to manually trigger intro replay
export function useIntroReplay(storageKey = "portfolio-intro-seen") {
  const replay = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
      window.location.reload();
    } catch {
      window.location.reload();
    }
  }, [storageKey]);

  return { replay };
}

// Component to add a "replay intro" button
export function ReplayIntroButton({
  className = "",
  children = "Replay Intro",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { replay } = useIntroReplay();

  return (
    <button
      onClick={replay}
      className={`font-mono text-sm text-[var(--terminal-green)] hover:underline ${className}`}
    >
      {children}
    </button>
  );
}
