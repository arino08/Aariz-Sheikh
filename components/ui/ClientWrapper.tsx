"use client";

import { useState, useEffect, useCallback } from "react";
import BootSequence from "./BootSequence";
import TerminalCursor from "./TerminalCursor";
import CommandBar from "./CommandBar";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [showBootSequence, setShowBootSequence] = useState(true);
  const [isBooted, setIsBooted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [shouldShowBoot, setShouldShowBoot] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    // Check if boot sequence has been shown this session
    // Use try-catch in case sessionStorage is not available
    try {
      const hasBooted = sessionStorage.getItem("portfolio-booted");
      if (hasBooted === "true") {
        setShouldShowBoot(false);
        setShowBootSequence(false);
        setIsBooted(true);
      } else {
        setShouldShowBoot(true);
        setShowBootSequence(true);
      }
    } catch {
      // If sessionStorage fails, show boot sequence
      setShouldShowBoot(true);
      setShowBootSequence(true);
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    // Mark as booted for this session
    try {
      sessionStorage.setItem("portfolio-booted", "true");
    } catch {
      // Ignore if sessionStorage fails
    }
    setShowBootSequence(false);
    setIsBooted(true);
  }, []);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        {/* Show black screen while loading */}
      </div>
    );
  }

  return (
    <>
      {/* Boot Sequence - shows only once per session */}
      {showBootSequence && shouldShowBoot && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      {/* Custom Terminal Cursor - only after boot */}
      {isBooted && <TerminalCursor />}

      {/* Command Bar - always available after boot */}
      {isBooted && <CommandBar />}

      {/* Main content - fade in after boot */}
      <div
        className={`transition-opacity duration-500 ${
          isBooted ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}
