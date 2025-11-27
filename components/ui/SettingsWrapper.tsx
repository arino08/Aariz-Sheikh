"use client";

import { useState, useEffect, useCallback } from "react";
import { usePerformance } from "./PerformanceProvider";
import { StaticGrain } from "./FilmGrain";
import SettingsPanel, { SettingsButton } from "./SettingsPanel";
import CRTEffect from "./CRTEffect";

export default function SettingsWrapper() {
  const { settings } = usePerformance();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Callback to open settings
  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Listen for custom event from command bar
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsSettingsOpen(true);
    };

    window.addEventListener("open-settings", handleOpenSettings);
    return () =>
      window.removeEventListener("open-settings", handleOpenSettings);
  }, []);

  // Keyboard shortcut to open settings (Ctrl + ,)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Don't render anything until mounted to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Film grain overlay - conditional based on settings */}
      {settings.enableGrain && <StaticGrain opacity={0.03} />}

      {/* CRT Effect - replaces basic scanlines with full retro terminal experience */}
      {settings.enableScanlines && (
        <CRTEffect
          enabled={true}
          intensity="subtle"
          enableScanlines={true}
          enableGlow={settings.enableGlow}
          enableFlicker={settings.enableAnimations}
          enableCurvature={false}
          enableVignette={true}
          enableNoise={settings.enableAnimations}
        />
      )}

      {/* Settings button */}
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />

      {/* Settings panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
