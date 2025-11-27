// Section Components
export { default as HeroSection } from "./sections/HeroSection";
export { default as AboutSection } from "./sections/AboutSection";
export { default as SkillsSection } from "./sections/SkillsSection";
export { default as ProjectsSection } from "./sections/ProjectsSection";
export { default as ContactSection } from "./sections/ContactSection";

// UI Components
export { default as Navigation } from "./ui/Navigation";
export { default as TypingAnimation } from "./ui/TypingAnimation";
export { default as TerminalMenu } from "./ui/TerminalMenu";
export { default as TerminalMatrixRain } from "./ui/TerminalMatrixRain";
export { default as MiniTerminal } from "./ui/MiniTerminal";
export { default as AdminPanel } from "./ui/AdminPanel";
export { default as GlobalTerminalShortcut } from "./ui/GlobalTerminalShortcut";
export { default as TerminalCursor } from "./ui/TerminalCursor";
export { default as BootSequence } from "./ui/BootSequence";
export { default as CommandBar } from "./ui/CommandBar";
export { default as ClientWrapper } from "./ui/ClientWrapper";
export { default as MagneticButton } from "./ui/MagneticButton";
export { default as SoundToggle } from "./ui/SoundToggle";
export {
  default as TypewriterText,
  TypewriterLines,
} from "./ui/TypewriterText";
export {
  default as AsciiDivider,
  CircuitDivider,
  WaveDivider,
  MatrixDivider,
  BinaryDivider,
  CodeDivider,
} from "./ui/AsciiDivider";

// Intro Components
export {
  default as AsciiAvatarIntro,
  DEV_AVATAR_FRAMES,
  COMPACT_AVATAR_FRAMES,
} from "./ui/AsciiAvatarIntro";
export {
  default as IntroSequence,
  useIntroReplay,
  ReplayIntroButton,
} from "./ui/IntroSequence";

// Interactive Guide
export {
  default as AsciiGuide,
  ASCII_NAME,
  ASCII_NAME_SMALL,
  AVATAR_FRAMES,
  COMPACT_AVATAR,
} from "./ui/AsciiGuide";

export {
  default as SpriteGuide,
  SPRITES,
  SECTION_CONFIG,
} from "./ui/SpriteGuide";

// Terminal Icons
export {
  default as TerminalIcons,
  EmailIcon,
  GitHubIcon,
  LinkedInIcon,
  TwitterIcon,
  RocketIcon,
  CodeIcon,
  RustIcon,
  ToolsIcon,
  ChatIcon,
  StrengthIcon,
  WaveIcon,
  SmugIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  TerminalIcon,
} from "./ui/TerminalIcons";

// CRT Effect
export { default as CRTEffect, useCRTEffect } from "./ui/CRTEffect";

// ASCII Photo Morph
export { default as AsciiPhotoMorph, AsciiText } from "./ui/AsciiPhotoMorph";

// ASCII Heading
export { default as AsciiHeading, HeadingPresets } from "./ui/AsciiHeading";

// Terminal Heading Variants
export { default as TerminalHeading } from "./ui/TerminalHeading";
export type { HeadingVariant } from "./ui/TerminalHeading";

// Awwwards-Level Headings
export {
  default as AwwardsHeading,
  AwwardsHeadingPresets,
} from "./ui/AwwardsHeading";

// ASCII Art Headings
export {
  default as AsciiArtHeading,
  AsciiArtHeadingPresets,
} from "./ui/AsciiArtHeading";

// Magnetic ASCII Name
export { default as MagneticAsciiName } from "./ui/MagneticAsciiName";

// Holographic Text
export {
  default as HolographicText,
  HolographicPresets,
} from "./ui/HolographicText";

// Live Presence
export { default as LivePresence, usePresence } from "./ui/LivePresence";

// 3D Components
export { default as MatrixRain } from "./3d/MatrixRain";

// Hooks
export {
  default as useTerminalSounds,
  SoundProvider,
  useSounds,
} from "../hooks/useTerminalSounds";
