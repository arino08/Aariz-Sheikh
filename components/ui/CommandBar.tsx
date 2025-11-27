"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import useTerminalSounds from "@/hooks/useTerminalSounds";

const FORTUNES = [
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Experience is the name everyone gives to their mistakes.",
  "In order to be irreplaceable, one must always be different.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "The only way to learn a new programming language is by writing programs in it.",
  "Talk is cheap. Show me the code.",
];

const THEME_COLORS: Record<ThemeColor, string> = {
  green: "#00ff88",
  amber: "#ffb000",
  blue: "#00d4ff",
  purple: "#a855f7",
  red: "#ff4444",
};

type ThemeColor = "green" | "amber" | "blue" | "purple" | "red";

interface Command {
  name: string;
  aliases?: string[];
  description: string;
  category: "navigation" | "action" | "theme" | "fun" | "system";
  action: () => string | void;
}

interface HistoryEntry {
  input: string;
  output: string;
  timestamp: Date;
}

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>("green");
  const [matrixMode, setMatrixMode] = useState(false);
  const [easterEggTriggered, setEasterEggTriggered] = useState<string | null>(
    null,
  );
  const [glitchEffect, setGlitchEffect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Check if mobile - hide button on mobile since sprite handles it
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Terminal sounds
  const { playKeypress, playSuccess, playError, playWhoosh, playBeep } =
    useTerminalSounds();

  // Scroll to section helper
  const scrollTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
    return `Navigating to ${id}...`;
  }, []);

  // Theme change helper
  const changeTheme = useCallback((theme: ThemeColor) => {
    setCurrentTheme(theme);
    document.documentElement.style.setProperty(
      "--terminal-green",
      THEME_COLORS[theme],
    );
    return `Theme changed to ${theme}. Terminal color updated.`;
  }, []);

  // All available commands
  const commands: Command[] = useMemo(
    () => [
      // Navigation
      {
        name: "home",
        aliases: ["h", "index"],
        description: "Go to hero section",
        category: "navigation",
        action: () => scrollTo("hero"),
      },
      {
        name: "about",
        aliases: ["me", "whoami"],
        description: "Learn about me",
        category: "navigation",
        action: () => scrollTo("about"),
      },
      {
        name: "skills",
        aliases: ["tech", "stack"],
        description: "View my tech stack",
        category: "navigation",
        action: () => scrollTo("skills"),
      },
      {
        name: "projects",
        aliases: ["work", "portfolio"],
        description: "See my projects",
        category: "navigation",
        action: () => scrollTo("projects"),
      },
      {
        name: "contact",
        aliases: ["email", "connect"],
        description: "Get in touch",
        category: "navigation",
        action: () => scrollTo("contact"),
      },
      {
        name: "blog",
        aliases: ["posts", "articles"],
        description: "Read my blog",
        category: "navigation",
        action: () => {
          window.location.href = "/blog";
          return "Opening blog...";
        },
      },

      // Actions
      {
        name: "github",
        aliases: ["gh", "repo"],
        description: "Open GitHub profile",
        category: "action",
        action: () => {
          window.open("https://github.com/arino08", "_blank");
          return "Opening GitHub in new tab...";
        },
      },
      {
        name: "linkedin",
        aliases: ["li", "in"],
        description: "Open LinkedIn profile",
        category: "action",
        action: () => {
          window.open(
            "https://www.linkedin.com/in/aariz-sheikh-384432307/",
            "_blank",
          );
          return "Opening LinkedIn...";
        },
      },
      {
        name: "twitter",
        aliases: ["x", "tw"],
        description: "Open Twitter/X profile",
        category: "action",
        action: () => {
          window.open("https://x.com/Sheikh12Ariz", "_blank");
          return "Opening Twitter/X...";
        },
      },
      {
        name: "resume",
        aliases: ["cv", "download"],
        description: "Download resume",
        category: "action",
        action: () => {
          window.open("/resume.pdf", "_blank");
          return "Opening resume...";
        },
      },
      {
        name: "email",
        aliases: ["mail", "mailto"],
        description: "Send me an email",
        category: "action",
        action: () => {
          window.location.href = "mailto:arinopc22@gmail.com";
          return "Opening email client...";
        },
      },

      // Themes
      {
        name: "theme green",
        aliases: ["green"],
        description: "Green terminal theme",
        category: "theme",
        action: () => changeTheme("green"),
      },
      {
        name: "theme amber",
        aliases: ["amber", "orange"],
        description: "Amber terminal theme",
        category: "theme",
        action: () => changeTheme("amber"),
      },
      {
        name: "theme blue",
        aliases: ["blue", "cyan"],
        description: "Blue terminal theme",
        category: "theme",
        action: () => changeTheme("blue"),
      },
      {
        name: "theme purple",
        aliases: ["purple", "violet"],
        description: "Purple terminal theme",
        category: "theme",
        action: () => changeTheme("purple"),
      },
      {
        name: "theme red",
        aliases: ["red", "danger"],
        description: "Red terminal theme",
        category: "theme",
        action: () => changeTheme("red"),
      },

      // System
      {
        name: "clear",
        aliases: ["cls", "reset"],
        description: "Clear terminal history",
        category: "system",
        action: () => {
          setHistory([]);
          return "Terminal cleared.";
        },
      },
      {
        name: "help",
        aliases: ["?", "commands", "h"],
        description: "Show all commands",
        category: "system",
        action: () => "help",
      },
      {
        name: "history",
        aliases: ["hist"],
        description: "Show command history",
        category: "system",
        action: () => "history",
      },
      {
        name: "date",
        aliases: ["time", "now"],
        description: "Show current date/time",
        category: "system",
        action: () => new Date().toLocaleString(),
      },
      {
        name: "uptime",
        description: "Show session uptime",
        category: "system",
        action: () =>
          `Session started ${Math.floor((Date.now() - performance.timing.navigationStart) / 1000 / 60)} minutes ago`,
      },
      {
        name: "reboot",
        aliases: ["restart", "boot"],
        description: "Replay boot sequence",
        category: "system",
        action: () => {
          try {
            sessionStorage.removeItem("portfolio-booted");
          } catch {
            // Ignore
          }
          setTimeout(() => window.location.reload(), 500);
          return "Rebooting system... Stand by.";
        },
      },
      {
        name: "intro",
        aliases: ["avatar", "greeting", "hello"],
        description: "Replay the intro sequence",
        category: "system",
        action: () => {
          try {
            sessionStorage.removeItem("portfolio-intro-seen");
          } catch {
            // Ignore
          }
          setTimeout(() => window.location.reload(), 500);
          return "Replaying intro... Say hello again! 👋";
        },
      },
      {
        name: "guide",
        aliases: ["companion", "assistant", "helper"],
        description: "Toggle the ASCII guide companion",
        category: "system",
        action: () => {
          // Simulate pressing 'G' key to toggle guide
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "g", bubbles: true }),
          );
          setIsOpen(false);
          return "Toggled ASCII guide companion! 🤖";
        },
      },
      {
        name: "settings",
        aliases: ["config", "preferences", "options"],
        description: "Open settings panel",
        category: "system",
        action: () => {
          setIsOpen(false);
          // Dispatch custom event to open settings
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("open-settings"));
          }, 300);
          return "Opening settings panel...";
        },
      },
      {
        name: "performance",
        aliases: ["perf", "fps"],
        description: "Toggle performance mode",
        category: "system",
        action: () => {
          setIsOpen(false);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("open-settings"));
          }, 300);
          return "Opening performance settings...";
        },
      },

      // Fun / Easter eggs
      {
        name: "matrix",
        aliases: ["neo"],
        description: "Toggle matrix mode",
        category: "fun",
        action: () => {
          const newMode = !matrixMode;
          setMatrixMode(newMode);
          document.body.classList.toggle("matrix-intense");
          return newMode
            ? "Welcome to the Matrix, Neo."
            : "Exiting the Matrix...";
        },
      },
      {
        name: "sudo rm -rf /",
        aliases: ["rm -rf"],
        description: "Nice try!",
        category: "fun",
        action: () => {
          setEasterEggTriggered("sudo");
          return "Nice try! 😏 But this terminal is read-only.";
        },
      },
      {
        name: "exit",
        aliases: ["quit", "bye"],
        description: "Close command bar",
        category: "fun",
        action: () => {
          setTimeout(() => setIsOpen(false), 500);
          return "Goodbye! 👋";
        },
      },
      {
        name: "cowsay",
        aliases: ["moo"],
        description: "What does the cow say?",
        category: "fun",
        action: () => "cowsay",
      },
      {
        name: "fortune",
        aliases: ["quote"],
        description: "Get a random fortune",
        category: "fun",
        action: () => "fortune",
      },
      {
        name: "hack",
        aliases: ["hacker"],
        description: "Activate hacker mode",
        category: "fun",
        action: () => {
          setGlitchEffect(true);
          setTimeout(() => setGlitchEffect(false), 2000);
          return "ACCESSING MAINFRAME... just kidding 😄";
        },
      },
      {
        name: "flip",
        aliases: ["tableflip"],
        description: "(╯°□°)╯︵ ┻━┻",
        category: "fun",
        action: () => "(╯°□°)╯︵ ┻━┻",
      },
      {
        name: "shrug",
        description: "¯\\_(ツ)_/¯",
        category: "fun",
        action: () => "¯\\_(ツ)_/¯",
      },
      {
        name: "dance",
        aliases: ["party"],
        description: "Let's dance!",
        category: "fun",
        action: () => "♪┏(°.°)┛┗(°.°)┓┗(°.°)┛┏(°.°)┓ ♪",
      },
      {
        name: "coffee",
        aliases: ["brew"],
        description: "Brewing coffee...",
        category: "fun",
        action: () => "☕ Here's your coffee! Now get back to coding!",
      },
      {
        name: "ping",
        description: "Pong!",
        category: "fun",
        action: () => "🏓 Pong! Latency: 0.001ms (local execution)",
      },
    ],
    [scrollTo, changeTheme, matrixMode],
  );

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!input.trim()) return [];
    const searchTerm = input.toLowerCase().trim();

    return commands
      .filter((cmd) => {
        const nameMatch = cmd.name.toLowerCase().includes(searchTerm);
        const aliasMatch = cmd.aliases?.some((a) =>
          a.toLowerCase().includes(searchTerm),
        );
        return nameMatch || aliasMatch;
      })
      .slice(0, 8);
  }, [input, commands]);

  // Open/close handlers with animations
  const openCommandBar = useCallback(() => {
    setIsOpen(true);
    setInput("");
    setSelectedSuggestion(0);
    setHistoryIndex(-1);
    playWhoosh({ volume: 0.06, duration: 0.2 });
  }, [playWhoosh]);

  const closeCommandBar = useCallback(() => {
    playWhoosh({ volume: 0.04, duration: 0.15 });
    if (containerRef.current && backdropRef.current) {
      gsap.to(containerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(false);
    }
  }, [playWhoosh]);

  // Animation on open
  useEffect(() => {
    if (isOpen && containerRef.current && backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
      );
      gsap.fromTo(
        containerRef.current,
        { y: -20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" },
      );
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard shortcut to open (Ctrl+Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        if (isOpen) {
          closeCommandBar();
        } else {
          openCommandBar();
        }
      }
      if (e.key === "Escape" && isOpen) {
        closeCommandBar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openCommandBar, closeCommandBar]);

  // Execute command
  const executeCommand = useCallback(
    (commandInput?: string) => {
      const cmdInput = (commandInput || input).toLowerCase().trim();
      if (!cmdInput) return;

      let output = "";

      // Find matching command
      const foundCommand = commands.find((cmd) => {
        if (cmd.name.toLowerCase() === cmdInput) return true;
        if (cmd.aliases?.some((a) => a.toLowerCase() === cmdInput)) return true;
        // Partial match for multi-word commands
        if (cmdInput.startsWith(cmd.name.toLowerCase().split(" ")[0])) {
          return cmd.name.toLowerCase() === cmdInput;
        }
        return false;
      });

      if (foundCommand) {
        const result = foundCommand.action();

        // Special outputs
        if (result === "help") {
          const categories = [
            "navigation",
            "action",
            "theme",
            "system",
            "fun",
          ] as const;
          output = "Available commands:\n\n";
          categories.forEach((cat) => {
            const cmds = commands.filter((c) => c.category === cat);
            output += `[${cat.toUpperCase()}]\n`;
            cmds.forEach((c) => {
              output += `  ${c.name.padEnd(18)} - ${c.description}\n`;
            });
            output += "\n";
          });
        } else if (result === "history") {
          if (history.length === 0) {
            output = "No command history yet.";
          } else {
            output = history
              .map((h, i) => `${i + 1}. $ ${h.input}\n   → ${h.output}`)
              .join("\n\n");
          }
        } else if (result === "cowsay") {
          output = ` ${"_".repeat(20)}
< Moo! I'm a cow! >
 ${"-".repeat(20)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
        } else if (result === "fortune") {
          output = `🔮 ${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}`;
        } else {
          output = result || "Command executed.";
        }
      } else {
        // Check for partial matches
        const partialMatches = commands.filter(
          (cmd) =>
            cmd.name.toLowerCase().startsWith(cmdInput) ||
            cmd.aliases?.some((a) => a.toLowerCase().startsWith(cmdInput)),
        );

        if (partialMatches.length > 0) {
          output = `Command not found. Did you mean: ${partialMatches
            .slice(0, 3)
            .map((c) => c.name)
            .join(", ")}?`;
        } else {
          output = `Command not found: "${cmdInput}". Type 'help' for available commands.`;
        }
      }

      // Add to history
      setHistory((prev) => [
        ...prev,
        {
          input: cmdInput,
          output,
          timestamp: new Date(),
        },
      ]);

      // Play success or error sound based on command result
      if (foundCommand) {
        playSuccess({ volume: 0.08 });
      } else {
        playError({ volume: 0.06 });
      }

      setInput("");
      setSelectedSuggestion(0);
      setHistoryIndex(-1);
    },
    [input, commands, history, playSuccess, playError],
  );

  // Input keydown handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (suggestions.length > 0 && selectedSuggestion >= 0) {
          setInput(suggestions[selectedSuggestion].name);
          executeCommand(suggestions[selectedSuggestion].name);
        } else {
          executeCommand();
        }
        break;

      case "Tab":
        e.preventDefault();
        if (suggestions.length > 0) {
          setInput(suggestions[selectedSuggestion].name);
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        playKeypress({ volume: 0.03 });
        if (suggestions.length > 0) {
          setSelectedSuggestion((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1,
          );
        } else if (history.length > 0) {
          const newIndex =
            historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]?.input || "");
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        playKeypress({ volume: 0.03 });
        if (suggestions.length > 0) {
          setSelectedSuggestion((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0,
          );
        } else if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]?.input || "");
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput("");
        }
        break;
    }
  };

  // Scroll history to bottom
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "navigation":
        return "🧭";
      case "action":
        return "⚡";
      case "theme":
        return "🎨";
      case "system":
        return "⚙️";
      case "fun":
        return "🎮";
      default:
        return "📌";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "navigation":
        return "text-[var(--terminal-blue)]";
      case "action":
        return "text-[var(--terminal-green)]";
      case "theme":
        return "text-[var(--terminal-purple)]";
      case "system":
        return "text-[var(--terminal-orange)]";
      case "fun":
        return "text-pink-400";
      default:
        return "text-gray-400";
    }
  };

  // Floating button when closed - hidden on mobile (sprite handles it)
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9995] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCommandBar}
      />

      {/* Command bar container */}
      <div
        ref={containerRef}
        className={`relative w-full max-w-2xl mx-4 bg-[#0d1117] border border-[var(--terminal-green)]/30 rounded-2xl overflow-hidden shadow-2xl ${
          glitchEffect ? "animate-glitch" : ""
        }`}
        style={{
          boxShadow: `
            0 0 0 1px rgba(0,255,136,0.1),
            0 25px 50px -12px rgba(0,0,0,0.8),
            0 0 60px rgba(0,255,136,0.1)
          `,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#161B22]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
            </div>
            <span className="font-mono text-xs text-gray-500 ml-2">
              terminal — command palette
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-gray-600">
              {matrixMode && "🔴 MATRIX "}
              Theme: {currentTheme}
            </span>
          </div>
        </div>

        {/* History output */}
        {history.length > 0 && (
          <div
            ref={historyRef}
            className="max-h-48 overflow-y-auto border-b border-gray-800 custom-scrollbar"
          >
            <div className="p-4 space-y-3 font-mono text-xs">
              {history.slice(-5).map((entry, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-[var(--terminal-green)]">
                    <span className="text-gray-600">$</span>
                    <span>{entry.input}</span>
                  </div>
                  <div className="text-gray-400 pl-4 whitespace-pre-wrap break-words">
                    {entry.output}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-center px-4 py-4 gap-3 bg-[#0d1117]">
          <span className="text-[var(--terminal-green)] font-mono text-lg font-bold">
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSelectedSuggestion(0);
              // Play subtle keypress sound
              if (e.target.value.length > input.length) {
                playKeypress({ volume: 0.02 });
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-gray-600"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:flex items-center px-2 py-1 bg-black/30 rounded text-[10px] text-gray-500 border border-gray-700">
              ESC
            </kbd>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="border-t border-gray-800 max-h-72 overflow-y-auto custom-scrollbar">
            {suggestions.map((cmd, i) => (
              <button
                key={cmd.name}
                onClick={() => {
                  setInput(cmd.name);
                  executeCommand(cmd.name);
                }}
                onMouseEnter={() => setSelectedSuggestion(i)}
                className={`w-full text-left px-4 py-3 font-mono text-sm transition-all duration-150 flex items-center gap-3 ${
                  i === selectedSuggestion
                    ? "bg-[var(--terminal-green)]/10 border-l-2 border-[var(--terminal-green)]"
                    : "hover:bg-gray-800/50 border-l-2 border-transparent"
                }`}
              >
                <span className="text-lg">{getCategoryIcon(cmd.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${getCategoryColor(cmd.category)}`}
                    >
                      {cmd.name}
                    </span>
                    {cmd.aliases && cmd.aliases.length > 0 && (
                      <span className="text-[10px] text-gray-600">
                        ({cmd.aliases.slice(0, 2).join(", ")})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {cmd.description}
                  </div>
                </div>
                {i === selectedSuggestion && (
                  <span className="text-xs text-gray-500">↵</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Empty state / hint */}
        {!input && suggestions.length === 0 && history.length === 0 && (
          <div className="px-4 py-6 text-center border-t border-gray-800">
            <div className="font-mono text-sm text-gray-500 mb-2">
              Quick actions:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["home", "projects", "github", "theme", "help"].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setInput(cmd);
                    if (cmd !== "theme") executeCommand(cmd);
                  }}
                  className="font-mono text-xs px-3 py-1.5 bg-gray-800/50 text-gray-400 rounded-lg hover:bg-[var(--terminal-green)]/10 hover:text-[var(--terminal-green)] transition-all border border-transparent hover:border-[var(--terminal-green)]/30"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-800 bg-[#0a0a0a] flex items-center justify-between">
          <div className="flex items-center gap-4 font-mono text-[10px] text-gray-600">
            <span>↑↓ navigate</span>
            <span>⇥ autocomplete</span>
            <span>↵ execute</span>
          </div>
          <div className="font-mono text-[10px] text-gray-600">
            {commands.length} commands available
          </div>
        </div>

        {/* Easter egg overlay */}
        {easterEggTriggered === "sudo" && (
          <div
            className="absolute inset-0 bg-red-500/20 pointer-events-none animate-pulse"
            onAnimationEnd={() => setEasterEggTriggered(null)}
          />
        )}
      </div>

      {/* Glitch animation styles */}
      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        .animate-glitch {
          animation: glitch 0.3s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--terminal-green);
          border-radius: 3px;
          opacity: 0.5;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--terminal-green);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
