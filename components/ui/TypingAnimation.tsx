"use client";

import { useState, useEffect } from "react";

interface TypingAnimationProps {
        text: string;
        className?: string;
        speed?: number;
        delay?: number;
        showCursor?: boolean;
}

export default function TypingAnimation({
        text,
        className = "",
        speed = 100,
        delay = 0,
        showCursor = true,
}: TypingAnimationProps) {
        const [displayText, setDisplayText] = useState("");
        const [currentIndex, setCurrentIndex] = useState(0);
        const [showBlinkingCursor, setShowBlinkingCursor] = useState(true);

        useEffect(() => {
                if (currentIndex < text.length) {
                        const timeout = setTimeout(() => {
                                setDisplayText(
                                        (prev) => prev + text[currentIndex]
                                );
                                setCurrentIndex((prev) => prev + 1);
                        }, delay + speed);

                        return () => clearTimeout(timeout);
                } else if (showCursor) {
                        // Start blinking cursor after typing is complete
                        const cursorTimeout = setTimeout(() => {
                                setShowBlinkingCursor(false);
                        }, 3000); // Hide cursor after 3 seconds

                        return () => clearTimeout(cursorTimeout);
                }
        }, [currentIndex, text, speed, delay, showCursor]);

        return (
                <span className={`font-mono ${className}`}>
                        {displayText}
                        {showCursor && currentIndex <= text.length && (
                                <span
                                        className={`inline-block w-0.5 h-6 ml-1 ${
                                                currentIndex === text.length &&
                                                showBlinkingCursor
                                                        ? "animate-pulse bg-[var(--terminal-green)]"
                                                        : "bg-[var(--terminal-green)]"
                                        }`}
                                />
                        )}
                </span>
        );
}
