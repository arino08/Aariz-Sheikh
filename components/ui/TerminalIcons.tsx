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
    <path
      d="M7 10V17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 7V7.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
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
    <circle cx="9" cy="12" r="1.5" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="15" cy="12" r="1.5" stroke={color} strokeWidth="1.5" fill="none" />
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
    <path d="M7 17L5 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 18L9 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 18L15 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 17L19 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
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
    <path
      d="M8 10H8.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
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
    <path
      d="M4 8V16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
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
    <path
      d="M20 8V16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
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
    <path
      d="M2 7L3 8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2 11H3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
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
    <path
      d="M5 12H19"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
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
      d="M6 9L10 12L6 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15H18"
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
};

export default TerminalIcons;
