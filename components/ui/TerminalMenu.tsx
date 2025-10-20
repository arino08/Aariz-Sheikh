"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import TerminalMatrixRain from "./TerminalMatrixRain";

interface TerminalMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

type Stage = 'entering' | 'typing' | 'loading' | 'morphing' | 'ready' | 'navigating';

const navigationItems = [
  { id: "hero", label: "HOME", number: 1 },
  { id: "about", label: "ABOUT", number: 2 },
  { id: "skills", label: "SKILLS", number: 3 },
  { id: "projects", label: "PROJECTS", number: 4 },
  { id: "contact", label: "CONTACT", number: 5 },
];

const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

export default function TerminalMenu({ isOpen, onClose, onNavigate }: TerminalMenuProps) {
  const [stage, setStage] = useState<Stage>('entering');
  const [typedText, setTypedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [loadingDots, setLoadingDots] = useState('');
  const [morphedTexts, setMorphedTexts] = useState<Record<number, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLoadingMessage, setShowLoadingMessage] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const morphingIntervalsRef = useRef<Record<number, NodeJS.Timeout>>({});

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Handle ESC key and number key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // ESC to close
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Number keys 1-5 for navigation (only when ready)
      if (stage === 'ready' && /^[1-5]$/.test(e.key)) {
        const itemNumber = parseInt(e.key);
        const item = navigationItems.find(i => i.number === itemNumber);
        if (item) {
          handleNavClick(item);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, stage]);

  // Stage 1: Terminal slide-in animation
  useEffect(() => {
    if (isOpen && terminalRef.current) {
      setStage('entering');
      gsap.fromTo(
        terminalRef.current,
        { x: '100%', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power3.out',
          onComplete: () => {
            setTimeout(() => startTyping(), 500);
          },
        }
      );
    } else if (!isOpen && terminalRef.current) {
      gsap.to(terminalRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
      });
      resetMenu();
    }
  }, [isOpen]);

  // Stage 2: Auto-type "nav" command
  const startTyping = useCallback(() => {
    setStage('typing');
    const command = 'nav';
    let currentIndex = 0;

    const typeCharacter = () => {
      if (currentIndex < command.length) {
        setTypedText(command.substring(0, currentIndex + 1));
        currentIndex++;
        const delay = 80 + Math.random() * 120; // Random delay between 80-200ms
        typingTimeoutRef.current = setTimeout(typeCharacter, delay);
      } else {
        // Press Enter after typing
        setTimeout(() => {
          setTypedText(command);
          startLoading();
        }, 300);
      }
    };

    typeCharacter();
  }, []);

  // Stage 3: Terminal loading animation
  const startLoading = useCallback(() => {
    setStage('loading');
    let dots = '';
    const loadingInterval = setInterval(() => {
      dots = dots.length >= 3 ? '' : dots + '.';
      setLoadingDots(dots);
    }, 200);

    setTimeout(() => {
      clearInterval(loadingInterval);
      startMorphing();
    }, 500);
  }, []);

  // Stage 4: Random text morphing to navigation links
  const startMorphing = useCallback(() => {
    setStage('morphing');

    // Initialize random text for each nav item
    const initialRandomTexts: Record<number, string> = {};
    navigationItems.forEach((item) => {
      initialRandomTexts[item.number] = generateRandomString(item.label.length);
    });
    setMorphedTexts(initialRandomTexts);

    // Show nav links with fade-in
    if (navLinksRef.current) {
      gsap.fromTo(
        navLinksRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4 }
      );
    }

    // Start morphing each link with staggered timing
    navigationItems.forEach((item, index) => {
      setTimeout(() => {
        morphTextToTarget(item.number, item.label);
      }, index * 150);
    });

    // Set ready stage after all morphing completes
    setTimeout(() => {
      setStage('ready');
    }, navigationItems.length * 150 + 1200);
  }, []);

  const generateRandomString = (length: number): string => {
    return Array.from({ length }, () =>
      RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]
    ).join('');
  };

  const morphTextToTarget = (itemNumber: number, targetText: string) => {
    const totalIterations = 20;
    let iteration = 0;

    const interval = setInterval(() => {
      setMorphedTexts((prev) => {
        const newText = targetText
          .split('')
          .map((char, index) => {
            if (iteration / totalIterations > index / targetText.length) {
              return char;
            }
            return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
          })
          .join('');

        return { ...prev, [itemNumber]: newText };
      });

      iteration++;

      if (iteration > totalIterations) {
        clearInterval(interval);
        setMorphedTexts((prev) => ({ ...prev, [itemNumber]: targetText }));
      }
    }, 60);

    morphingIntervalsRef.current[itemNumber] = interval;
  };

  // Stage 5: Handle navigation click
  const handleNavClick = (item: typeof navigationItems[0]) => {
    if (stage !== 'ready') return;

    setSelectedItem(item.id);
    setStage('navigating');

    // Start reverse morphing animation for all links (staggered)
    navigationItems.forEach((navItem, index) => {
      setTimeout(() => {
        reverseMorphText(navItem.number, navItem.label);
      }, index * 100);
    });

    // Calculate total reverse morph time:
    // - Last link starts at: (navigationItems.length - 1) * 100ms
    // - Reverse morph duration: 15 iterations * 50ms = 750ms
    // - Total: ~1150ms
    const reverseMorphDuration = (navigationItems.length - 1) * 100 + 750;

    // Fade out all navigation links after reverse morph completes
    setTimeout(() => {
      if (navLinksRef.current) {
        gsap.to(navLinksRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }, reverseMorphDuration);

    // Show loading message AFTER links disappear
    const loadingOverlayDelay = reverseMorphDuration + 300; // Add 300ms for fade out

    setTimeout(() => {
      setShowLoadingMessage(true);
      setIsFullScreen(true);
      if (terminalRef.current) {
        gsap.to(terminalRef.current, {
          width: '100%',
          height: '100vh',
          top: 0,
          right: 0,
          borderRadius: 0,
          duration: 0.4,
          ease: 'power3.inOut',
        });
      }
    }, loadingOverlayDelay);

    // After fullscreen transition, navigate and fade out matrix
    setTimeout(() => {
      onNavigate(item.id);
      // Fade out matrix rain smoothly
      setTimeout(() => {
        setIsFullScreen(false);
        setTimeout(() => {
          onClose();
        }, 800);
      }, 1000);
    }, loadingOverlayDelay + 1000);
  };

  // Reverse morph: text back to random characters
  const reverseMorphText = (itemNumber: number, currentText: string) => {
    const totalIterations = 15;
    let iteration = 0;

    const interval = setInterval(() => {
      setMorphedTexts((prev) => {
        const newText = currentText
          .split('')
          .map((char, index) => {
            if (iteration / totalIterations > index / currentText.length) {
              return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
            }
            return char;
          })
          .join('');

        return { ...prev, [itemNumber]: newText };
      });

      iteration++;

      if (iteration > totalIterations) {
        clearInterval(interval);
        // Set to fully random at the end
        setMorphedTexts((prev) => ({
          ...prev,
          [itemNumber]: generateRandomString(currentText.length)
        }));
      }
    }, 50);

    morphingIntervalsRef.current[itemNumber] = interval;
  };

  const resetMenu = () => {
    setStage('entering');
    setTypedText('');
    setLoadingDots('');
    setMorphedTexts({});
    setSelectedItem(null);
    setIsFullScreen(false);
    setShowLoadingMessage(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    Object.values(morphingIntervalsRef.current).forEach(clearInterval);
    morphingIntervalsRef.current = {};
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0 }}
      />

      {/* Terminal Window */}
      <div
        ref={terminalRef}
        className="fixed top-0 right-0 w-full md:w-[600px] h-full md:h-screen bg-[#0D1117] z-[110] shadow-2xl border-l border-[#00ff88]/30"
        style={{ transformOrigin: 'right center' }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#00ff88]/30">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="font-mono text-xs text-[#00ff88]">
            terminal@portfolio:~$
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#00ff88] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm h-[calc(100%-60px)] overflow-y-auto">
          {/* Command Prompt */}
          <div className="mb-4">
            <span className="text-[#00ff88]">visitor@portfolio</span>
            <span className="text-gray-400">:</span>
            <span className="text-[#00d4ff]">~</span>
            <span className="text-gray-400">$ </span>
            <span className="text-white">{typedText}</span>
            {stage === 'typing' && (
              <span className={`inline-block w-2 h-4 bg-[#00ff88] ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
            )}
          </div>

          {/* Loading State */}
          {(stage === 'loading' || stage === 'morphing' || stage === 'ready' || stage === 'navigating') && (
            <div className="mb-6">
              {stage === 'loading' && (
                <div className="text-[#00ff88] animate-pulse">
                  Processing{loadingDots}
                </div>
              )}

              {(stage === 'morphing' || stage === 'ready' || stage === 'navigating') && (
                <div ref={navLinksRef}>
                  <div className="text-gray-400 mb-4">
                    <span className="text-[#00ff88]">&gt;</span> Available sections:
                  </div>

                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      disabled={stage !== 'ready'}
                      className={`group block w-full text-left py-4 px-4 mb-2 transition-all duration-300 relative ${
                        stage === 'ready'
                          ? 'hover:bg-[#00ff88]/10 hover:border-l-4 hover:border-[#00ff88] cursor-pointer hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                          : 'cursor-wait'
                      } ${
                        selectedItem === item.id
                          ? 'bg-[#ff8c00]/20 border-l-4 border-[#ff8c00] shadow-[0_0_20px_rgba(255,140,0,0.4)]'
                          : ''
                      }`}
                    >
                      {/* Hover effect background */}
                      {stage === 'ready' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/0 to-[#00ff88]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}

                      <div className="flex items-center space-x-4 relative z-10">
                        <span className="text-[#00ff88] text-xs font-bold">
                          [{item.number}]
                        </span>
                        <span className={`text-2xl md:text-4xl font-bold transition-all duration-300 ${
                          selectedItem === item.id
                            ? 'text-[#ff8c00] text-glitch-effect'
                            : 'text-[#00ff88] group-hover:text-[#00d4ff]'
                        } ${stage === 'ready' ? 'group-hover:tracking-wider' : ''}`}>
                          {morphedTexts[item.number] || generateRandomString(item.label.length)}
                        </span>

                        {/* Arrow indicator on hover */}
                        {stage === 'ready' && (
                          <span className="text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl">
                            →
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Loading State */}
          {stage === 'navigating' && selectedItem && showLoadingMessage && !isFullScreen && (
            <div className="mt-8 space-y-2 fade-in-up">
              <div className="text-[#ff8c00] animate-pulse">
                <span className="text-[#00ff88]">&gt;</span> Initiating navigation sequence...
              </div>
              <div className="text-gray-400 text-xs">
                <span className="text-[#00ff88]">&gt;</span> Decrypting path to {navigationItems.find(i => i.id === selectedItem)?.label}...
              </div>
            </div>
          )}

          {/* Cursor when ready */}
          {stage === 'ready' && (
            <>
              <div className="mt-8">
                <span className="text-[#00ff88]">visitor@portfolio</span>
                <span className="text-gray-400">:</span>
                <span className="text-[#00d4ff]">~</span>
                <span className="text-gray-400">$ </span>
                <span className={`inline-block w-2 h-4 bg-[#00ff88] ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#00ff88]">&gt;</span>
                    <span>Press <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-[#00ff88]">1-5</kbd> for quick navigation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#00ff88]">&gt;</span>
                    <span>Press <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-[#00ff88]">ESC</kbd> to close</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fullscreen Navigation Overlay - Minimalistic Terminal Style */}
        {isFullScreen && stage === 'navigating' && selectedItem && (
          <div className="absolute inset-0 flex items-center justify-center z-20 font-mono">
            <div className="max-w-2xl w-full px-8">
              {/* Terminal-style loading messages */}
              <div className="space-y-3 text-sm md:text-base">
                <div className="text-gray-400 fade-in-up">
                  <span className="text-[#00ff88]">visitor@portfolio</span>
                  <span className="text-gray-500">:</span>
                  <span className="text-[#00d4ff]">~</span>
                  <span className="text-gray-500">$ </span>
                  <span>cd {navigationItems.find(i => i.id === selectedItem)?.label.toLowerCase()}</span>
                </div>

                <div className="text-gray-500 text-xs md:text-sm pl-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <span className="text-[#00ff88]">&gt;</span> loading resources
                  <span className="animate-pulse">...</span>
                </div>

                <div className="text-gray-600 text-xs pl-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <span className="text-[#00ff88]">✓</span> components initialized
                </div>

                <div className="text-gray-600 text-xs pl-8 fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <span className="text-[#00ff88]">✓</span> views mounted
                </div>

                {/* Minimal progress bar */}
                <div className="pt-4 fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <div className="h-0.5 bg-gray-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00ff88] rounded-full shadow-[0_0_8px_rgba(0,255,136,0.6)]"
                      style={{
                        width: '100%',
                        animation: 'loading-progress 2s ease-out forwards'
                      }}
                    />
                  </div>
                </div>

                <div className="text-[#00ff88] text-xs pt-3 fade-in-up" style={{ animationDelay: '1.2s' }}>
                  <span>&gt;</span> ready!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matrix Rain Background for Full Screen */}
        {isFullScreen && (
          <div className="absolute inset-0 z-10">
            <TerminalMatrixRain isActive={isFullScreen && stage === 'navigating'} />
          </div>
        )}

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent opacity-30 animate-pulse" />
      </div>
    </>
  );
}
