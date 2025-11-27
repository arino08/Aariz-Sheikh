"use client";

import { useEffect, useRef, useState } from "react";

type HeadingVariant =
  | "ssh"
  | "git"
  | "manpage"
  | "process"
  | "database"
  | "hexdump"
  | "diff"
  | "logstream"
  | "neofetch"
  | "vim";

interface TerminalHeadingProps {
  children: string;
  variant?: HeadingVariant;
  subtitle?: string;
  className?: string;
  color?: string;
  accentColor?: string;
  animate?: boolean;
  animateOnScroll?: boolean;
  delay?: number;
  onAnimationComplete?: () => void;
}

// Helper to generate random hex
const randomHex = (length: number) => {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
};

// Helper to get current timestamp
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace("T", " ").substring(0, 19);
};

// Convert text to hex representation
const textToHex = (text: string) => {
  return text
    .split("")
    .map((char) =>
      char.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase(),
    )
    .join(" ");
};

export default function TerminalHeading({
  children,
  variant = "ssh",
  subtitle,
  className = "",
  color = "var(--terminal-green)",
  accentColor = "var(--terminal-orange)",
  animate = true,
  animateOnScroll = true,
  delay = 0,
  onAnimationComplete,
}: TerminalHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  const [isMobile, setIsMobile] = useState(false);
  const [, setDisplayState] = useState({
    typing: "",
    showContent: false,
    currentLine: 0,
  });

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll trigger
  useEffect(() => {
    if (!animateOnScroll || !containerRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay * 1000);
          }
        });
      },
      {
        threshold: 0.1, // Lower threshold for mobile compatibility
        rootMargin: "50px 0px", // Trigger earlier for smoother experience
      },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOnScroll, delay]);

  // Fallback: Force show content after timeout on mobile if animation hasn't triggered
  useEffect(() => {
    if (isMobile && !isVisible && animateOnScroll) {
      const fallbackTimer = setTimeout(() => {
        setIsVisible(true);
        setDisplayState({
          typing: children,
          showContent: true,
          currentLine: 10,
        });
      }, 1500); // 1.5 second fallback for mobile
      return () => clearTimeout(fallbackTimer);
    }
  }, [isMobile, isVisible, animateOnScroll, children]);

  // Typing animation for various variants
  useEffect(() => {
    if (!isVisible || !animate) {
      setDisplayState({ typing: children, showContent: true, currentLine: 10 });
      return;
    }

    let timeout: NodeJS.Timeout;
    let charIndex = 0;

    const typeText = (text: string, onComplete?: () => void) => {
      if (charIndex < text.length) {
        setDisplayState((prev) => ({
          ...prev,
          typing: text.slice(0, charIndex + 1),
        }));
        charIndex++;
        timeout = setTimeout(
          () => typeText(text, onComplete),
          30 + Math.random() * 20,
        );
      } else if (onComplete) {
        onComplete();
      }
    };

    // Start animation based on variant
    if (variant === "ssh" || variant === "git" || variant === "logstream") {
      typeText(children, () => {
        setDisplayState((prev) => ({ ...prev, showContent: true }));
        onAnimationComplete?.();
      });
    } else {
      // For other variants, show progressively
      let line = 0;
      const lineInterval = setInterval(() => {
        line++;
        setDisplayState((prev) => ({
          ...prev,
          currentLine: line,
          showContent: true,
        }));
        if (line >= 10) {
          clearInterval(lineInterval);
          onAnimationComplete?.();
        }
      }, 100);

      return () => clearInterval(lineInterval);
    }

    return () => clearTimeout(timeout);
  }, [isVisible, animate, children, variant, onAnimationComplete]);

  // SSH Connection Style
  const renderSSH = () => (
    <div className="font-mono text-sm space-y-1">
      <div className="flex items-center gap-2 text-[var(--code-comment)] opacity-70">
        <span>┌──────────────────────────────────────────────────</span>
      </div>
      <div className="flex items-center gap-2">
        <span style={{ color: accentColor }}>│</span>
        <span className="text-[var(--code-comment)]">$</span>
        <span style={{ color }}>ssh</span>
        <span className="text-white">
          aariz@{children.toLowerCase().replace(/\s+/g, "-")}
        </span>
        <span className="text-[var(--code-comment)]">-p 22</span>
      </div>
      <div className="flex items-center gap-2">
        <span style={{ color: accentColor }}>│</span>
        <span className="text-[var(--code-comment)]">Password:</span>
        <span className="text-white">••••••••</span>
      </div>
      <div className="flex items-center gap-2">
        <span style={{ color: accentColor }}>│</span>
        <span style={{ color }}>Connection established.</span>
      </div>
      {subtitle && (
        <div className="flex items-center gap-2">
          <span style={{ color: accentColor }}>│</span>
          <span className="text-[var(--code-comment)]">
            Last login: Today from visitor.ip
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 text-[var(--code-comment)] opacity-70">
        <span>└──────────────────────────────────────────────────</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span
          style={{ color }}
          className="text-3xl md:text-5xl font-bold tracking-wider"
        >
          {children}
        </span>
      </div>
    </div>
  );

  // Git Log/Branch Style
  const renderGit = () => (
    <div className="font-mono text-sm space-y-1">
      <div className="flex items-center gap-2">
        <span style={{ color }}>*</span>
        <span className="text-white font-bold">
          feat/{children.toLowerCase().replace(/\s+/g, "-")}
        </span>
        <span className="text-[var(--code-comment)]">(HEAD)</span>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span style={{ color: accentColor }}>│</span>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span style={{ color: accentColor }}>├──</span>
        <span className="text-yellow-400">commit</span>
        <span className="text-[var(--code-comment)]">{randomHex(7)}</span>
        <span className="text-[var(--code-comment)]">
          - &quot;Add {children.toLowerCase()}&quot;
        </span>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span style={{ color: accentColor }}>├──</span>
        <span className="text-yellow-400">commit</span>
        <span className="text-[var(--code-comment)]">{randomHex(7)}</span>
        <span className="text-[var(--code-comment)]">
          - &quot;Update content&quot;
        </span>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span style={{ color: accentColor }}>│</span>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span style={{ color: accentColor }}>└──</span>
        <span style={{ color }}>+247</span>
        <span className="text-red-400">-58</span>
        <span className="text-[var(--code-comment)]">│ 3 files changed</span>
      </div>
      <div className="mt-4">
        <span
          style={{ color }}
          className="text-3xl md:text-5xl font-bold tracking-wider"
        >
          {children}
        </span>
      </div>
    </div>
  );

  // Man Page Documentation Style
  const renderManPage = () => (
    <div className="font-mono text-sm">
      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor: `${color}40` }}
      >
        <div
          className="px-4 py-2 border-b flex justify-between items-center"
          style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
        >
          <span style={{ color }} className="font-bold">
            {children.toUpperCase()}(7)
          </span>
          <span className="text-[var(--code-comment)]">Developer Manual</span>
          <span style={{ color }} className="font-bold">
            {children.toUpperCase()}(7)
          </span>
        </div>
        <div className="p-4 space-y-3 bg-[#0D1117]/50">
          <div>
            <span style={{ color: accentColor }} className="font-bold">
              NAME
            </span>
            <div className="ml-6 text-white">
              {children.toLowerCase()} - {subtitle || "section information"}
            </div>
          </div>
          <div>
            <span style={{ color: accentColor }} className="font-bold">
              SYNOPSIS
            </span>
            <div className="ml-6">
              <span style={{ color }}>./</span>
              <span className="text-white">
                {children.toLowerCase().replace(/\s+/g, "-")}
              </span>
              <span className="text-[var(--code-comment)]">
                {" "}
                [--verbose] [--interactive]
              </span>
            </div>
          </div>
          <div>
            <span style={{ color: accentColor }} className="font-bold">
              DESCRIPTION
            </span>
            <div className="ml-6 text-[var(--code-comment)]">
              Displays detailed {children.toLowerCase()} information for the
              portfolio.
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span
          style={{ color }}
          className="text-3xl md:text-5xl font-bold tracking-wider"
        >
          {children}
        </span>
      </div>
    </div>
  );

  // Process Monitor Style
  const renderProcess = () => (
    <div className="font-mono text-sm">
      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor: `${color}40` }}
      >
        <div
          className="px-4 py-2 border-b flex justify-between items-center"
          style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
        >
          <span style={{ color }} className="font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            PROCESS MONITOR
          </span>
          <span className="text-[var(--code-comment)]">
            CPU: <span className="text-green-400">2.1%</span> MEM:{" "}
            <span className="text-blue-400">47%</span>
          </span>
        </div>
        <div className="bg-[#0D1117]/50">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: `${color}20` }}>
                <th className="px-4 py-2 text-left text-[var(--code-comment)]">
                  PID
                </th>
                <th className="px-4 py-2 text-left text-[var(--code-comment)]">
                  SERVICE
                </th>
                <th className="px-4 py-2 text-left text-[var(--code-comment)]">
                  STATUS
                </th>
                <th className="px-4 py-2 text-left text-[var(--code-comment)]">
                  UPTIME
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2" style={{ color: accentColor }}>
                  0x{randomHex(4).toUpperCase()}
                </td>
                <td className="px-4 py-2 text-white font-bold">
                  {children.toLowerCase().replace(/\s+/g, "_")}.service
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                    ACTIVE
                  </span>
                </td>
                <td className="px-4 py-2 text-[var(--code-comment)]">
                  3y 127d
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span
          style={{ color }}
          className="text-3xl md:text-5xl font-bold tracking-wider"
        >
          {children}
        </span>
      </div>
    </div>
  );

  // Database Query Style
  const renderDatabase = () => (
    <div className="font-mono text-sm space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-blue-400">mysql&gt;</span>
        <span className="text-white">
          SELECT * FROM portfolio WHERE section=&apos;{children.toLowerCase()}
          &apos;;
        </span>
      </div>
      <div
        className="border rounded overflow-hidden"
        style={{ borderColor: `${color}40` }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: `${color}10` }}>
              <th
                className="px-4 py-2 text-left border-r"
                style={{ color, borderColor: `${color}40` }}
              >
                id
              </th>
              <th
                className="px-4 py-2 text-left border-r"
                style={{ color, borderColor: `${color}40` }}
              >
                section
              </th>
              <th className="px-4 py-2 text-left" style={{ color }}>
                description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#0D1117]/50">
              <td
                className="px-4 py-2 border-r"
                style={{ color: accentColor, borderColor: `${color}20` }}
              >
                1
              </td>
              <td
                className="px-4 py-2 border-r text-white font-bold"
                style={{ borderColor: `${color}20` }}
              >
                {children.toLowerCase()}
              </td>
              <td className="px-4 py-2 text-[var(--code-comment)]">
                {subtitle || `Portfolio ${children.toLowerCase()} section`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-[var(--code-comment)]">1 row in set (0.001 sec)</div>
      <div className="mt-4 text-center">
        <span
          style={{ color }}
          className="text-3xl md:text-5xl font-bold tracking-wider"
        >
          {children}
        </span>
      </div>
    </div>
  );

  // Hex Dump Style
  const renderHexDump = () => {
    const hex = textToHex(children.toUpperCase());
    const paddedHex = hex.padEnd(23, " 00");

    return (
      <div className="font-mono text-sm space-y-1">
        <div className="text-[var(--code-comment)] mb-2">
          ADDR{"      "}0{"  "}1{"  "}2{"  "}3{"  "}4{"  "}5{"  "}6{"  "}7
          {"   "}ASCII
        </div>
        <div className="text-[var(--code-comment)]">
          ───────────────────────────────────────────
        </div>
        <div className="flex items-center gap-4">
          <span style={{ color: accentColor }}>0x00FF88</span>
          <span style={{ color }}>{paddedHex}</span>
          <span className="text-white">
            {children.toUpperCase().substring(0, 8).padEnd(8, ".")}
          </span>
        </div>
        {children.length > 8 && (
          <div className="flex items-center gap-4">
            <span style={{ color: accentColor }}>0x00FF90</span>
            <span style={{ color }}>
              {textToHex(children.toUpperCase().substring(8)).padEnd(23, " 00")}
            </span>
            <span className="text-white">
              {children.toUpperCase().substring(8, 16).padEnd(8, ".")}
            </span>
          </div>
        )}
        <div className="text-[var(--code-comment)]">
          ───────────────────────────────────────────
        </div>
        <div className="mt-4 text-center">
          <span
            style={{ color }}
            className="text-3xl md:text-5xl font-bold tracking-wider"
          >
            {children}
          </span>
        </div>
      </div>
    );
  };

  // Diff/Patch Style
  const renderDiff = () => (
    <div className="font-mono text-sm space-y-1">
      <div className="text-[var(--code-comment)]">
        diff --git a/sections/{children.toLowerCase().replace(/\s+/g, "-")}.tsx
        b/sections/
        {children.toLowerCase().replace(/\s+/g, "-")}.tsx
      </div>
      <div className="text-[var(--code-comment)]">
        index {randomHex(7)}..{randomHex(7)} 100644
      </div>
      <div className="text-[var(--code-comment)]">
        --- a/sections/{children.toLowerCase().replace(/\s+/g, "-")}.tsx
      </div>
      <div className="text-[var(--code-comment)]">
        +++ b/sections/{children.toLowerCase().replace(/\s+/g, "-")}.tsx
      </div>
      <div style={{ color: "var(--terminal-blue)" }}>@@ -0,0 +1,127 @@</div>
      <div style={{ color }}>+ // {children} Section</div>
      <div style={{ color }}>+ // {subtitle || "Portfolio content"}</div>
      <div style={{ color }}>
        + export default function {children.replace(/\s+/g, "")}() {"{"}
      </div>
      <div style={{ color }}>
        +{"   "}return {"<"}section{">"}...{"<"}/section{">"};
      </div>
      <div style={{ color }}>+ {"}"}</div>
      <div className="mt-4 text-center">
        <span
          style={{ color }}
          className="text-3xl md:text-5xl font-bold tracking-wider"
        >
          {children}
        </span>
      </div>
    </div>
  );

  // Log Stream Style
  const renderLogStream = () => {
    const timestamp = getTimestamp();

    return (
      <div className="font-mono text-sm space-y-1">
        <div className="flex items-start gap-2">
          <span className="text-[var(--code-comment)]">[{timestamp}]</span>
          <span className="text-blue-400">INFO</span>
          <span className="text-white">╭─────────────────────────────╮</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[var(--code-comment)]">[{timestamp}]</span>
          <span className="text-blue-400">INFO</span>
          <span className="text-white">
            │{"   "}LOADING: {children.toLowerCase()}.tsx{"   "}│
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[var(--code-comment)]">[{timestamp}]</span>
          <span className="text-yellow-400">DEBUG</span>
          <span className="text-white">
            │{"   "}
            {subtitle || "Initializing..."}
            {"   "}│
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[var(--code-comment)]">[{timestamp}]</span>
          <span style={{ color }}>SUCCESS</span>
          <span className="text-white">
            │{"   "}Status: READY{"          "}│
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[var(--code-comment)]">[{timestamp}]</span>
          <span className="text-blue-400">INFO</span>
          <span className="text-white">╰─────────────────────────────╯</span>
        </div>
        <div className="mt-4 text-center">
          <span
            style={{ color }}
            className="text-3xl md:text-5xl font-bold tracking-wider"
          >
            {children}
          </span>
        </div>
      </div>
    );
  };

  // Neofetch Style
  const renderNeofetch = () => (
    <div className="font-mono text-sm">
      <div className="flex gap-8 items-start">
        {/* ASCII Art Logo */}
        <div
          style={{ color }}
          className="text-xs leading-tight hidden md:block"
        >
          <pre>{`
    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
   ████████████████▄
  ██              ██▄
  ██   ████████   ██▀
  ██   ██    ██   ██
  ██   ████████   ██
  ██   ██    ██   ██
  ██   ██    ██   ██
   ████████████████
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀
          `}</pre>
        </div>
        {/* Info */}
        <div className="space-y-1">
          <div>
            <span style={{ color }} className="font-bold">
              aariz
            </span>
            <span className="text-white">@</span>
            <span style={{ color }} className="font-bold">
              {children.toLowerCase().replace(/\s+/g, "-")}
            </span>
          </div>
          <div className="text-[var(--code-comment)]">──────────────────</div>
          <div>
            <span style={{ color: accentColor }}>OS:</span>{" "}
            <span className="text-white">Portfolio v3.0</span>
          </div>
          <div>
            <span style={{ color: accentColor }}>Section:</span>{" "}
            <span className="text-white">{children}</span>
          </div>
          <div>
            <span style={{ color: accentColor }}>Status:</span>{" "}
            <span className="text-green-400">Active</span>
          </div>
          <div>
            <span style={{ color: accentColor }}>Theme:</span>{" "}
            <span className="text-white">Terminal Dark</span>
          </div>
          <div>
            <span style={{ color: accentColor }}>Stack:</span>{" "}
            <span className="text-white">Next.js, React, TS</span>
          </div>
          <div className="flex gap-1 mt-2">
            {[
              "#0d1117",
              "#00ff88",
              "#00d4ff",
              "#ff8c00",
              "#a855f7",
              "#ff4444",
              "#ffbb00",
              "#ffffff",
            ].map((c, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span
          style={{ color }}
          className="text-3xl md:text-5xl font-bold tracking-wider"
        >
          {children}
        </span>
      </div>
    </div>
  );

  // Vim Style
  const renderVim = () => (
    <div className="font-mono text-sm">
      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor: `${color}40` }}
      >
        {/* Vim tabs */}
        <div
          className="flex items-center border-b px-2"
          style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
        >
          <div
            className="px-3 py-1 border-r border-l border-t rounded-t text-white"
            style={{
              borderColor: `${color}40`,
              backgroundColor: "#0D1117",
              marginTop: "-1px",
            }}
          >
            {children.toLowerCase().replace(/\s+/g, "_")}.tsx
          </div>
          <div className="px-3 py-1 text-[var(--code-comment)]">+</div>
        </div>
        {/* Content */}
        <div className="bg-[#0D1117] p-4">
          <div className="flex">
            <div className="text-[var(--code-comment)] pr-4 text-right select-none border-r border-gray-800 mr-4">
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
            </div>
            <div>
              <div>
                <span className="text-purple-400">import</span>{" "}
                <span className="text-white">{"{ "}</span>
                <span className="text-yellow-400">Section</span>
                <span className="text-white">{" }"}</span>
                <span className="text-purple-400"> from</span>{" "}
                <span style={{ color }}>&apos;@/components&apos;</span>
              </div>
              <div className="text-[var(--code-comment)]">
                {"// "}
                {subtitle || children + " Section"}
              </div>
              <div>
                <span className="text-purple-400">export default</span>{" "}
                <span className="text-blue-400">function</span>{" "}
                <span className="text-yellow-400">
                  {children.replace(/\s+/g, "")}
                </span>
                <span className="text-white">() {"{"}</span>
              </div>
              <div className="text-white">
                {"  "}return {"<"}
                <span className="text-blue-400">Section</span>
                {" />"};
              </div>
              <div className="text-white">{"}"}</div>
            </div>
          </div>
        </div>
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-2 py-1 text-xs"
          style={{ backgroundColor: `${color}20` }}
        >
          <div className="flex items-center gap-4">
            <span style={{ color }} className="font-bold">
              -- NORMAL --
            </span>
            <span className="text-white">
              {children.toLowerCase().replace(/\s+/g, "_")}.tsx
            </span>
          </div>
          <div className="flex items-center gap-4 text-[var(--code-comment)]">
            <span>utf-8</span>
            <span>tsx</span>
            <span>Ln 1, Col 1</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span
          style={{ color }}
          className="text-3xl md:text-5xl font-bold tracking-wider"
        >
          {children}
        </span>
      </div>
    </div>
  );

  // Render based on variant
  const renderContent = () => {
    switch (variant) {
      case "ssh":
        return renderSSH();
      case "git":
        return renderGit();
      case "manpage":
        return renderManPage();
      case "process":
        return renderProcess();
      case "database":
        return renderDatabase();
      case "hexdump":
        return renderHexDump();
      case "diff":
        return renderDiff();
      case "logstream":
        return renderLogStream();
      case "neofetch":
        return renderNeofetch();
      case "vim":
        return renderVim();
      default:
        return renderSSH();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`terminal-heading overflow-x-auto max-w-full ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      {renderContent()}
    </div>
  );
}

// Export variant type for external use
export type { HeadingVariant };
