"use client";

import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  glow?: boolean;
}

// Email icon - terminal style envelope
export const EmailIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M2 6L12 13L22 6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 18L8 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M22 18L16 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// GitHub icon - octocat inspired terminal style
export const GitHubIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.579 9.521 21.272 9.521 21.007C9.521 20.769 9.513 20.14 9.508 19.306C6.726 19.91 6.139 17.965 6.139 17.965C5.685 16.812 5.029 16.504 5.029 16.504C4.121 15.88 5.098 15.893 5.098 15.893C6.101 15.963 6.629 16.926 6.629 16.926C7.521 18.455 8.97 18.013 9.539 17.758C9.631 17.11 9.889 16.668 10.175 16.419C7.954 16.167 5.62 15.31 5.62 11.477C5.62 10.386 6.01 9.494 6.649 8.794C6.546 8.542 6.203 7.524 6.747 6.148C6.747 6.148 7.587 5.88 9.497 7.173C10.31 6.95 11.177 6.839 12.04 6.835C12.903 6.839 13.77 6.95 14.583 7.173C16.493 5.88 17.333 6.148 17.333 6.148C17.877 7.524 17.534 8.542 17.431 8.794C18.07 9.494 18.46 10.386 18.46 11.477C18.46 15.32 16.123 16.164 13.895 16.411C14.252 16.717 14.571 17.322 14.571 18.263C14.571 19.605 14.559 20.688 14.559 21.007C14.559 21.275 14.739 21.585 15.247 21.488C19.138 20.163 22 16.417 22 12C22 6.477 17.523 2 12 2Z"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

// LinkedIn icon - terminal style
export const LinkedInIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M7 10V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 7V7.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path
      d="M11 17V13C11 11.895 11.895 11 13 11C14.105 11 15 11.895 15 13V17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 10V17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Twitter/X icon - terminal style
export const TwitterIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M4 4L10.5 12.5L4 20H6L11.5 13.5L16 20H20L13 11L19 4H17L12 10L8 4H4Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// Rocket icon - for demos/launches
export const RocketIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M12 2C12 2 8 6 8 12C8 14.5 9 17 12 20C15 17 16 14.5 16 12C16 6 12 2 12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M5 18L8 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M19 18L16 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 20V22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Code/Developer icon
export const CodeIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M8 6L2 12L8 18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 6L22 12L16 18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 4L10 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Rust/Crab icon
export const RustIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    {/* Crab body */}
    <ellipse
      cx="12"
      cy="14"
      rx="7"
      ry="5"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    {/* Eyes */}
    <circle
      cx="9"
      cy="12"
      r="1.5"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="15"
      cy="12"
      r="1.5"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    {/* Left claw */}
    <path
      d="M5 14C3 13 2 11 2 9C2 8 3 7 4 8L5 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Right claw */}
    <path
      d="M19 14C21 13 22 11 22 9C22 8 21 7 20 8L19 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Legs */}
    <path
      d="M7 17L5 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 18L9 21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 18L15 21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17 17L19 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Tools/Wrench icon
export const ToolsIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M14.7 6.3C14.3 5.9 14 5.4 14 4.8C14 3.3 15.3 2 16.8 2C17.4 2 17.9 2.3 18.3 2.7L21.3 5.7C21.7 6.1 22 6.6 22 7.2C22 8.7 20.7 10 19.2 10C18.6 10 18.1 9.7 17.7 9.3L14.7 6.3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M2 22L13 11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9.3 14.7L14.7 9.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6.3 17.7C5.9 18.1 5.4 18 4.8 18C3.3 18 2 16.7 2 15.2C2 14.6 2.3 14.1 2.7 13.7L5.7 10.7C6.1 10.3 6.6 10 7.2 10C8.7 10 10 11.3 10 12.8C10 13.4 9.7 13.9 9.3 14.3L6.3 17.7Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// Chat/Message icon
export const ChatIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M21 11.5C21 16.19 16.97 20 12 20C10.82 20 9.69 19.82 8.65 19.49L3 21L4.51 15.35C3.56 13.91 3 12.21 3 10.5C3 5.81 7.03 2 12 2C16.97 2 21 5.81 21 10.5V11.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M8 10H8.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path
      d="M12 10H12.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 10H16.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Muscle/Strength icon
export const StrengthIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M4 8C4 8 5 4 8 4C11 4 11 8 11 8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M11 8V16C11 16 11 20 8 20C5 20 4 16 4 16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M4 8V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M20 8C20 8 19 4 16 4C13 4 13 8 13 8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M13 8V16C13 16 13 20 16 20C19 20 20 16 20 16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M20 8V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M11 12H13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Wave/Hello icon
export const WaveIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M7 11V7C7 5.89543 7.89543 5 9 5C10.1046 5 11 5.89543 11 7V11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M11 9V6C11 4.89543 11.8954 4 13 4C14.1046 4 15 4.89543 15 6V9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M15 8V6C15 4.89543 15.8954 4 17 4C18.1046 4 19 4.89543 19 6V14C19 18 16 21 12 21C8 21 5 18 5 14V11C5 9.89543 5.89543 9 7 9C8.10457 9 9 9.89543 9 11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Motion lines */}
    <path d="M2 7L3 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2 11H3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M2 15L3 14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Smug/Cool icon
export const SmugIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    {/* Sunglasses */}
    <path
      d="M6 10H10C10 11.5 9 12 8 12C7 12 6 11.5 6 10Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M14 10H18C18 11.5 17 12 16 12C15 12 14 11.5 14 10Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M10 10H14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Smirk */}
    <path
      d="M8 16C9 17 11 17.5 14 16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Arrow icon
