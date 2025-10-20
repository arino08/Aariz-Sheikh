"use client";

import { useEffect, useState } from "react";
import MiniTerminal from "./MiniTerminal";
import AdminPanel from "./AdminPanel";

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
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </>
  );
}
