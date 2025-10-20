"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";

interface MiniTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "az8576";

export default function MiniTerminal({ isOpen, onClose, onAuthenticated }: MiniTerminalProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Slide-in animation
  useEffect(() => {
    if (isOpen && terminalRef.current) {
      gsap.fromTo(
        terminalRef.current,
        { y: '100%', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power3.out',
        }
      );
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 350);
    } else if (!isOpen && terminalRef.current) {
      gsap.to(terminalRef.current, {
        y: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
      });
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleCommand = useCallback((command: string) => {
    const cmd = command.trim().toLowerCase();

    // Add command to output
    setOutput((prev) => [...prev, `$ ${command}`]);

    // Process commands
    if (cmd === ADMIN_SECRET.toLowerCase()) {
      setOutput((prev) => [
        ...prev,
        "✓ Authentication successful!",
        "Opening admin panel...",
      ]);
      setIsAuthenticated(true);
      setTimeout(() => {
        onAuthenticated();
        setTimeout(onClose, 500);
      }, 1000);
    } else if (cmd === "help") {
      setOutput((prev) => [
        ...prev,
        "Available commands:",
        "  help     - Show this help message",
        "  clear    - Clear terminal",
        "  exit     - Close terminal",
        "  [code]   - Enter admin code",
      ]);
    } else if (cmd === "clear") {
      setOutput([]);
    } else if (cmd === "exit") {
      onClose();
    } else if (cmd === "") {
      // Do nothing for empty command
    } else {
      setOutput((prev) => [...prev, `Command not found: ${command}`, "Type 'help' for available commands"]);
    }

    setInput("");
  }, [onAuthenticated, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Mini Terminal */}
      <div
        ref={terminalRef}
        className="fixed bottom-0 left-0 right-0 z-[70] bg-[#0D1117] border-t-2 border-[#00ff88] shadow-2xl"
        style={{ height: 'min(350px, 50vh)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-[#161b22] border-b border-[#00ff88]/30">
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" />
            <span className="ml-2 md:ml-4 font-mono text-[10px] md:text-xs text-[#00ff88]">mini-terminal</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#00ff88] transition-colors p-1 active:scale-95"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-3 md:p-4 font-mono text-xs md:text-sm h-[calc(100%-48px)] overflow-y-auto">
          {/* Output */}
          <div className="space-y-1 mb-2">
            {output.length === 0 && (
              <div className="text-gray-500 text-[10px] md:text-xs">
                Welcome to Admin Terminal. Type 'help' for available commands.
              </div>
            )}
            {output.map((line, index) => (
              <div
                key={index}
                className={`text-[10px] md:text-xs ${
                  line.startsWith("✓")
                    ? "text-[#00ff88]"
                    : line.startsWith("$")
                    ? "text-white"
                    : line.includes("not found") || line.includes("Error")
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Input Line */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <span className="text-[#00ff88] text-[10px] md:text-xs">visitor@admin</span>
              <span className="text-gray-400">:</span>
              <span className="text-[#00d4ff]">~</span>
              <span className="text-gray-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white caret-[#00ff88] text-xs md:text-sm min-w-0"
                autoComplete="off"
                spellCheck="false"
                placeholder="Enter command..."
              />
              <span
                className={`inline-block w-1.5 md:w-2 h-3 md:h-4 bg-[#00ff88] flex-shrink-0 ${
                  cursorVisible ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="hidden sm:block absolute bottom-2 right-4 text-[10px] md:text-xs text-gray-600 font-mono">
          Press <kbd className="px-1 py-0.5 bg-gray-800 rounded border border-gray-700 text-[10px] md:text-xs">ESC</kbd> to close
        </div>
      </div>
    </>
  );
}