export const ArrowRightIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path d="M5 12H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M13 6L19 12L13 18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// External link icon
export const ExternalLinkIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M18 13V19C18 20.1046 17.1046 21 16 21H5C3.89543 21 3 20.1046 3 19V8C3 6.89543 3.89543 6 5 6H11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M15 3H21V9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14L21 3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Terminal icon
export const TerminalIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <rect
      x="2"
      y="3"
      width="20"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M6 8L10 12L6 16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16H18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Coffee icon - for caffeine references
export const CoffeeIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M17 8H18C19.1046 8 20 8.89543 20 10V11C20 12.1046 19.1046 13 18 13H17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 8H17V15C17 17.2091 15.2091 19 13 19H7C4.79086 19 3 17.2091 3 15V8Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path d="M7 3V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 3V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 3V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// React/Atom icon
export const ReactIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke={color} strokeWidth="1.5" />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      stroke={color}
      strokeWidth="1.5"
      transform="rotate(60 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      stroke={color}
      strokeWidth="1.5"
      transform="rotate(120 12 12)"
    />
  </svg>
);

// TypeScript icon
export const TypeScriptIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M7 10H13M10 10V17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14.5 10H17.5C18.0523 10 18.5 10.4477 18.5 11V11.5C18.5 12.0523 18.0523 12.5 17.5 12.5H15.5C14.9477 12.5 14.5 12.9477 14.5 13.5V16C14.5 16.5523 14.9477 17 15.5 17H18.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Tailwind CSS icon (wind)
export const TailwindIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M6.5 8C7.5 5 9.5 4 12 4C16 4 16.5 7 18.5 7.5C19.5 7.75 20.5 7.5 21.5 6.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 17.5C3.5 16.5 4.5 16.25 5.5 16.5C7.5 17 8 20 12 20C14.5 20 16.5 19 17.5 16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 12.5C5.33333 11.5 7 11 9 11.5C12 12.25 12.5 15 16 15C18 15 19.5 14.5 21 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Three.js / 3D Globe icon
export const ThreeJsIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="4" ry="9" stroke={color} strokeWidth="1.5" />
    <path d="M3 12H21" stroke={color} strokeWidth="1.5" />
    <path
      d="M4.5 7H19.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4.5 17H19.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Sparkle/GSAP animation icon
export const SparkleIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M18 14L19 17L22 18L19 19L18 22L17 19L14 18L17 17L18 14Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M5 16L5.5 18L7.5 18.5L5.5 19L5 21L4.5 19L2.5 18.5L4.5 18L5 16Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// PostgreSQL elephant icon
export const PostgresIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M17 4C19 5 20 7.5 20 10C20 13 18.5 15 17 16L18 20C18 21 17 22 16 22C15 22 14.5 21.5 14.5 21L14 18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 4C5 5 4 7.5 4 10C4 14 6 17 10 18L9 21C9 21.5 9.5 22 10 22C11 22 11.5 21.5 11.5 21L12 18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <ellipse cx="12" cy="10" rx="6" ry="7" stroke={color} strokeWidth="1.5" />
    <circle cx="9" cy="9" r="1" fill={color} />
    <circle cx="15" cy="9" r="1" fill={color} />
    <path
      d="M10 13C10.5 13.5 11.5 13.5 12 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Stack Overflow icon
export const StackOverflowIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M4 21V13H7V18H17V13H20V21H4Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8 15H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M8.5 11.5L15.5 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 8L16 11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 5L17 9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M15 3L18.5 7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Folder icon for projects
export const FolderIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M3 6C3 4.89543 3.89543 4 5 4H9L11 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path d="M3 10H21" stroke={color} strokeWidth="1.5" />
  </svg>
);

// Lightning bolt for tech/energy
export const LightningIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M13 2L4 14H11L10 22L20 10H13L14 2H13Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Graduation cap for education
export const GraduationIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <path
      d="M12 4L2 9L12 14L22 9L12 4Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M6 11.5V17C6 17 8 20 12 20C16 20 18 17 18 17V11.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22 9V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Next.js icon (N in a box)
export const NextJsIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <path
      d="M8 16V8L16 18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M16 8V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Target icon for goals/hints
export const TargetIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <path d="M12 2V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M12 19V22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M2 12H5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M19 12H22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Crab icon for Rust
export const CrabIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  glow = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      filter: glow ? `drop-shadow(0 0 4px ${color})` : undefined,
    }}
  >
    <ellipse cx="12" cy="14" rx="7" ry="5" stroke={color} strokeWidth="1.5" />
    <circle cx="9" cy="13" r="1" fill={color} />
    <circle cx="15" cy="13" r="1" fill={color} />
    <path
      d="M5 12C3 11 2 9 2 7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M19 12C21 11 22 9 22 7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M5 14L3 17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M19 14L21 17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 17L6 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17 17L18 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 17L10 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 17L14 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Export all icons as a map for easy access
export const TerminalIcons = {
  email: EmailIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  rocket: RocketIcon,
  code: CodeIcon,
  rust: RustIcon,
  tools: ToolsIcon,
  chat: ChatIcon,
  strength: StrengthIcon,
  wave: WaveIcon,
  smug: SmugIcon,
  arrowRight: ArrowRightIcon,
  externalLink: ExternalLinkIcon,
  terminal: TerminalIcon,
  coffee: CoffeeIcon,
  react: ReactIcon,
  typescript: TypeScriptIcon,
  tailwind: TailwindIcon,
  threejs: ThreeJsIcon,
  sparkle: SparkleIcon,
  postgres: PostgresIcon,
  stackoverflow: StackOverflowIcon,
  folder: FolderIcon,
  lightning: LightningIcon,
  graduation: GraduationIcon,
  nextjs: NextJsIcon,
  crab: CrabIcon,
  target: TargetIcon,
};

export default TerminalIcons;
