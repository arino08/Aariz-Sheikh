"use client";

import { useEffect, useState } from "react";
import MiniTerminal from "./MiniTerminal";
import UnifiedAdminPanel from "./UnifiedAdminPanel";

export default function GlobalTerminalShortcut() {
  const [isMiniTerminalOpen, setIsMiniTerminalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open mini terminal
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsMiniTerminalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Expose a global function to open terminal (for mobile access)
  useEffect(() => {
    (window as any).openAdminTerminal = () => {
      setIsMiniTerminalOpen(true);
    };

    return () => {
      delete (window as any).openAdminTerminal;
    };
  }, []);

  const handleAuthenticated = () => {
    setIsAdminPanelOpen(true);
  };

  return (
    <>
      <MiniTerminal
        isOpen={isMiniTerminalOpen}
        onClose={() => setIsMiniTerminalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
      <UnifiedAdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </>
  );
}
